import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSessionCookie, signSessionToken, UserRole } from "@/lib/auth";

const PHONE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { phone?: string; otp?: string };
    const phone = (body.phone || "").replace(/\D/g, "").slice(-10);
    const otp = (body.otp || "").trim();

    if (!PHONE_REGEX.test(phone) || !/^\d{4,6}$/.test(otp)) {
      return NextResponse.json({ error: "Invalid phone number or OTP format." }, { status: 400 });
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

    const session = await otpCol.findOne(
      { phone, expiresAt: { $gt: new Date() } },
      { sort: { createdAt: -1 } }
    );

    if (!session) {
      return NextResponse.json(
        { error: "OTP expired or not found. Please request a new OTP." },
        { status: 400 }
      );
    }

    if ((session.attempts ?? 0) >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    const verifyRes = await fetch(
      `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/VERIFY/${encodeURIComponent(
        session.twoFactorSessionId
      )}/${encodeURIComponent(otp)}`,
      { method: "GET" }
    );
    const verifyData = (await verifyRes.json()) as { Status?: string; Details?: string };

    if (!verifyRes.ok || verifyData.Status !== "Success") {
      await otpCol.updateOne({ _id: session._id }, { $inc: { attempts: 1 } });
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // Clear used OTP sessions for this phone
    await otpCol.deleteMany({ phone });

    const now = new Date();
    const usersCol = db.collection("users");
    const existing = await usersCol.findOne({ phone });

    let userId: string;
    let role: UserRole = "customer";
    let name: string | undefined;
    let email: string | undefined;

    if (existing) {
      userId = existing._id.toString();
      role = (existing.role as UserRole) || "customer";
      name = existing.name;
      email = existing.email;
      await usersCol.updateOne({ _id: existing._id }, { $set: { updatedAt: now } });
    } else {
      const inserted = await usersCol.insertOne({
        phone,
        role: "customer",
        addresses: [],
        createdAt: now,
        updatedAt: now,
      });
      userId = inserted.insertedId.toString();
    }

    const token = await signSessionToken({ userId, role, name, email, phone });
    const response = NextResponse.json({
      ok: true,
      user: { id: userId, role, name: name ?? null, email: email ?? null, phone },
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Unable to verify OTP right now." }, { status: 500 });
  }
}
