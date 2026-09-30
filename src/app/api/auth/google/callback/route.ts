import { NextRequest, NextResponse } from "next/server";
import { setAuthCookieFromUser } from "@/lib/auth-cookie";
import { findOrCreateGoogleUser } from "@/lib/find-or-create-google-user";
import {
  exchangeGoogleAuthCode,
  fetchGoogleUserInfo,
  getGoogleRedirectUri,
  getOAuthOrigin,
  getSafeNextPath,
} from "@/lib/google-oauth";
import {
  clearGoogleOAuthStateCookie,
  consumeGoogleOAuthState,
} from "@/lib/google-oauth-state";

function redirectWithError(request: NextRequest, message: string, nextPath: string) {
  const redirectUrl = new URL(nextPath, request.nextUrl.origin);
  redirectUrl.searchParams.set("auth_error", message);
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const fallbackNext = "/dashboard";

  if (error) {
    await clearGoogleOAuthStateCookie();
    return redirectWithError(
      request,
      "Google sign-in was cancelled. Please try again.",
      fallbackNext
    );
  }

  if (!code || !state) {
    await clearGoogleOAuthStateCookie();
    return redirectWithError(
      request,
      "Google sign-in failed. Missing authorization data.",
      fallbackNext
    );
  }

  const consumed = await consumeGoogleOAuthState(state);
  const nextPath = consumed?.nextPath ?? fallbackNext;
  const redirectUri =
    consumed?.redirectUri ?? getGoogleRedirectUri(getOAuthOrigin(request));

  try {
    const token = await exchangeGoogleAuthCode(code, redirectUri);
    const googleUser = await fetchGoogleUserInfo(token.access_token);
    const user = await findOrCreateGoogleUser(googleUser);

    const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin));
    await setAuthCookieFromUser(response, user);
    return response;
  } catch (err) {
    console.error("google/callback", err);
    await clearGoogleOAuthStateCookie();
    const message =
      err instanceof Error
        ? err.message
        : "Google sign-in failed. Please try again.";
    return redirectWithError(request, message, getSafeNextPath(nextPath));
  }
}
