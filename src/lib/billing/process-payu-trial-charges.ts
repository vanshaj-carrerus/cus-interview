import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getPlanPeriodEnd } from "@/lib/billing/activate-plan";
import { getSubscriptionAmounts } from "@/lib/billing/order-amount";
import { executePayURecurringCharge } from "@/lib/billing/payu-recurring";
import { isBillingPlanId, type BillingPlanId } from "@/lib/billing/plan";

export type PayUTrialChargeSummary = {
  processed: number;
  activated: number;
  failed: number;
  errors: string[];
};

function buildRecurringTxnId(userId: string): string {
  return `rec${Date.now()}${userId.slice(-6)}`;
}

export async function processDuePayUTrialCharges(): Promise<PayUTrialChargeSummary> {
  await connectDB();

  const dueUsers = await User.find({
    subscriptionStatus: "trialing",
    payuAuthPayuId: { $exists: true, $ne: "" },
    payuFirstChargeAt: { $exists: false },
    trialEndsAt: { $lte: new Date() },
  }).limit(25);

  const summary: PayUTrialChargeSummary = {
    processed: 0,
    activated: 0,
    failed: 0,
    errors: [],
  };

  for (const user of dueUsers) {
    summary.processed += 1;

    const planId = isBillingPlanId(user.billingPlanId) ? user.billingPlanId : "monthly";
    const authPayuId = user.payuAuthPayuId?.trim();
    if (!authPayuId) {
      summary.failed += 1;
      summary.errors.push(`User ${user._id.toString()} missing payuAuthPayuId.`);
      continue;
    }

    const { totalAmount } = getSubscriptionAmounts(planId);
    const txnid = buildRecurringTxnId(user._id.toString());
    const invoiceDisplayNumber = `INV-${txnid}`;

    try {
      const charge = await executePayURecurringCharge({
        authPayuId,
        amount: totalAmount.toFixed(2),
        txnid,
        phone: user.phone ?? "",
        email: user.email ?? "",
        invoiceDisplayNumber,
        mandateSeqNo: 2,
      });

      if (!charge.ok) {
        summary.failed += 1;
        summary.errors.push(
          `User ${user._id.toString()} charge failed: ${charge.message ?? "unknown error"}`
        );
        await User.findByIdAndUpdate(user._id, {
          subscriptionStatus: "past_due",
        });
        continue;
      }

      const periodEnd = getPlanPeriodEnd(planId);
      await User.findByIdAndUpdate(user._id, {
        subscriptionStatus: "active",
        currentPeriodEnd: periodEnd,
        trialEndsAt: null,
        cancelAtPeriodEnd: false,
        payuFirstChargeAt: new Date(),
        payuLastRecurringTxnId: txnid,
      });

      summary.activated += 1;
    } catch (err) {
      summary.failed += 1;
      const message = err instanceof Error ? err.message : "Unexpected charge error.";
      summary.errors.push(`User ${user._id.toString()}: ${message}`);
    }
  }

  return summary;
}
