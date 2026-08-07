export type SubscriptionStatus =
  | "none"
  | "pending"
  | "trialing"
  | "active"
  | "past_due"
  | "failed"
  | "canceled"
  | "unpaid";

export type PublicSubscription = {
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasAccess: boolean;
  hasPlatformAccess: boolean;
  planId: "test" | "monthly" | "quarterly" | "yearly" | null;
  isTrialing: boolean;
  /** `1` during trial, `null` when unlimited (active paid plan). */
  mockInterviewsDailyLimit: number | null;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "User" | "SuperAdmin";
  createdAt: string;
  subscription: PublicSubscription;
};
