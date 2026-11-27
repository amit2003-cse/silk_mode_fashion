import { getDb } from "@/lib/db";
import { getVariantStock, mapDbProductToSaree } from "@/lib/products";

export interface RawCartItem {
  slug: string;
  colorName?: string;
  quantity: number;
}

export interface HydratedCartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  code?: string;
  price: number;
  originalPrice?: number;
  image: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  maxStock: number;
}

export async function hydrateCartItems(rawItems: RawCartItem[]): Promise<HydratedCartItem[]> {
  if (!rawItems.length) return [];
  const db = await getDb();
  const slugs = Array.from(new Set(rawItems.map((i) => i.slug)));
  const docs = await db
    .collection("products")
    .find({ slug: { $in: slugs }, isActive: { $ne: false } })
    .toArray();

  const bySlug = new Map(docs.map((d) => [d.slug as string, mapDbProductToSaree(d as never)]));
  const result: HydratedCartItem[] = [];

  for (const item of rawItems) {
    const product = bySlug.get(item.slug);
    if (!product) continue;
    const colorObj = item.colorName
      ? product.colors?.find((c) => c.name === item.colorName)
      : product.colors?.[0];
    const { inStock, stock } = getVariantStock(product, colorObj?.name);
    if (!inStock || stock <= 0) continue;

    const qty = Math.max(1, Math.min(item.quantity, stock));
    const imgIdx = colorObj?.imageIndex ?? 0;
    result.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      code: product.code,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[imgIdx] || product.images[0] || "/images/hero-banner-2.jpg",
      colorName: colorObj?.name,
      colorHex: colorObj?.hex,
      quantity: qty,
      maxStock: stock,
    });
  }

  return result;
}
