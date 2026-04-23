import crypto from "crypto";

export function generateSixDigitCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function normalizeVerificationCode(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 6) {
    return null;
  }
  return digits;
}
