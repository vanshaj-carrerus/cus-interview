import { NextResponse } from "next/server";
import { clearAuthCookieOnResponse } from "@/lib/auth-cookie";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookieOnResponse(response);
  return response;
}
