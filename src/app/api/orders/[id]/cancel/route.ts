import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { initiateRazorpayRefund } from "@/lib/razorpay";
import { notifyOrderStatusUpdate } from "@/lib/notifications";

const CANCELLABLE_STATUSES = ["placed", "confirmed", "packed"];

export async function POST(
  req: NextRequest,
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

  try {
    const body = (await req.json().catch(() => ({}))) as { reason?: string };
    const cancelReason = (body.reason || "Cancelled by customer").trim().slice(0, 200);

    const db = await getDb();
    const ordersCol = db.collection("orders");
    const now = new Date();

    // Atomic state transition prevents double-cancel race conditions
    const order = await ordersCol.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: session.userId,
        orderStatus: { $in: CANCELLABLE_STATUSES },
      },
      {
        $set: {
          orderStatus: "cancelled",
          cancelledAt: now,
          cancelReason,
          updatedAt: now,
        },
        $push: {
          statusHistory: {
            status: "cancelled",
            at: now,
            note: "Order cancelled by customer before shipment.",
          },
        } as never,
      },
      { returnDocument: "before" }
    );

    if (!order) {
      const existing = await ordersCol.findOne({
        _id: new ObjectId(id),
        userId: session.userId,
      });
      if (!existing) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      return NextResponse.json(
        { error: `Order cannot be cancelled once it is "${existing.orderStatus}".` },
        { status: 400 }
      );
    }

    let nextPaymentStatus = order.paymentStatus as string;
    let refundNote = "Order cancelled by customer before shipment.";

    if (
      order.paymentMethod === "razorpay" &&
      order.paymentStatus === "paid" &&
      order.razorpayPaymentId
    ) {
      try {
        const refund = await initiateRazorpayRefund({
          razorpayPaymentId: order.razorpayPaymentId as string,
          amountInRupees: order.totalAmount as number,
        });
        nextPaymentStatus = refund ? "refunded" : "refund_pending";
        refundNote = refund
          ? `Order cancelled. Refund ${refund.id} initiated via Razorpay.`
          : "Order cancelled. Refund queued for processing.";
      } catch (err) {
        console.error("Razorpay cancel refund error:", err);
        nextPaymentStatus = "refund_pending";
        refundNote = "Order cancelled. Refund queued for manual verification.";
      }

      await ordersCol.updateOne(
        { _id: order._id },
        { $set: { paymentStatus: nextPaymentStatus, updatedAt: new Date() } }
      );
    }

    // Restore colour-variant stock exactly once
    const productsCol = db.collection("products");
    const items =
      (order.items as Array<{ slug: string; colorName?: string; quantity: number }>) ?? [];
    for (const item of items) {
      if (item.colorName) {
        await productsCol.updateOne(
          { slug: item.slug, "colors.name": item.colorName },
          { $inc: { "colors.$.stock": item.quantity } }
        );
      }
    }

    await notifyOrderStatusUpdate({
      orderNumber: order.orderNumber as string,
      status: "cancelled",
      note: refundNote,
      customerPhone: (order.customerPhone as string) || session.phone,
      customerEmail: (order.customerEmail as string) || session.email,
      customerName: order.customerName as string,
    });

    return NextResponse.json({
      ok: true,
      orderStatus: "cancelled",
      paymentStatus: nextPaymentStatus,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: "Unable to cancel order." }, { status: 500 });
  }
}
