import { NextRequest, NextResponse } from "next/server";
import { getProductBySlugFromDb, getRelatedProductsFromDb } from "@/lib/products";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlugFromDb(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    const relatedProducts = await getRelatedProductsFromDb(product.slug, product.category, 4);
    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json({ error: "Failed to load product." }, { status: 500 });
  }
}
