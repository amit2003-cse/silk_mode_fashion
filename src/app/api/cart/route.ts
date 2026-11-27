import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { hydrateCartItems, RawCartItem } from "@/lib/cart";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const cartDoc = await db.collection("carts").findOne({ userId: session.userId });
  const rawItems = (cartDoc?.items as RawCartItem[] | undefined) ?? [];
  const items = await hydrateCartItems(rawItems);
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { items?: RawCartItem[] };
    const incoming = Array.isArray(body.items) ? body.items : [];
    const hydrated = await hydrateCartItems(incoming);
    const sanitized: RawCartItem[] = hydrated.map((h) => ({
      slug: h.slug,
      ...(h.colorName ? { colorName: h.colorName } : {}),
      quantity: h.quantity,
    }));

    const db = await getDb();
    await db.collection("carts").updateOne(
      { userId: session.userId },
      { $set: { userId: session.userId, items: sanitized, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, items: hydrated });
  } catch (error) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json({ error: "Failed to update cart." }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  await db.collection("carts").deleteOne({ userId: session.userId });
  return NextResponse.json({ ok: true, items: [] });
}
