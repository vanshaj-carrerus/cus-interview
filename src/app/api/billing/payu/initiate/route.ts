import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getBillingSetupError } from "@/lib/billing/config";
import { generatePayUHash, getAppOrigin } from "@/lib/payu";
import { getPlanRecurringAmount } from "@/lib/billing/payu-mandate";
import { buildPayUSiDetails } from "@/lib/billing/payu-si-details";
import {
  getPricingPlan,
  isBillingPlanId,
  SUBSCRIPTION_AUTH_AMOUNT_INR,
  type BillingPlanId,
} from "@/lib/billing/plan";
import {
  getCheckoutFullName,
  parseCheckoutDetails,
  type CheckoutDetailsInput,
} from "@/lib/billing/checkout-details";

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
    const billingPlanId: BillingPlanId = isBillingPlanId(body.plan) ? body.plan : "monthly";

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
    user.billingPlanId = billingPlanId;
    user.planAmount = getPlanRecurringAmount(billingPlanId);
    user.subscriptionStatus = "pending";
    await user.save();

    const selectedPlan = getPricingPlan(billingPlanId);
    const txnid = `tx${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const origin = getAppOrigin();

    const surl = `${origin}/api/billing/payu/callback`;
    const furl = `${origin}/api/billing/payu/callback`;

    const firstname = sanitizeString(checkout.firstName || user.name || "Customer", "Customer");
    const email = checkout.email || user.email || "customer@example.com";
    const phone = sanitizePhone(checkout.contact || user.phone || "");
    const rawProductInfo = `${selectedPlan.name} ${billingPlanId}`;
    const productinfo = sanitizeString(rawProductInfo, "Platform Access");

    const isSubscription =
      billingPlanId === "monthly" ||
      billingPlanId === "quarterly" ||
      billingPlanId === "test";

    // ₹2 mandate registration; full plan amount is auto-debited later via si_transaction.
    const amountStr = SUBSCRIPTION_AUTH_AMOUNT_INR.toFixed(2);
    const siDetails = isSubscription ? buildPayUSiDetails(billingPlanId) : undefined;

    const payuParams = {
      txnid,
      amount: amountStr,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      udf1: user._id.toString(),
      udf2: billingPlanId,
      udf3: "plan",
      ...(siDetails ? { siDetails } : {}),
    };

    const { hash, key, actionUrl, apiVersion } = generatePayUHash(payuParams);

    const formParams: Record<string, string> = {
      ...payuParams,
      key,
      hash,
      service_provider: "payu_paisa",
    };

    delete formParams.siDetails;

    if (isSubscription) {
      formParams.si = "1";
      if (siDetails) {
        formParams.si_details = siDetails;
      }
      if (apiVersion) {
        formParams.api_version = apiVersion;
      }
    }

    return NextResponse.json({
      actionUrl,
      params: formParams,
    });
  } catch (err) {
    console.error("payu-initiate-error", err);
    const message = err instanceof Error ? err.message : "Failed to initiate payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
