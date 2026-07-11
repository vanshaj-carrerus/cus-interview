import { NextResponse } from "next/server";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";
import { getUserLearningProfile } from "@/lib/learning/service";

export async function GET() {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }
    const sessionUser = access.user;
    const profile = await getUserLearningProfile(sessionUser.id, sessionUser.name || sessionUser.email);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("learning/me/profile", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}
