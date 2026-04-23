import { NextResponse } from "next/server";
import { listTracksByLanguageSlug } from "@/lib/learning/service";

type Props = {
  params: Promise<{ languageSlug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const { languageSlug } = await params;
    const kindParam = new URL(_.url).searchParams.get("kind");
    const kind = kindParam === "track" || kindParam === "course" ? kindParam : undefined;
    const result = await listTracksByLanguageSlug(languageSlug, kind);
    if (!result) {
      return NextResponse.json({ error: "Language not found." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("learning/language/tracks", error);
    return NextResponse.json({ error: "Failed to fetch tracks." }, { status: 500 });
  }
}
