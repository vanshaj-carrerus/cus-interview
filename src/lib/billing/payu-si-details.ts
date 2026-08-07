import { getSubscriptionAmounts } from "@/lib/billing/order-amount";
import {
  addDays,
  formatDateYYYYMMDD,
} from "@/lib/billing/payu-billing-dates";
import type { BillingPlanId } from "@/lib/billing/plan";

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export type PayUSiDetailsPayload = {
  billingAmount: string;
  billingCurrency: "INR";
  billingCycle: "MONTHLY" | "YEARLY";
  billingInterval: number;
  billingRule: "MAX";
  paymentStartDate: string;
  paymentEndDate: string;
};

/**
 * Builds PayU Standing Instruction (SI) JSON for mandate registration.
 * `paymentStartDate` is tomorrow — RBI/PayU disallow same-day recurring debits.
 */
export function buildPayUSiDetailsPayload(
  planId: BillingPlanId,
  from = new Date()
): PayUSiDetailsPayload {
  const { totalAmount } = getSubscriptionAmounts(planId);
  const mandateStart = addDays(from, 1);

  return {
    billingAmount: totalAmount.toFixed(2),
    billingCurrency: "INR",
    billingCycle: planId === "yearly" ? "YEARLY" : "MONTHLY",
    billingInterval: planId === "quarterly" ? 3 : 1,
    billingRule: "MAX",
    paymentStartDate: formatDateYYYYMMDD(mandateStart),
    paymentEndDate: formatDateYYYYMMDD(addYears(from, 10)),
  };
}

/** JSON string for PayU checkout `si_details` form field (must match hash input exactly). */
export function buildPayUSiDetails(
  planId: BillingPlanId,
  from = new Date()
): string {
  return JSON.stringify(buildPayUSiDetailsPayload(planId, from));
}
