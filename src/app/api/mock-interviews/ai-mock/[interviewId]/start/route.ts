import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { AiMockInterview } from "@/models/AiMockInterview";
import { runMockInterviewPrompt } from "@/lib/ai/mock-interview-engine";

type Context = {
  params: Promise<{ interviewId: string }>;
};

type GeneratedQuestions = {
  questions: Array<{
    id?: string;
    text?: string;
    focusArea?: string;
    difficulty?: string;
  }>;
};

const QUESTION_COUNT = 8;

function buildQuestionPrompt(interview: {
  role?: string;
  framework?: string;
  languages?: string[];
  seniority: string;
  focusAreas: string[];
  notes?: string;
}) {
  return `
Generate exactly ${QUESTION_COUNT} distinct technical interview questions.
Context: role=${interview.role || "na"}; level=${interview.seniority}; langs=${(interview.languages ?? []).slice(0, 4).join("/") || "na"}; fw=${interview.framework || "na"}; focus=${(interview.focusAreas ?? []).join("/")}; notes=${interview.notes || "na"}.
Rules: short practical questions (<180 chars), no answers, progressive difficulty, JSON only.
Output:
{"questions":[{"id":"q1","text":"string","focusArea":"string","difficulty":"easy|medium|hard"}]}
`;
}

export async function POST(_: Request, context: Context) {
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
    });
    if (!interview) {
      return NextResponse.json({ error: "Mock interview not found." }, { status: 404 });
    }

    if ((interview.questions ?? []).length > 0) {
      return NextResponse.json({
        questions: interview.questions,
        status: interview.status,
      });
    }

    const prompt = buildQuestionPrompt({
      role: interview.role,
      framework: interview.framework,
      languages: interview.languages,
      seniority: interview.seniority,
      focusAreas: interview.focusAreas,
      notes: interview.notes,
    });

    const generated = await runMockInterviewPrompt<GeneratedQuestions>(prompt);
    const normalized = (generated.data.questions ?? [])
      .map((q, index) => ({
        id: typeof q.id === "string" && q.id.trim() ? q.id.trim() : `q${index + 1}`,
        text: typeof q.text === "string" ? q.text.trim() : "",
        focusArea: typeof q.focusArea === "string" ? q.focusArea.trim() : "",
        difficulty: typeof q.difficulty === "string" ? q.difficulty.trim().toLowerCase() : "medium",
      }))
      .filter((q) => q.text.length > 0)
      .slice(0, QUESTION_COUNT);

    if (normalized.length === 0) {
      return NextResponse.json({ error: "Failed to generate interview questions." }, { status: 422 });
    }

    interview.questions = normalized;
    interview.status = "in_progress";
    if (!interview.startedAt) interview.startedAt = new Date();
    await interview.save();

    return NextResponse.json({
      questions: interview.questions,
      status: interview.status,
      model: generated.model,
    });
  } catch (error) {
    console.error("mock-interviews/ai-mock/start", error);
    return NextResponse.json({ error: "Failed to start AI mock interview." }, { status: 500 });
  }
}
