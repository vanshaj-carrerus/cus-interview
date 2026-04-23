import { NextResponse } from "next/server";
import { listLanguages } from "@/lib/learning/service";

export async function GET() {
  try {
    const languages = await listLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error("learning/languages", error);
    return NextResponse.json({ error: "Failed to fetch languages." }, { status: 500 });
  }
}
