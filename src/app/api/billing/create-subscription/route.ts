import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getRazorpay, getRazorpayPublicKey } from "@/lib/razorpay";
import { getBillingSetupError } from "@/lib/billing/config";
import { getOrCreateRazorpayPlanId } from "@/lib/billing/ensure-plan";
import {
  getSubscriptionAmounts,
  getSubscriptionTotalDisplay,
} from "@/lib/billing/order-amount";
import {
  getPricingPlan,
  getTrialStartAtUnix,
  isBillingPlanId,
  SUBSCRIPTION_AUTH_AMOUNT_INR,
  SUBSCRIPTION_AUTH_AMOUNT_PAISE,
  TRIAL_DAYS,
  type BillingPlanId,
} from "@/lib/billing/plan";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const setupError = getBillingSetupError();
    if (setupError) {
      return NextResponse.json({ error: setupError }, { status: 503 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const billingPlanId: BillingPlanId = isBillingPlanId(body.plan)
      ? body.plan
      : "monthly";
    const selectedPlan = getPricingPlan(billingPlanId);
    const subscriptionAmounts = getSubscriptionAmounts(billingPlanId);
    const billedTotalDisplay = getSubscriptionTotalDisplay(billingPlanId);

    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (sessionUser.subscription.hasAccess) {
      return NextResponse.json(
        { error: "You already have an active subscription." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const razorpay = getRazorpay();
    const startAt = getTrialStartAtUnix();
    const planId = await getOrCreateRazorpayPlanId(billingPlanId);

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: billingPlanId === "quarterly" ? 40 : 120,
      quantity: 1,
      customer_notify: 1,
      start_at: startAt,
      addons: [
        {
          item: {
            name: "Payment method authorization",
            amount: SUBSCRIPTION_AUTH_AMOUNT_PAISE,
            currency: "INR",
          },
        },
      ],
      notes: {
        userId: user._id.toString(),
        email: user.email,
        billingPlanId,
        baseAmountInr: String(subscriptionAmounts.baseAmount),
        gstAmountInr: String(subscriptionAmounts.gstAmount),
        totalAmountInr: String(subscriptionAmounts.totalAmount),
      },
    });

    user.razorpaySubscriptionId = subscription.id;
    if (subscription.customer_id) {
      user.razorpayCustomerId = subscription.customer_id;
    }
    await user.save();

    const publicKey = getRazorpayPublicKey();
    if (!publicKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: publicKey,
      name: "CareerUs Interview",
      description: `${selectedPlan.name} (${selectedPlan.periodLabel}) — ₹${SUBSCRIPTION_AUTH_AMOUNT_INR} auth now, ${TRIAL_DAYS}-day free trial, then ${selectedPlan.priceDisplay} + 18% GST (${billedTotalDisplay}) auto-billed`,
      trialDays: TRIAL_DAYS,
      authAmountInr: SUBSCRIPTION_AUTH_AMOUNT_INR,
      baseAmountInr: subscriptionAmounts.baseAmount,
      gstAmountInr: subscriptionAmounts.gstAmount,
      totalAmountInr: subscriptionAmounts.totalAmount,
      billedTotalDisplay,
      prefill: {
        name: user.name || undefined,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("create-subscription", err);
    const razorpayMessage =
      err &&
      typeof err === "object" &&
      "error" in err &&
      err.error &&
      typeof err.error === "object" &&
      "description" in err.error &&
      typeof err.error.description === "string"
        ? err.error.description
        : null;
    const message =
      razorpayMessage ??
      (err instanceof Error && err.message.includes("does not exist")
        ? "Razorpay plan is invalid. Check your plan IDs in .env."
        : err instanceof Error && err.message.includes("Authentication failed")
          ? "Razorpay keys are invalid. Check RAZORPAY_KEY_SECRET and NEXT_PUBLIC_RAZORPAY_KEY_ID."
          : err instanceof Error && err.message.includes("ECONNREFUSED")
            ? "Database connection failed. Check MONGODB_URI and your network."
            : err instanceof Error
              ? err.message
              : "Could not start checkout. Please try again.");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
