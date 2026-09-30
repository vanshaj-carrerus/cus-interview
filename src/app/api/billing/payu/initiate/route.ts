import type { HydratedDocument } from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, type UserDocument } from "@/models/User";
import { Payment } from "@/models/Payment";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getBillingSetupError } from "@/lib/billing/config";
import { generatePayUHash, getAppOrigin } from "@/lib/payu";
import {
  getServiceOrderAmounts,
  getSubscriptionAmounts,
} from "@/lib/billing/order-amount";
import {
  getHumanService,
  isHumanServiceId,
  type HumanServiceId,
} from "@/lib/billing/human-services";
import {
  getPricingPlan,
  isPublicBillingPlanId,
  type BillingPlanId,
} from "@/lib/billing/plan";
import {
  getCheckoutFullName,
  parseCheckoutDetails,
  type CheckoutDetails,
  type CheckoutDetailsInput,
} from "@/lib/billing/checkout-details";
import {
  checkCouponForCheckout,
  claimCouponUse,
  getCouponPlanPeriodEnd,
  normalizeCouponCode,
  recordCouponRedemption,
  type CouponCheckResult,
  type CouponQuote,
  type CouponTarget,
} from "@/lib/billing/coupons";
import type { CouponDocument } from "@/models/Coupon";

export const dynamic = "force-dynamic";

function sanitizeString(str: string, fallback: string): string {
  const cleaned = str.replace(/[^\w\s]/gi, "").trim();
  return cleaned || fallback;
}

function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return "9999999999";
}

type UserDoc = HydratedDocument<UserDocument>;

/** Coupon brought the total to ₹0 — activate straight away, no PayU. */
async function activateFreeCheckout({
  user,
  target,
  coupon,
  quote,
  email,
  fullName,
  checkout,
}: {
  user: UserDoc;
  target: CouponTarget;
  coupon: CouponDocument;
  quote: CouponQuote;
  email: string;
  fullName: string;
  checkout: CheckoutDetails;
}) {
  const claimed = await claimCouponUse(coupon._id);
  if (!claimed) {
    return NextResponse.json(
      { error: "This coupon has reached its usage limit." },
      { status: 400 }
    );
  }

  const txnid = `free${Date.now()}${Math.floor(Math.random() * 1000)}`;

  if (target.type === "plan") {
    const periodEnd = getCouponPlanPeriodEnd(coupon, target.id);
    user.billingPlanId = target.id;
    user.subscribedAt = new Date();
    user.subscriptionStatus = "active";
    user.planAmount = 0;
    user.set("currentPeriodEnd", periodEnd ?? undefined);
    user.set("trialEndsAt", undefined);
    user.cancelAtPeriodEnd = false;
    user.appliedCouponCode = coupon.code;
    await user.save();
  } else {
    const service = getHumanService(target.id);
    await user.save();
    await Payment.create({
      orderId: txnid,
      baseAmount: quote.baseAmount,
      gstAmount: 0,
      amount: 0,
      currency: "INR",
      status: "SUCCESS",
      purchaseType: "service",
      productId: target.id,
      productName: service.name,
      userId: user._id,
      userEmail: email,
      userName: fullName,
      firstName: checkout.firstName,
      lastName: checkout.lastName,
      phone: checkout.contact,
      couponCode: coupon.code,
      discountAmount: quote.discountAmount,
    });
  }

  await recordCouponRedemption({
    coupon,
    userId: user._id.toString(),
    target,
    quote,
    amountPaid: 0,
    txnid,
    incrementUsage: false,
  });

  return NextResponse.json({
    free: true,
    redirectUrl: `/pricing/success?type=${target.type}&product=${target.id}`,
  });
}

export async function POST(request: Request) {
  try {
    const setupError = getBillingSetupError();
    if (setupError) {
      return NextResponse.json({ error: setupError }, { status: 503 });
    }

    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const billingPlanId = isPublicBillingPlanId(body.plan) ? body.plan : null;
    const serviceId = isHumanServiceId(body.service) ? body.service : null;

    if (!billingPlanId && !serviceId) {
      return NextResponse.json(
        { error: "Invalid checkout. Select a platform plan or expert service." },
        { status: 400 }
      );
    }

    const checkoutParsed = parseCheckoutDetails({
      firstName: typeof body.firstName === "string" ? body.firstName : "",
      lastName: typeof body.lastName === "string" ? body.lastName : "",
      email: typeof body.email === "string" ? body.email : sessionUser.email ?? "",
      contact:
        typeof body.contact === "string"
          ? body.contact
          : typeof body.phone === "string"
            ? body.phone
            : "",
    } satisfies CheckoutDetailsInput);

    if (!checkoutParsed.ok) {
      return NextResponse.json({ error: checkoutParsed.error }, { status: 400 });
    }

    const checkout = checkoutParsed.details;
    const fullName = getCheckoutFullName(checkout);

    await connectDB();
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!user.name?.trim()) {
      user.name = fullName;
    }
    user.firstName = checkout.firstName;
    user.lastName = checkout.lastName;
    user.phone = checkout.contact;

    const target: CouponTarget = billingPlanId
      ? { type: "plan", id: billingPlanId }
      : { type: "service", id: serviceId! };

    const couponCode = normalizeCouponCode(body.couponCode);
    let appliedCoupon: Extract<CouponCheckResult, { ok: true }> | null = null;
    if (couponCode) {
      if (target.type === "plan" && sessionUser.subscription.hasPlatformAccess) {
        return NextResponse.json(
          { error: "Your platform plan is already active." },
          { status: 400 }
        );
      }
      const couponResult = await checkCouponForCheckout(couponCode, target, sessionUser.id);
      if (!couponResult.ok) {
        return NextResponse.json({ error: couponResult.error }, { status: 400 });
      }
      appliedCoupon = couponResult;
    }

    if (appliedCoupon?.quote.isFree) {
      return activateFreeCheckout({
        user,
        target,
        coupon: appliedCoupon.coupon,
        quote: appliedCoupon.quote,
        email: checkout.email || user.email,
        fullName,
        checkout,
      });
    }

    const txnid = `tx${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const origin = getAppOrigin();
    const surl = `${origin}/api/billing/payu/callback`;
    const furl = `${origin}/api/billing/payu/callback`;

    const firstname = sanitizeString(checkout.firstName || user.name || "Customer", "Customer");
    const email = checkout.email || user.email || "customer@example.com";
    const phone = sanitizePhone(checkout.contact || user.phone || "");

    let totalAmount: number;
    let productinfo: string;
    let udf2: string;
    let udf3: "plan" | "service";

    if (billingPlanId) {
      const planId: BillingPlanId = billingPlanId;
      const selectedPlan = getPricingPlan(planId);
      const amounts = getSubscriptionAmounts(planId);

      totalAmount = appliedCoupon?.quote.totalAmount ?? amounts.totalAmount;
      productinfo = sanitizeString(`${selectedPlan.name} ${planId}`, "Platform Access");
      udf2 = planId;
      udf3 = "plan";

      user.billingPlanId = planId;
      user.planAmount = totalAmount;
      user.subscriptionStatus = "pending";
      user.appliedCouponCode = appliedCoupon?.coupon.code ?? "";
    } else {
      const id: HumanServiceId = serviceId!;
      const service = getHumanService(id);
      const amounts = getServiceOrderAmounts(id);
      const quote = appliedCoupon?.quote;

      totalAmount = quote?.totalAmount ?? amounts.totalAmount;
      productinfo = sanitizeString(service.name, "Expert Service");
      udf2 = id;
      udf3 = "service";

      await Payment.create({
        orderId: txnid,
        baseAmount: amounts.baseAmount,
        gstAmount: quote?.gstAmount ?? amounts.gstAmount,
        amount: totalAmount,
        currency: amounts.currency,
        status: "PENDING",
        purchaseType: "service",
        productId: id,
        productName: service.name,
        userId: user._id,
        userEmail: email,
        userName: fullName,
        firstName: checkout.firstName,
        lastName: checkout.lastName,
        phone: checkout.contact,
        couponCode: appliedCoupon?.coupon.code ?? "",
        discountAmount: quote?.discountAmount ?? 0,
      });
    }

    await user.save();

    const payuParams = {
      txnid,
      amount: totalAmount.toFixed(2),
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      udf1: user._id.toString(),
      udf2,
      udf3,
      udf4: appliedCoupon?.coupon.code ?? "",
    };

    const { hash, key, actionUrl } = generatePayUHash(payuParams);

    return NextResponse.json({
      actionUrl,
      params: {
        ...payuParams,
        key,
        hash,
        service_provider: "payu_paisa",
      },
    });
  } catch (err) {
    console.error("payu-initiate-error", err);
    const message = err instanceof Error ? err.message : "Failed to initiate payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
