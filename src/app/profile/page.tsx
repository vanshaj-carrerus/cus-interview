import { redirect } from "next/navigation";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { buildProfileDashboardModel } from "@/lib/profile/profile-dashboard-model";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getUserLearningActivityRollup, getUserLearningProfile } from "@/lib/learning/service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionPublicUser();
  if (!user) {
    redirect("/login?next=/profile");
  }

  await connectDB();
  const [userDoc, profile, rollup] = await Promise.all([
    User.findById(user.id).select({ updatedAt: 1 }).lean(),
    getUserLearningProfile(user.id, user.name || user.email),
    getUserLearningActivityRollup(user.id),
  ]);

  const accountUpdatedAtIso = userDoc?.updatedAt
    ? new Date(userDoc.updatedAt as Date).toISOString()
    : null;

  const model = buildProfileDashboardModel(user, profile, rollup, accountUpdatedAtIso);

  return <ProfileDashboard model={model} />;
}
