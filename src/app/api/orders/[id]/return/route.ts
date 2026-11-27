import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { notifyOrderStatusUpdate } from "@/lib/notifications";

const VALID_REASONS = new Set(["damaged", "wrong_product", "incorrect_color"]);
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

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
    const body = (await req.json()) as {
      reason?: string;
      description?: string;
      proofImages?: string[];
      refundUpiOrBank?: string;
    };

    const reason = body.reason?.trim() || "";
    const description = (body.description || "").trim().slice(0, 500);
    const proofImages = Array.isArray(body.proofImages) ? body.proofImages.slice(0, 3) : [];
    const refundUpiOrBank = (body.refundUpiOrBank || "").trim().slice(0, 150);

    if (!VALID_REASONS.has(reason)) {
      return NextResponse.json(
        { error: "Return is eligible only for damaged, wrong product, or incorrect colour." },
        { status: 400 }
      );
    }

    if (proofImages.length === 0) {
      return NextResponse.json(
        { error: "Please upload at least 1 photo as proof of the issue." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.orderStatus !== "delivered" || !order.deliveredAt) {
      return NextResponse.json(
        { error: "Return requests are allowed only for delivered orders." },
        { status: 400 }
      );
    }

    const deliveredTime = new Date(order.deliveredAt as string | Date).getTime();
    if (Date.now() - deliveredTime > THREE_DAYS_MS) {
      return NextResponse.json(
        { error: "The 3-day return window for this order has expired." },
        { status: 400 }
      );
    }

    if (order.paymentMethod === "cod" && !refundUpiOrBank) {
      return NextResponse.json(
        { error: "Please provide your UPI ID or Bank Account details for COD refund." },
        { status: 400 }
      );
    }

    const returnsCol = db.collection("return_requests");
    const existing = await returnsCol.findOne({ orderId: id, userId: session.userId });
    if (existing) {
      return NextResponse.json(
        { error: "A return request has already been submitted for this order." },
        { status: 409 }
      );
    }

    const now = new Date();
    const inserted = await returnsCol.insertOne({
      orderId: id,
      orderNumber: order.orderNumber,
      userId: session.userId,
      items: order.items ?? [],
      reason,
      description,
      proofImages,
      status: "requested",
      refundAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      ...(refundUpiOrBank ? { refundDetails: refundUpiOrBank } : {}),
      createdAt: now,
      updatedAt: now,
    });

    await notifyOrderStatusUpdate({
      orderNumber: order.orderNumber as string,
      status: "return requested",
      note: "We have received your return request and will review it within 24 hours.",
      customerPhone: (order.customerPhone as string) || session.phone,
      customerEmail: (order.customerEmail as string) || session.email,
      customerName: order.customerName as string,
    });

    return NextResponse.json({
      ok: true,
      returnId: inserted.insertedId.toString(),
      status: "requested",
    });
  } catch (error) {
    console.error("Return request error:", error);
    return NextResponse.json({ error: "Unable to submit return request." }, { status: 500 });
  }
}
