import { redirect } from "next/navigation";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { buildProfileDashboardModel } from "@/lib/profile/profile-dashboard-model";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { ensureUserLearningProfileInitialized, getUserLearningActivityRollup, getUserLearningProfile } from "@/lib/learning/service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionPublicUser();
  if (!user) {
    redirect("/login?next=/profile");
  }

  await connectDB();
  await ensureUserLearningProfileInitialized(user.id);

  const [userDoc, profile, rollup, totalProjects] = await Promise.all([
    User.findById(user.id).select({ updatedAt: 1, completedProjects: 1 }).lean(),
    getUserLearningProfile(user.id, user.name || user.email),
    getUserLearningActivityRollup(user.id),
    Project.countDocuments(),
  ]);

  const accountUpdatedAtIso = userDoc?.updatedAt
    ? new Date(userDoc.updatedAt as Date).toISOString()
    : null;

  const completedProjectsCount = userDoc?.completedProjects?.length || 0;

  const model = buildProfileDashboardModel(user, profile, rollup, accountUpdatedAtIso, completedProjectsCount, totalProjects);

  return <ProfileDashboard model={model} />;
}
