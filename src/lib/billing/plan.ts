export type BillingPlanId = "monthly" | "quarterly";

export const TRIAL_DAYS = 14;
export const SUBSCRIPTION_AUTH_AMOUNT_INR = 2;
export const SUBSCRIPTION_AUTH_AMOUNT_PAISE = SUBSCRIPTION_AUTH_AMOUNT_INR * 100;

export type PricingFeature = {
  label: string;
  isNew?: boolean;
};

export const PRICING_FEATURES: PricingFeature[] = [
  { label: "AI interview practice" },
  { label: "Interview question bank" },
  { label: "Resume ATS analysis", isNew: true },
  { label: "Unlimited practice problems" },
  { label: "AI-powered mock interviews" },
  { label: "Structured learning tracks" },
  { label: "Programming language courses" },
  { label: "Online compiler access" },
  { label: "Progress tracking dashboard" },
];

/** @deprecated Use PRICING_FEATURES */
export const PRICING_FEATURES_VISIBLE = PRICING_FEATURES;

export const PRICING_PLANS = {
  monthly: {
    id: "monthly" as const,
    name: "Full Access",
    priceDisplay: "₹499",
    periodSuffix: "/ Month",
    periodLabel: "billed monthly",
    amountPaise: 49900,
    razorpayPeriod: "monthly" as const,
    razorpayInterval: 1,
    envPlanId: process.env.RAZORPAY_MONTHLY_PLAN_ID ?? "",
  },
  quarterly: {
    id: "quarterly" as const,
    name: "Full Access",
    priceDisplay: "₹1,299",
    originalPriceDisplay: "₹1,497",
    periodSuffix: "/ Quarter",
    periodLabel: "billed quarterly",
    amountPaise: 129900,
    razorpayPeriod: "monthly" as const,
    razorpayInterval: 3,
    envPlanId: process.env.RAZORPAY_QUARTERLY_PLAN_ID ?? "",
  },
} satisfies Record<BillingPlanId, Record<string, unknown>>;

export function getPricingPlan(planId: BillingPlanId) {
  return PRICING_PLANS[planId];
}

export function getTrialStartAtUnix(): number {
  return Math.floor(Date.now() / 1000) + TRIAL_DAYS * 24 * 60 * 60;
}

export function isBillingPlanId(value: unknown): value is BillingPlanId {
  return value === "monthly" || value === "quarterly";
}
