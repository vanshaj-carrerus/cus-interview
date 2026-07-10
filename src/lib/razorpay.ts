import Razorpay from "razorpay";
import { getRazorpayKeyId } from "@/lib/billing/config";

let razorpayClient: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  const keyId = getRazorpayKeyId();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured.");
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
}

export function getRazorpayPublicKey(): string {
  return getRazorpayKeyId();
}

export function getAppOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}
