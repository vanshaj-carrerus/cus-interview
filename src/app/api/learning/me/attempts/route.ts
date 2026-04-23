import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserAttempts } from "@/lib/learning/service";

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const limitParam = new URL(request.url).searchParams.get("limit");
    const parsedLimit = Number(limitParam ?? "100");
    const attempts = await getUserAttempts(
      sessionUser.id,
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 100
    );
    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("learning/me/attempts", error);
    return NextResponse.json({ error: "Failed to fetch attempts." }, { status: 500 });
  }
}
