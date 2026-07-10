import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import {
  markRazorpaySubscriptionCanceled,
  syncRazorpaySubscriptionToUser,
} from "@/lib/billing/sync-subscription";
import type { RazorpayWebhookEvent } from "@/types/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(body).digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

async function handleRazorpayEvent(event: RazorpayWebhookEvent): Promise<void> {
  const subscription = event.payload.subscription?.entity;
  if (!subscription) {
    return;
  }

  switch (event.event) {
    case "subscription.authenticated":
    case "subscription.activated":
    case "subscription.charged":
    case "subscription.updated":
    case "subscription.pending":
    case "subscription.halted": {
      await syncRazorpaySubscriptionToUser(subscription);
      return;
    }
    case "subscription.cancelled":
    case "subscription.completed": {
      await markRazorpaySubscriptionCanceled(subscription);
      return;
    }
    default:
      return;
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  if (!verifyWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(payload) as RazorpayWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    await handleRazorpayEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("razorpay-webhook-handler", event.event, err);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
