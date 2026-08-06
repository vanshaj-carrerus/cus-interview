import mongoose from "mongoose";

export interface IDemoOTP {
  email: string;
  codeHash: string;
  expiresAt: Date;
  lastSentAt: Date;
  attemptsLeft: number;
}

const demoOTPSchema = new mongoose.Schema<IDemoOTP>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    lastSentAt: { type: Date, required: true },
    attemptsLeft: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// TTL index to automatically delete expired OTPs
demoOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const DemoOTP =
  mongoose.models.DemoOTP || mongoose.model<IDemoOTP>("DemoOTP", demoOTPSchema);
