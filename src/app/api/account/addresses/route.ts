import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSessionUser, UserAddress } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(session.userId) }, { projection: { addresses: 1 } });

  return NextResponse.json({ addresses: user?.addresses ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<UserAddress>;
    const fullName = (body.fullName || "").trim();
    const phone = (body.phone || "").replace(/\D/g, "").slice(-10);
    const line1 = (body.line1 || "").trim();
    const line2 = (body.line2 || "").trim();
    const city = (body.city || "").trim();
    const state = (body.state || "").trim();
    const pincode = (body.pincode || "").replace(/\D/g, "");
    const label = (body.label || "Home").trim();

    if (!fullName || !/^[6-9]\d{9}$/.test(phone) || !line1 || !city || !state || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Please fill all required address fields with a valid 10-digit phone and 6-digit pincode." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCol = db.collection("users");
    const userDoc = await usersCol.findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { addresses: 1 } }
    );
    const currentAddresses = (userDoc?.addresses as UserAddress[] | undefined) ?? [];

    const makeDefault = Boolean(body.isDefault) || currentAddresses.length === 0;
    const updatedAddresses = currentAddresses.map((addr) =>
      makeDefault ? { ...addr, isDefault: false } : addr
    );

    const newAddress: UserAddress = {
      id: crypto.randomUUID(),
      label,
      fullName,
      phone,
      line1,
      ...(line2 ? { line2 } : {}),
      city,
      state,
      pincode,
      isDefault: makeDefault,
    };
    updatedAddresses.push(newAddress);

    await usersCol.updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { addresses: updatedAddresses, updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true, addresses: updatedAddresses, address: newAddress });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json({ error: "Failed to save address." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addressId = req.nextUrl.searchParams.get("id");
  if (!addressId) {
    return NextResponse.json({ error: "Missing address id." }, { status: 400 });
  }

  const db = await getDb();
  const usersCol = db.collection("users");
  const userDoc = await usersCol.findOne(
    { _id: new ObjectId(session.userId) },
    { projection: { addresses: 1 } }
  );
  const current = (userDoc?.addresses as UserAddress[] | undefined) ?? [];
  const filtered = current.filter((a) => a.id !== addressId);

  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
    filtered[0] = { ...filtered[0], isDefault: true };
  }

  await usersCol.updateOne(
    { _id: new ObjectId(session.userId) },
    { $set: { addresses: filtered, updatedAt: new Date() } }
  );

  return NextResponse.json({ ok: true, addresses: filtered });
}
