import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getMockInterviewQuota, type MockInterviewQuota } from "@/lib/billing/mock-interview-quota";
import type { PublicUser } from "@/types/auth";
import { getFeatureAccessSession } from "@/lib/billing/feature-credits";
import { AiMockInterview } from "@/models/AiMockInterview";

/** Coupon-credit users see their credit balance in place of the daily trial quota. */
async function getQuota(via: "plan" | "credits", user: PublicUser): Promise<MockInterviewQuota> {
  const credits = user.subscription.featureCredits?.mockInterview;
  if (via === "credits" && credits) {
    return {
      dailyLimit: credits.total,
      usedToday: credits.total - credits.remaining,
      remainingToday: credits.remaining,
      unlimited: false,
    };
  }
  return getMockInterviewQuota(user.subscription, user.id, user.role === "SuperAdmin");
}

export async function GET() {
  try {
    const access = await getFeatureAccessSession("mockInterview");
    if ("error" in access) {
      return access.error;
    }
    const sessionUser = access.user;

    await connectDB();
    const interviews = await AiMockInterview.find({
      userId: sessionUser.id,
      showToUser: { $ne: false },
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const rows = interviews.map((item) => {
      const responses = item.responses ?? [];
      const averageScoreOutOf10 =
        responses.length > 0
          ? Number((responses.reduce((sum, x) => sum + x.scoreOutOf10, 0) / responses.length).toFixed(1))
          : 0;

      return {
        id: item._id.toString(),
        status: item.status,
        role: item.role ?? "",
        framework: item.framework ?? "",
        seniority: item.seniority ?? "",
        createdAt: item.createdAt,
        questionsCount: (item.questions ?? []).length,
        answeredCount: responses.length,
        averageScoreOutOf10,
      };
    });

    return NextResponse.json({
      interviews: rows,
      quota: await getQuota(access.via, sessionUser),
    });
  } catch (error) {
    console.error("mock-interviews/ai-mock/history", error);
    return NextResponse.json({ error: "Failed to fetch AI mock interview history." }, { status: 500 });
  }
}
