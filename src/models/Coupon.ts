import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * - percent: `discountValue`% off the base price
 * - flat: ₹`discountValue` off the base price
 * - free: full access at ₹0 for `freeAccessDays` days (null = lifetime)
 * - credits: no plan — a set number of free mock interviews / resume analyses,
 *   usable for `freeAccessDays` days (null = no expiry)
 */
export const COUPON_DISCOUNT_TYPES = ["percent", "flat", "free", "credits"] as const;
export type CouponDiscountType = (typeof COUPON_DISCOUNT_TYPES)[number];

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "", trim: true },
    discountType: { type: String, enum: COUPON_DISCOUNT_TYPES, required: true },
    discountValue: { type: Number, default: 0 },
    /** Only for `free` coupons. null = lifetime access. */
    freeAccessDays: { type: Number, default: null },
    /** Only for `credits` coupons. */
    mockInterviewCredits: { type: Number, default: 0 },
    resumeAnalyzerCredits: { type: Number, default: 0 },
    /** Plan / service ids this coupon works on. Empty = everything. */
    appliesTo: { type: [String], default: [] },
    validFrom: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    /** Total redemptions allowed. null = unlimited. */
    maxUses: { type: Number, default: null },
    perUserLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type CouponDocument = InferSchemaType<typeof couponSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.Coupon) {
  delete mongoose.models.Coupon;
}

export const Coupon: Model<CouponDocument> =
  mongoose.model<CouponDocument>("Coupon", couponSchema);
