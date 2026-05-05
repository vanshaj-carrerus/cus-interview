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
  /** After Atlas auth fails on MONGODB_TRACKING_URI, reuse main pool (same as fixing a bad duplicate env on Vercel). */
  trackingUseMainConnectionFallback: boolean | undefined;
};

const cached: TrackingCache = globalForTracking.trackingMongoose ?? {
  conn: null,
  promise: null,
};

function isMongoAuthError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const o = err as {
    code?: number;
    codeName?: string;
    message?: string;
    errorResponse?: { code?: number; errmsg?: string };
  };
  const code = o.code ?? o.errorResponse?.code;
  if (code === 8000 || code === 13) return true;
  const msg = `${o.message ?? ""} ${o.errorResponse?.errmsg ?? ""}`.toLowerCase();
  return msg.includes("authentication failed") || msg.includes("bad auth");
}

export async function connectTrackingDB(): Promise<Connection> {
  if (!TRACKING_MONGODB_URI) {
    throw new Error(
      "Missing database URI for learning progress: set MONGODB_TRACKING_URI or MONGODB_URI.",
    );
  }

  const useMainConnection = Boolean(
    MAIN_MONGODB_URI && TRACKING_MONGODB_URI === MAIN_MONGODB_URI,
  );

  if (useMainConnection || globalForTracking.trackingUseMainConnectionFallback) {
    await connectDB();
    if (learningProgressDebugEnabled()) {
      logLearningProgress(
        "mongodb-tracking",
        globalForTracking.trackingUseMainConnectionFallback
          ? "using default mongoose connection (fallback after MONGODB_TRACKING_URI auth failure)"
          : "using default mongoose connection (tracking URI matches MONGODB_URI)",
      );
    }
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  try {
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
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    globalForTracking.trackingMongoose = cached;

    if (isMongoAuthError(err) && MAIN_MONGODB_URI) {
      console.warn(
        "[mongodb-tracking] MONGODB_TRACKING_URI authentication failed; using MONGODB_URI for learning progress collections. " +
          "On Vercel, remove MONGODB_TRACKING_URI or set it exactly equal to MONGODB_URI (same user/password).",
        err instanceof Error ? err.message : err,
      );
      globalForTracking.trackingUseMainConnectionFallback = true;
      await connectDB();
      return mongoose.connection;
    }

    throw err;
  }
}
