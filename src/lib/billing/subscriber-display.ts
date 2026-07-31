import type { SubscriptionStatus } from "@/types/auth";
import {
  getPricingPlan,
  isBillingPlanId,
  type BillingPlanId,
} from "@/lib/billing/plan";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const ADMIN_DATE_TIMEZONE = "Asia/Kolkata";

export function formatAdminDate(value?: Date | string | null): string {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString("en-IN", {
    timeZone: ADMIN_DATE_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getDaysSince(value?: Date | string | null): number | null {
  if (!value) {
    return null;
  }
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 0) {
    return 0;
  }
  return Math.floor(diff / MS_PER_DAY);
}

export function getDaysRemaining(value?: Date | string | null): number | null {
  if (!value) {
    return null;
  }
  const diff = new Date(value).getTime() - Date.now();
  if (diff <= 0) {
    return 0;
  }
  return Math.ceil(diff / MS_PER_DAY);
}

export function getPlanLabel(planId?: string | null): string {
  if (!planId || !isBillingPlanId(planId)) {
    return "—";
  }
  const plan = getPricingPlan(planId);
  return `${plan.name} — ${plan.priceDisplay}${plan.periodSuffix}`;
}

export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "pending":
      return "Pending mandate";
    case "trialing":
      return "Free trial";
    case "active":
      return "Active";
    case "past_due":
      return "Past due";
    case "failed":
      return "Failed";
    case "canceled":
      return "Canceled";
    case "unpaid":
      return "Unpaid";
    default:
      return "None";
  }
}

export function getRenewalSummary(input: {
  status: SubscriptionStatus;
  trialEndsAt?: Date | string | null;
  currentPeriodEnd?: Date | string | null;
  cancelAtPeriodEnd?: boolean;
  billingPlanId?: string | null;
}): {
  periodEndsAt: Date | string | null | undefined;
  daysRemaining: number | null;
  renewalLabel: string;
} {
  const periodEndsAt =
    input.status === "trialing" ? input.trialEndsAt : input.currentPeriodEnd;
  const daysRemaining = getDaysRemaining(periodEndsAt);

  let renewalLabel = "—";
  if (input.cancelAtPeriodEnd) {
    renewalLabel = "Cancels at period end";
  } else if (input.status === "trialing" && input.trialEndsAt) {
    renewalLabel = `Auto-bills after trial (${getPlanLabel(input.billingPlanId)})`;
  } else if (
    (input.status === "active" || input.status === "past_due") &&
    input.currentPeriodEnd
  ) {
    renewalLabel = `Access until ${formatAdminDate(input.currentPeriodEnd)}`;
  } else if (input.status === "canceled") {
    renewalLabel = "No renewal";
  }

  return { periodEndsAt, daysRemaining, renewalLabel };
}

export function getDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
}): string {
  const fromParts = [input.firstName, input.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fromParts) {
    return fromParts;
  }
  return input.name?.trim() || "—";
}

export function getBillingPlanIdLabel(planId: BillingPlanId): string {
  return getPlanLabel(planId);
}
