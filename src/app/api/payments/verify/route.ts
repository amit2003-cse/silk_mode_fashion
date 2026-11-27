import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { notifyOrderConfirmed } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const rpOrderId = body.razorpay_order_id?.trim();
    const rpPaymentId = body.razorpay_payment_id?.trim();
    const rpSignature = body.razorpay_signature?.trim();

    if (!rpOrderId || !rpPaymentId || !rpSignature) {
      return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
    }

    const isValid = await verifyRazorpayPaymentSignature({
      razorpayOrderId: rpOrderId,
      razorpayPaymentId: rpPaymentId,
      razorpaySignature: rpSignature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    const db = await getDb();
    const ordersCol = db.collection("orders");
    const order = await ordersCol.findOne({
      razorpayOrderId: rpOrderId,
      userId: session.userId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.paymentStatus !== "paid") {
      const now = new Date();
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
              note: "Razorpay payment verified",
            },
          } as never,
        }
      );

      if (order.mode !== "buy_now") {
        await db.collection("carts").deleteOne({ userId: session.userId });
      }

      await notifyOrderConfirmed({
        orderNumber: order.orderNumber as string,
        totalAmount: order.totalAmount as number,
        paymentMethod: "razorpay",
        customerPhone: (order.customerPhone as string) || session.phone,
        customerEmail: (order.customerEmail as string) || session.email,
        customerName: order.customerName as string,
      });
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      orderId: order._id.toString(),
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
