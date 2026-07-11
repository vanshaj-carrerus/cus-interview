import type { SubscriptionStatus } from "@/types/auth";
import { isBillingPlanId } from "@/lib/billing/plan";

const ACCESS_STATUSES: ReadonlySet<SubscriptionStatus> = new Set([
  "trialing",
  "active",
]);

export function hasSubscriptionAccess(
  status: SubscriptionStatus,
  trialEndsAt?: string | null,
  currentPeriodEnd?: string | null
): boolean {
  if (!ACCESS_STATUSES.has(status)) {
    return false;
  }

  const cutoff =
    status === "trialing"
      ? trialEndsAt
      : currentPeriodEnd;

  if (!cutoff) {
    return true;
  }

  return new Date(cutoff).getTime() > Date.now();
}

type PlatformAccessInput = {
  status: SubscriptionStatus;
  billingPlanId?: string | null;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
};

/** Monthly or quarterly plan with an active trial or billing period. */
export function hasPlatformPlanAccess(input: PlatformAccessInput): boolean {
  if (!isBillingPlanId(input.billingPlanId)) {
    return false;
  }

  return hasSubscriptionAccess(
    input.status,
    input.trialEndsAt,
    input.currentPeriodEnd
  );
}
