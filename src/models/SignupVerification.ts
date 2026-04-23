import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const signupVerificationSchema = new Schema(
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

export type SignupVerificationDocument = InferSchemaType<
  typeof signupVerificationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const SignupVerification: Model<SignupVerificationDocument> =
  (mongoose.models.SignupVerification as Model<SignupVerificationDocument>) ||
  mongoose.model<SignupVerificationDocument>(
    "SignupVerification",
    signupVerificationSchema
  );
