import { User } from "@/models/User";
import type { BillingPlanId } from "@/lib/billing/plan";

export function getPlanPeriodEnd(planId: BillingPlanId, from = new Date()): Date {
  const end = new Date(from);
  if (planId === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  } else if (planId === "quarterly") {
    end.setMonth(end.getMonth() + 3);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

export async function activatePlanForUser(
  userId: string,
  planId: BillingPlanId
): Promise<void> {
  const periodEnd = getPlanPeriodEnd(planId);

  await User.findByIdAndUpdate(userId, {
    subscriptionStatus: "active",
    currentPeriodEnd: periodEnd,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
  });
}
