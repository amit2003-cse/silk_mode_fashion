import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const docs = await db
    .collection("orders")
    .find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  const orders = docs.map((d) => ({
    id: d._id.toString(),
    orderNumber: d.orderNumber,
    items: d.items ?? [],
    totalAmount: d.totalAmount,
    paymentMethod: d.paymentMethod,
    paymentStatus: d.paymentStatus,
    orderStatus: d.orderStatus,
    createdAt: d.createdAt,
    deliveredAt: d.deliveredAt ?? null,
  }));

  return NextResponse.json({ orders });
}
