import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSessionUser, setSessionCookie, signSessionToken, UserRole } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    const db = await getDb();
    const userDoc = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.userId) },
        { projection: { name: 1, email: 1, phone: 1, role: 1, addresses: 1 } }
      );

    if (!userDoc) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name ?? null,
        email: userDoc.email ?? null,
        phone: userDoc.phone ?? null,
        role: userDoc.role ?? "customer",
        addresses: userDoc.addresses ?? [],
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { name?: string; phone?: string };
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim().slice(0, 80);
    }
    if (typeof body.phone === "string" && body.phone.trim()) {
      const cleanPhone = body.phone.replace(/\D/g, "").slice(-10);
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return NextResponse.json({ error: "Invalid 10-digit mobile number." }, { status: 400 });
      }
      updates.phone = cleanPhone;
    }

    const db = await getDb();
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(session.userId) }, { $set: updates });

    const updated = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId) });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = await signSessionToken({
      userId: updated._id.toString(),
      role: (updated.role as UserRole) || "customer",
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: updated._id.toString(),
        name: updated.name ?? null,
        email: updated.email ?? null,
        phone: updated.phone ?? null,
        role: updated.role ?? "customer",
        addresses: updated.addresses ?? [],
      },
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
