import type { PublicUser } from "@/types/auth";
import type { UserLearningActivityRollup } from "@/lib/learning/service";
import {
  getUserAllTimePracticeSolvedCount,
} from "@/lib/learning/service";
import type { UserLearningProfile } from "@/types/profile";
import { buildProfileDashboardModel } from "@/lib/profile/profile-dashboard-model";
import { getUserAvatarCandidates } from "@/lib/user-avatar";
import { PORTFOLIO_PROJECT_COUNT } from "@/lib/dashboard/project-ideas";
import { COMPANY_INTERVIEW_GUIDE_COUNT } from "@/lib/dashboard/company-guides";
import type { LoginStreakSnapshot } from "@/lib/login-streak";
import { Types } from "mongoose";

/** Matches attempt rows whether `userId` was stored as ObjectId or string. */
function matchUserLearningAttempts(userId: string) {
  const oid = new Types.ObjectId(userId);
  return { $or: [{ userId: oid }, { userId }] };
}

export type PlatformStats = {
  totalQuestions: number;
  totalPracticeQuestions: number;
  totalPracticeTracks: number;
  totalCourses: number;
  totalLevels: number;
  totalCourseLevels: number;
  totalTasks: number;
  totalPortfolioProjects: number;
  courseTrackIds: string[];
  practiceLevelIds: string[];
};

export type UserDashboardMetrics = {
  distinctSolvedQuestions: number;
  distinctPracticeSolved: number;
  distinctTasksCompleted: number;
  solutionsSubmitted: number;
  levelsCompleted: number;
  courseLevelsCompleted: number;
  startedCourses: number;
  completedCourses: number;
};

export type DashboardProgressCard = {
  label: string;
  title: string;
  subtitle: string;
  href: string;
  surfaceClass: string;
  labelClass: string;
};

export type DashboardModel = {
  displayName: string;
  email: string;
  avatarUrls: string[];
  platform: PlatformStats;
  userSolvedQuestions: number;
  userMockInterviews: number;
  userPoints: number;
  currentStreak: number;
  bestStreak: number;
  welcomeSubtitle: string;
  exploreItems: { title: string; href: string; desc: string }[];
  statTiles: { label: string; value: string; icon: "learn" | "practice" | "jobs" }[];
  progressCards: DashboardProgressCard[];
  profileStats: { label: string; value: string }[];
};

function sumCourseProgress(profile: UserLearningProfile, courseTrackIds: Set<string>) {
  let courseLevelsCompleted = 0;
  let startedCourses = 0;
  let completedCourses = 0;

  for (const lang of profile.languages ?? []) {
    for (const track of lang.tracks ?? []) {
      if (!courseTrackIds.has(track.trackId)) continue;
      courseLevelsCompleted += track.completedLevels;
      const inProgress =
        track.totalLevels > 0 &&
        track.completedLevels < track.totalLevels &&
        track.cleared > 0;
      if (inProgress) startedCourses += 1;
      if (track.totalLevels > 0 && track.completedLevels >= track.totalLevels) completedCourses += 1;
    }
  }

  return { courseLevelsCompleted, startedCourses, completedCourses };
}

function buildQuizSubtitle(metrics: UserDashboardMetrics): string {
  if (metrics.completedCourses > 0) {
    const quizLabel = metrics.completedCourses === 1 ? "quiz" : "quizzes";
    return `${metrics.completedCourses} ${quizLabel} completed · ${metrics.courseLevelsCompleted} levels cleared`;
  }
  if (metrics.startedCourses > 0) {
    const quizLabel = metrics.startedCourses === 1 ? "quiz" : "quizzes";
    return `${metrics.startedCourses} ${quizLabel} in progress · keep going!`;
  }
  return "Start exploring structured language roadmaps";
}

function buildWelcomeSubtitle(rollup: UserLearningActivityRollup, currentStreak: number): string {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLevels = rollup.dayCounts.find((d) => d.dateKey === todayKey)?.count ?? 0;

  if (currentStreak >= 7) {
    return `You're on a ${currentStreak}-day streak — keep the momentum going!`;
  }
  if (currentStreak > 0) {
    return `Maintain your ${currentStreak}-day streak. Consistency is the key to cracking your dream job.`;
  }
  if (todayLevels > 0) {
    const levelLabel = todayLevels === 1 ? "level" : "levels";
    return `You've practiced ${todayLevels} ${levelLabel} today — great start!`;
  }
  return "Solve today's challenge and maintain your streak. Consistency is the key to cracking your dream job.";
}

function formatStatCount(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "0";
  return String(Math.floor(n));
}

export function buildDashboardModel(
  user: PublicUser,
  profile: UserLearningProfile,
  rollup: UserLearningActivityRollup,
  platform: PlatformStats,
  userMetrics: UserDashboardMetrics,
  mockInterviewCount: number,
  loginStreak: LoginStreakSnapshot
): DashboardModel {
  const profileModel = buildProfileDashboardModel(user, profile, rollup, null);
  const displayName = profileModel.user.displayName;
  const practiceSolvedCount = userMetrics.distinctPracticeSolved;
  const solutionsSubmitted = userMetrics.solutionsSubmitted;
  const levelsCompleted = userMetrics.levelsCompleted;
  /** 1 point per unique practice problem solved. */
  const points = practiceSolvedCount;

  const currentStreak = loginStreak.currentStreak;
  const bestStreak = loginStreak.bestStreak;
  const codingPracticeTotal = platform.totalPracticeQuestions;

  const projectsValue =
    platform.totalTasks > 0
      ? `${userMetrics.distinctTasksCompleted} / ${platform.totalTasks}`
      : `0 / ${platform.totalPortfolioProjects}`;

  const statTiles: DashboardModel["statTiles"] = [
    {
      label: "Learn",
      value: `${formatStatCount(userMetrics.courseLevelsCompleted)} / ${platform.totalCourseLevels}`,
      icon: "learn",
    },
    {
      label: "Coding Practices",
      value: `${formatStatCount(practiceSolvedCount)} / ${codingPracticeTotal}`,
      icon: "practice",
    },
    {
      label: "Projects",
      value: projectsValue,
      icon: "jobs",
    },
  ];

  const progressCards: DashboardProgressCard[] = [
    {
      label: "Practice",
      title: "Practice Problems",
      subtitle:
        practiceSolvedCount > 0
          ? `${practiceSolvedCount} solved — keep going!`
          : "Solve your first coding problem today",
      href: "/dashboard/practice-problems",
      surfaceClass:
        "border border-orange-200/70 bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100",
      labelClass: "text-orange-600",
    },
    {
      label: "Tutorial",
      title: "Programming Languages",
      subtitle: buildQuizSubtitle(userMetrics),
      href: "/dashboard/programming-languages",
      surfaceClass:
        "border border-emerald-200/70 bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100",
      labelClass: "text-emerald-600",
    },
    {
      label: "Interview",
      title: "AI Mock Interview",
      subtitle:
        mockInterviewCount > 0
          ? `${mockInterviewCount} interview${mockInterviewCount === 1 ? "" : "s"} completed`
          : "Practice with AI-powered mock interviews",
      href: "/dashboard/ai-mock-interview",
      surfaceClass:
        "border border-violet-200/70 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100",
      labelClass: "text-violet-600",
    },
  ];

  const profileStats = [
    { label: "Points", value: formatStatCount(points) },
    { label: "Problems Solved", value: formatStatCount(practiceSolvedCount) },
    { label: "Solutions Submitted", value: formatStatCount(solutionsSubmitted) },
    { label: "Levels Completed", value: formatStatCount(levelsCompleted) },
  ];

  return {
    displayName,
    email: user.email,
    avatarUrls: getUserAvatarCandidates(user.email, user.image),
    platform,
    userSolvedQuestions: practiceSolvedCount,
    userMockInterviews: mockInterviewCount,
    userPoints: points,
    currentStreak,
    bestStreak,
    welcomeSubtitle: buildWelcomeSubtitle(rollup, currentStreak),
    exploreItems: [
      { title: "Compiler", href: "/dashboard/compiler", desc: "Run code in 10+ languages" },
      {
        title: "Resume Analyzer",
        href: "/dashboard/resume-analyzer",
        desc: "Get ATS score & feedback",
      },
      {
        title: "Company Interviews",
        href: "/dashboard/company-interviews",
        desc: `${platform.totalPracticeTracks} practice tracks · ${COMPANY_INTERVIEW_GUIDE_COUNT} company guides`,
      },
      {
        title: "Projects",
        href: "/dashboard/projects",
        desc: `${platform.totalPortfolioProjects} portfolio project ideas`,
      },
    ],
    statTiles,
    progressCards,
    profileStats,
  };
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const { connectDB } = await import("@/lib/mongodb");
  const { LearningTrack, LearningLevel, LearningQuestion, LearningTask } = await import(
    "@/models/learning"
  );

  await connectDB();

  const [practiceTracks, courseTracks] = await Promise.all([
    LearningTrack.find({ status: "published", kind: "track" }).select({ _id: 1 }).lean(),
    LearningTrack.find({ status: "published", kind: "course" }).select({ _id: 1 }).lean(),
  ]);

  const practiceTrackIds = practiceTracks.map((t) => t._id);
  const courseTrackIds = courseTracks.map((t) => String(t._id));

  const [practiceLevels, courseLevels, totalQuestions, totalTasks] = await Promise.all([
    LearningLevel.find({ trackId: { $in: practiceTrackIds }, status: "published" })
      .select({ _id: 1 })
      .lean(),
    LearningLevel.countDocuments({ trackId: { $in: courseTracks.map((t) => t._id) }, status: "published" }),
    LearningQuestion.countDocuments({ status: "published" }),
    LearningTask.countDocuments({ status: "published" }),
  ]);

  const practiceLevelIds = practiceLevels.map((l) => String(l._id));

  const totalPracticeQuestions = await LearningQuestion.countDocuments({
    levelId: { $in: practiceLevels.map((l) => l._id) },
    status: "published",
  });

  return {
    totalQuestions,
    totalPracticeQuestions,
    totalPracticeTracks: practiceTracks.length,
    totalCourses: courseTracks.length,
    totalLevels: practiceLevels.length + courseLevels,
    totalCourseLevels: courseLevels,
    totalTasks,
    totalPortfolioProjects: PORTFOLIO_PROJECT_COUNT,
    courseTrackIds,
    practiceLevelIds,
  };
}

export async function getUserDashboardMetrics(
  userId: string,
  profile: UserLearningProfile,
  platform: PlatformStats
): Promise<UserDashboardMetrics> {
  const { getTrackingModels } = await import("@/models/learning");
  const tracking = await getTrackingModels();
  const { UserLearningAttempt } = tracking;

  const courseTrackIdSet = new Set(platform.courseTrackIds);
  const courseProgress = sumCourseProgress(profile, courseTrackIdSet);
  const userMatch = matchUserLearningAttempts(userId);

  const practiceLevelOids = platform.practiceLevelIds.map((id) => new Types.ObjectId(id));

  const baseQuestionMatch = {
    ...userMatch,
    entityType: "question",
    isCorrect: true,
  };

  const [distinctAllAgg, distinctPracticeAgg, distinctTasksAgg, submissionAgg] =
    await Promise.all([
      UserLearningAttempt.aggregate<{ total: number }>([
        { $match: baseQuestionMatch },
        { $group: { _id: "$entityId" } },
        { $count: "total" },
      ]),
      practiceLevelOids.length > 0
        ? UserLearningAttempt.aggregate<{ total: number }>([
          {
            $match: {
              ...baseQuestionMatch,
              levelId: { $in: practiceLevelOids },
            },
          },
          { $group: { _id: "$entityId" } },
          { $count: "total" },
        ])
        : Promise.resolve([]),
      UserLearningAttempt.aggregate<{ total: number }>([
        {
          $match: {
            ...userMatch,
            entityType: "task",
            isCorrect: true,
          },
        },
        { $group: { _id: "$entityId" } },
        { $count: "total" },
      ]),
      UserLearningAttempt.aggregate<{ total: number }>([
        { $match: userMatch },
        { $count: "total" },
      ]),
    ]);

  const distinctAll = Number(distinctAllAgg[0]?.total ?? 0);
  const distinctPractice = Number(distinctPracticeAgg[0]?.total ?? 0);

  const [allTimePracticeSolved] = await Promise.all([
    getUserAllTimePracticeSolvedCount(userId, platform.practiceLevelIds),
  ]);

  /** Coding Practices counts only practice-track coding problems — not quiz MCQ completions. */
  const practiceSolved = Math.max(distinctPractice, allTimePracticeSolved);

  const permanentDistinct = Number(profile.totals?.distinctQuestionsSolved ?? 0);
  const profileSolvedIdsLen = profile.solvedQuestionIds?.length ?? 0;
  const solvedQuestions = Math.max(distinctAll, permanentDistinct, profileSolvedIdsLen);

  const submissionsFromAttempts = Number(submissionAgg[0]?.total ?? 0);
  const submissionsFromProfile = Number(profile.totals?.totalQuestionsAttempted ?? 0);

  return {
    distinctSolvedQuestions: solvedQuestions,
    distinctPracticeSolved: practiceSolved,
    distinctTasksCompleted: Number(distinctTasksAgg[0]?.total ?? 0),
    solutionsSubmitted: Math.max(submissionsFromAttempts, submissionsFromProfile),
    levelsCompleted: profile.totals.totalLevelsCompleted,
    ...courseProgress,
  };
}
