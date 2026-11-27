import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }
  return uri;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    globalThis._mongoClientPromise = client.connect();
  }
  return globalThis._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "silkmodefashion";
  return client.db(dbName);
}

/**
 * Ensures core indexes exist across collections.
 * Safe to call idempotently during seeding or startup.
 */
export async function ensureIndexes(db?: Db): Promise<void> {
  const database = db ?? (await getDb());

  await Promise.all([
    database.collection("users").createIndex({ phone: 1 }, { unique: true, sparse: true }),
    database.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true }),
    database
      .collection("otp_sessions")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database.collection("products").createIndex({ slug: 1 }, { unique: true }),
    database.collection("products").createIndex({ category: 1, isActive: 1 }),
    database.collection("carts").createIndex({ userId: 1 }, { unique: true }),
    database.collection("orders").createIndex({ orderNumber: 1 }, { unique: true }),
    database.collection("orders").createIndex({ userId: 1, createdAt: -1 }),
    database.collection("return_requests").createIndex({ orderId: 1 }, { unique: true }),
    database.collection("return_requests").createIndex({ userId: 1, createdAt: -1 }),
    database.collection("webhook_events").createIndex({ eventId: 1 }, { unique: true }),
  ]);
}
