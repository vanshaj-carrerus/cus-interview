import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getPlanPeriodEnd } from "@/lib/billing/activate-plan";
import {
  isPreDebitLeadTimeMet,
  isWithinPreDebitWindow,
} from "@/lib/billing/payu-billing-dates";
import {
  getPayUMandateToken,
  getRenewalNextBillingDate,
} from "@/lib/billing/payu-mandate";
import {
  chargeRecurringSubscription,
  sendPreDebitForUpcomingBilling,
} from "@/lib/billing/payu-recurring";
import { isBillingPlanId, type BillingPlanId } from "@/lib/billing/plan";

export type PayURecurringBillingSummary = {
  preDebitProcessed: number;
  preDebitSent: number;
  preDebitFailed: number;
  chargeProcessed: number;
  chargeSucceeded: number;
  chargeFailed: number;
  errors: string[];
};

const MANDATE_FILTER = {
  $or: [
    { payuMandateToken: { $exists: true, $ne: "" } },
    { payuAuthPayuId: { $exists: true, $ne: "" } },
  ],
};

function datesMatch(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return a.getTime() === b.getTime();
}

/**
 * Phase 1 — within 24h of `nextBillingDate`, send PayU pre_debit_SI (RBI compliance).
 */
export async function processUpcomingPreDebitNotifications(): Promise<
  Pick<
    PayURecurringBillingSummary,
    "preDebitProcessed" | "preDebitSent" | "preDebitFailed" | "errors"
  >
> {
  await connectDB();

  const now = new Date();
  const candidates = await User.find({
    subscriptionStatus: "active",
    nextBillingDate: { $gt: now },
    ...MANDATE_FILTER,
  }).limit(50);

  const summary = {
    preDebitProcessed: 0,
    preDebitSent: 0,
    preDebitFailed: 0,
    errors: [] as string[],
  };

  for (const user of candidates) {
    const nextBillingDate = user.nextBillingDate;
    if (!nextBillingDate || !isWithinPreDebitWindow(nextBillingDate, now)) {
      continue;
    }

    if (
      user.payuPreDebitSentAt &&
      datesMatch(user.payuPreDebitForDate, nextBillingDate)
    ) {
      continue;
    }

    const amount = user.planAmount ?? 0;
    if (amount <= 0 || !getPayUMandateToken(user)) {
      continue;
    }

    summary.preDebitProcessed += 1;

    try {
      const result = await sendPreDebitForUpcomingBilling({
        _id: user._id,
        payuMandateToken: user.payuMandateToken,
        payuAuthPayuId: user.payuAuthPayuId,
        phone: user.phone,
        email: user.email,
        planAmount: amount,
        nextBillingDate,
      });

      if (!result.ok) {
        summary.preDebitFailed += 1;
        summary.errors.push(
          `Pre-debit user ${user._id.toString()}: ${result.message ?? "failed"}`
        );
        continue;
      }

      await User.findByIdAndUpdate(user._id, {
        payuPreDebitSentAt: new Date(),
        payuPreDebitForDate: nextBillingDate,
      });

      summary.preDebitSent += 1;
    } catch (err) {
      summary.preDebitFailed += 1;
      const message = err instanceof Error ? err.message : "Unexpected pre-debit error.";
      summary.errors.push(`Pre-debit user ${user._id.toString()}: ${message}`);
    }
  }

  return summary;
}

/**
 * Phase 2 — on `nextBillingDate`, execute si_transaction (pre-debit must be ≥24h old).
 */
export async function processDueRecurringCharges(): Promise<
  Pick<
    PayURecurringBillingSummary,
    "chargeProcessed" | "chargeSucceeded" | "chargeFailed" | "errors"
  >
> {
  await connectDB();

  const dueUsers = await User.find({
    subscriptionStatus: "active",
    nextBillingDate: { $lte: new Date() },
    payuPreDebitSentAt: { $exists: true, $ne: null },
    ...MANDATE_FILTER,
  }).limit(25);

  const summary = {
    chargeProcessed: 0,
    chargeSucceeded: 0,
    chargeFailed: 0,
    errors: [] as string[],
  };

  for (const user of dueUsers) {
    const nextBillingDate = user.nextBillingDate;
    const preDebitSentAt = user.payuPreDebitSentAt;

    if (!nextBillingDate || !preDebitSentAt) {
      continue;
    }

    if (!isPreDebitLeadTimeMet(preDebitSentAt, nextBillingDate)) {
      summary.errors.push(
        `User ${user._id.toString()}: pre-debit 24h lead time not met — skipping charge.`
      );
      continue;
    }

    if (!datesMatch(user.payuPreDebitForDate, nextBillingDate)) {
      summary.errors.push(
        `User ${user._id.toString()}: pre-debit date mismatch — skipping charge.`
      );
      continue;
    }

    summary.chargeProcessed += 1;

    const planId: BillingPlanId = isBillingPlanId(user.billingPlanId)
      ? user.billingPlanId
      : "monthly";
    const mandateToken = getPayUMandateToken(user);
    if (!mandateToken) {
      summary.chargeFailed += 1;
      summary.errors.push(`User ${user._id.toString()} missing payu_mandate_token.`);
      continue;
    }

    const amount = user.planAmount ?? 0;
    if (amount <= 0) {
      summary.chargeFailed += 1;
      summary.errors.push(`User ${user._id.toString()} has invalid plan_amount.`);
      continue;
    }

    try {
      const charge = await chargeRecurringSubscription(user, amount);

      if (!charge.ok) {
        summary.chargeFailed += 1;
        summary.errors.push(
          `User ${user._id.toString()} charge failed: ${charge.message ?? "unknown error"}`
        );
        await User.findByIdAndUpdate(user._id, {
          subscriptionStatus: "failed",
        });
        continue;
      }

      const periodEnd = getPlanPeriodEnd(planId);
      const renewalBillingDate = getRenewalNextBillingDate(planId);

      await User.findByIdAndUpdate(user._id, {
        subscriptionStatus: "active",
        currentPeriodEnd: periodEnd,
        nextBillingDate: renewalBillingDate,
        cancelAtPeriodEnd: false,
        payuFirstChargeAt: user.payuFirstChargeAt ?? new Date(),
        payuLastRecurringTxnId: charge.txnid,
        $unset: {
          payuPreDebitSentAt: "",
          payuPreDebitForDate: "",
        },
      });

      summary.chargeSucceeded += 1;
    } catch (err) {
      summary.chargeFailed += 1;
      const message = err instanceof Error ? err.message : "Unexpected charge error.";
      summary.errors.push(`User ${user._id.toString()}: ${message}`);
    }
  }

  return summary;
}

/** Runs pre-debit notifications then due recurring charges (cron entry point). */
export async function processRecurringBilling(): Promise<PayURecurringBillingSummary> {
  const preDebit = await processUpcomingPreDebitNotifications();
  const charges = await processDueRecurringCharges();

  return {
    ...preDebit,
    ...charges,
  };
}

/** @deprecated Use processRecurringBilling */
export async function processDuePayUTrialCharges(): Promise<PayURecurringBillingSummary> {
  return processRecurringBilling();
}
