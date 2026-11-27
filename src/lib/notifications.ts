export async function sendSmsNotification(phone: string | undefined, message: string): Promise<void> {
  if (!phone) return;
  const apiKey = process.env.TWOFACTOR_API_KEY?.trim();
  if (!apiKey) {
    console.info(`[SMS skipped - no TWOFACTOR_API_KEY] To +91${phone}: ${message}`);
    return;
  }

  try {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    await fetch(`https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/ADDON_SERVICES/SEND/TSMS`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        From: "SLKMOD",
        To: `91${cleanPhone}`,
        Msg: message,
      }),
    });
  } catch (err) {
    console.error("SMS notification error:", err);
  }
}

export async function sendEmailNotification(params: {
  to?: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!params.to) return;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info(`[Email skipped - no RESEND_API_KEY] To ${params.to}: ${params.subject}`);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "SilkMode Fashion <orders@silkmodefashion.in>";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });
  } catch (err) {
    console.error("Email notification error:", err);
  }
}

export async function notifyOrderConfirmed(order: {
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
}): Promise<void> {
  const smsMsg = `Namaste ${order.customerName || "Customer"}! Your SilkMode Fashion order ${order.orderNumber} (Rs.${order.totalAmount.toLocaleString("en-IN")}, ${order.paymentMethod.toUpperCase()}) is confirmed. Thank you for shopping with us!`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #e8dec8; border-radius: 12px;">
      <h2 style="color: #58111A; margin-top: 0;">Order Confirmed — ${order.orderNumber}</h2>
      <p>Namaste ${order.customerName || "Valued Customer"},</p>
      <p>Thank you for your order with <strong>SilkMode Fashion, Surat</strong>.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}<br/>
         <strong>Amount:</strong> ₹${order.totalAmount.toLocaleString("en-IN")}<br/>
         <strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      <p style="color: #666; font-size: 13px;">We will notify you again once your handcrafted parcel is shipped.</p>
    </div>
  `;

  await Promise.all([
    sendSmsNotification(order.customerPhone, smsMsg),
    sendEmailNotification({
      to: order.customerEmail,
      subject: `Order Confirmed: ${order.orderNumber} | SilkMode Fashion`,
      html: emailHtml,
    }),
  ]);
}

export async function notifyOrderStatusUpdate(params: {
  orderNumber: string;
  status: string;
  note?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
}): Promise<void> {
  const smsMsg = `SilkMode Fashion: Order ${params.orderNumber} status updated to ${params.status.toUpperCase()}.${params.note ? " " + params.note : ""}`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #e8dec8; border-radius: 12px;">
      <h2 style="color: #58111A; margin-top: 0;">Order Update — ${params.orderNumber}</h2>
      <p>Namaste ${params.customerName || "Valued Customer"},</p>
      <p>Your order status is now: <strong>${params.status.toUpperCase()}</strong>.</p>
      ${params.note ? `<p>${params.note}</p>` : ""}
    </div>
  `;
  await Promise.all([
    sendSmsNotification(params.customerPhone, smsMsg),
    sendEmailNotification({
      to: params.customerEmail,
      subject: `Order ${params.orderNumber}: ${params.status.toUpperCase()} | SilkMode Fashion`,
      html: emailHtml,
    }),
  ]);
}
