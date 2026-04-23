import { NextResponse } from "next/server";
import { getTrackBySlug } from "@/lib/learning/service";

type Props = {
  params: Promise<{ trackSlug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const { trackSlug } = await params;
    const result = await getTrackBySlug(trackSlug);
    if (!result) {
      return NextResponse.json({ error: "Track not found." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("learning/track", error);
    return NextResponse.json({ error: "Failed to fetch track." }, { status: 500 });
  }
}
