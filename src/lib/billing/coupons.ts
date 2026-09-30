import { connectDB } from "@/lib/mongodb";
import { Coupon, type CouponDocument } from "@/models/Coupon";
import { User } from "@/models/User";
import { CouponRedemption } from "@/models/CouponRedemption";
import { getPlanPeriodEnd } from "@/lib/billing/activate-plan";
import { GST_RATE } from "@/lib/billing/order-amount";
import {
  getHumanService,
  HUMAN_SERVICE_IDS,
  type HumanServiceId,
} from "@/lib/billing/human-services";
import {
  PRICING_PLANS,
  PUBLIC_BILLING_PLAN_IDS,
  type PublicBillingPlanId,
} from "@/lib/billing/plan";

export type CouponTarget =
  | { type: "plan"; id: PublicBillingPlanId }
  | { type: "service"; id: HumanServiceId };

export const COUPON_PRODUCT_IDS: string[] = [
  ...PUBLIC_BILLING_PLAN_IDS,
  ...HUMAN_SERVICE_IDS,
];

const COUPON_CODE_PATTERN = /^[A-Z0-9_-]{3,30}$/;

/** PayU rejects amounts below ₹1, so any non-zero total is raised to this. */
const MIN_PAYABLE_AMOUNT = 1;

export function normalizeCouponCode(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toUpperCase() : "";
}

export function isValidCouponCode(code: string): boolean {
  return COUPON_CODE_PATTERN.test(code);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function getTargetBaseAmount(target: CouponTarget): number {
  if (target.type === "plan") {
    return PRICING_PLANS[target.id].amountPaise / 100;
  }
  return getHumanService(target.id).amountInr;
}

export type CouponQuote = {
  code: string;
  discountType: CouponDocument["discountType"];
  baseAmount: number;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
  isFree: boolean;
  /** Human-readable summary, e.g. "20% off" or "Free lifetime access". */
  label: string;
};

type DescribableCoupon = Pick<
  CouponDocument,
  | "discountType"
  | "discountValue"
  | "freeAccessDays"
  | "mockInterviewCredits"
  | "resumeAnalyzerCredits"
>;

export function describeCoupon(coupon: DescribableCoupon): string {
  if (coupon.discountType === "credits") {
    const parts: string[] = [];
    if (coupon.mockInterviewCredits) {
      parts.push(`${coupon.mockInterviewCredits} AI mock interview${coupon.mockInterviewCredits === 1 ? "" : "s"}`);
    }
    if (coupon.resumeAnalyzerCredits) {
      parts.push(`${coupon.resumeAnalyzerCredits} resume analys${coupon.resumeAnalyzerCredits === 1 ? "is" : "es"}`);
    }
    const validity = coupon.freeAccessDays ? ` (valid ${coupon.freeAccessDays} days)` : "";
    return `${parts.join(" + ")} free${validity}`;
  }
  if (coupon.discountType === "free") {
    return coupon.freeAccessDays
      ? `Free access for ${coupon.freeAccessDays} days`
      : "Free lifetime access";
  }
  if (coupon.discountType === "percent") {
    return `${coupon.discountValue}% off`;
  }
  return `₹${coupon.discountValue} off`;
}

/** Discount is taken off the base price; GST is charged on what remains. */
export function computeCouponQuote(
  coupon: DescribableCoupon & Pick<CouponDocument, "code">,
  target: CouponTarget
): CouponQuote {
  const baseAmount = getTargetBaseAmount(target);
  const value = coupon.discountValue ?? 0;

  let discountAmount: number;
  if (coupon.discountType === "free" || coupon.discountType === "credits") {
    discountAmount = baseAmount;
  } else if (coupon.discountType === "percent") {
    discountAmount = (baseAmount * Math.min(Math.max(value, 0), 100)) / 100;
  } else {
    discountAmount = Math.min(Math.max(value, 0), baseAmount);
  }
  discountAmount = round2(discountAmount);

  const discountedBase = Math.max(0, baseAmount - discountAmount);
  const gstAmount = round2(discountedBase * GST_RATE);
  let totalAmount = round2(discountedBase + gstAmount);
  if (totalAmount > 0 && totalAmount < MIN_PAYABLE_AMOUNT) {
    totalAmount = MIN_PAYABLE_AMOUNT;
  }

  return {
    code: coupon.code,
    discountType: coupon.discountType,
    baseAmount,
    discountAmount,
    gstAmount,
    totalAmount,
    isFree: totalAmount === 0,
    label: describeCoupon(coupon),
  };
}

/**
 * When a plan is bought with a coupon: `free` coupons grant `freeAccessDays`
 * (null → lifetime, stored as no period end); other coupons keep the normal plan period.
 */
export function getCouponPlanPeriodEnd(
  coupon: Pick<CouponDocument, "discountType" | "freeAccessDays"> | null,
  planId: PublicBillingPlanId,
  from = new Date()
): Date | null {
  if (coupon?.discountType === "free") {
    if (!coupon.freeAccessDays) {
      return null;
    }
    return new Date(from.getTime() + coupon.freeAccessDays * 24 * 60 * 60 * 1000);
  }
  return getPlanPeriodEnd(planId, from);
}

export type CouponCheckResult =
  | { ok: true; coupon: CouponDocument; quote: CouponQuote }
  | { ok: false; error: string };

export async function checkCouponForCheckout(
  rawCode: unknown,
  target: CouponTarget,
  userId: string
): Promise<CouponCheckResult> {
  const code = normalizeCouponCode(rawCode);
  if (!isValidCouponCode(code)) {
    return { ok: false, error: "Invalid coupon code." };
  }

  await connectDB();
  const coupon = await Coupon.findOne({ code });
  if (!coupon || !coupon.isActive) {
    return { ok: false, error: "Invalid coupon code." };
  }

  const now = Date.now();
  if (coupon.validFrom && coupon.validFrom.getTime() > now) {
    return { ok: false, error: "This coupon is not active yet." };
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() <= now) {
    return { ok: false, error: "This coupon has expired." };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }
  if (coupon.discountType === "credits" && target.type !== "plan") {
    return { ok: false, error: "Redeem this coupon from a plan on the pricing page." };
  }
  if (coupon.appliesTo.length > 0 && !coupon.appliesTo.includes(target.id)) {
    return { ok: false, error: "This coupon does not apply to this purchase." };
  }

  const perUserLimit = coupon.perUserLimit ?? 1;
  if (perUserLimit > 0) {
    const usedByUser = await CouponRedemption.countDocuments({
      couponId: coupon._id,
      userId,
    });
    if (usedByUser >= perUserLimit) {
      return { ok: false, error: "You have already used this coupon." };
    }
  }

  return { ok: true, coupon, quote: computeCouponQuote(coupon, target) };
}

/**
 * Atomically takes one use of the coupon, respecting `maxUses`.
 * Used for ₹0 checkouts, where nothing has been paid yet.
 */
export async function claimCouponUse(couponId: CouponDocument["_id"]): Promise<boolean> {
  await connectDB();
  const updated = await Coupon.findOneAndUpdate(
    {
      _id: couponId,
      isActive: true,
      $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }],
    },
    { $inc: { usedCount: 1 } }
  );
  return Boolean(updated);
}

/**
 * Adds a `credits` coupon's free uses to the user's balance (stacks with any
 * unexpired balance). Validity comes from the coupon's `freeAccessDays`.
 */
export async function grantCouponCredits(
  userId: string,
  coupon: Pick<
    CouponDocument,
    "code" | "freeAccessDays" | "mockInterviewCredits" | "resumeAnalyzerCredits"
  >
): Promise<void> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const current = user.featureCredits;
  const currentExpiry = current?.expiresAt ?? null;
  const stillValid = Boolean(
    current && (!currentExpiry || currentExpiry.getTime() > now.getTime())
  );
  const newExpiry = coupon.freeAccessDays
    ? new Date(now.getTime() + coupon.freeAccessDays * 24 * 60 * 60 * 1000)
    : null;

  // Keep whichever expiry is later (null = never expires).
  let expiresAt: Date | null = newExpiry;
  if (stillValid) {
    if (!currentExpiry || !newExpiry) {
      expiresAt = null;
    } else {
      expiresAt = currentExpiry > newExpiry ? currentExpiry : newExpiry;
    }
  }

  const mock = coupon.mockInterviewCredits ?? 0;
  const resume = coupon.resumeAnalyzerCredits ?? 0;
  user.set("featureCredits", {
    mockInterviewRemaining: (stillValid ? current?.mockInterviewRemaining ?? 0 : 0) + mock,
    mockInterviewTotal: (stillValid ? current?.mockInterviewTotal ?? 0 : 0) + mock,
    resumeAnalyzerRemaining: (stillValid ? current?.resumeAnalyzerRemaining ?? 0 : 0) + resume,
    resumeAnalyzerTotal: (stillValid ? current?.resumeAnalyzerTotal ?? 0 : 0) + resume,
    expiresAt,
    couponCode: coupon.code,
  });
  await user.save();
}

type RecordRedemptionInput = {
  coupon: Pick<CouponDocument, "_id" | "code">;
  userId: string;
  target: CouponTarget;
  quote: CouponQuote;
  amountPaid: number;
  txnid: string;
  /** false when `claimCouponUse` already counted this use. */
  incrementUsage: boolean;
};

/** Idempotent per txnid — PayU may hit the callback more than once. */
export async function recordCouponRedemption(input: RecordRedemptionInput): Promise<void> {
  await connectDB();
  try {
    await CouponRedemption.create({
      couponId: input.coupon._id,
      code: input.coupon.code,
      userId: input.userId,
      purchaseType: input.target.type,
      productId: input.target.id,
      baseAmount: input.quote.baseAmount,
      discountAmount: input.quote.discountAmount,
      amountPaid: input.amountPaid,
      txnid: input.txnid,
    });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return;
    }
    throw err;
  }

  if (input.incrementUsage) {
    await Coupon.updateOne({ _id: input.coupon._id }, { $inc: { usedCount: 1 } });
  }
}
