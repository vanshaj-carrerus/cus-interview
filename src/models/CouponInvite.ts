import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * An admin invited `email` to use a free-access / free-uses coupon.
 * - pending: no account yet — access is granted when they sign up with this email
 * - activated: access granted
 * - failed: coupon was off / expired / used up when they signed up
 */
export const COUPON_INVITE_STATUSES = ["pending", "activated", "failed"] as const;
export type CouponInviteStatus = (typeof COUPON_INVITE_STATUSES)[number];

const couponInviteSchema = new Schema(
  {
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    code: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: COUPON_INVITE_STATUSES, default: "pending" },
    /** Why access could not be granted (status = failed). */
    failureReason: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    activatedAt: { type: Date, default: null },
    lastEmailedAt: { type: Date, default: null },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

couponInviteSchema.index({ couponId: 1, email: 1 }, { unique: true });

export type CouponInviteDocument = InferSchemaType<typeof couponInviteSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.CouponInvite) {
  delete mongoose.models.CouponInvite;
}

export const CouponInvite: Model<CouponInviteDocument> =
  mongoose.model<CouponInviteDocument>("CouponInvite", couponInviteSchema);
