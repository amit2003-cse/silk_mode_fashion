import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ProductColor } from "@/data/products";

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const db = await getDb();
  const docs = await db
    .collection("products")
    .find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray();

  const products = docs.map((d) => ({
    id: d._id.toString(),
    slug: d.slug,
    name: d.name,
    category: d.category,
    code: d.code ?? "",
    price: d.price,
    originalPrice: d.originalPrice ?? null,
    badge: d.badge ?? "",
    description: d.description ?? "",
    fabric: d.fabric ?? "",
    images: d.images ?? [],
    colors: (d.colors as ProductColor[] | undefined) ?? [],
    trending: Boolean(d.trending),
    featured: Boolean(d.featured),
    isActive: d.isActive !== false,
  }));

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = (await req.json()) as {
      name?: string;
      slug?: string;
      category?: string;
      code?: string;
      price?: number;
      originalPrice?: number;
      badge?: string;
      description?: string;
      fabric?: string;
      images?: string[];
      colors?: ProductColor[];
      trending?: boolean;
      featured?: boolean;
    };

    const name = (body.name || "").trim();
    const category = (body.category || "").trim();
    const price = Number(body.price);

    if (!name || !category || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Product name, category, and valid price are required." },
        { status: 400 }
      );
    }

    const rawSlug = (body.slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${rawSlug}-${crypto.randomUUID().slice(0, 4)}`;

    const db = await getDb();
    const now = new Date();
    const colors = Array.isArray(body.colors) ? body.colors : [];

    const inserted = await db.collection("products").insertOne({
      slug,
      name,
      category,
      code: body.code?.trim() || null,
      price,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      badge: body.badge?.trim() || null,
      description: (body.description || "").trim(),
      fabric: body.fabric?.trim() || null,
      images: Array.isArray(body.images) ? body.images : [],
      colors,
      trending: Boolean(body.trending),
      featured: Boolean(body.featured),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      ok: true,
      id: inserted.insertedId.toString(),
      slug,
    });
  } catch (error) {
    console.error("Admin create product error:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
