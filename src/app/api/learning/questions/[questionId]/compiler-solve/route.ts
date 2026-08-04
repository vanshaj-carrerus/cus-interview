import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { recordCompilerQuestionSolve } from "@/lib/learning/service";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ questionId: string }>;
};

export async function POST(_: Request, { params }: Props) {
  try {
    const user = await getSessionPublicUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { questionId } = await params;
    const result = await recordCompilerQuestionSolve({
      userId: user.id,
      questionId,
    });

    if (!result) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    if (result.tracked) {
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/practice-problems");
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("learning/question/compiler-solve", error);
    return NextResponse.json({ error: "Failed to record solve." }, { status: 500 });
  }
}
