import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { AiMockInterview } from "@/models/AiMockInterview";

export async function GET() {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

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

    return NextResponse.json({ interviews: rows });
  } catch (error) {
    console.error("mock-interviews/ai-mock/history", error);
    return NextResponse.json({ error: "Failed to fetch AI mock interview history." }, { status: 500 });
  }
}
