import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { TRIAL_DAYS } from "@/lib/billing/plan";
import type { RazorpaySubscriptionEntity } from "@/types/razorpay";
import type { SubscriptionStatus } from "@/types/auth";

function isInTrialPeriod(subscription: RazorpaySubscriptionEntity): boolean {
  if (!subscription.start_at) {
    return false;
  }
  return subscription.start_at * 1000 > Date.now();
}

function mapRazorpayStatus(
  subscription: RazorpaySubscriptionEntity
): SubscriptionStatus {
  if (isInTrialPeriod(subscription)) {
    return "trialing";
  }

  switch (subscription.status) {
    case "active":
    case "authenticated":
      return "active";
    case "halted":
    case "pending":
      return "past_due";
    case "cancelled":
    case "completed":
    case "expired":
      return "canceled";
    case "created":
    default:
      return "none";
  }
}

function toDate(unixSeconds: number | null | undefined): Date | undefined {
  if (!unixSeconds) {
    return undefined;
  }
  return new Date(unixSeconds * 1000);
}

export async function syncRazorpaySubscriptionToUser(
  subscription: RazorpaySubscriptionEntity,
  userId?: string
): Promise<void> {
  await connectDB();

  const resolvedUserId = userId ?? subscription.notes?.userId ?? undefined;
  const status = mapRazorpayStatus(subscription);
  const trialEndsAt = toDate(subscription.start_at);
  const currentPeriodEnd = toDate(
    subscription.current_end ?? subscription.end_at ?? subscription.start_at
  );

  const update = {
    razorpayCustomerId: subscription.customer_id ?? undefined,
    razorpaySubscriptionId: subscription.id,
    subscriptionStatus: status,
    trialEndsAt,
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.status === "cancelled",
  };

  if (resolvedUserId) {
    await User.findByIdAndUpdate(resolvedUserId, update);
    return;
  }

  await User.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    update
  );
}

export async function markRazorpaySubscriptionCanceled(
  subscription: RazorpaySubscriptionEntity
): Promise<void> {
  await connectDB();

  await User.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    {
      razorpayCustomerId: subscription.customer_id ?? undefined,
      subscriptionStatus: "canceled",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: toDate(
        subscription.current_end ?? subscription.ended_at ?? subscription.end_at
      ),
    }
  );
}

export function hasActiveRazorpayAccess(
  subscription: RazorpaySubscriptionEntity
): boolean {
  const status = mapRazorpayStatus(subscription);
  return status === "trialing" || status === "active";
}

export function getTrialDaysLabel(): number {
  return TRIAL_DAYS;
}
