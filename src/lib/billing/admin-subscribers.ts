import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import {
  formatAdminDate,
  getDaysSince,
  getDisplayName,
  getPlanLabel,
  getRenewalSummary,
  getSubscriptionStatusLabel,
} from "@/lib/billing/subscriber-display";
import type { SubscriptionStatus } from "@/types/auth";

export type AdminPlatformSubscriber = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  planLabel: string;
  status: SubscriptionStatus;
  statusLabel: string;
  subscribedAt: string;
  daysSinceSubscribe: number | null;
  periodEndsAt: string;
  daysRemaining: number | null;
  renewalLabel: string;
  cancelAtPeriodEnd: boolean;
  razorpaySubscriptionId: string;
  payuMandateToken: string;
  planAmount: number | null;
  accountJoinedAt: string;
};

export type AdminServicePayment = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  serviceName: string;
  amountInr: number;
  paidAt: string;
  paymentId: string;
  orderId: string;
};

export async function getAdminPlatformSubscribers(): Promise<
  AdminPlatformSubscriber[]
> {
  await connectDB();

  const users = await User.find({
    $or: [
      { razorpaySubscriptionId: { $exists: true, $ne: null } },
      {
        subscriptionStatus: {
          $in: ["trialing", "active", "past_due", "canceled"],
        },
      },
    ],
  })
    .select({
      email: 1,
      name: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      billingPlanId: 1,
      subscribedAt: 1,
      subscriptionStatus: 1,
      trialEndsAt: 1,
      currentPeriodEnd: 1,
      cancelAtPeriodEnd: 1,
      razorpaySubscriptionId: 1,
      payuMandateToken: 1,
      planAmount: 1,
      createdAt: 1,
    })
    .sort({ subscribedAt: -1, updatedAt: -1 })
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

    return {
      id: String(user._id),
      firstName: String(user.firstName ?? ""),
      lastName: String(user.lastName ?? ""),
      fullName: getDisplayName({
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
      }),
      email: String(user.email ?? ""),
      phone: String(user.phone ?? "—"),
      planLabel: getPlanLabel(user.billingPlanId),
      status,
      statusLabel: getSubscriptionStatusLabel(status),
      subscribedAt: formatAdminDate(user.subscribedAt ?? user.createdAt),
      daysSinceSubscribe: getDaysSince(user.subscribedAt ?? user.createdAt),
      periodEndsAt: formatAdminDate(renewal.periodEndsAt),
      daysRemaining: renewal.daysRemaining,
      renewalLabel: renewal.renewalLabel,
      cancelAtPeriodEnd: Boolean(user.cancelAtPeriodEnd),
      razorpaySubscriptionId: String(user.razorpaySubscriptionId ?? "—"),
      payuMandateToken: String(user.payuMandateToken ?? "—"),
      planAmount: typeof user.planAmount === "number" ? user.planAmount : null,
      accountJoinedAt: formatAdminDate(user.createdAt),
    };
  });
}

export async function getAdminServicePayments(): Promise<AdminServicePayment[]> {
  await connectDB();

  const payments = await Payment.find({
    status: "SUCCESS",
    purchaseType: "service",
  })
    .select({
      userEmail: 1,
      userName: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      productName: 1,
      amount: 1,
      paymentId: 1,
      orderId: 1,
      createdAt: 1,
    })
    .sort({ createdAt: -1 })
    .lean();

  return payments.map((payment) => ({
    id: String(payment._id),
    firstName: String(payment.firstName ?? ""),
    lastName: String(payment.lastName ?? ""),
    fullName: getDisplayName({
      firstName: payment.firstName,
      lastName: payment.lastName,
      name: payment.userName,
    }),
    email: String(payment.userEmail ?? ""),
    phone: String(payment.phone ?? "—"),
    serviceName: String(payment.productName ?? ""),
    amountInr: Number(payment.amount ?? 0),
    paidAt: formatAdminDate(payment.createdAt),
    paymentId: String(payment.paymentId ?? "—"),
    orderId: String(payment.orderId ?? ""),
  }));
}

export async function getAdminSubscriberStats() {
  const [platform, services] = await Promise.all([
    getAdminPlatformSubscribers(),
    getAdminServicePayments(),
  ]);

  const activePlatform = platform.filter(
    (row) => row.status === "trialing" || row.status === "active"
  ).length;

  return {
    platformTotal: platform.length,
    platformActive: activePlatform,
    servicePaymentsTotal: services.length,
  };
}
