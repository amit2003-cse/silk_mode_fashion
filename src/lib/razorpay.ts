async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createRazorpayOrder(params: {
  amountInRupees: number;
  receipt: string;
}): Promise<{ id: string; amount: number; currency: string }> {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_NOT_CONFIGURED");
  }

  const auth = btoa(`${keyId}:${keySecret}`);
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(params.amountInRupees * 100),
      currency: "INR",
      receipt: params.receipt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Razorpay order creation failed: ${errText}`);
  }

  return (await res.json()) as { id: string; amount: number; currency: string };
}

export async function verifyRazorpayPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<boolean> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keySecret) return false;
  const expected = await hmacSha256Hex(
    keySecret,
    `${params.razorpayOrderId}|${params.razorpayPaymentId}`
  );
  return timingSafeEqualHex(expected, params.razorpaySignature);
}

export async function verifyRazorpayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): Promise<boolean> {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret || !signatureHeader) return false;
  const expected = await hmacSha256Hex(webhookSecret, rawBody);
  return timingSafeEqualHex(expected, signatureHeader);
}

export async function initiateRazorpayRefund(params: {
  razorpayPaymentId: string;
  amountInRupees: number;
}): Promise<{ id: string; status: string } | null> {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    return null; // Graceful fallback when keys are not configured yet
  }

  const auth = btoa(`${keyId}:${keySecret}`);
  const res = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(params.razorpayPaymentId)}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(params.amountInRupees * 100),
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Razorpay refund failed: ${errText}`);
  }

  return (await res.json()) as { id: string; status: string };
}
