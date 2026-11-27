import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { initiateRazorpayRefund } from "@/lib/razorpay";
import { notifyOrderStatusUpdate } from "@/lib/notifications";

const ALLOWED_RETURN_STATUSES = new Set([
  "requested",
  "approved",
  "rejected",
  "picked_up",
  "refunded",
]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid return ID." }, { status: 400 });
  }

  try {
    const body = (await req.json()) as { status?: string; adminNote?: string };
    const status = body.status?.trim();
    if (!status || !ALLOWED_RETURN_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid return status." }, { status: 400 });
    }

    const db = await getDb();
    const returnsCol = db.collection("return_requests");
    const retDoc = await returnsCol.findOne({ _id: new ObjectId(id) });
    if (!retDoc) {
      return NextResponse.json({ error: "Return request not found." }, { status: 404 });
    }

    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(retDoc.orderId as string) });

    if (
      status === "refunded" &&
      order &&
      order.paymentMethod === "razorpay" &&
      order.paymentStatus === "paid" &&
      order.razorpayPaymentId
    ) {
      await initiateRazorpayRefund({
        razorpayPaymentId: order.razorpayPaymentId as string,
        amountInRupees: retDoc.refundAmount as number,
      });
      await db
        .collection("orders")
        .updateOne({ _id: order._id }, { $set: { paymentStatus: "refunded", updatedAt: new Date() } });
    } else if (status === "refunded" && order) {
      await db
        .collection("orders")
        .updateOne({ _id: order._id }, { $set: { paymentStatus: "refunded", updatedAt: new Date() } });
    }

    await returnsCol.updateOne(
      { _id: retDoc._id },
      {
        $set: {
          status,
          adminNote: (body.adminNote || "").trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (order) {
      await notifyOrderStatusUpdate({
        orderNumber: order.orderNumber as string,
        status: `return ${status}`,
        note: body.adminNote?.trim(),
        customerPhone: order.customerPhone as string,
        customerEmail: order.customerEmail as string,
        customerName: order.customerName as string,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin update return error:", error);
    return NextResponse.json({ error: "Failed to update return request." }, { status: 500 });
  }
}
