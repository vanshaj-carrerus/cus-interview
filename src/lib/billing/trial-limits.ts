import type { SubscriptionStatus } from "@/types/auth";
import { TRIAL_DAYS } from "@/lib/billing/plan";

export const TRIAL_MOCK_INTERVIEWS_PER_DAY = 1;

/** Start/end of the current calendar day in IST (UTC+5:30). */
export function getIstDayBounds(now = new Date()): { start: Date; end: Date } {
  const istMs = now.getTime() + 5.5 * 60 * 60 * 1000;
  const istDate = new Date(istMs);
  const y = istDate.getUTCFullYear();
  const m = istDate.getUTCMonth();
  const d = istDate.getUTCDate();
  const start = new Date(Date.UTC(y, m, d) - 5.5 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

type SubscriptionLimitInput = {
  status: SubscriptionStatus;
  hasPlatformAccess: boolean;
};

export function isTrialingSubscription(input: SubscriptionLimitInput): boolean {
  return input.status === "trialing" && input.hasPlatformAccess;
}

export function hasUnlimitedMockInterviews(
  input: SubscriptionLimitInput
): boolean {
  if (!input.hasPlatformAccess) {
    return false;
  }
  return input.status === "active";
}

/** `1` during trial, `null` when unlimited (active paid plan), `0` when no access. */
export function getMockInterviewDailyLimit(
  input: SubscriptionLimitInput
): number | null {
  if (!input.hasPlatformAccess) {
    return 0;
  }
  if (input.status === "trialing") {
    return TRIAL_MOCK_INTERVIEWS_PER_DAY;
  }
  if (input.status === "active") {
    return null;
  }
  return 0;
}

export function buildTrialMockLimitMessage(): string {
  return `Free trial (${TRIAL_DAYS} days): you can run ${TRIAL_MOCK_INTERVIEWS_PER_DAY} AI mock interview per day. Practice problems, courses, and the compiler are fully available. After your plan auto-renews, mock interviews are unlimited.`;
}

export function buildTrialMockLimitReachedMessage(): string {
  return `You've used today's free trial mock interview. Come back tomorrow, or wait until your plan renews after the ${TRIAL_DAYS}-day trial for unlimited access.`;
}
