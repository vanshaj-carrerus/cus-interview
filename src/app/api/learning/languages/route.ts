import { NextResponse } from "next/server";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";
import { listLanguages } from "@/lib/learning/service";

export async function GET() {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }

    const languages = await listLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error("learning/languages", error);
    return NextResponse.json({ error: "Failed to fetch languages." }, { status: 500 });
  }
}
