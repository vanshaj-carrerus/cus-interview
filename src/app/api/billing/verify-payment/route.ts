import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { getSessionPublicUser } from "@/lib/get-session-user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const razorpay_order_id = String(body.razorpay_order_id ?? "");
    const razorpay_payment_id = String(body.razorpay_payment_id ?? "");
    const razorpay_signature = String(body.razorpay_signature ?? "");

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET is not configured." },
        { status: 503 }
      );
    }

    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    await connectDB();

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "FAILED" }
      );
      return NextResponse.json(
        { error: "Invalid signature. Payment verification failed." },
        { status: 400 }
      );
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "SUCCESS",
      },
      { returnDocument: 'after' }
    );

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
    }

    if (payment.userId?.toString() !== sessionUser.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (payment.purchaseType === "service") {
      // Human service bookings are fulfilled manually by the team.
    }

    return NextResponse.json({
      message: "Payment verified successfully!",
      purchaseType: payment.purchaseType,
      productId: payment.productId,
      productName: payment.productName,
    });
  } catch (error) {
    console.error("verify-payment", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
