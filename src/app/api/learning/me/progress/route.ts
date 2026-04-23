import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserLearningProfile } from "@/lib/learning/service";

export async function GET() {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const profile = await getUserLearningProfile(sessionUser.id, sessionUser.name || sessionUser.email);
    return NextResponse.json({ progress: profile.languages, totals: profile.totals });
  } catch (error) {
    console.error("learning/me/progress", error);
    return NextResponse.json({ error: "Failed to fetch progress." }, { status: 500 });
  }
}
