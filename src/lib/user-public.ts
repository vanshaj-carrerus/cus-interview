import { hasPlatformPlanAccess, hasSubscriptionAccess } from "@/lib/billing/access";
import { getMockInterviewDailyLimit, isTrialingSubscription } from "@/lib/billing/trial-limits";
import { isBillingPlanId } from "@/lib/billing/plan";
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
  const hasAccess = hasSubscriptionAccess(status, trialEndsAt, currentPeriodEnd);
  const hasPlatformAccess = hasPlatformPlanAccess({
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
