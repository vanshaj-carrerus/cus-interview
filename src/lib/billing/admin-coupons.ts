import { connectDB } from "@/lib/mongodb";
import { Coupon, COUPON_DISCOUNT_TYPES, type CouponDiscountType } from "@/models/Coupon";
import {
  COUPON_PRODUCT_IDS,
  describeCoupon,
  isValidCouponCode,
  normalizeCouponCode,
} from "@/lib/billing/coupons";

export type AdminCouponRecord = {
  id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  freeAccessDays: number | null;
  appliesTo: string[];
  validFrom: string | null;
  expiresAt: string | null;
  maxUses: number | null;
  perUserLimit: number;
  usedCount: number;
  isActive: boolean;
  label: string;
  createdAt: string;
};

export type CouponInput = {
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  freeAccessDays: number | null;
  appliesTo: string[];
  validFrom: Date | null;
  expiresAt: Date | null;
  maxUses: number | null;
  perUserLimit: number;
  isActive: boolean;
};

function toIso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export async function getAdminCoupons(): Promise<AdminCouponRecord[]> {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return coupons.map((coupon) => ({
    id: coupon._id.toString(),
    code: coupon.code,
    description: coupon.description ?? "",
    discountType: coupon.discountType,
    discountValue: coupon.discountValue ?? 0,
    freeAccessDays: coupon.freeAccessDays ?? null,
    appliesTo: coupon.appliesTo ?? [],
    validFrom: toIso(coupon.validFrom),
    expiresAt: toIso(coupon.expiresAt),
    maxUses: coupon.maxUses ?? null,
    perUserLimit: coupon.perUserLimit ?? 1,
    usedCount: coupon.usedCount ?? 0,
    isActive: coupon.isActive ?? true,
    label: describeCoupon(coupon),
    createdAt: toIso(coupon.createdAt as Date) ?? new Date().toISOString(),
  }));
}

function parseOptionalDate(value: unknown): Date | null | "invalid" {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return "invalid";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
}

function parseOptionalPositiveInt(value: unknown): number | null | "invalid" {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : "invalid";
}

export function parseCouponInput(
  body: Record<string, unknown>
): { ok: true; input: CouponInput } | { ok: false; error: string } {
  const code = normalizeCouponCode(body.code);
  if (!isValidCouponCode(code)) {
    return {
      ok: false,
      error: "Code must be 3–30 characters: letters, numbers, - or _.",
    };
  }

  const discountType = body.discountType as CouponDiscountType;
  if (!COUPON_DISCOUNT_TYPES.includes(discountType)) {
    return { ok: false, error: "Choose a discount type." };
  }

  let discountValue = 0;
  let freeAccessDays: number | null = null;
  if (discountType === "percent") {
    discountValue = Number(body.discountValue);
    if (!Number.isFinite(discountValue) || discountValue <= 0 || discountValue > 100) {
      return { ok: false, error: "Percent discount must be between 1 and 100." };
    }
  } else if (discountType === "flat") {
    discountValue = Number(body.discountValue);
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      return { ok: false, error: "Flat discount must be more than ₹0." };
    }
  } else {
    const days = parseOptionalPositiveInt(body.freeAccessDays);
    if (days === "invalid") {
      return { ok: false, error: "Free access days must be a whole number, or empty for lifetime." };
    }
    freeAccessDays = days;
  }

  const appliesTo = Array.isArray(body.appliesTo)
    ? body.appliesTo.filter((id): id is string => typeof id === "string")
    : [];
  if (appliesTo.some((id) => !COUPON_PRODUCT_IDS.includes(id))) {
    return { ok: false, error: "Unknown plan or service in 'applies to'." };
  }

  const validFrom = parseOptionalDate(body.validFrom);
  const expiresAt = parseOptionalDate(body.expiresAt);
  if (validFrom === "invalid" || expiresAt === "invalid") {
    return { ok: false, error: "Invalid date." };
  }
  if (validFrom && expiresAt && expiresAt <= validFrom) {
    return { ok: false, error: "Expiry must be after the start date." };
  }

  const maxUses = parseOptionalPositiveInt(body.maxUses);
  if (maxUses === "invalid") {
    return { ok: false, error: "Max uses must be a whole number, or empty for unlimited." };
  }

  const perUserLimit = parseOptionalPositiveInt(body.perUserLimit) ?? 1;
  if (perUserLimit === "invalid") {
    return { ok: false, error: "Uses per user must be a whole number." };
  }

  return {
    ok: true,
    input: {
      code,
      description: typeof body.description === "string" ? body.description.trim() : "",
      discountType,
      discountValue,
      freeAccessDays,
      appliesTo,
      validFrom,
      expiresAt,
      maxUses,
      perUserLimit,
      isActive: body.isActive !== false,
    },
  };
}
