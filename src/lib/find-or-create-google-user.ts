import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { normalizeEmail } from "@/lib/email-validation";
import { splitFullName } from "@/lib/billing/checkout-details";
import type { GoogleUserInfo } from "@/lib/google-oauth";
import { ensureUserLearningProfileInitialized } from "@/lib/learning/service";
import { User, type UserDocument } from "@/models/User";

export async function findOrCreateGoogleUser(
  googleUser: GoogleUserInfo
): Promise<UserDocument> {
  if (!googleUser.email) {
    throw new Error("Google account did not return an email address.");
  }

  if (googleUser.email_verified === false) {
    throw new Error("Your Google email must be verified to sign in.");
  }

  const email = normalizeEmail(googleUser.email);
  await connectDB();

  const existing = await User.findOne({
    $or: [{ googleId: googleUser.sub }, { email }],
  });

  const name = googleUser.name?.trim() || "";
  const { firstName, lastName } = splitFullName(name);
  const profileImageUrl = googleUser.picture?.trim() || "";

  if (existing) {
    const updates: Record<string, string> = {};

    if (!existing.googleId) {
      updates.googleId = googleUser.sub;
    }
    if (profileImageUrl) {
      updates.profileImageUrl = profileImageUrl;
    }
    if (!existing.name && name) {
      updates.name = name;
      updates.firstName = googleUser.given_name?.trim() || firstName;
      updates.lastName = googleUser.family_name?.trim() || lastName;
    }

    if (Object.keys(updates).length === 0) {
      return existing;
    }

    const updated = await User.findByIdAndUpdate(
      existing._id,
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      throw new Error("Unable to update Google account.");
    }

    return updated;
  }

  const passwordHash = await bcrypt.hash(crypto.randomBytes(48).toString("hex"), 12);

  const user = await User.create({
    email,
    googleId: googleUser.sub,
    passwordHash,
    name,
    firstName: googleUser.given_name?.trim() || firstName,
    lastName: googleUser.family_name?.trim() || lastName,
    profileImageUrl,
  });

  await ensureUserLearningProfileInitialized(user._id.toString());

  return user;
}
