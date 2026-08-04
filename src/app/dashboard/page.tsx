import DashboardHome from "./components/dashboard-home";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { connectDB } from "@/lib/mongodb";
import {
  ensureUserLearningProfileInitialized,
  getUserLearningActivityRollup,
  getUserLearningProfile,
  syncUserLearningProgress,
} from "@/lib/learning/service";
import {
  buildDashboardModel,
  getPlatformStats,
  getUserDashboardMetrics,
} from "@/lib/dashboard/dashboard-model";
import { recordUserLoginStreak } from "@/lib/login-streak";
import { ensureUserAvatarSaved } from "@/lib/sync-user-avatar";
import { AiMockInterview } from "@/models/AiMockInterview";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let user = await getSessionPublicUser();
  if (!user) {
    return null;
  }

  if (!user.image) {
    const savedImage = await ensureUserAvatarSaved(user.id, user.email);
    if (savedImage) {
      user = { ...user, image: savedImage };
    }
  }

  await connectDB();
  await ensureUserLearningProfileInitialized(user.id);
  await syncUserLearningProgress(user.id);

  const loginStreak = await recordUserLoginStreak(user.id);

  const [profile, rollup, platform, mockCount] = await Promise.all([
    getUserLearningProfile(user.id, user.name || user.email),
    getUserLearningActivityRollup(user.id),
    getPlatformStats(),
    AiMockInterview.countDocuments({
      $or: [{ userId: new Types.ObjectId(user.id) }, { userId: user.id }],
      showToUser: { $ne: false },
    }),
  ]);

  const userMetrics = await getUserDashboardMetrics(user.id, profile, platform);

  const model = buildDashboardModel(
    user,
    profile,
    rollup,
    platform,
    userMetrics,
    mockCount,
    loginStreak,
  );

  return <DashboardHome model={model} />;
}
