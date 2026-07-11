import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getRazorpay, getRazorpayPublicKey } from "@/lib/razorpay";
import { formatPhoneForRazorpayPrefill } from "@/lib/billing/phone";
import { getBillingSetupError } from "@/lib/billing/config";
import {
  getCheckoutFullName,
  parseCheckoutDetails,
  type CheckoutDetailsInput,
} from "@/lib/billing/checkout-details";
import {
  getServiceOrderAmounts,
} from "@/lib/billing/order-amount";
import {
  getHumanService,
  isHumanServiceId,
} from "@/lib/billing/human-services";
import { isBillingPlanId } from "@/lib/billing/plan";

export const dynamic = "force-dynamic";

function parseCheckoutBody(body: Record<string, unknown>) {
  return parseCheckoutDetails({
    firstName: typeof body.firstName === "string" ? body.firstName : "",
    lastName: typeof body.lastName === "string" ? body.lastName : "",
    email: typeof body.email === "string" ? body.email : "",
    contact:
      typeof body.contact === "string"
        ? body.contact
        : typeof body.phone === "string"
          ? body.phone
          : "",
  } satisfies CheckoutDetailsInput);
}

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
    const currency =
      typeof body.currency === "string" && body.currency.trim()
        ? body.currency.trim().toUpperCase()
        : "INR";

    const serviceId = isHumanServiceId(body.service) ? body.service : null;

    if (isBillingPlanId(body.plan)) {
      return NextResponse.json(
        {
          error:
            "Platform plans use subscription checkout. Use create-subscription instead.",
        },
        { status: 400 }
      );
    }

    if (!serviceId) {
      return NextResponse.json(
        { error: "Invalid service selected." },
        { status: 400 }
      );
    }

    const checkoutParsed = parseCheckoutBody(body);
    if (!checkoutParsed.ok) {
      return NextResponse.json({ error: checkoutParsed.error }, { status: 400 });
    }
    const checkout = checkoutParsed.details;
    const fullName = getCheckoutFullName(checkout);

    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

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
    await user.save();

    const purchaseType = "service";
    const productId = serviceId;
    const product = getHumanService(serviceId);
    const productName = product.name;

    const amounts = getServiceOrderAmounts(serviceId, currency);

    const { baseAmount, gstAmount, totalAmount, amountPaise } = amounts;

    const razorpay = getRazorpay();
    let order;

    try {
      order = await razorpay.orders.create({
        amount: amountPaise,
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          userId: user._id.toString(),
          email: checkout.email,
          purchaseType,
          productId,
          productName,
          firstName: checkout.firstName,
          lastName: checkout.lastName,
          contact: checkout.contact,
        },
      });
    } catch (rzpError) {
      console.error("Razorpay order creation failed.", rzpError);

      await Payment.create({
        orderId: `failed_order_${Date.now()}`,
        baseAmount,
        gstAmount,
        amount: totalAmount,
        currency,
        status: "FAILED",
        purchaseType,
        productId,
        productName,
        userId: user._id,
        userEmail: checkout.email,
        userName: fullName,
        firstName: checkout.firstName,
        lastName: checkout.lastName,
        phone: checkout.contact,
      });

      return NextResponse.json(
        { error: "Order creation failed." },
        { status: 500 }
      );
    }

    await Payment.create({
      orderId: order.id,
      baseAmount,
      gstAmount,
      amount: totalAmount,
      currency,
      status: "PENDING",
      purchaseType,
      productId,
      productName,
      userId: user._id,
      userEmail: checkout.email,
      userName: fullName,
      firstName: checkout.firstName,
      lastName: checkout.lastName,
      phone: checkout.contact,
    });

    const publicKey = getRazorpayPublicKey();
    if (!publicKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured." },
        { status: 503 }
      );
    }

    const description = productName;

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: publicKey,
      baseAmount,
      gstAmount,
      totalAmount,
      purchaseType,
      productId,
      productName,
      name: "CareerUs Interview",
      description,
      prefill: {
        name: fullName,
        email: checkout.email,
        contact: formatPhoneForRazorpayPrefill(checkout.contact) ?? checkout.contact,
      },
    });
  } catch (error) {
    console.error("create-order", error);
    const message =
      error instanceof Error ? error.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
