import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import { verifyPayUResponseHash, getAppOrigin } from "@/lib/payu";
import { getPlanPeriodEnd } from "@/lib/billing/activate-plan";
import { getSubscriptionAmounts } from "@/lib/billing/order-amount";
import { isHumanServiceId } from "@/lib/billing/human-services";
import { isBillingPlanId, type BillingPlanId } from "@/lib/billing/plan";

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
          await User.findByIdAndUpdate(userId, { subscriptionStatus: "failed" });
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
    const { totalAmount } = getSubscriptionAmounts(planId);
    const periodEnd = getPlanPeriodEnd(planId);

    await User.findByIdAndUpdate(userId, {
      $set: {
        billingPlanId: planId,
        subscribedAt: new Date(),
        subscriptionStatus: "active",
        planAmount: totalAmount,
        currentPeriodEnd: periodEnd,
        trialEndsAt: null,
        cancelAtPeriodEnd: false,
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
