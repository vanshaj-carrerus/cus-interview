import { connectDB } from "@/lib/mongodb";
import { AiMockInterview } from "@/models/AiMockInterview";
import type { PublicSubscription } from "@/types/auth";
import {
  buildTrialMockLimitReachedMessage,
  getIstDayBounds,
  getMockInterviewDailyLimit,
  hasUnlimitedMockInterviews,
} from "@/lib/billing/trial-limits";

export async function countMockInterviewsCreatedToday(
  userId: string
): Promise<number> {
  await connectDB();
  const { start, end } = getIstDayBounds();
  return AiMockInterview.countDocuments({
    userId,
    createdAt: { $gte: start, $lt: end },
  });
}

export type MockInterviewQuota = {
  dailyLimit: number | null;
  usedToday: number;
  remainingToday: number | null;
  unlimited: boolean;
};

export async function getMockInterviewQuota(
  subscription: PublicSubscription,
  userId: string
): Promise<MockInterviewQuota> {
  const dailyLimit = getMockInterviewDailyLimit(subscription);
  if (dailyLimit === null) {
    return {
      dailyLimit: null,
      usedToday: 0,
      remainingToday: null,
      unlimited: true,
    };
  }

  const usedToday = await countMockInterviewsCreatedToday(userId);
  return {
    dailyLimit,
    usedToday,
    remainingToday: Math.max(0, dailyLimit - usedToday),
    unlimited: false,
  };
}

export type MockInterviewCreateLimitResult =
  | { allowed: true }
  | { allowed: false; message: string; code: "TRIAL_MOCK_DAILY_LIMIT" };

export async function assertCanCreateMockInterview(
  subscription: PublicSubscription,
  userId: string,
  isSuperAdmin: boolean
): Promise<MockInterviewCreateLimitResult> {
  if (isSuperAdmin || hasUnlimitedMockInterviews(subscription)) {
    return { allowed: true };
  }

  const dailyLimit = getMockInterviewDailyLimit(subscription);
  if (dailyLimit === null || dailyLimit <= 0) {
    return { allowed: true };
  }

  const usedToday = await countMockInterviewsCreatedToday(userId);
  if (usedToday >= dailyLimit) {
    return {
      allowed: false,
      message: buildTrialMockLimitReachedMessage(),
      code: "TRIAL_MOCK_DAILY_LIMIT",
    };
  }

  return { allowed: true };
}
