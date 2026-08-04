import crypto from "crypto";

const GMAIL_AVATAR_COLORS = [
  "#1a73e8",
  "#d93025",
  "#188038",
  "#e37400",
  "#9334e6",
  "#007b83",
  "#c5221f",
  "#137333",
];

const PLACEHOLDER_AVATAR_PATTERNS = [
  "ui-avatars.com",
  "avatar.vercel.sh",
  "robohash.org",
  "api.dicebear.com",
  "unavatar.io/fallback",
  "api.unavatar.io/fallback",
];

function isGoogleEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return domain === "gmail.com" || domain === "googlemail.com";
}

export function getUserInitials(name: string, email: string): string {
  const trimmed = name.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }

  const local = email.split("@")[0] ?? "U";
  return local.slice(0, 2).toUpperCase();
}

export function getAvatarFallbackColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GMAIL_AVATAR_COLORS[Math.abs(hash) % GMAIL_AVATAR_COLORS.length];
}

export function isPlaceholderAvatarUrl(url: string): boolean {
  const normalized = url.trim().toLowerCase();
  if (!normalized) return true;
  return PLACEHOLDER_AVATAR_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function isRealAvatarUrl(url: string): boolean {
  const normalized = url.trim();
  if (!normalized || isPlaceholderAvatarUrl(normalized)) return false;
  return (
    normalized.includes("googleusercontent.com") ||
    normalized.includes("gravatar.com/avatar/") ||
    normalized.includes("cloudinary.com") ||
    normalized.startsWith("https://")
  );
}

export function getGravatarUrl(email: string): string {
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash("md5").update(normalized).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=256&d=404`;
}

export function getUserAvatarUrl(email: string): string {
  const normalized = email.trim().toLowerCase();

  if (isGoogleEmail(normalized)) {
    return `https://unavatar.io/google/${encodeURIComponent(normalized)}`;
  }

  return getGravatarUrl(normalized);
}

export function getUserAvatarCandidates(
  email: string,
  storedUrl?: string | null
): string[] {
  const normalized = email.trim().toLowerCase();
  const candidates: string[] = [];

  if (storedUrl?.trim() && isRealAvatarUrl(storedUrl)) {
    candidates.push(storedUrl.trim());
  }

  if (isGoogleEmail(normalized)) {
    candidates.push(
      `https://unavatar.io/google/${encodeURIComponent(normalized)}`
    );
  }

  candidates.push(getGravatarUrl(normalized));

  return [...new Set(candidates)];
}

/** Client-safe avatar list without Node crypto (for dashboard top bar, etc.). */
export function getClientAvatarCandidates(
  email: string,
  storedUrl?: string | null
): string[] {
  const urls: string[] = [];
  if (storedUrl?.trim() && isRealAvatarUrl(storedUrl)) {
    urls.push(storedUrl.trim());
  }

  const normalized = email.trim().toLowerCase();
  if (isGoogleEmail(normalized)) {
    urls.push(`https://unavatar.io/google/${encodeURIComponent(normalized)}`);
  }

  return urls;
}

export async function resolveUserAvatarUrl(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();

  if (isGoogleEmail(normalized)) {
    try {
      const response = await fetch(
        `https://unavatar.io/google/${encodeURIComponent(normalized)}?json`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = (await response.json()) as { url?: string; type?: string };
        if (
          data.url &&
          isRealAvatarUrl(data.url) &&
          !isPlaceholderAvatarUrl(data.url) &&
          (data.type === "google" || data.url.includes("googleusercontent.com"))
        ) {
          return data.url;
        }
      }
    } catch {
      // fall through to gravatar
    }
  }

  const gravatarUrl = getGravatarUrl(normalized);
  try {
    const response = await fetch(gravatarUrl, { method: "HEAD", cache: "no-store" });
    if (response.ok) {
      return gravatarUrl;
    }
  } catch {
    // ignore
  }

  return null;
}
