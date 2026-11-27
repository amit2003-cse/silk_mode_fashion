import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
  }

  const db = await getDb();
  const order = await db.collection("orders").findOne({
    _id: new ObjectId(id),
    userId: session.userId,
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const returnRequest = await db.collection("return_requests").findOne({
    orderId: id,
    userId: session.userId,
  });

  return NextResponse.json({
    order: {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items ?? [],
      shippingAddress: order.shippingAddress,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber ?? null,
      courierName: order.courierName ?? null,
      statusHistory: order.statusHistory ?? [],
      deliveredAt: order.deliveredAt ?? null,
      cancelledAt: order.cancelledAt ?? null,
      cancelReason: order.cancelReason ?? null,
      createdAt: order.createdAt,
    },
    returnRequest: returnRequest
      ? {
          id: returnRequest._id.toString(),
          reason: returnRequest.reason,
          description: returnRequest.description,
          proofImages: returnRequest.proofImages ?? [],
          status: returnRequest.status,
          refundAmount: returnRequest.refundAmount,
          adminNote: returnRequest.adminNote ?? null,
          createdAt: returnRequest.createdAt,
        }
      : null,
  });
}
