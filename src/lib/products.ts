import { getDb } from "@/lib/db";
import {
  getProductBySlug as getStaticProductBySlug,
  getRelatedProducts as getStaticRelatedProducts,
  PRODUCTS_DATA,
  ProductColor,
  SareeProduct,
} from "@/data/products";

interface DbProductDoc {
  _id: { toString(): string };
  legacyId?: string;
  slug: string;
  aliases?: string[];
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  code?: string | null;
  description: string;
  fabric?: string | null;
  work?: string | null;
  sareeLength?: string | null;
  blouseDetails?: string | null;
  weight?: string | null;
  images: string[];
  colors?: ProductColor[];
  trending?: boolean;
  featured?: boolean;
  isActive?: boolean;
}

export function mapDbProductToSaree(doc: DbProductDoc): SareeProduct {
  const colors = doc.colors ?? [];
  const hasAnyStock =
    colors.length === 0 ? doc.isActive !== false : colors.some((c) => (c.stock ?? 10) > 0);

  return {
    id: doc.legacyId || doc._id.toString(),
    slug: doc.slug,
    aliases: doc.aliases ?? [],
    name: doc.name,
    category: doc.category,
    price: doc.price,
    originalPrice: doc.originalPrice ?? undefined,
    badge: doc.badge ?? undefined,
    code: doc.code ?? undefined,
    description: doc.description,
    fabric: doc.fabric ?? undefined,
    work: doc.work ?? undefined,
    sareeLength: doc.sareeLength ?? undefined,
    blouseDetails: doc.blouseDetails ?? undefined,
    weight: doc.weight ?? undefined,
    images: doc.images ?? [],
    colors,
    trending: Boolean(doc.trending),
    featured: Boolean(doc.featured),
    inStock: doc.isActive !== false && hasAnyStock,
  };
}

export function getVariantStock(
  product: SareeProduct,
  colorName?: string
): { inStock: boolean; stock: number } {
  if (product.inStock === false) {
    return { inStock: false, stock: 0 };
  }
  if (!product.colors || product.colors.length === 0) {
    return { inStock: true, stock: 10 };
  }
  const matched =
    (colorName ? product.colors.find((c) => c.name === colorName) : undefined) ||
    product.colors[0];
  const stock = matched?.stock ?? 10;
  return { inStock: stock > 0, stock };
}

export async function getActiveProductsFromDb(): Promise<SareeProduct[]> {
  try {
    const db = await getDb();
    const docs = (await db
      .collection<DbProductDoc>("products")
      .find({ isActive: { $ne: false } })
      .sort({ featured: -1, createdAt: -1 })
      .toArray()) as DbProductDoc[];

    if (docs.length === 0) {
      return PRODUCTS_DATA;
    }
    return docs.map(mapDbProductToSaree);
  } catch (error) {
    console.warn("Falling back to static PRODUCTS_DATA:", error);
    return PRODUCTS_DATA;
  }
}

export async function getProductBySlugFromDb(slug: string): Promise<SareeProduct | undefined> {
  try {
    const db = await getDb();
    const doc = (await db.collection<DbProductDoc>("products").findOne({
      $or: [{ slug }, { aliases: slug }],
      isActive: { $ne: false },
    })) as DbProductDoc | null;

    if (doc) {
      return mapDbProductToSaree(doc);
    }
  } catch (error) {
    console.warn("DB slug lookup failed, using static fallback:", error);
  }
  return getStaticProductBySlug(slug);
}

export async function getRelatedProductsFromDb(
  currentSlug: string,
  category: string,
  limit = 4
): Promise<SareeProduct[]> {
  try {
    const db = await getDb();
    const docs = (await db
      .collection<DbProductDoc>("products")
      .find({
        slug: { $ne: currentSlug },
        category,
        isActive: { $ne: false },
      })
      .limit(limit)
      .toArray()) as DbProductDoc[];

    if (docs.length > 0) {
      return docs.map(mapDbProductToSaree);
    }
  } catch (error) {
    console.warn("DB related lookup failed, using static fallback:", error);
  }
  return getStaticRelatedProducts(currentSlug, limit);
}
