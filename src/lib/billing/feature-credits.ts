import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSessionPublicUser } from "@/lib/get-session-user";
import type { CreditFeature, PublicFeatureCredits, PublicUser } from "@/types/auth";

export type FeatureCreditsLike = {
  mockInterviewRemaining?: number | null;
  mockInterviewTotal?: number | null;
  resumeAnalyzerRemaining?: number | null;
  resumeAnalyzerTotal?: number | null;
  expiresAt?: Date | string | null;
  couponCode?: string | null;
  suspended?: boolean | null;
  planLimited?: boolean | null;
};

const REMAINING_FIELD: Record<CreditFeature, string> = {
  mockInterview: "featureCredits.mockInterviewRemaining",
  resumeAnalyzer: "featureCredits.resumeAnalyzerRemaining",
};

const FEATURE_LABEL: Record<CreditFeature, string> = {
  mockInterview: "AI mock interviews",
  resumeAnalyzer: "resume analyses",
};

/** null when the user has no credits or they have expired. */
export function toPublicFeatureCredits(
  credits?: FeatureCreditsLike | null
): PublicFeatureCredits | null {
  if (!credits || credits.suspended) return null;
  const mockTotal = credits.mockInterviewTotal ?? 0;
  const resumeTotal = credits.resumeAnalyzerTotal ?? 0;
  if (mockTotal <= 0 && resumeTotal <= 0) return null;

  const expiresAt = credits.expiresAt ? new Date(credits.expiresAt) : null;
  if (expiresAt && expiresAt.getTime() <= Date.now()) return null;

  return {
    mockInterview: {
      remaining: Math.max(0, credits.mockInterviewRemaining ?? 0),
      total: mockTotal,
    },
    resumeAnalyzer: {
      remaining: Math.max(0, credits.resumeAnalyzerRemaining ?? 0),
      total: resumeTotal,
    },
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    planLimited: Boolean(credits.planLimited),
  };
}

/**
 * True when this user's use of `feature` is counted against coupon credits:
 * either they have no plan (free-uses coupon), or their free-access coupon capped it.
 */
export function isFeatureCreditLimited(user: PublicUser, feature: CreditFeature): boolean {
  if (user.role === "SuperAdmin") return false;
  const credits = user.subscription.featureCredits;
  const featureCredits = credits?.[feature];
  if (!credits || !featureCredits || featureCredits.total <= 0) return false;
  return !user.subscription.hasPlatformAccess || credits.planLimited;
}

function hasFullAccess(user: PublicUser): boolean {
  return user.role === "SuperAdmin" || user.subscription.hasPlatformAccess;
}

function creditsError(feature: CreditFeature, hadCredits: boolean) {
  return NextResponse.json(
    {
      error: hadCredits
        ? `You've used all your free ${FEATURE_LABEL[feature]}. Buy a plan to keep going.`
        : "Subscribe to the monthly or quarterly plan to access this feature.",
      code: "SUBSCRIPTION_REQUIRED",
    },
    { status: 403 }
  );
}

export type FeatureAccess = { user: PublicUser; via: "plan" | "credits" };

/**
 * Like `getPlatformAccessSession`, but also lets in users holding coupon credits
 * for this feature. Does not take a credit — call `consumeFeatureCredit` for that.
 */
export async function getFeatureAccessSession(
  feature: CreditFeature
): Promise<FeatureAccess | { error: NextResponse }> {
  const user = await getSessionPublicUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  if (isFeatureCreditLimited(user, feature)) {
    return { user, via: "credits" };
  }

  if (hasFullAccess(user)) {
    return { user, via: "plan" };
  }

  return { error: creditsError(feature, false) };
}

/**
 * Atomically takes one credit. Returns a `refund` to call if the action then fails,
 * or an error response when no credits are left.
 */
export async function consumeFeatureCredit(
  userId: string,
  feature: CreditFeature
): Promise<{ refund: () => Promise<void> } | { error: NextResponse }> {
  const field = REMAINING_FIELD[feature];
  await connectDB();
  const updated = await User.findOneAndUpdate(
    {
      _id: userId,
      [field]: { $gt: 0 },
      "featureCredits.suspended": { $ne: true },
      $or: [
        { "featureCredits.expiresAt": null },
        { "featureCredits.expiresAt": { $gt: new Date() } },
      ],
    },
    { $inc: { [field]: -1 } }
  );
  if (!updated) {
    return { error: creditsError(feature, true) };
  }

  return {
    refund: async () => {
      await User.updateOne({ _id: userId }, { $inc: { [field]: 1 } });
    },
  };
}
