import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const passwordResetSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    attemptsLeft: { type: Number, required: true, default: 5 },
    lastSentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type PasswordResetDocument = InferSchemaType<
  typeof passwordResetSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const PasswordReset: Model<PasswordResetDocument> =
  (mongoose.models.PasswordReset as Model<PasswordResetDocument>) ||
  mongoose.model<PasswordResetDocument>(
    "PasswordReset",
    passwordResetSchema
  );
