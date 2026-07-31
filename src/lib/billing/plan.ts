export type BillingPlanId = "test" | "monthly" | "quarterly";

/** Plans shown on the public pricing page (test plan is internal/legacy only). */
export type PublicBillingPlanId = "monthly" | "quarterly";

export const PUBLIC_BILLING_PLAN_IDS: PublicBillingPlanId[] = ["monthly", "quarterly"];

export const TRIAL_MINUTES = 10;
export const PRE_DEBIT_HOURS = 24;
export const TRIAL_HOURS = 10 / 60;
export const TRIAL_DAYS = 10 / (24 * 60);
export const TRIAL_LABEL = "10-minute";
export const FIRST_CHARGE_LABEL = "24-hour";
export const SUBSCRIPTION_AUTH_AMOUNT_INR = 2;
export const SUBSCRIPTION_AUTH_AMOUNT_PAISE = SUBSCRIPTION_AUTH_AMOUNT_INR * 100;

export type PricingFeature = {
  label: string;
  isNew?: boolean;
};

export const PRICING_FEATURES: PricingFeature[] = [
  { label: "AI interview practice" },
  { label: "Interview question bank" },
  { label: "ATS Resume Analyzer — upload & instant score", isNew: true },
  { label: "AI resume improve, edit & PDF download", isNew: true },
  { label: "Unlimited practice problems" },
  { label: "Unlimited AI mock interviews" },
  { label: "Structured learning tracks" },
  { label: "Programming language courses" },
  { label: "Online compiler access" },
  { label: "Progress tracking dashboard" },
];

/** @deprecated Use PRICING_FEATURES */
export const PRICING_FEATURES_VISIBLE = PRICING_FEATURES;

export const PRICING_PLANS = {
  test: {
    id: "test" as const,
    name: "Test Plan (₹10)",
    priceDisplay: "₹10",
    periodSuffix: " / Test",
    periodLabel: "test purchase",
    amountPaise: 1000,
    razorpayPeriod: "monthly" as const,
    razorpayInterval: 1,
    envPlanId: "",
  },
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
  return Math.floor(Date.now() / 1000) + TRIAL_MINUTES * 60;
}

export function isBillingPlanId(value: unknown): value is BillingPlanId {
  return value === "test" || value === "monthly" || value === "quarterly";
}

export function isPublicBillingPlanId(value: unknown): value is PublicBillingPlanId {
  return value === "monthly" || value === "quarterly";
}
