import mongoose, { Connection } from "mongoose";

const TRACKING_MONGODB_URI = process.env.MONGODB_TRACKING_URI;

interface TrackingCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

const globalForTracking = globalThis as unknown as {
  trackingMongoose: TrackingCache | undefined;
};

const cached: TrackingCache = globalForTracking.trackingMongoose ?? {
  conn: null,
  promise: null,
};

export async function connectTrackingDB(): Promise<Connection> {
  if (!TRACKING_MONGODB_URI) {
    throw new Error("Missing MONGODB_TRACKING_URI environment variable.");
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.createConnection(TRACKING_MONGODB_URI).asPromise();
  }
  cached.conn = await cached.promise;
  globalForTracking.trackingMongoose = cached;
  return cached.conn;
}
