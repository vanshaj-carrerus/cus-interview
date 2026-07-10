function getRazorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID?.trim() ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    ""
  );
}

export function getBillingSetupError(): string | null {
  const missing: string[] = [];

  if (!getRazorpayKeyId()) {
    missing.push("NEXT_PUBLIC_RAZORPAY_KEY_ID");
  }
  if (!process.env.RAZORPAY_KEY_SECRET?.trim()) {
    missing.push("RAZORPAY_KEY_SECRET");
  }

  if (missing.length === 0) {
    return null;
  }

  return `Billing is not set up yet. Add ${missing.join(" and ")} to your .env file.`;
}

export { getRazorpayKeyId };
