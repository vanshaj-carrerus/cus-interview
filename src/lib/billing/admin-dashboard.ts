import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import { LearningTrack, LearningQuestion } from "@/models/learning";
import { getTrackingModels } from "@/models/learning/tracking-models";

const ACTIVE_DAYS = 30;

export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  superAdmins: number;
  platformSubscribers: number;
  activeSubscribers: number;
  servicePayments: number;
  practiceTracks: number;
  courses: number;
  totalQuestions: number;
  newUsersThisMonth: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - ACTIVE_DAYS);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    superAdmins,
    platformSubscribers,
    activeSubscribers,
    servicePayments,
    practiceTracks,
    courses,
    totalQuestions,
    newUsersThisMonth,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "SuperAdmin" }),
    User.countDocuments({
      $or: [
        { razorpaySubscriptionId: { $exists: true, $nin: [null, ""] } },
        {
          subscriptionStatus: {
            $in: ["trialing", "active", "past_due", "canceled"],
          },
        },
      ],
    }),
    User.countDocuments({ subscriptionStatus: { $in: ["trialing", "active"] } }),
    Payment.countDocuments({ status: "SUCCESS", purchaseType: "service" }),
    LearningTrack.countDocuments({ kind: "track" }),
    LearningTrack.countDocuments({ kind: "course" }),
    LearningQuestion.countDocuments({}),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
  ]);

  let activeUsers = 0;
  try {
    const { UserLearningProfile } = await getTrackingModels();
    activeUsers = await UserLearningProfile.countDocuments({
      lastActiveAt: { $gte: thirtyDaysAgo },
    });
  } catch {
    activeUsers = activeSubscribers;
  }

  return {
    totalUsers,
    activeUsers,
    superAdmins,
    platformSubscribers,
    activeSubscribers,
    servicePayments,
    practiceTracks,
    courses,
    totalQuestions,
    newUsersThisMonth,
  };
}
