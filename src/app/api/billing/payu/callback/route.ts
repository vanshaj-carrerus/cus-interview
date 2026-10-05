import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import { verifyPayUResponseHash, getAppOrigin } from "@/lib/payu";
import { getPlanPeriodEnd } from "@/lib/billing/activate-plan";
import { getSubscriptionAmounts } from "@/lib/billing/order-amount";
import { isHumanServiceId } from "@/lib/billing/human-services";
import { isBillingPlanId, isPublicBillingPlanId, type BillingPlanId } from "@/lib/billing/plan";
import {
  computeCouponQuote,
  getCouponPlanPeriodEnd,
  normalizeCouponCode,
  recordCouponRedemption,
  type CouponTarget,
} from "@/lib/billing/coupons";
import { Coupon } from "@/models/Coupon";

export const dynamic = "force-dynamic";

async function parsePayUParams(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";
  const params: Record<string, string> = {};

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    formData.forEach((value, key) => {
      params[key] = typeof value === "string" ? value : value.name;
    });
  } else {
    const url = new URL(request.url);
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    if (Object.keys(params).length === 0) {
      const json = await request.json().catch(() => ({}));
      Object.entries(json).forEach(([k, v]) => {
        if (typeof v === "string" || typeof v === "number") {
          params[k] = String(v);
        }
      });
    }
  }

  return params;
}

export async function POST(request: Request) {
  return handlePayUCallback(request);
}

export async function GET(request: Request) {
  return handlePayUCallback(request);
}

/** Logs a coupon use for a paid checkout (udf4 = coupon code). Never blocks the payment. */
async function recordPaidCouponUse(
  rawCode: string | undefined,
  userId: string,
  target: CouponTarget,
  amountPaid: number,
  txnid: string
) {
  const code = normalizeCouponCode(rawCode);
  if (!code) return null;
  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return null;
    await recordCouponRedemption({
      coupon,
      userId,
      target,
      quote: computeCouponQuote(coupon, target),
      amountPaid,
      txnid,
      incrementUsage: true,
    });
    return coupon;
  } catch (err) {
    console.error("payu-callback-coupon-record-error", { code, txnid, err });
    return null;
  }
}

/** PayU success redirect — activates platform plan or records expert service payment. */
async function handlePayUCallback(request: Request) {
  const origin = getAppOrigin();

  try {
    const params = await parsePayUParams(request);
    console.log("payu-callback-params", params);

    const {
      status,
      txnid,
      mihpayid,
      udf1: userId,
      udf2: productId,
      udf3: checkoutType = "plan",
      udf4: couponCode,
      amount: paidAmount,
      error_Message,
    } = params;

    const isValidHash = verifyPayUResponseHash(params);
    if (!isValidHash) {
      console.error("payu-callback-invalid-hash", { txnid, params });
      return NextResponse.redirect(
        `${origin}/pricing?error=${encodeURIComponent("Payment response signature verification failed.")}`,
        { status: 303 }
      );
    }

    if (status?.toLowerCase() !== "success") {
      console.warn("payu-callback-failed-status", { status, error_Message, txnid });
      const failureReason = error_Message || "Payment transaction was not successful.";

      if (userId && txnid) {
        await connectDB();
        if (checkoutType === "service") {
          await Payment.findOneAndUpdate(
            { orderId: txnid },
            { status: "FAILED", ...(mihpayid?.trim() ? { paymentId: mihpayid.trim() } : {}) }
          );
        } else {
          // Only a checkout that put the plan in "pending" fails it — a failed upgrade from
          // a free-access coupon plan keeps that plan active.
          await User.updateOne(
            { _id: userId, subscriptionStatus: "pending" },
            { subscriptionStatus: "failed" }
          );
        }
      }

      return NextResponse.redirect(
        `${origin}/pricing?error=${encodeURIComponent(failureReason)}`,
        { status: 303 }
      );
    }

    if (!userId) {
      console.error("payu-callback-missing-user", { txnid });
      return NextResponse.redirect(
        `${origin}/pricing?error=${encodeURIComponent("User identifier missing in payment response.")}`,
        { status: 303 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      console.error("payu-callback-user-not-found", { userId });
      return NextResponse.redirect(
        `${origin}/pricing?error=${encodeURIComponent("User account not found.")}`,
        { status: 303 }
      );
    }

    if (checkoutType === "service" && isHumanServiceId(productId)) {
      await Payment.findOneAndUpdate(
        { orderId: txnid },
        {
          status: "SUCCESS",
          ...(mihpayid?.trim() ? { paymentId: mihpayid.trim() } : {}),
        },
        { upsert: false }
      );

      await recordPaidCouponUse(
        couponCode,
        user._id.toString(),
        { type: "service", id: productId },
        Number(paidAmount) || 0,
        txnid
      );

      console.log("payu-callback-service-success", {
        userId: user._id.toString(),
        serviceId: productId,
        txnid,
      });

      return NextResponse.redirect(
        `${origin}/pricing/success?type=service&product=${productId}`,
        { status: 303 }
      );
    }

    const planId: BillingPlanId = isBillingPlanId(productId) ? productId : "monthly";
    const { totalAmount: listTotal } = getSubscriptionAmounts(planId);
    const totalAmount = couponCode ? Number(paidAmount) || listTotal : listTotal;
    const coupon =
      isPublicBillingPlanId(planId)
        ? await recordPaidCouponUse(
            couponCode,
            user._id.toString(),
            { type: "plan", id: planId },
            totalAmount,
            txnid
          )
        : null;
    const periodEnd =
      coupon && isPublicBillingPlanId(planId)
        ? getCouponPlanPeriodEnd(coupon, planId)
        : getPlanPeriodEnd(planId);

    await User.findByIdAndUpdate(userId, {
      $set: {
        billingPlanId: planId,
        subscribedAt: new Date(),
        subscriptionStatus: "active",
        planAmount: totalAmount,
        currentPeriodEnd: periodEnd,
        trialEndsAt: null,
        cancelAtPeriodEnd: false,
        appliedCouponCode: coupon?.code ?? "",
        // A paid plan is unlimited — drop caps left over from a free-access coupon.
        "featureCredits.planLimited": false,
        couponAccessStartsAt: null,
        couponAccessSuspended: false,
        ...(mihpayid?.trim() ? { payuMandateToken: mihpayid.trim() } : {}),
      },
      $unset: {
        nextBillingDate: "",
        payuPreDebitSentAt: "",
        payuPreDebitForDate: "",
        payuFirstChargeAt: "",
        payuLastRecurringTxnId: "",
      },
    });

    console.log("payu-callback-plan-success", {
      userId: user._id.toString(),
      planId,
      txnid,
    });

    return NextResponse.redirect(
      `${origin}/pricing/success?type=plan&product=${planId}`,
      { status: 303 }
    );
  } catch (err) {
    console.error("payu-callback-error", err);
    return NextResponse.redirect(
      `${origin}/pricing?error=${encodeURIComponent("An error occurred while processing payment result.")}`,
      { status: 303 }
    );
  }
}
