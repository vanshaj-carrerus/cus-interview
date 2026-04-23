import { NextResponse } from "next/server";
import { attemptQuestion, verifyQuestionWithoutTracking } from "@/lib/learning/service";
import { getSessionPublicUser } from "@/lib/get-session-user";

type Props = {
  params: Promise<{ questionId: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const { questionId } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const answer = (body.answer ?? null) as string | number | string[] | null;
    const latencyMs = Number(body.latencyMs ?? 0);
    const sessionUser = await getSessionPublicUser();
    const result = sessionUser
      ? await attemptQuestion({
          userId: sessionUser.id,
          questionId,
          answer,
          latencyMs: Number.isFinite(latencyMs) && latencyMs > 0 ? latencyMs : undefined,
        })
      : await verifyQuestionWithoutTracking({
          questionId,
          answer,
        });

    if (!result) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("learning/question/attempt", error);
    return NextResponse.json({ error: "Failed to submit attempt." }, { status: 500 });
  }
}
