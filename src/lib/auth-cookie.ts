import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_MAX_AGE_SECONDS, createSessionToken } from "@/lib/auth-token";
import type { UserDocument } from "@/models/User";

export const AUTH_COOKIE_NAME = "cus_session";

export function setAuthCookieOnResponse(
  response: NextResponse,
  token: string
): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookieOnResponse(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function setAuthCookieFromUser(
  response: NextResponse,
  user: UserDocument
): Promise<void> {
  const token = await createSessionToken({
    sub: user._id.toString(),
    email: user.email,
  });
  setAuthCookieOnResponse(response, token);
}

export async function getAuthTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value;
}
