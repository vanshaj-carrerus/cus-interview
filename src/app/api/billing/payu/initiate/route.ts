import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
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

      totalAmount = amounts.totalAmount;
      productinfo = sanitizeString(`${selectedPlan.name} ${planId}`, "Platform Access");
      udf2 = planId;
      udf3 = "plan";

      user.billingPlanId = planId;
      user.planAmount = totalAmount;
      user.subscriptionStatus = "pending";
    } else {
      const id: HumanServiceId = serviceId!;
      const service = getHumanService(id);
      const amounts = getServiceOrderAmounts(id);

      totalAmount = amounts.totalAmount;
      productinfo = sanitizeString(service.name, "Expert Service");
      udf2 = id;
      udf3 = "service";

      await Payment.create({
        orderId: txnid,
        baseAmount: amounts.baseAmount,
        gstAmount: amounts.gstAmount,
        amount: amounts.totalAmount,
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
