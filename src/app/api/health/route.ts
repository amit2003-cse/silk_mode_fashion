import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const productCount = await db.collection("products").countDocuments();

    return NextResponse.json({
      ok: true,
      mongodb: "connected",
      productCount,
      r2Configured: Boolean(
        process.env.R2_ENDPOINT &&
          process.env.R2_ACCESS_KEY_ID &&
          process.env.R2_SECRET_ACCESS_KEY &&
          process.env.R2_PUBLIC_URL
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
