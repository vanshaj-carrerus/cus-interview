import mongoose from "mongoose";
import { resolveMongoUri } from "@/lib/mongo-uri";

const MONGODB_URI = process.env.MONGODB_URI?.trim();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as {
  mongoose: MongooseCache | undefined;
};

const cached: MongooseCache = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

function resetMongoCache(): void {
  cached.conn = null;
  cached.promise = null;
  globalForMongoose.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const uri = await resolveMongoUri(MONGODB_URI);
      return mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10_000,
      });
    })();
  }

  try {
    cached.conn = await cached.promise;
    globalForMongoose.mongoose = cached;
    return cached.conn;
  } catch (err) {
    resetMongoCache();
    throw err;
  }
}
