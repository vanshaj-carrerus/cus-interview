import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PURCHASE_TYPES = ["plan", "service"] as const;
export type PurchaseType = (typeof PURCHASE_TYPES)[number];

const paymentSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String, sparse: true },
    signature: { type: String },
    baseAmount: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "PENDING",
    },
    purchaseType: {
      type: String,
      enum: PURCHASE_TYPES,
      required: true,
    },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, default: "" },
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export type PaymentDocument = InferSchemaType<typeof paymentSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

export const Payment: Model<PaymentDocument> =
  mongoose.model<PaymentDocument>("Payment", paymentSchema);
