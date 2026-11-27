import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const db = await getDb();
  const docs = await db
    .collection("return_requests")
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const returns = docs.map((d) => ({
    id: d._id.toString(),
    orderId: d.orderId,
    orderNumber: d.orderNumber,
    reason: d.reason,
    description: d.description ?? "",
    proofImages: d.proofImages ?? [],
    status: d.status,
    refundAmount: d.refundAmount,
    paymentMethod: d.paymentMethod,
    refundDetails: d.refundDetails ?? "",
    adminNote: d.adminNote ?? "",
    createdAt: d.createdAt,
  }));

  return NextResponse.json({ returns });
}
