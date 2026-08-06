import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { connectDB } from "@/lib/mongodb";
import {
  getUserLearningProfile,
  syncUserLearningProgress,
} from "@/lib/learning/service";
import {
  getPlatformStats,
  getUserDashboardMetrics,
} from "@/lib/dashboard/dashboard-model";
import { recordUserLoginStreak } from "@/lib/login-streak";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionPublicUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const loginStreak = await recordUserLoginStreak(user.id);
    await syncUserLearningProgress(user.id);

    const [profile, platform] = await Promise.all([
      getUserLearningProfile(user.id, user.name || user.email),
      getPlatformStats(),
    ]);
    const metrics = await getUserDashboardMetrics(user.id, profile, platform);

    const practiceSolved = metrics.distinctPracticeSolved;

    return NextResponse.json({
      practiceSolved,
      totalLevels: platform.totalLevels,
      points: practiceSolved,
      problemsSolved: practiceSolved,
      solutionsSubmitted: metrics.solutionsSubmitted,
      levelsCompleted: metrics.levelsCompleted,
      codingPracticesLabel: `${practiceSolved} / ${platform.totalPracticeQuestions}`,
      learnLabel: `${metrics.courseLevelsCompleted} / ${platform.totalCourseLevels}`,
      practiceSubtitle:
        practiceSolved > 0
          ? `${practiceSolved} solved — keep going!`
          : "Solve your first coding problem today",
      currentStreak: loginStreak.currentStreak,
      bestStreak: loginStreak.bestStreak,
    });
  } catch (error) {
    console.error("learning/me/dashboard-stats", error);
    return NextResponse.json({ error: "Failed to load dashboard stats." }, { status: 500 });
  }
}
