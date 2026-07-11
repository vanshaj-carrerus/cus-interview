import { NextResponse } from "next/server";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";
import { getTrackLevelContent } from "@/lib/learning/service";

type Props = {
  params: Promise<{ trackSlug: string; levelNumber: string }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }

    const { trackSlug, levelNumber } = await params;
    const parsedLevel = Number(levelNumber);
    if (!Number.isFinite(parsedLevel) || parsedLevel < 1) {
      return NextResponse.json({ error: "Invalid level number." }, { status: 400 });
    }
    const result = await getTrackLevelContent(trackSlug, parsedLevel);
    if (!result) {
      return NextResponse.json({ error: "Level not found." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("learning/track/level", error);
    return NextResponse.json({ error: "Failed to fetch level." }, { status: 500 });
  }
}
