import { NextResponse } from "next/server";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";
import { getQuestionPublic } from "@/lib/learning/service";

type Props = {
  params: Promise<{ questionId: string }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }

    const { questionId } = await params;
    const question = await getQuestionPublic(questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }
    return NextResponse.json({ question });
  } catch (error) {
    console.error("learning/question", error);
    return NextResponse.json({ error: "Failed to fetch question." }, { status: 500 });
  }
}
