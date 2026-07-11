import { NextResponse } from "next/server";
import { logLearningProgress } from "@/lib/learning-progress-debug";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";
import { getUserLearningProfile } from "@/lib/learning/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      logLearningProgress("me-progress", "GET unauthorized (no session)");
      return access.error;
    }
    const sessionUser = access.user;
    const profile = await getUserLearningProfile(sessionUser.id, sessionUser.name || sessionUser.email);
    console.info("[cus-learning:api/me/progress]", {
      userIdSnippet: `${sessionUser.id.slice(0, 8)}…`,
      languageRows: profile.languages.length,
      totals: profile.totals,
      trackSlugs: profile.languages.flatMap((l) => l.tracks.map((t) => t.trackSlug)),
    });
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
