/** Normalize to Razorpay prefill format: +91XXXXXXXXXX */
export function normalizeIndianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length === 13 && digits.startsWith("091")) {
    return `+91${digits.slice(3)}`;
  }
  return null;
}

export function isValidIndianPhone(value: string): boolean {
  return normalizeIndianPhone(value) !== null;
}

/** Razorpay Checkout expects a 10-digit Indian mobile without country code. */
export function formatPhoneForRazorpayPrefill(value: string): string | null {
  const normalized = normalizeIndianPhone(value);
  if (!normalized) {
    return null;
  }
  return normalized.slice(3);
}
