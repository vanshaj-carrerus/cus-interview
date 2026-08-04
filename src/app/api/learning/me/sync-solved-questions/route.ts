import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import {
  getUserSolvedQuestionIds,
  recordCompilerQuestionSolve,
} from "@/lib/learning/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getSessionPublicUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { questionIds?: unknown };
    const questionIds = Array.isArray(body.questionIds)
      ? body.questionIds.map(String).filter(Boolean)
      : [];

    if (questionIds.length === 0) {
      const existing = await getUserSolvedQuestionIds(user.id);
      return NextResponse.json({ synced: 0, questionIds: existing });
    }

    let newlySynced = 0;
    let skipped = 0;
    for (const questionId of questionIds) {
      try {
        const result = await recordCompilerQuestionSolve({
          userId: user.id,
          questionId,
        });
        if (result?.tracked && !result.alreadySolved) {
          newlySynced += 1;
        } else if (!result) {
          skipped += 1;
        }
      } catch (error) {
        console.error("sync-solved-questions item", questionId, error);
        skipped += 1;
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/practice-problems");

    const questionIdsAfterSync = await getUserSolvedQuestionIds(user.id);
    return NextResponse.json({
      synced: newlySynced,
      skipped,
      questionIds: questionIdsAfterSync,
    });
  } catch (error) {
    console.error("learning/me/sync-solved-questions", error);
    return NextResponse.json({ error: "Failed to sync solved questions." }, { status: 500 });
  }
}
