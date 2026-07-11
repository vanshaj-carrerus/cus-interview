import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import {
  formatAdminDate,
  getDaysSince,
  getDisplayName,
  getPlanLabel,
  getRenewalSummary,
  getSubscriptionStatusLabel,
} from "@/lib/billing/subscriber-display";
import { splitFullName } from "@/lib/billing/checkout-details";
import type { SubscriptionStatus } from "@/types/auth";
import type { UserRole } from "@/models/User";

export type AdminUserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  daysSinceJoined: number | null;
  subscriptionStatus: SubscriptionStatus;
  statusLabel: string;
  planLabel: string;
  subscribedAt: string;
  daysSinceSubscribe: number | null;
  periodEndsAt: string;
  daysRemaining: number | null;
  renewalLabel: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string;
  currentPeriodEnd: string;
  razorpayCustomerId: string;
  razorpaySubscriptionId: string;
  hasSubscription: boolean;
};

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  await connectDB();

  const users = await User.find({})
    .select({
      name: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      role: 1,
      billingPlanId: 1,
      subscribedAt: 1,
      subscriptionStatus: 1,
      trialEndsAt: 1,
      currentPeriodEnd: 1,
      cancelAtPeriodEnd: 1,
      razorpayCustomerId: 1,
      razorpaySubscriptionId: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .lean();

  return users.map((user) => {
    const status = (user.subscriptionStatus ?? "none") as SubscriptionStatus;
    const renewal = getRenewalSummary({
      status,
      trialEndsAt: user.trialEndsAt,
      currentPeriodEnd: user.currentPeriodEnd,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd,
      billingPlanId: user.billingPlanId,
    });
    const hasSubscription =
      status !== "none" ||
      Boolean(user.razorpaySubscriptionId) ||
      Boolean(user.billingPlanId);

    const storedFirst = String(user.firstName ?? "").trim();
    const storedLast = String(user.lastName ?? "").trim();
    const fromSignup = splitFullName(String(user.name ?? ""));
    const firstName = storedFirst || fromSignup.firstName;
    const lastName = storedLast || fromSignup.lastName;

    return {
      id: String(user._id),
      firstName,
      lastName,
      fullName: getDisplayName({
        firstName,
        lastName,
        name: user.name,
      }),
      name: String(user.name ?? ""),
      email: String(user.email ?? ""),
      phone: String(user.phone ?? "—"),
      role: (user.role ?? "User") as UserRole,
      createdAt: formatAdminDate(user.createdAt),
      updatedAt: formatAdminDate(user.updatedAt),
      daysSinceJoined: getDaysSince(user.createdAt),
      subscriptionStatus: status,
      statusLabel: getSubscriptionStatusLabel(status),
      planLabel: getPlanLabel(user.billingPlanId),
      subscribedAt: formatAdminDate(user.subscribedAt),
      daysSinceSubscribe: getDaysSince(user.subscribedAt),
      periodEndsAt: formatAdminDate(renewal.periodEndsAt),
      daysRemaining: renewal.daysRemaining,
      renewalLabel: renewal.renewalLabel,
      cancelAtPeriodEnd: Boolean(user.cancelAtPeriodEnd),
      trialEndsAt: formatAdminDate(user.trialEndsAt),
      currentPeriodEnd: formatAdminDate(user.currentPeriodEnd),
      razorpayCustomerId: String(user.razorpayCustomerId ?? "—"),
      razorpaySubscriptionId: String(user.razorpaySubscriptionId ?? "—"),
      hasSubscription,
    };
  });
}
