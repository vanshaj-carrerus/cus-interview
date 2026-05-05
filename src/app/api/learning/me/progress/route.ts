import { NextResponse } from "next/server";
import { logLearningProgress } from "@/lib/learning-progress-debug";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserLearningProfile } from "@/lib/learning/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      logLearningProgress("me-progress", "GET unauthorized (no session)");
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const profile = await getUserLearningProfile(sessionUser.id, sessionUser.name || sessionUser.email);
    logLearningProgress("me-progress", "GET profile", {
      userIdSnippet: `${sessionUser.id.slice(0, 8)}…`,
      languageRows: profile.languages.length,
      totalQuestionsAttempted: profile.totals.totalQuestionsAttempted,
      totalCleared: profile.totals.totalCleared,
    });
    return NextResponse.json({ progress: profile.languages, totals: profile.totals });
  } catch (error) {
    console.error("learning/me/progress", error);
    return NextResponse.json({ error: "Failed to fetch progress." }, { status: 500 });
  }
}
