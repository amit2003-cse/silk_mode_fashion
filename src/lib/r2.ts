import { S3Client, PutObjectCommand, HeadObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let cachedR2Client: S3Client | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not defined.`);
  }
  return value;
}

export function getR2Client(): S3Client {
  if (!cachedR2Client) {
    cachedR2Client = new S3Client({
      region: "auto",
      endpoint: getRequiredEnv("R2_ENDPOINT"),
      credentials: {
        accessKeyId: getRequiredEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: getRequiredEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }
  return cachedR2Client;
}

export function getR2BucketName(): string {
  return getRequiredEnv("R2_BUCKET_NAME");
}

export function getPublicR2Url(key: string): string {
  const base = getRequiredEnv("R2_PUBLIC_URL").replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${base}/${cleanKey}`;
}

export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 60
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const client = getR2Client();
  const bucket = getR2BucketName();
  const cleanKey = key.replace(/^\/+/, "");

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  return {
    uploadUrl,
    publicUrl: getPublicR2Url(cleanKey),
    key: cleanKey,
  };
}

export async function objectExistsInR2(key: string, bucketOverride?: string): Promise<boolean> {
  const client = getR2Client();
  const bucket = bucketOverride || getR2BucketName();
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key.replace(/^\/+/, ""),
      })
    );
    return true;
  } catch {
    return false;
  }
}

export async function listR2Buckets(): Promise<string[]> {
  const client = getR2Client();
  const res = await client.send(new ListBucketsCommand({}));
  return (res.Buckets ?? []).map((b) => b.Name).filter((n): n is string => Boolean(n));
}
