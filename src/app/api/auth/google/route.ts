import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleAuthUrl,
  getGoogleOAuthConfig,
  getSafeNextPath,
} from "@/lib/google-oauth";
import {
  createGoogleOAuthState,
  setGoogleOAuthStateCookie,
} from "@/lib/google-oauth-state";

export async function GET(request: NextRequest) {
  const config = getGoogleOAuthConfig();
  if (!config) {
    const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));
    const redirectUrl = new URL(nextPath, request.nextUrl.origin);
    redirectUrl.searchParams.set(
      "auth_error",
      "Google sign-in is not configured yet. Please use email login."
    );
    return NextResponse.redirect(redirectUrl);
  }

  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));
  const { state, cookieValue } = createGoogleOAuthState(nextPath);
  await setGoogleOAuthStateCookie(cookieValue);

  return NextResponse.redirect(buildGoogleAuthUrl(state));
}
