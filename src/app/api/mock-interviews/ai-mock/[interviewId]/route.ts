import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { AiMockInterview } from "@/models/AiMockInterview";

type Context = {
  params: Promise<{ interviewId: string }>;
};

export async function GET(_: Request, context: Context) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { interviewId } = await context.params;
    await connectDB();

    const interview = await AiMockInterview.findOne({
      _id: interviewId,
      userId: sessionUser.id,
      showToUser: { $ne: false },
    }).lean();

    if (!interview) {
      return NextResponse.json({ error: "Mock interview not found." }, { status: 404 });
    }

    return NextResponse.json({
      interview: {
        id: interview._id.toString(),
        languages: interview.languages ?? [],
        framework: interview.framework ?? "",
        role: interview.role ?? "",
        seniority: interview.seniority,
        focusAreas: interview.focusAreas ?? [],
        notes: interview.notes ?? "",
        status: interview.status,
        questions: interview.questions ?? [],
        responses: interview.responses ?? [],
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error("mock-interviews/ai-mock/get", error);
    return NextResponse.json({ error: "Failed to fetch AI mock interview." }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { interviewId } = await context.params;
    await connectDB();

    const updated = await AiMockInterview.updateOne(
      {
        _id: interviewId,
        userId: sessionUser.id,
      },
      { $set: { showToUser: false } },
    );

    if (updated.matchedCount === 0) {
      return NextResponse.json({ error: "Mock interview not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("mock-interviews/ai-mock/delete", error);
    return NextResponse.json({ error: "Failed to remove mock interview from your list." }, { status: 500 });
  }
}
