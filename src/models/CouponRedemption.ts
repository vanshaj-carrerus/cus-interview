import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const couponRedemptionSchema = new Schema(
  {
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    code: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    purchaseType: { type: String, enum: ["plan", "service"], required: true },
    productId: { type: String, required: true },
    baseAmount: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    /** PayU txnid (or generated id for ₹0 checkouts) — makes recording idempotent. */
    txnid: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export type CouponRedemptionDocument = InferSchemaType<typeof couponRedemptionSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.CouponRedemption) {
  delete mongoose.models.CouponRedemption;
}

export const CouponRedemption: Model<CouponRedemptionDocument> =
  mongoose.model<CouponRedemptionDocument>("CouponRedemption", couponRedemptionSchema);
