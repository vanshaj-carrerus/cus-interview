import { connectDB } from "@/lib/mongodb";
import { EMAIL_RE, normalizeEmail } from "@/lib/email-validation";
import { sendCouponInviteEmail } from "@/lib/mail";
import { getAppOrigin } from "@/lib/payu";
import { Coupon, type CouponDocument } from "@/models/Coupon";
import { CouponInvite, type CouponInviteDocument } from "@/models/CouponInvite";
import { CouponRedemption } from "@/models/CouponRedemption";
import { User } from "@/models/User";
import type { PublicBillingPlanId } from "@/lib/billing/plan";
import {
  applyFreeCouponPlan,
  claimCouponUse,
  computeCouponQuote,
  describeCoupon,
  grantCouponCredits,
  recordCouponRedemption,
} from "@/lib/billing/coupons";

/** Max emails per invite request — keeps one request well inside the SMTP / route time limits. */
export const MAX_INVITES_PER_REQUEST = 50;

export function canInviteToCoupon(coupon: Pick<CouponDocument, "discountType">): boolean {
  return coupon.discountType === "free" || coupon.discountType === "credits";
}

/** Splits a pasted list (commas, spaces, new lines) into unique normalized emails. */
export function parseInviteEmails(raw: unknown): { valid: string[]; invalid: string[] } {
  const parts = typeof raw === "string" ? raw.split(/[\s,;]+/) : [];
  const valid = new Set<string>();
  const invalid: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    const email = normalizeEmail(part);
    if (EMAIL_RE.test(email)) valid.add(email);
    else invalid.push(part);
  }
  return { valid: [...valid], invalid };
}

function invitePlanId(coupon: Pick<CouponDocument, "appliesTo">): PublicBillingPlanId {
  const appliesTo = coupon.appliesTo ?? [];
  return appliesTo.includes("quarterly") && !appliesTo.includes("monthly") ? "quarterly" : "monthly";
}

type GrantResult = { ok: true } | { ok: false; reason: string };

/** Gives `userId` what the coupon offers, as if they had redeemed it at a ₹0 checkout. */
async function grantInvite(
  invite: CouponInviteDocument,
  coupon: CouponDocument,
  userId: string
): Promise<GrantResult> {
  const alreadyRedeemed = await CouponRedemption.exists({ couponId: coupon._id, userId });
  if (alreadyRedeemed) {
    return { ok: true };
  }

  const now = Date.now();
  if (!coupon.isActive) return { ok: false, reason: "Coupon is turned off." };
  if (coupon.validFrom && coupon.validFrom.getTime() > now) {
    return { ok: false, reason: "Coupon is not active yet." };
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() <= now) {
    return { ok: false, reason: "Coupon has expired." };
  }

  const user = await User.findById(userId);
  if (!user) return { ok: false, reason: "User not found." };

  // Never replace a plan someone is paying for with a free one.
  const onPaidPlan =
    user.subscriptionStatus === "active" && (user.planAmount ?? 0) > 0;
  if (coupon.discountType === "free" && onPaidPlan) {
    return { ok: false, reason: "Already on a paid plan." };
  }

  if (!(await claimCouponUse(coupon._id))) {
    return { ok: false, reason: "Coupon has reached its usage limit." };
  }

  const planId = invitePlanId(coupon);
  if (coupon.discountType === "credits") {
    await grantCouponCredits(userId, coupon);
  } else {
    applyFreeCouponPlan(user, coupon, planId);
    await user.save();
  }

  const target = { type: "plan" as const, id: planId };
  await recordCouponRedemption({
    coupon,
    userId,
    target,
    quote: computeCouponQuote(coupon, target),
    amountPaid: 0,
    txnid: `invite-${invite._id.toString()}`,
    incrementUsage: false,
  });

  return { ok: true };
}

async function markInvite(
  invite: CouponInviteDocument,
  userId: string,
  result: GrantResult
): Promise<void> {
  await CouponInvite.updateOne(
    { _id: invite._id },
    result.ok
      ? { $set: { status: "activated", userId, activatedAt: new Date(), failureReason: "" } }
      : { $set: { status: "failed", userId, failureReason: result.reason } }
  );
}

export type InviteSendResult = {
  email: string;
  status: "activated" | "pending" | "failed";
  emailSent: boolean;
  message?: string;
};

/**
 * Invites each email to the coupon. Existing accounts get access right away;
 * new emails get it when they sign up. Everyone is emailed an invitation.
 * Re-inviting an email just re-sends the email (and retries a failed grant).
 */
export async function inviteEmailsToCoupon(
  couponId: string,
  emails: string[],
  adminId: string
): Promise<{ ok: true; results: InviteSendResult[] } | { ok: false; error: string }> {
  await connectDB();
  const coupon = await Coupon.findById(couponId);
  if (!coupon) return { ok: false, error: "Coupon not found." };
  if (!canInviteToCoupon(coupon)) {
    return { ok: false, error: "Only Free access or Free uses coupons can be sent as invites." };
  }
  if (!coupon.isActive) {
    return { ok: false, error: "Turn the coupon on before sending invites." };
  }

  const offerLabel = describeCoupon(coupon);
  const origin = getAppOrigin();
  const results: InviteSendResult[] = [];

  for (const email of emails) {
    const invite = await CouponInvite.findOneAndUpdate(
      { couponId: coupon._id, email },
      { $setOnInsert: { code: coupon.code, invitedBy: adminId, status: "pending" } },
      { upsert: true, new: true }
    );

    if (invite.status === "paused") {
      results.push({
        email,
        status: "failed",
        emailSent: false,
        message: "Invite is paused — resume it first.",
      });
      continue;
    }

    const user = await User.findOne({ email }).select({ _id: 1 }).lean();
    let status: InviteSendResult["status"] = "pending";
    let message: string | undefined;

    if (user && invite.status !== "activated") {
      const grant = await grantInvite(invite, coupon, user._id.toString());
      await markInvite(invite, user._id.toString(), grant);
      status = grant.ok ? "activated" : "failed";
      message = grant.ok ? undefined : grant.reason;
    } else if (invite.status === "activated") {
      status = "activated";
    } else if (invite.status === "failed") {
      // No account any more (or never signed up) — wait for signup again.
      await CouponInvite.updateOne(
        { _id: invite._id },
        { $set: { status: "pending", failureReason: "", userId: null } }
      );
    }

    // Don't email someone we couldn't give anything to.
    let emailSent = false;
    if (status !== "failed") {
      try {
        await sendCouponInviteEmail(email, {
          code: coupon.code,
          offerLabel,
          alreadyActive: status === "activated",
          actionUrl:
            status === "activated"
              ? `${origin}/dashboard`
              : `${origin}/signup?email=${encodeURIComponent(email)}`,
        });
        emailSent = true;
        await CouponInvite.updateOne({ _id: invite._id }, { $set: { lastEmailedAt: new Date() } });
      } catch (err) {
        console.error("coupon-invite-email", email, err);
        message = "Access saved, but the email could not be sent.";
      }
    }

    results.push({ email, status, emailSent, message });
  }

  return { ok: true, results };
}

/** Called right after an account is created — grants any pending invites for its email. */
export async function activatePendingInvitesForUser(userId: string, email: string): Promise<void> {
  try {
    await connectDB();
    const invites = await CouponInvite.find({
      email: normalizeEmail(email),
      status: "pending",
    }).sort({ createdAt: 1 });

    for (const invite of invites) {
      const coupon = await Coupon.findById(invite.couponId);
      const grant: GrantResult = coupon
        ? await grantInvite(invite, coupon, userId)
        : { ok: false, reason: "Coupon was deleted." };
      await markInvite(invite, userId, grant);
    }
  } catch (err) {
    // Signup must still succeed — the admin can re-send the invite to retry.
    console.error("activate-coupon-invites", userId, err);
  }
}

/** Turns one user's free plan / free uses from this coupon off or back on. */
async function setUserCouponAccessSuspended(
  userId: string,
  code: string,
  suspended: boolean
): Promise<void> {
  await User.updateOne(
    suspended
      ? { _id: userId, appliedCouponCode: code, planAmount: 0, subscriptionStatus: "active" }
      : { _id: userId, appliedCouponCode: code, planAmount: 0, couponAccessSuspended: true },
    suspended
      ? { $set: { subscriptionStatus: "canceled", couponAccessSuspended: true } }
      : { $set: { subscriptionStatus: "active", couponAccessSuspended: false } }
  );
  await User.updateOne(
    { _id: userId, "featureCredits.couponCode": code },
    { $set: { "featureCredits.suspended": suspended } }
  );
}

type InviteActionResult = { ok: true } | { ok: false; error: string; status: number };

async function findInvite(couponId: string, inviteId: string) {
  await connectDB();
  return CouponInvite.findOne({ _id: inviteId, couponId });
}

/**
 * Pause: the user loses this coupon's access (or won't get it at signup) until resumed.
 * Resume: access comes back — unless the whole coupon is turned off, in which case
 * it comes back when the coupon is turned on again.
 */
export async function setInvitePaused(
  couponId: string,
  inviteId: string,
  paused: boolean
): Promise<InviteActionResult> {
  const invite = await findInvite(couponId, inviteId);
  if (!invite) return { ok: false, error: "Invite not found.", status: 404 };

  if (paused) {
    if (invite.status === "paused") return { ok: true };
    if (invite.status === "failed") {
      return { ok: false, error: "This invite never gave access.", status: 400 };
    }
    if (invite.status === "activated" && invite.userId) {
      await setUserCouponAccessSuspended(invite.userId.toString(), invite.code, true);
    }
    await CouponInvite.updateOne(
      { _id: invite._id },
      { $set: { status: "paused", statusBeforePause: invite.status } }
    );
    return { ok: true };
  }

  if (invite.status !== "paused") return { ok: true };
  const restoreTo = invite.statusBeforePause === "activated" ? "activated" : "pending";
  if (restoreTo === "activated" && invite.userId) {
    const coupon = await Coupon.findById(couponId).select({ isActive: 1 }).lean();
    if (coupon?.isActive) {
      await setUserCouponAccessSuspended(invite.userId.toString(), invite.code, false);
    }
  }
  await CouponInvite.updateOne(
    { _id: invite._id },
    { $set: { status: restoreTo, statusBeforePause: null } }
  );

  // Paused before they signed up, and they've signed up since: grant now.
  if (restoreTo === "pending") {
    const user = await User.findOne({ email: invite.email }).select({ _id: 1 }).lean();
    if (user) await activatePendingInvitesForUser(user._id.toString(), invite.email);
  }
  return { ok: true };
}

/** Removes the invite and takes away the access it gave. The email can be invited again later. */
export async function deleteInvite(couponId: string, inviteId: string): Promise<InviteActionResult> {
  const invite = await findInvite(couponId, inviteId);
  if (!invite) return { ok: false, error: "Invite not found.", status: 404 };

  const gaveAccess =
    invite.userId &&
    (invite.status === "activated" ||
      (invite.status === "paused" && invite.statusBeforePause === "activated"));
  if (gaveAccess && invite.userId) {
    const userId = invite.userId.toString();
    // Clear the coupon code too, so turning the coupon off/on never brings this access back.
    await User.updateOne(
      { _id: userId, appliedCouponCode: invite.code, planAmount: 0 },
      {
        $set: {
          subscriptionStatus: "canceled",
          couponAccessSuspended: false,
          appliedCouponCode: "",
        },
      }
    );
    await User.updateOne(
      { _id: userId, "featureCredits.couponCode": invite.code },
      { $set: { "featureCredits.suspended": true, "featureCredits.couponCode": "" } }
    );

    // Free up the use, so re-inviting this email later grants access again.
    const removed = await CouponRedemption.deleteOne({ txnid: `invite-${invite._id.toString()}` });
    if (removed.deletedCount > 0) {
      await Coupon.updateOne(
        { _id: invite.couponId, usedCount: { $gt: 0 } },
        { $inc: { usedCount: -1 } }
      );
    }
  }

  await CouponInvite.deleteOne({ _id: invite._id });
  return { ok: true };
}

/** Users whose invite to this coupon is paused — turning the coupon on must not restore them. */
export async function getPausedInviteUserIds(code: string): Promise<string[]> {
  await connectDB();
  const paused = await CouponInvite.find({ code, status: "paused", userId: { $ne: null } })
    .select({ userId: 1 })
    .lean();
  return paused.map((invite) => invite.userId!.toString());
}

export type AdminCouponInvite = {
  id: string;
  email: string;
  status: CouponInviteDocument["status"];
  failureReason: string;
  invitedAt: string;
  activatedAt: string | null;
  lastEmailedAt: string | null;
};

export function toAdminCouponInvite(invite: CouponInviteDocument): AdminCouponInvite {
  return {
    id: invite._id.toString(),
    email: invite.email,
    status: invite.status,
    failureReason: invite.failureReason ?? "",
    invitedAt: (invite.createdAt as Date | undefined)?.toISOString() ?? "",
    activatedAt: invite.activatedAt ? invite.activatedAt.toISOString() : null,
    lastEmailedAt: invite.lastEmailedAt ? invite.lastEmailedAt.toISOString() : null,
  };
}
