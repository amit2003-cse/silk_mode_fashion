import fs from "node:fs";
import { PRODUCTS_DATA } from "../data/products";
import { ensureIndexes, getDb, getMongoClient } from "../lib/db";

if (typeof process.loadEnvFile === "function" && fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

function toR2ImageUrl(imagePath: string): string {
  const base = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
  if (!base) return imagePath;
  if (imagePath.startsWith("/images/products/")) {
    const fileName = imagePath.slice("/images/products/".length);
    return `${base}/products/${fileName}`;
  }
  return imagePath;
}

async function main() {
  const db = await getDb();
  await ensureIndexes(db);

  const productsCol = db.collection("products");
  const now = new Date();
  let upserted = 0;

  for (const product of PRODUCTS_DATA) {
    const r2Images = product.images.map(toR2ImageUrl);
    const baseSku = (product.code || product.id).replace(/\s+/g, "-").toUpperCase();

    const colors = (product.colors ?? []).map((c, idx) => ({
      name: c.name,
      hex: c.hex,
      sku: `${baseSku}-C${idx + 1}`,
      stock: product.inStock === false ? 0 : 10,
      imageIndex: c.imageIndex,
    }));

    await productsCol.updateOne(
      { slug: product.slug },
      {
        $set: {
          legacyId: product.id,
          slug: product.slug,
          aliases: product.aliases ?? [],
          name: product.name,
          category: product.category,
          code: product.code ?? null,
          price: product.price,
          originalPrice: product.originalPrice ?? null,
          badge: product.badge ?? null,
          description: product.description,
          fabric: product.fabric ?? null,
          work: product.work ?? null,
          sareeLength: product.sareeLength ?? null,
          blouseDetails: product.blouseDetails ?? null,
          weight: product.weight ?? null,
          images: r2Images,
          colors,
          trending: Boolean(product.trending),
          featured: Boolean(product.featured),
          isActive: product.inStock !== false,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
    upserted++;
  }

  // Ensure initial admin account exists
  const adminEmail = (process.env.ADMIN_EMAIL || "silkmodefashion06@gmail.com").toLowerCase();
  await db.collection("users").updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        role: "admin",
        updatedAt: now,
      },
      $setOnInsert: {
        name: "SilkMode Admin",
        addresses: [],
        createdAt: now,
      },
    },
    { upsert: true }
  );

  const totalProducts = await productsCol.countDocuments();
  console.log(`Seeded/updated ${upserted} products. Total in MongoDB: ${totalProducts}.`);
  console.log(`Admin account ensured: ${adminEmail}`);

  const client = await getMongoClient();
  await client.close();
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
