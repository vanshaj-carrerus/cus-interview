import { getPayUMerchantKey, getPayUMerchantSalt } from "@/lib/payu";

export function getRazorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID?.trim() ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    ""
  );
}

export function getBillingSetupError(): string | null {
  const missing: string[] = [];

  if (!getPayUMerchantKey()) {
    missing.push("PAYU_MERCHANT_KEY");
  }
  if (!getPayUMerchantSalt()) {
    missing.push("PAYU_MERCHANT_SALT");
  }

  if (missing.length === 0) {
    return null;
  }

  return `Billing is not set up yet. Add ${missing.join(" and ")} to your .env file.`;
}
