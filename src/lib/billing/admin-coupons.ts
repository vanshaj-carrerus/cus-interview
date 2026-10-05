import { connectDB } from "@/lib/mongodb";
import { Coupon, COUPON_DISCOUNT_TYPES, type CouponDiscountType } from "@/models/Coupon";
import { CouponRedemption } from "@/models/CouponRedemption";
import { CouponInvite } from "@/models/CouponInvite";
import {
  getPausedInviteUserIds,
  toAdminCouponInvite,
  type AdminCouponInvite,
} from "@/lib/billing/coupon-invites";
import { User } from "@/models/User";
import {
  COUPON_PRODUCT_IDS,
  describeCoupon,
  isValidCouponCode,
  normalizeCouponCode,
} from "@/lib/billing/coupons";

export type AdminCouponRedemption = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  amountPaid: number;
  discountAmount: number;
  usedAt: string;
  /** User's current coupon free-uses balance (credits coupons), or null if none. */
  creditUsage: {
    mockInterviewUsed: number;
    mockInterviewTotal: number;
    resumeAnalyzerUsed: number;
    resumeAnalyzerTotal: number;
    expiresAt: string | null;
  } | null;
  /** The user's current access window from this coupon (free / credits coupons). */
  accessStartsAt: string | null;
  accessEndsAt: string | null;
};

/**
 * Turning a coupon off pauses what it gave away for free; turning it on again restores it.
 * - free-access coupons: users on a ₹0 plan from this code lose (or regain) the plan
 * - free-uses coupons: users' credits from this code are paused (or resumed)
 * Paid purchases that used a % / flat discount are never touched.
 * Returns how many users were affected.
 */
export async function setCouponGrantsSuspended(
  code: string,
  suspended: boolean
): Promise<number> {
  await connectDB();
  // Invites the admin paused one by one stay off when the coupon is turned back on.
  const pausedUserIds = suspended ? [] : await getPausedInviteUserIds(code);

  const plans = suspended
    ? await User.updateMany(
        { appliedCouponCode: code, planAmount: 0, subscriptionStatus: "active" },
        { $set: { subscriptionStatus: "canceled", couponAccessSuspended: true } }
      )
    : await User.updateMany(
        {
          appliedCouponCode: code,
          planAmount: 0,
          couponAccessSuspended: true,
          _id: { $nin: pausedUserIds },
        },
        { $set: { subscriptionStatus: "active", couponAccessSuspended: false } }
      );

  const credits = await User.updateMany(
    suspended
      ? { "featureCredits.couponCode": code }
      : { "featureCredits.couponCode": code, _id: { $nin: pausedUserIds } },
    { $set: { "featureCredits.suspended": suspended } }
  );

  return plans.modifiedCount + credits.modifiedCount;
}

export type AdminCouponRecord = {
  id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  freeAccessDays: number | null;
  mockInterviewCredits: number;
  resumeAnalyzerCredits: number;
  appliesTo: string[];
  validFrom: string | null;
  expiresAt: string | null;
  maxUses: number | null;
  perUserLimit: number;
  inviteOnly: boolean;
  usedCount: number;
  isActive: boolean;
  label: string;
  createdAt: string;
  redemptions: AdminCouponRedemption[];
  invites: AdminCouponInvite[];
};

export type CouponInput = {
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  freeAccessDays: number | null;
  mockInterviewCredits: number;
  resumeAnalyzerCredits: number;
  appliesTo: string[];
  validFrom: Date | null;
  expiresAt: Date | null;
  maxUses: number | null;
  perUserLimit: number;
  inviteOnly: boolean;
  isActive: boolean;
};

function toIso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

type WindowUser = {
  appliedCouponCode?: string | null;
  planAmount?: number | null;
  currentPeriodEnd?: Date | null;
  couponAccessStartsAt?: Date | null;
  featureCredits?: { couponCode?: string | null; startsAt?: Date | null; expiresAt?: Date | null } | null;
};

/** Where this user's access from `code` currently starts and ends (start defaults to when they used it). */
function accessWindowFor(
  user: WindowUser | undefined,
  code: string,
  usedAt: Date | undefined
): { accessStartsAt: string | null; accessEndsAt: string | null } {
  const fallbackStart = toIso(usedAt);
  if (user?.appliedCouponCode === code && (user.planAmount ?? 0) === 0) {
    return {
      accessStartsAt: toIso(user.couponAccessStartsAt) ?? fallbackStart,
      accessEndsAt: toIso(user.currentPeriodEnd),
    };
  }
  if (user?.featureCredits?.couponCode === code) {
    return {
      accessStartsAt: toIso(user.featureCredits.startsAt) ?? fallbackStart,
      accessEndsAt: toIso(user.featureCredits.expiresAt),
    };
  }
  return { accessStartsAt: fallbackStart, accessEndsAt: null };
}

export async function getAdminCoupons(): Promise<AdminCouponRecord[]> {
  await connectDB();
  const [coupons, redemptions, invites] = await Promise.all([
    Coupon.find().sort({ createdAt: -1 }).lean(),
    CouponRedemption.find().sort({ createdAt: -1 }).lean(),
    CouponInvite.find().sort({ createdAt: -1 }).lean(),
  ]);

  const invitesByCoupon = new Map<string, AdminCouponInvite[]>();
  for (const invite of invites) {
    const list = invitesByCoupon.get(invite.couponId.toString()) ?? [];
    list.push(toAdminCouponInvite(invite));
    invitesByCoupon.set(invite.couponId.toString(), list);
  }

  const userIds = [...new Set(redemptions.map((r) => r.userId.toString()))];
  const users = await User.find({ _id: { $in: userIds } })
    .select({
      name: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      featureCredits: 1,
      appliedCouponCode: 1,
      planAmount: 1,
      currentPeriodEnd: 1,
      couponAccessStartsAt: 1,
    })
    .lean();
  const userById = new Map(users.map((u) => [u._id.toString(), u]));

  const redemptionsByCoupon = new Map<string, AdminCouponRedemption[]>();
  for (const r of redemptions) {
    const user = userById.get(r.userId.toString());
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    const credits = user?.featureCredits;
    const hasCredits =
      (credits?.mockInterviewTotal ?? 0) > 0 || (credits?.resumeAnalyzerTotal ?? 0) > 0;
    const list = redemptionsByCoupon.get(r.couponId.toString()) ?? [];
    list.push({
      id: r._id.toString(),
      userId: r.userId.toString(),
      userName: user?.name || fullName || "Deleted user",
      userEmail: user?.email ?? "",
      productId: r.productId,
      amountPaid: r.amountPaid,
      discountAmount: r.discountAmount,
      usedAt: toIso(r.createdAt as Date) ?? "",
      ...accessWindowFor(user, r.code, r.createdAt as Date | undefined),
      creditUsage:
        credits && hasCredits
          ? {
              mockInterviewUsed:
                (credits.mockInterviewTotal ?? 0) - (credits.mockInterviewRemaining ?? 0),
              mockInterviewTotal: credits.mockInterviewTotal ?? 0,
              resumeAnalyzerUsed:
                (credits.resumeAnalyzerTotal ?? 0) - (credits.resumeAnalyzerRemaining ?? 0),
              resumeAnalyzerTotal: credits.resumeAnalyzerTotal ?? 0,
              expiresAt: toIso(credits.expiresAt),
            }
          : null,
    });
    redemptionsByCoupon.set(r.couponId.toString(), list);
  }

  return coupons.map((coupon) => ({
    id: coupon._id.toString(),
    code: coupon.code,
    description: coupon.description ?? "",
    discountType: coupon.discountType,
    discountValue: coupon.discountValue ?? 0,
    freeAccessDays: coupon.freeAccessDays ?? null,
    mockInterviewCredits: coupon.mockInterviewCredits ?? 0,
    resumeAnalyzerCredits: coupon.resumeAnalyzerCredits ?? 0,
    appliesTo: coupon.appliesTo ?? [],
    validFrom: toIso(coupon.validFrom),
    expiresAt: toIso(coupon.expiresAt),
    maxUses: coupon.maxUses ?? null,
    perUserLimit: coupon.perUserLimit ?? 1,
    inviteOnly: coupon.inviteOnly ?? false,
    usedCount: coupon.usedCount ?? 0,
    isActive: coupon.isActive ?? true,
    label: describeCoupon(coupon),
    createdAt: toIso(coupon.createdAt as Date) ?? new Date().toISOString(),
    redemptions: redemptionsByCoupon.get(coupon._id.toString()) ?? [],
    invites: invitesByCoupon.get(coupon._id.toString()) ?? [],
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
  let mockInterviewCredits = 0;
  let resumeAnalyzerCredits = 0;
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
      return {
        ok: false,
        error: "Days must be a whole number, or empty for lifetime / no expiry.",
      };
    }
    freeAccessDays = days;
  }

  // credits: the free uses themselves. free: optional caps on the plan (0 = unlimited).
  if (discountType === "credits" || discountType === "free") {
    const mock = Number(body.mockInterviewCredits || 0);
    const resume = Number(body.resumeAnalyzerCredits || 0);
    if (!Number.isInteger(mock) || !Number.isInteger(resume) || mock < 0 || resume < 0) {
      return { ok: false, error: "Limits must be whole numbers." };
    }
    if (discountType === "credits" && mock === 0 && resume === 0) {
      return { ok: false, error: "Give at least one free mock interview or resume analysis." };
    }
    mockInterviewCredits = mock;
    resumeAnalyzerCredits = resume;
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

  // Invites only grant free access / free uses, so only those types can be invite-only.
  const inviteOnly =
    body.inviteOnly === true && (discountType === "free" || discountType === "credits");

  // Invite-only: the invite list is the limit, not a total count.
  const maxUses = inviteOnly ? null : parseOptionalPositiveInt(body.maxUses);
  if (maxUses === "invalid") {
    return { ok: false, error: "Max uses must be a whole number, or empty for unlimited." };
  }

  // Invite-only: one access per invited email.
  const perUserLimit = inviteOnly ? 1 : parseOptionalPositiveInt(body.perUserLimit) ?? 1;
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
      mockInterviewCredits,
      resumeAnalyzerCredits,
      appliesTo,
      validFrom,
      expiresAt,
      maxUses,
      perUserLimit,
      inviteOnly,
      isActive: body.isActive !== false,
    },
  };
}
