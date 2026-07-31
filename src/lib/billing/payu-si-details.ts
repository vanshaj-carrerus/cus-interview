import { getSubscriptionAmounts } from "@/lib/billing/order-amount";
import { TRIAL_MINUTES, type BillingPlanId } from "@/lib/billing/plan";

function formatDateYYYYMMDD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getTrialEndDate(from = new Date()): Date {
  return new Date(from.getTime() + TRIAL_MINUTES * 60 * 1000);
}

/** PayU auto-debit schedule starts after the first post-trial charge. */
export function getPayURecurringStartDate(
  planId: BillingPlanId,
  trialEndsAt: Date
): Date {
  const start = new Date(trialEndsAt);
  if (planId === "quarterly") {
    start.setMonth(start.getMonth() + 3);
  } else {
    start.setMonth(start.getMonth() + 1);
  }
  return start;
}

export function buildPayUSiDetails(planId: BillingPlanId, trialEndsAt: Date): string {
  const { totalAmount } = getSubscriptionAmounts(planId);
  const recurringStart = getPayURecurringStartDate(planId, trialEndsAt);

  return JSON.stringify({
    billingAmount: totalAmount.toFixed(2),
    billingCurrency: "INR",
    billingCycle: "MONTHLY",
    billingInterval: planId === "quarterly" ? 3 : 1,
    paymentStartDate: formatDateYYYYMMDD(recurringStart),
    paymentEndDate: "2035-12-31",
  });
}
