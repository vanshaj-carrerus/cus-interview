import { getPricingPlan, type BillingPlanId } from "@/lib/billing/plan";
import {
  getHumanService,
  type HumanServiceId,
} from "@/lib/billing/human-services";

export const GST_RATE = 0.18;

export function getOrderAmounts(planId: BillingPlanId, currency = "INR") {
  const plan = getPricingPlan(planId);
  const baseAmount = plan.amountPaise / 100;
  const gstRate = currency === "INR" ? GST_RATE : 0;
  const gstAmount = baseAmount * gstRate;
  const totalAmount = baseAmount + gstAmount;

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    amountPaise: Math.round(totalAmount * 100),
    currency,
  };
}

/** Recurring subscription charge after trial (base + 18% GST). */
export const getSubscriptionAmounts = getOrderAmounts;

export function formatInrAmount(amount: number): string {
  const hasFraction = Math.round(amount * 100) % 100 !== 0;
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  })}`;
}

export function getSubscriptionTotalDisplay(planId: BillingPlanId): string {
  const { totalAmount } = getSubscriptionAmounts(planId);
  return formatInrAmount(totalAmount);
}

export function getServiceOrderAmounts(
  serviceId: HumanServiceId,
  currency = "INR"
) {
  const service = getHumanService(serviceId);
  const baseAmount = service.amountInr;
  const gstRate = currency === "INR" ? GST_RATE : 0;
  const gstAmount = baseAmount * gstRate;
  const totalAmount = baseAmount + gstAmount;

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    amountPaise: Math.round(totalAmount * 100),
    currency,
  };
}
