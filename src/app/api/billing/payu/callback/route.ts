import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPayUResponseHash, getAppOrigin } from "@/lib/payu";
import { isBillingPlanId, TRIAL_MINUTES } from "@/lib/billing/plan";

export const dynamic = "force-dynamic";

async function parsePayUParams(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";
  const params: Record<string, string> = {};

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    formData.forEach((value, key) => {
      params[key] = typeof value === "string" ? value : value.name;
    });
  } else {
    // Try URL search params or JSON body
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
      udf2: rawPlanId,
      udf3: checkoutType = "plan",
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

    const planId = isBillingPlanId(rawPlanId) ? rawPlanId : "monthly";

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      console.error("payu-callback-user-not-found", { userId });
      return NextResponse.redirect(
        `${origin}/pricing?error=${encodeURIComponent("User account not found.")}`,
        { status: 303 }
      );
    }

    const periodDays = planId === "quarterly" ? 90 : 30;
    const isSubscription = planId === "monthly" || planId === "quarterly" || planId === "test";
    const trialEndsAt = isSubscription ? new Date(Date.now() + TRIAL_MINUTES * 60 * 1000) : null;

    await User.findByIdAndUpdate(userId, {
      $set: {
        subscriptionStatus: isSubscription ? "trialing" : "active",
        billingPlanId: planId,
        subscribedAt: new Date(),
        trialEndsAt,
        currentPeriodEnd: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        ...(isSubscription && mihpayid?.trim()
          ? { payuAuthPayuId: mihpayid.trim() }
          : {}),
      },
      ...(isSubscription
        ? {
            $unset: {
              payuFirstChargeAt: "",
              payuLastRecurringTxnId: "",
            },
          }
        : {}),
    });

    console.log("payu-callback-success-activated", {
      userId: user._id.toString(),
      planId,
      txnid,
    });

    return NextResponse.redirect(
      `${origin}/pricing/success?type=${checkoutType}&product=${planId}`,
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
