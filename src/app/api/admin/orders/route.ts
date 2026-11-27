import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const statusFilter = req.nextUrl.searchParams.get("status")?.trim();
  const query = statusFilter && statusFilter !== "all" ? { orderStatus: statusFilter } : {};

  const db = await getDb();
  const docs = await db
    .collection("orders")
    .find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const orders = docs.map((d) => ({
    id: d._id.toString(),
    orderNumber: d.orderNumber,
    customerName: d.customerName,
    customerPhone: d.customerPhone,
    customerEmail: d.customerEmail,
    items: d.items ?? [],
    totalAmount: d.totalAmount,
    paymentMethod: d.paymentMethod,
    paymentStatus: d.paymentStatus,
    orderStatus: d.orderStatus,
    courierName: d.courierName ?? "",
    trackingNumber: d.trackingNumber ?? "",
    createdAt: d.createdAt,
  }));

  return NextResponse.json({ orders });
}
