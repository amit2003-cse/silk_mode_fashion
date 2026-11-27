import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const PHONE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { phone?: string };
    const phone = (body.phone || "").replace(/\D/g, "").slice(-10);

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const apiKey = process.env.TWOFACTOR_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Mobile OTP service is not configured yet. Please use Google Sign-In." },
        { status: 503 }
      );
    }

    const db = await getDb();
    const otpCol = db.collection("otp_sessions");

    // Rate-limit: 1 OTP per 60 seconds per phone
    const recent = await otpCol.findOne({
      phone,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });
    if (recent) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another OTP." },
        { status: 429 }
      );
    }

    const res = await fetch(
      `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/+91${phone}/AUTOGEN`,
      { method: "GET" }
    );
    const data = (await res.json()) as { Status?: string; Details?: string };

    if (!res.ok || data.Status !== "Success" || !data.Details) {
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again shortly." },
        { status: 502 }
      );
    }

    const now = new Date();
    await otpCol.insertOne({
      phone,
      twoFactorSessionId: data.Details,
      attempts: 0,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 5 * 60 * 1000), // 5 min TTL
    });

    return NextResponse.json({ ok: true, message: "OTP sent to +91 " + phone });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Unable to send OTP right now." }, { status: 500 });
  }
}
