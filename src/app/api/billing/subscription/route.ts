import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionPublicUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ subscription: user.subscription });
}
