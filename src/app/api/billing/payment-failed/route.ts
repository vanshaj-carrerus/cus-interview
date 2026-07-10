import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { getSessionPublicUser } from "@/lib/get-session-user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const order_id = String(body.order_id ?? body.razorpay_order_id ?? "");

    if (!order_id) {
      return NextResponse.json({ error: "order_id is required." }, { status: 400 });
    }

    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    }

    if (payment.userId?.toString() !== sessionUser.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (payment.status !== "SUCCESS") {
      payment.status = "FAILED";
      await payment.save();
    }

    return NextResponse.json({ message: "Payment marked as failed." });
  } catch (error) {
    console.error("payment-failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
