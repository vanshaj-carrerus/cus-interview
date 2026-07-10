import { getRazorpay } from "@/lib/razorpay";
import {
  getPricingPlan,
  TRIAL_DAYS,
  type BillingPlanId,
} from "@/lib/billing/plan";
import { getSubscriptionAmounts } from "@/lib/billing/order-amount";

const cachedPlanIds = new Map<BillingPlanId, string>();

async function findExistingPlanId(
  planId: BillingPlanId,
  amountPaise: number,
  period: "daily" | "weekly" | "monthly" | "yearly",
  interval: number
): Promise<string | null> {
  const plan = getPricingPlan(planId);
  const razorpay = getRazorpay();
  const response = await razorpay.plans.all({ count: 100 });
  const match = response.items.find(
    (item) =>
      Number(item.item.amount) === amountPaise &&
      item.period === period &&
      item.interval === interval &&
      (item.item.name === `CareerUs ${plan.name} (${plan.periodLabel})` ||
        item.notes?.billingPlanId === planId)
  );
  return match?.id ?? null;
}

async function isConfiguredPlanValid(
  planId: BillingPlanId,
  configuredPlanId: string,
  expectedAmountPaise: number
): Promise<boolean> {
  try {
    const fetched = await getRazorpay().plans.fetch(configuredPlanId);
    return Number(fetched.item.amount) === expectedAmountPaise;
  } catch {
    return false;
  }
}

export async function getOrCreateRazorpayPlanId(
  planId: BillingPlanId
): Promise<string> {
  const plan = getPricingPlan(planId);
  const { amountPaise, baseAmount, totalAmount } = getSubscriptionAmounts(planId);
  const configured = plan.envPlanId?.trim();

  if (configured) {
    const valid = await isConfiguredPlanValid(planId, configured, amountPaise);
    if (valid) {
      return configured;
    }
    console.warn(
      `[razorpay] ${planId} plan ${configured} amount mismatch (expected ${amountPaise} paise incl. GST). Finding or creating a new plan.`
    );
  }

  const cached = cachedPlanIds.get(planId);
  if (cached) {
    const valid = await isConfiguredPlanValid(planId, cached, amountPaise);
    if (valid) {
      return cached;
    }
    cachedPlanIds.delete(planId);
  }

  const existing = await findExistingPlanId(
    planId,
    amountPaise,
    plan.razorpayPeriod,
    plan.razorpayInterval
  );
  if (existing) {
    cachedPlanIds.set(planId, existing);
    return existing;
  }

  const created = await getRazorpay().plans.create({
    period: plan.razorpayPeriod,
    interval: plan.razorpayInterval,
    item: {
      name: `CareerUs ${plan.name} (${plan.periodLabel})`,
      amount: amountPaise,
      currency: "INR",
      description: `${plan.priceDisplay} + 18% GST (${totalAmount} INR/cycle) after ${TRIAL_DAYS}-day free trial`,
    },
    notes: {
      app: "cus-interview",
      billingPlanId: planId,
      baseAmountInr: String(baseAmount),
      includesGst: "true",
    },
  });

  cachedPlanIds.set(planId, created.id);
  console.info(
    `[razorpay] Created ${planId} plan ${created.id} at ${amountPaise} paise (incl. GST). Optional: add RAZORPAY_${planId.toUpperCase()}_PLAN_ID=${created.id} to .env`
  );
  return created.id;
}
