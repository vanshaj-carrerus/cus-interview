import { connectDB } from "@/lib/mongodb";
import { resolveUserAvatarUrl } from "@/lib/user-avatar";
import { User } from "@/models/User";

export async function ensureUserAvatarSaved(
  userId: string,
  email: string
): Promise<string | null> {
  await connectDB();

  const user = await User.findById(userId).select("profileImageUrl email").lean();
  if (!user) return null;

  const existing = user.profileImageUrl?.trim();
  if (existing) return existing;

  const resolved = await resolveUserAvatarUrl(email);
  if (!resolved) return null;

  await User.updateOne({ _id: userId }, { $set: { profileImageUrl: resolved } });
  return resolved;
}

export function scheduleUserAvatarSync(userId: string, email: string): void {
  void ensureUserAvatarSaved(userId, email).catch((error) => {
    console.error("avatar sync", error);
  });
}
