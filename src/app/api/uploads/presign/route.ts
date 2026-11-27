import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createPresignedUploadUrl } from "@/lib/r2";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      folder?: "returns" | "products";
      contentType?: string;
      fileName?: string;
    };

    const folder = body.folder === "products" ? "products" : "returns";
    if (folder === "products" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const contentType = body.contentType || "image/jpeg";
    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WEBP images are allowed." },
        { status: 400 }
      );
    }

    const ext =
      contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const safeName = (body.fileName || "image")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 40);
    const key =
      folder === "products"
        ? `products/${safeName}-${crypto.randomUUID().slice(0, 8)}.${ext}`
        : `returns/${session.userId}/${crypto.randomUUID()}.${ext}`;

    const presigned = await createPresignedUploadUrl(key, contentType, 60);
    return NextResponse.json({ ok: true, ...presigned });
  } catch (error) {
    console.error("Presign upload error:", error);
    return NextResponse.json({ error: "Failed to prepare upload URL." }, { status: 500 });
  }
}
