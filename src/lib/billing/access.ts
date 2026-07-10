import type { SubscriptionStatus } from "@/types/auth";

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
