import { NextRequest, NextResponse } from "next/server";
import { getActiveProductsFromDb } from "@/lib/products";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category")?.trim();
    const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();

    let products = await getActiveProductsFromDb();

    if (category && category !== "All") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.code && p.code.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ products, total: products.length });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}
