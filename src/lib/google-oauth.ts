export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
};

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

export function getAppOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  return "http://localhost:3000";
}

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function getGoogleRedirectUri(): string {
  return `${getAppOrigin()}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string): string {
  const config = getGoogleOAuthConfig();
  if (!config) {
    throw new Error("Google OAuth is not configured.");
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", getGoogleRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export async function exchangeGoogleAuthCode(code: string): Promise<{ access_token: string }> {
  const config = getGoogleOAuthConfig();
  if (!config) {
    throw new Error("Google OAuth is not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    cache: "no-store",
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: getGoogleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Google authorization code.");
  }

  return (await response.json()) as { access_token: string };
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Google profile.");
  }

  return (await response.json()) as GoogleUserInfo;
}

export function getSafeNextPath(nextParam: string | null | undefined): string {
  if (!nextParam) return "/dashboard";
  if (!nextParam.startsWith("/") || nextParam.startsWith("//")) return "/dashboard";
  return nextParam;
}
