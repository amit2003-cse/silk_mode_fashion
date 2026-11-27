import { NextRequest, NextResponse } from "next/server";
import { Db } from "mongodb";
import { getDb } from "@/lib/db";
import { getSessionUser, UserAddress } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/razorpay";
import { notifyOrderConfirmed } from "@/lib/notifications";
import { mapDbProductToSaree } from "@/lib/products";

interface CheckoutItemInput {
  slug: string;
  colorName?: string;
  quantity: number;
}

interface OrderItemSnapshot {
  productId: string;
  slug: string;
  name: string;
  code?: string;
  colorName?: string;
  priceAtPurchase: number;
  quantity: number;
  image: string;
}

interface DecrementedItem {
  slug: string;
  colorName?: string;
  quantity: number;
}

async function rollbackStock(db: Db, decremented: DecrementedItem[]) {
  const productsCol = db.collection("products");
  for (const item of decremented) {
    if (item.colorName) {
      await productsCol.updateOne(
        { slug: item.slug, "colors.name": item.colorName },
        { $inc: { "colors.$.stock": item.quantity } }
      );
    }
  }
}

function generateOrderNumber(): string {
  const y = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `SM-${y}-${rand}`;
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      items?: CheckoutItemInput[];
      shippingAddress?: Partial<UserAddress>;
      paymentMethod?: "razorpay" | "cod";
      mode?: "cart" | "buy_now";
    };

    const itemsInput = Array.isArray(body.items) ? body.items : [];
    if (itemsInput.length === 0) {
      return NextResponse.json({ error: "Your order has no items." }, { status: 400 });
    }

    const paymentMethod = body.paymentMethod === "cod" ? "cod" : "razorpay";
    const addr = body.shippingAddress;
    const cleanPhone = (addr?.phone || "").replace(/\D/g, "").slice(-10);
    const cleanPin = (addr?.pincode || "").replace(/\D/g, "");

    if (
      !addr?.fullName?.trim() ||
      !/^[6-9]\d{9}$/.test(cleanPhone) ||
      !addr?.line1?.trim() ||
      !addr?.city?.trim() ||
      !addr?.state?.trim() ||
      !/^\d{6}$/.test(cleanPin)
    ) {
      return NextResponse.json(
        { error: "Please provide a complete shipping address with valid 10-digit phone and 6-digit pincode." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const productsCol = db.collection("products");
    const decremented: DecrementedItem[] = [];
    const orderItems: OrderItemSnapshot[] = [];

    // 1. Validate & atomically decrement stock per item/colour
    for (const input of itemsInput) {
      const qty = Math.max(1, Math.min(20, Math.floor(input.quantity || 1)));
      const productDoc = await productsCol.findOne({
        slug: input.slug,
        isActive: { $ne: false },
      });

      if (!productDoc) {
        await rollbackStock(db, decremented);
        return NextResponse.json(
          { error: `Product "${input.slug}" is no longer available.` },
          { status: 404 }
        );
      }

      const saree = mapDbProductToSaree(productDoc as never);
      const targetColor =
        (input.colorName ? saree.colors?.find((c) => c.name === input.colorName) : undefined) ||
        saree.colors?.[0];

      if (targetColor) {
        const updated = await productsCol.findOneAndUpdate(
          {
            slug: saree.slug,
            isActive: { $ne: false },
            colors: {
              $elemMatch: {
                name: targetColor.name,
                stock: { $gte: qty },
              },
            },
          },
          { $inc: { "colors.$.stock": -qty } }
        );

        if (!updated) {
          await rollbackStock(db, decremented);
          return NextResponse.json(
            {
              error: `Insufficient stock for "${saree.name}" (${targetColor.name}).`,
            },
            { status: 409 }
          );
        }
        decremented.push({ slug: saree.slug, colorName: targetColor.name, quantity: qty });
      }

      const imgIdx = targetColor?.imageIndex ?? 0;
      orderItems.push({
        productId: saree.id,
        slug: saree.slug,
        name: saree.name,
        code: saree.code,
        colorName: targetColor?.name,
        priceAtPurchase: saree.price,
        quantity: qty,
        image: saree.images[imgIdx] || saree.images[0] || "/images/hero-banner-2.jpg",
      });
    }

    // 2. Compute authoritative totals on server
    const subtotal = orderItems.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
    // Business rule: Free shipping above ₹999; ₹99 fixed charge for ₹999 and below
    const shippingFee = subtotal > 999 ? 0 : 99;
    const totalAmount = subtotal + shippingFee;

    // Business rule: COD allowed up to ₹10,000
    if (paymentMethod === "cod" && totalAmount > 10000) {
      await rollbackStock(db, decremented);
      return NextResponse.json(
        {
          error:
            "Cash on Delivery is available only for orders up to ₹10,000. Please pay online via Razorpay.",
        },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const now = new Date();
    const shippingAddress = {
      label: addr.label?.trim() || "Home",
      fullName: addr.fullName.trim(),
      phone: cleanPhone,
      line1: addr.line1.trim(),
      ...(addr.line2?.trim() ? { line2: addr.line2.trim() } : {}),
      city: addr.city.trim(),
      state: addr.state.trim(),
      pincode: cleanPin,
    };

    let razorpayOrderId: string | undefined;
    if (paymentMethod === "razorpay") {
      try {
        const rpOrder = await createRazorpayOrder({
          amountInRupees: totalAmount,
          receipt: orderNumber,
        });
        razorpayOrderId = rpOrder.id;
      } catch (err) {
        await rollbackStock(db, decremented);
        const isUnconfigured = err instanceof Error && err.message === "RAZORPAY_NOT_CONFIGURED";
        return NextResponse.json(
          {
            error: isUnconfigured
              ? "Online payment (Razorpay) is not configured yet. Please use Cash on Delivery (up to ₹10,000)."
              : "Could not initiate payment gateway. Please try again.",
          },
          { status: isUnconfigured ? 503 : 502 }
        );
      }
    }

    const initialStatus = paymentMethod === "cod" ? "confirmed" : "placed";
    const orderDoc = {
      orderNumber,
      userId: session.userId,
      customerEmail: session.email ?? null,
      customerPhone: session.phone ?? cleanPhone,
      customerName: shippingAddress.fullName,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      ...(razorpayOrderId ? { razorpayOrderId } : {}),
      orderStatus: initialStatus,
      mode: body.mode || "cart",
      statusHistory: [
        {
          status: initialStatus,
          at: now,
          note:
            paymentMethod === "cod"
              ? "COD order confirmed"
              : "Order created, awaiting Razorpay payment",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const inserted = await db.collection("orders").insertOne(orderDoc);

    if (paymentMethod === "cod") {
      if (body.mode !== "buy_now") {
        await db.collection("carts").deleteOne({ userId: session.userId });
      }
      await notifyOrderConfirmed({
        orderNumber,
        totalAmount,
        paymentMethod: "cod",
        customerPhone: shippingAddress.phone,
        customerEmail: session.email,
        customerName: shippingAddress.fullName,
      });
    }

    return NextResponse.json({
      ok: true,
      orderId: inserted.insertedId.toString(),
      orderNumber,
      totalAmount,
      paymentMethod,
      razorpayOrderId: razorpayOrderId ?? null,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}
