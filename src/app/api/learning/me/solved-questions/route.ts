import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserSolvedQuestionIds } from "@/lib/learning/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionPublicUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const questionIds = await getUserSolvedQuestionIds(user.id);
    return NextResponse.json({ questionIds });
  } catch (error) {
    console.error("learning/me/solved-questions", error);
    return NextResponse.json({ error: "Failed to fetch solved questions." }, { status: 500 });
  }
}
