import mongoose, { Connection } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { learningProgressDebugEnabled, logLearningProgress } from "@/lib/learning-progress-debug";

/** Prefer dedicated tracking cluster/DB when set; otherwise reuse main app DB (typical for Vercel/single-cluster deploys). */
const TRACKING_MONGODB_URI =
  process.env.MONGODB_TRACKING_URI?.trim() || process.env.MONGODB_URI?.trim();

const MAIN_MONGODB_URI = process.env.MONGODB_URI?.trim();

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
    throw new Error(
      "Missing database URI for learning progress: set MONGODB_TRACKING_URI or MONGODB_URI.",
    );
  }

  const useMainConnection = Boolean(
    MAIN_MONGODB_URI && TRACKING_MONGODB_URI === MAIN_MONGODB_URI,
  );

  if (useMainConnection) {
    await connectDB();
    if (learningProgressDebugEnabled()) {
      logLearningProgress(
        "mongodb-tracking",
        "using default mongoose connection (tracking URI matches MONGODB_URI)",
      );
    }
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    if (learningProgressDebugEnabled()) {
      logLearningProgress(
        "mongodb-tracking",
        "opening dedicated mongoose.createConnection for tracking",
      );
    }
    cached.promise = mongoose.createConnection(TRACKING_MONGODB_URI).asPromise();
  }
  cached.conn = await cached.promise;
  globalForTracking.trackingMongoose = cached;
  return cached.conn;
}
