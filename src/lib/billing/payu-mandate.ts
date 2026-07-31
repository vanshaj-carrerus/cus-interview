import type { UserDocument } from "@/models/User";
import { getPlanPeriodEnd } from "@/lib/billing/activate-plan";
import { getSubscriptionAmounts } from "@/lib/billing/order-amount";
import { PRE_DEBIT_LEAD_MS } from "@/lib/billing/payu-billing-dates";
import type { BillingPlanId } from "@/lib/billing/plan";

type MandateUserLike = {
  payuMandateToken?: string | null;
  payuAuthPayuId?: string | null;
};

/** Saved PayU mandate token (`mihpayid` / `authPayuId`) from the ₹2 SI registration. */
export function getPayUMandateToken(user: MandateUserLike): string | null {
  const token = user.payuMandateToken?.trim() || user.payuAuthPayuId?.trim();
  return token || null;
}

/** Plan recurring charge (base + GST). Prices are defined in plan.ts — not modified here. */
export function getPlanRecurringAmount(planId: BillingPlanId): number {
  return getSubscriptionAmounts(planId).totalAmount;
}

/**
 * First full auto-debit is scheduled 24 hours after mandate registration (RBI pre-debit rule).
 * Subsequent renewals use the plan billing period (monthly / quarterly).
 */
export function getInitialNextBillingDate(from = new Date()): Date {
  return new Date(from.getTime() + PRE_DEBIT_LEAD_MS);
}

export function getRenewalNextBillingDate(
  planId: BillingPlanId,
  from = new Date()
): Date {
  return getPlanPeriodEnd(planId, from);
}

export function buildMandateUpdateFields(
  mihpayid: string,
  planId: BillingPlanId
): Pick<
  UserDocument,
  | "payuMandateToken"
  | "payuAuthPayuId"
  | "planAmount"
  | "nextBillingDate"
  | "subscriptionStatus"
> {
  return {
    payuMandateToken: mihpayid,
    payuAuthPayuId: mihpayid,
    planAmount: getPlanRecurringAmount(planId),
    nextBillingDate: getInitialNextBillingDate(),
    subscriptionStatus: "active",
  };
}
