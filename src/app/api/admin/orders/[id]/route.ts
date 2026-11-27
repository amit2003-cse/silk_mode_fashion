import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { notifyOrderStatusUpdate } from "@/lib/notifications";

const ALLOWED_STATUSES = new Set([
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
  }

  try {
    const body = (await req.json()) as {
      orderStatus?: string;
      courierName?: string;
      trackingNumber?: string;
    };

    const orderStatus = body.orderStatus?.trim();
    if (!orderStatus || !ALLOWED_STATUSES.has(orderStatus)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }

    const db = await getDb();
    const ordersCol = db.collection("orders");
    const order = await ordersCol.findOne({ _id: new ObjectId(id) });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const now = new Date();
    const updates: Record<string, unknown> = {
      orderStatus,
      updatedAt: now,
    };
    if (typeof body.courierName === "string") updates.courierName = body.courierName.trim();
    if (typeof body.trackingNumber === "string") updates.trackingNumber = body.trackingNumber.trim();
    if (orderStatus === "delivered" && !order.deliveredAt) {
      updates.deliveredAt = now;
      if (order.paymentMethod === "cod") {
        updates.paymentStatus = "paid";
      }
    }

    const note =
      orderStatus === "shipped" && body.trackingNumber
        ? `Shipped via ${body.courierName || "Courier"} (Tracking: ${body.trackingNumber})`
        : `Status updated to ${orderStatus}`;

    await ordersCol.updateOne(
      { _id: order._id },
      {
        $set: updates,
        $push: {
          statusHistory: { status: orderStatus, at: now, note },
        } as never,
      }
    );

    await notifyOrderStatusUpdate({
      orderNumber: order.orderNumber as string,
      status: orderStatus,
      note,
      customerPhone: order.customerPhone as string,
      customerEmail: order.customerEmail as string,
      customerName: order.customerName as string,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin update order error:", error);
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
