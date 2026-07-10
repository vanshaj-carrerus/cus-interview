export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type PublicSubscription = {
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasAccess: boolean;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: "User" | "SuperAdmin";
  createdAt: string;
  subscription: PublicSubscription;
};
