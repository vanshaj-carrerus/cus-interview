import { hasPlatformPlanAccess, hasSubscriptionAccess } from "@/lib/billing/access";
import { getMockInterviewDailyLimit, isTrialingSubscription } from "@/lib/billing/trial-limits";
import { isBillingPlanId } from "@/lib/billing/plan";
import { toPublicFeatureCredits, type FeatureCreditsLike } from "@/lib/billing/feature-credits";
import type { PublicSubscription, PublicUser, SubscriptionStatus } from "@/types/auth";

type UserLike = {
  _id: { toString(): string };
  email: string;
  name?: string;
  profileImageUrl?: string;
  role?: "User" | "SuperAdmin";
  createdAt?: Date | string;
  billingPlanId?: string | null;
  subscriptionStatus?: SubscriptionStatus;
  trialEndsAt?: Date | string | null;
  currentPeriodEnd?: Date | string | null;
  cancelAtPeriodEnd?: boolean;
  planAmount?: number | null;
  couponAccessStartsAt?: Date | string | null;
  featureCredits?: FeatureCreditsLike | null;
};

function toIsoDate(value?: Date | string | null): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function toPublicSubscription(user: UserLike): PublicSubscription {
  const status = user.subscriptionStatus ?? "none";
  const trialEndsAt = toIsoDate(user.trialEndsAt);
  const currentPeriodEnd = toIsoDate(user.currentPeriodEnd);
  const planId = isBillingPlanId(user.billingPlanId) ? user.billingPlanId : null;
  // A ₹0 coupon plan with a custom start date gives no access until that date.
  const couponStartsAt = user.couponAccessStartsAt ? new Date(user.couponAccessStartsAt) : null;
  const notStartedYet =
    (user.planAmount ?? 0) === 0 && couponStartsAt !== null && couponStartsAt.getTime() > Date.now();
  const hasAccess =
    !notStartedYet && hasSubscriptionAccess(status, trialEndsAt, currentPeriodEnd);
  const hasPlatformAccess =
    !notStartedYet &&
    hasPlatformPlanAccess({
      status,
      billingPlanId: planId,
      trialEndsAt,
      currentPeriodEnd,
    });
  const limitInput = { status, hasPlatformAccess };

  return {
    status,
    trialEndsAt,
    currentPeriodEnd,
    cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
    hasAccess,
    hasPlatformAccess,
    planId,
    isTrialing: isTrialingSubscription(limitInput),
    mockInterviewsDailyLimit: getMockInterviewDailyLimit(limitInput),
    featureCredits: toPublicFeatureCredits(user.featureCredits),
  };
}

export function toPublicUser(user: UserLike): PublicUser {
  const createdAt =
    user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : typeof user.createdAt === "string"
        ? user.createdAt
        : new Date().toISOString();

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? "",
    image: user.profileImageUrl?.trim() || null,
    role: user.role === "SuperAdmin" ? "SuperAdmin" : "User",
    createdAt,
    subscription: toPublicSubscription(user),
  };
}
