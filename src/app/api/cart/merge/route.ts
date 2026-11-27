import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { hydrateCartItems, RawCartItem } from "@/lib/cart";

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { items?: RawCartItem[] };
    const guestItems = Array.isArray(body.items) ? body.items : [];

    const db = await getDb();
    const cartsCol = db.collection("carts");
    const existingDoc = await cartsCol.findOne({ userId: session.userId });
    const dbItems = (existingDoc?.items as RawCartItem[] | undefined) ?? [];

    const mergedMap = new Map<string, RawCartItem>();
    for (const item of [...dbItems, ...guestItems]) {
      if (!item.slug) continue;
      const key = `${item.slug}::${item.colorName || ""}`;
      const prev = mergedMap.get(key);
      mergedMap.set(key, {
        slug: item.slug,
        ...(item.colorName ? { colorName: item.colorName } : {}),
        quantity: (prev?.quantity ?? 0) + Math.max(1, item.quantity || 1),
      });
    }

    const hydrated = await hydrateCartItems(Array.from(mergedMap.values()));
    const sanitized: RawCartItem[] = hydrated.map((h) => ({
      slug: h.slug,
      ...(h.colorName ? { colorName: h.colorName } : {}),
      quantity: h.quantity,
    }));

    await cartsCol.updateOne(
      { userId: session.userId },
      { $set: { userId: session.userId, items: sanitized, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, items: hydrated });
  } catch (error) {
    console.error("POST /api/cart/merge error:", error);
    return NextResponse.json({ error: "Failed to merge cart." }, { status: 500 });
  }
}
