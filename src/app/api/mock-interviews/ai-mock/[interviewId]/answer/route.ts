import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { AiMockInterview } from "@/models/AiMockInterview";
import { runMockInterviewPrompt } from "@/lib/ai/mock-interview-engine";

type Context = {
  params: Promise<{ interviewId: string }>;
};

type Body = {
  questionId?: unknown;
  answer?: unknown;
};

type EvaluationResult = {
  scoreOutOf10?: number;
  verdict?: "correct" | "partially_correct" | "incorrect";
  strengths?: string[];
  gaps?: string[];
};

function buildEvaluationPrompt(input: {
  question: string;
  answer: string;
  role?: string;
  seniority: string;
  languages: string[];
  framework?: string;
}) {
  return `
Strictly score this answer.
Context: role=${input.role || "na"}; level=${input.seniority}; lang=${input.languages.slice(0, 2).join("/") || "na"}; fw=${input.framework || "na"}.
Q: ${input.question}
A: ${input.answer}
Return JSON only:
{"scoreOutOf10":0-10,"verdict":"correct|partially_correct|incorrect","strengths":["max 2 short points"],"gaps":["max 2 short points"]}
`;
}

export async function POST(request: Request, context: Context) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as Body;
    const questionId = typeof body.questionId === "string" ? body.questionId.trim() : "";
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";

    if (!questionId || !answer) {
      return NextResponse.json({ error: "Question and answer are required." }, { status: 400 });
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

    const question = (interview.questions ?? []).find((item) => item.id === questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found for this interview." }, { status: 404 });
    }

    const prompt = buildEvaluationPrompt({
      question: question.text,
      answer,
      role: interview.role,
      seniority: interview.seniority,
      languages: interview.languages ?? [],
      framework: interview.framework,
    });
    const evaluated = await runMockInterviewPrompt<EvaluationResult>(prompt);
    const scoreRaw = Number(evaluated.data.scoreOutOf10);
    const scoreOutOf10 = Number.isFinite(scoreRaw) ? Math.max(0, Math.min(10, scoreRaw)) : 0;
    const verdict =
      evaluated.data.verdict === "correct" ||
      evaluated.data.verdict === "partially_correct" ||
      evaluated.data.verdict === "incorrect"
        ? evaluated.data.verdict
        : scoreOutOf10 >= 8
          ? "correct"
          : scoreOutOf10 >= 5
            ? "partially_correct"
            : "incorrect";

    const responseItem = {
      questionId,
      answer,
      scoreOutOf10,
      verdict,
      strengths: Array.isArray(evaluated.data.strengths) ? evaluated.data.strengths.slice(0, 2) : [],
      gaps: Array.isArray(evaluated.data.gaps) ? evaluated.data.gaps.slice(0, 2) : [],
      provider: evaluated.model,
      answeredAt: new Date(),
    };

    const existingIndex = (interview.responses ?? []).findIndex((item) => item.questionId === questionId);
    if (existingIndex >= 0) {
      interview.responses[existingIndex]?.set(responseItem);
    } else {
      interview.responses.push(responseItem);
    }

    const totalQuestions = (interview.questions ?? []).length;
    const answeredQuestions = (interview.responses ?? []).length;
    if (totalQuestions > 0 && answeredQuestions >= totalQuestions) {
      interview.status = "completed";
      if (!interview.completedAt) interview.completedAt = new Date();
    } else {
      interview.status = "in_progress";
    }
    if (!interview.startedAt) interview.startedAt = new Date();
    await interview.save();

    const scores = (interview.responses ?? []).map((item) => item.scoreOutOf10);
    const averageScoreOutOf10 =
      scores.length > 0 ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)) : 0;

    return NextResponse.json({
      evaluation: responseItem,
      progress: {
        answered: answeredQuestions,
        total: totalQuestions,
        averageScoreOutOf10,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error("mock-interviews/ai-mock/answer", error);
    return NextResponse.json({ error: "Failed to evaluate interview answer." }, { status: 500 });
  }
}
