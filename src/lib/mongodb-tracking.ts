import mongoose, { Connection } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { resolveMongoUri } from "@/lib/mongo-uri";
import { learningProgressDebugEnabled, logLearningProgress } from "@/lib/learning-progress-debug";

/**
 * Host (+ port) + DB name from connection string — ignores credentials.
 * If MONGODB_TRACKING_URI matches this key for MONGODB_URI, we reuse the main pool so a bad
 * duplicate secret on Vercel cannot break tracking while the rest of the app works.
 */
function mongoDeploymentKey(uri: string): string {
  const s = uri.trim();
  const m = /^mongodb(\+srv)?:\/\/(?:[^@]+@)?([^/?]+)(?:\/([^?]*))?/i.exec(s);
  if (!m) return s;
  const host = (m[2] ?? "").toLowerCase();
  const db = (m[3] ?? "").trim();
  return `${host}/${db}`;
}

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
  const primaryUri = process.env.MONGODB_URI?.trim();
  if (!primaryUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const trackingUri = process.env.MONGODB_TRACKING_URI?.trim();

  const sameDeployment =
    !trackingUri || mongoDeploymentKey(trackingUri) === mongoDeploymentKey(primaryUri);

  if (sameDeployment) {
    await connectDB();
    if (learningProgressDebugEnabled()) {
      logLearningProgress(
        "mongodb-tracking",
        trackingUri
          ? "using shared mongoose connection (tracking URI same host/DB as MONGODB_URI; auth via MONGODB_URI only)"
          : "using shared mongoose connection (MONGODB_URI only)",
        { deploymentKey: mongoDeploymentKey(primaryUri) },
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
        "opening mongoose.createConnection — MONGODB_TRACKING_URI targets a different host/DB than MONGODB_URI",
        {
          primaryKey: mongoDeploymentKey(primaryUri),
          trackingKey: mongoDeploymentKey(trackingUri),
        },
      );
    }
    cached.promise = (async () => {
      const uri = await resolveMongoUri(trackingUri);
      return mongoose
        .createConnection(uri, { serverSelectionTimeoutMS: 10_000 })
        .asPromise();
    })();
  }

  try {
    cached.conn = await cached.promise;
    globalForTracking.trackingMongoose = cached;
    return cached.conn;
  } catch (err) {
    cached.conn = null;
    cached.promise = null;
    globalForTracking.trackingMongoose = cached;
    throw err;
  }
}
