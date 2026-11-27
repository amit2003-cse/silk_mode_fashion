import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ProductColor } from "@/data/products";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
  }

  try {
    const body = (await req.json()) as {
      name?: string;
      category?: string;
      code?: string;
      price?: number;
      originalPrice?: number | null;
      badge?: string;
      description?: string;
      fabric?: string;
      images?: string[];
      colors?: ProductColor[];
      trending?: boolean;
      featured?: boolean;
      isActive?: boolean;
    };

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
    if (typeof body.category === "string" && body.category.trim()) updates.category = body.category.trim();
    if (typeof body.code === "string") updates.code = body.code.trim() || null;
    if (typeof body.price === "number" && body.price > 0) updates.price = body.price;
    if (body.originalPrice !== undefined) updates.originalPrice = body.originalPrice;
    if (typeof body.badge === "string") updates.badge = body.badge.trim() || null;
    if (typeof body.description === "string") updates.description = body.description.trim();
    if (typeof body.fabric === "string") updates.fabric = body.fabric.trim() || null;
    if (Array.isArray(body.images)) updates.images = body.images;
    if (Array.isArray(body.colors)) updates.colors = body.colors;
    if (typeof body.trending === "boolean") updates.trending = body.trending;
    if (typeof body.featured === "boolean") updates.featured = body.featured;
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;

    const db = await getDb();
    await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin update product error:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
  }

  const db = await getDb();
  await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: { isActive: false, updatedAt: new Date() } });

  return NextResponse.json({ ok: true });
}
