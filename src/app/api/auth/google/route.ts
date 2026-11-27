import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSessionCookie, signSessionToken, UserRole } from "@/lib/auth";

interface GoogleTokenInfo {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { credential?: string };
    const credential = body.credential?.trim();

    if (!credential) {
      return NextResponse.json({ error: "Missing Google credential." }, { status: 400 });
    }

    const expectedClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!expectedClientId) {
      return NextResponse.json({ error: "Google Sign-In is not configured." }, { status: 503 });
    }

    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid Google token." }, { status: 401 });
    }

    const tokenInfo = (await verifyRes.json()) as GoogleTokenInfo;
    const isVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === "true";

    if (tokenInfo.aud !== expectedClientId || !tokenInfo.email || !isVerified) {
      return NextResponse.json({ error: "Google token verification failed." }, { status: 401 });
    }

    const email = tokenInfo.email.toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "silkmodefashion06@gmail.com").toLowerCase();
    const now = new Date();

    const db = await getDb();
    const usersCol = db.collection("users");
    const existing = await usersCol.findOne({ email });

    let userId: string;
    let role: UserRole = email === adminEmail ? "admin" : "customer";
    let phone: string | undefined;
    const name = existing?.name || tokenInfo.name || email.split("@")[0];

    if (existing) {
      userId = existing._id.toString();
      role = existing.role === "admin" || email === adminEmail ? "admin" : "customer";
      phone = existing.phone;
      await usersCol.updateOne(
        { _id: existing._id },
        {
          $set: {
            googleId: tokenInfo.sub,
            name,
            role,
            updatedAt: now,
          },
        }
      );
    } else {
      const inserted = await usersCol.insertOne({
        email,
        googleId: tokenInfo.sub,
        name,
        role,
        addresses: [],
        createdAt: now,
        updatedAt: now,
      });
      userId = inserted.insertedId.toString();
    }

    const token = await signSessionToken({ userId, role, name, email, phone });
    const response = NextResponse.json({
      ok: true,
      user: { id: userId, role, name, email, phone: phone ?? null },
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json({ error: "Google sign-in failed." }, { status: 500 });
  }
}
