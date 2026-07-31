import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const USER_ROLES = ["User", "SuperAdmin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SUBSCRIPTION_STATUSES = [
  "none",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: "", trim: true },
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    role: { type: String, enum: USER_ROLES, default: "User" },
    razorpayCustomerId: { type: String, index: true, sparse: true },
    razorpaySubscriptionId: { type: String, sparse: true },
    billingPlanId: {
      type: String,
      sparse: true,
    },
    subscribedAt: { type: Date },
    subscriptionStatus: {
      type: String,
      enum: SUBSCRIPTION_STATUSES,
      default: "none",
    },
    trialEndsAt: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    payuAuthPayuId: { type: String, sparse: true },
    payuFirstChargeAt: { type: Date },
    payuLastRecurringTxnId: { type: String, sparse: true },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

// In Next.js dev server, delete cached model to prevent stale schema validation errors
if (process.env.NODE_ENV !== "production" && mongoose.models.User) {
  delete mongoose.models.User;
}

export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);
