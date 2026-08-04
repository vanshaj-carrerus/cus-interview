import { cookies } from "next/headers";
import crypto from "crypto";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";
const STATE_MAX_AGE_SECONDS = 60 * 10;

type OAuthStatePayload = {
  state: string;
  nextPath: string;
};

function encodePayload(payload: OAuthStatePayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string): OAuthStatePayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    ) as OAuthStatePayload;
    if (!parsed.state || typeof parsed.nextPath !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createGoogleOAuthState(nextPath: string): {
  state: string;
  cookieValue: string;
} {
  const state = crypto.randomBytes(24).toString("hex");
  return {
    state,
    cookieValue: encodePayload({ state, nextPath }),
  };
}

export async function setGoogleOAuthStateCookie(cookieValue: string): Promise<void> {
  const store = await cookies();
  store.set(GOOGLE_OAUTH_STATE_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

export async function consumeGoogleOAuthState(
  stateFromQuery: string
): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  store.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (!raw) return null;
  const payload = decodePayload(raw);
  if (!payload || payload.state !== stateFromQuery) return null;
  return payload.nextPath;
}

export async function clearGoogleOAuthStateCookie(): Promise<void> {
  const store = await cookies();
  store.delete(GOOGLE_OAUTH_STATE_COOKIE);
}
