import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifySessionToken } from "@/lib/auth-token";
import { getAuthTokenFromCookies } from "@/lib/auth-cookie";
import { toPublicUser } from "@/lib/user-public";
import type { PublicUser } from "@/types/auth";

export async function getSessionPublicUser(): Promise<PublicUser | null> {
  const token = await getAuthTokenFromCookies();
  if (!token) {
    return null;
  }
  try {
    const { sub } = await verifySessionToken(token);
    await connectDB();
    const user = await User.findById(sub).lean();
    if (!user) {
      return null;
    }
    return toPublicUser(user);
  } catch {
    return null;
  }
}
