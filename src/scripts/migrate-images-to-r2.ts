import fs from "node:fs";
import path from "node:path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, listR2Buckets, objectExistsInR2, getPublicR2Url } from "../lib/r2";

if (typeof process.loadEnvFile === "function" && fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function resolveBucketName(): Promise<string> {
  const configured = process.env.R2_BUCKET_NAME;
  if (configured) {
    return configured;
  }
  const buckets = await listR2Buckets();
  if (buckets.length === 1) {
    console.log(`Using detected R2 bucket: ${buckets[0]}`);
    return buckets[0];
  }
  throw new Error(
    `Could not resolve R2 bucket. Set R2_BUCKET_NAME in .env.local.`
  );
}

async function main() {
  const productsDir = path.join(process.cwd(), "public", "images", "products");
  if (!fs.existsSync(productsDir)) {
    throw new Error(`Directory not found: ${productsDir}`);
  }

  const bucket = await resolveBucketName();
  const client = getR2Client();
  const files = fs
    .readdirSync(productsDir)
    .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));

  console.log(`Found ${files.length} product images. Bucket: ${bucket}`);

  // Fail fast on the first file if credentials or bucket permissions are invalid
  if (files.length > 0) {
    const testKey = `products/${files[0]}`;
    const testBody = fs.readFileSync(path.join(productsDir, files[0]));
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: testBody,
        ContentType: getContentType(files[0]),
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    console.log(`Verified write access with ${testKey}`);
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const concurrency = 10;

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (file) => {
        const key = `products/${file}`;
        try {
          const exists = await objectExistsInR2(key, bucket);
          if (exists) {
            skipped++;
            return;
          }
          const body = fs.readFileSync(path.join(productsDir, file));
          await client.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: body,
              ContentType: getContentType(file),
              CacheControl: "public, max-age=31536000, immutable",
            })
          );
          uploaded++;
        } catch (err) {
          failed++;
          console.error(`Failed ${key}:`, err instanceof Error ? err.message : err);
        }
      })
    );

    const processed = Math.min(i + concurrency, files.length);
    if (processed % 100 === 0 || processed === files.length) {
      console.log(
        `Progress: ${processed}/${files.length} (uploaded=${uploaded}, skipped=${skipped}, failed=${failed})`
      );
    }
  }

  if (files.length > 0) {
    console.log(`Sample public URL: ${getPublicR2Url(`products/${files[0]}`)}`);
  }
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
