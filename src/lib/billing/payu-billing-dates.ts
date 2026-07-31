/** RBI / PayU: pre-debit notification must precede auto-debit by at least 24 hours. */
export const PRE_DEBIT_LEAD_HOURS = 24;
export const PRE_DEBIT_LEAD_MS = PRE_DEBIT_LEAD_HOURS * 60 * 60 * 1000;

export function formatDateYYYYMMDD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** True when `now` is within the 24-hour pre-debit window before `billingDate`. */
export function isWithinPreDebitWindow(billingDate: Date, now = new Date()): boolean {
  const msUntilBilling = billingDate.getTime() - now.getTime();
  return msUntilBilling > 0 && msUntilBilling <= PRE_DEBIT_LEAD_MS;
}

/** True when pre-debit was sent at least 24 hours before the scheduled debit. */
export function isPreDebitLeadTimeMet(
  preDebitSentAt: Date,
  billingDate: Date
): boolean {
  return preDebitSentAt.getTime() <= billingDate.getTime() - PRE_DEBIT_LEAD_MS;
}
