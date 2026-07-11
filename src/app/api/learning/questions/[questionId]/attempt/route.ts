import { NextResponse } from "next/server";
import { logLearningProgress } from "@/lib/learning-progress-debug";
import { attemptQuestion } from "@/lib/learning/service";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ questionId: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }

    const { questionId } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const answer = (body.answer ?? null) as string | number | string[] | null;
    const latencyMs = Number(body.latencyMs ?? 0);
    const sessionUser = access.user;
    const result = await attemptQuestion({
      userId: sessionUser.id,
      questionId,
      answer,
      latencyMs: Number.isFinite(latencyMs) && latencyMs > 0 ? latencyMs : undefined,
    });

    if (!result) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    console.info("[cus-learning:api/question-attempt]", {
      questionId,
      hasSession: true,
      tracked: "tracked" in result ? result.tracked : undefined,
      isCorrect: result.isCorrect,
      attemptId: result.attemptId,
    });
    logLearningProgress("question-attempt", "POST completed", {
      questionId,
      hasSession: true,
      userIdSnippet: `${sessionUser.id.slice(0, 8)}…`,
      tracked: "tracked" in result ? result.tracked : undefined,
      isCorrect: result.isCorrect,
      attemptId: result.attemptId,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("learning/question/attempt", error);
    return NextResponse.json({ error: "Failed to submit attempt." }, { status: 500 });
  }
}
