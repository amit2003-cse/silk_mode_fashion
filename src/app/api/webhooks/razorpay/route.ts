import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { notifyOrderConfirmed } from "@/lib/notifications";

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const valid = await verifyRazorpayWebhookSignature(rawBody, signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    const eventHeaderId = req.headers.get("x-razorpay-event-id");
    const parsed = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const eventType = parsed.event || "unknown";
    const paymentEntity = parsed.payload?.payment?.entity;
    const rpOrderId = paymentEntity?.order_id;
    const rpPaymentId = paymentEntity?.id;
    const idempotencyKey = eventHeaderId || `${eventType}:${rpOrderId}:${rpPaymentId}`;

    const db = await getDb();
    const webhookCol = db.collection("webhook_events");

    // Idempotency check
    try {
      await webhookCol.insertOne({
        eventId: idempotencyKey,
        provider: "razorpay",
        eventType,
        processedAt: new Date(),
      });
    } catch {
      return NextResponse.json({ ok: true, deduplicated: true });
    }

    if (!rpOrderId) {
      return NextResponse.json({ ok: true });
    }

    const ordersCol = db.collection("orders");
    const order = await ordersCol.findOne({ razorpayOrderId: rpOrderId });
    if (!order) {
      return NextResponse.json({ ok: true });
    }

    const now = new Date();
    if (eventType === "payment.captured" && order.paymentStatus !== "paid") {
      await ordersCol.updateOne(
        { _id: order._id },
        {
          $set: {
            paymentStatus: "paid",
            razorpayPaymentId: rpPaymentId,
            orderStatus: "confirmed",
            updatedAt: now,
          },
          $push: {
            statusHistory: {
              status: "confirmed",
              at: now,
              note: "Confirmed via Razorpay webhook",
            },
          } as never,
        }
      );

      await notifyOrderConfirmed({
        orderNumber: order.orderNumber as string,
        totalAmount: order.totalAmount as number,
        paymentMethod: "razorpay",
        customerPhone: order.customerPhone as string,
        customerEmail: order.customerEmail as string,
        customerName: order.customerName as string,
      });
    } else if (eventType === "payment.failed" && order.paymentStatus === "pending") {
      await ordersCol.updateOne(
        { _id: order._id },
        {
          $set: {
            paymentStatus: "failed",
            orderStatus: "cancelled",
            cancelledAt: now,
            cancelReason: "Payment failed",
            updatedAt: now,
          },
          $push: {
            statusHistory: {
              status: "cancelled",
              at: now,
              note: "Razorpay payment failed",
            },
          } as never,
        }
      );

      // Restore stock
      const productsCol = db.collection("products");
      const items = (order.items as Array<{ slug: string; colorName?: string; quantity: number }>) ?? [];
      for (const item of items) {
        if (item.colorName) {
          await productsCol.updateOne(
            { slug: item.slug, "colors.name": item.colorName },
            { $inc: { "colors.$.stock": item.quantity } }
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
