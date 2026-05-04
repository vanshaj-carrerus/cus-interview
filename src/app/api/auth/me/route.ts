import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionPublicUser();
  return NextResponse.json({ user });
}
