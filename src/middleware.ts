import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { verifySessionToken } from "@/lib/auth-token";

const AUTH_REQUIRED_PREFIXES = ["/practice", "/problems", "/mock-interviews"];
const ADMIN_REQUIRED_PREFIXES = ["/admin-panel", "/api/admin-panel", "/api/learning/admin"];

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const GUEST_ONLY_PATHS = ["/login", "/signup"] as const;

function isGuestOnlyPath(pathname: string): boolean {
  return (GUEST_ONLY_PATHS as readonly string[]).includes(pathname);
}

/** Same rules as login page: only same-origin relative paths. */
function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) return "/";
  if (!nextParam.startsWith("/") || nextParam.startsWith("//")) return "/";
  return nextParam;
}

function loginRedirect(request: NextRequest): NextResponse {
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", next);
  loginUrl.searchParams.set("reason", "auth-required");
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isGuestOnlyPath(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.next();
    }
    try {
      await verifySessionToken(token);
      if (pathname === "/login") {
        const dest = getSafeNextPath(request.nextUrl.searchParams.get("next"));
        return NextResponse.redirect(new URL(dest, request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    } catch {
      return NextResponse.next();
    }
  }

  const needsAuth = matchesPrefix(pathname, AUTH_REQUIRED_PREFIXES) || matchesPrefix(pathname, ADMIN_REQUIRED_PREFIXES);
  const needsSuperAdmin = matchesPrefix(pathname, ADMIN_REQUIRED_PREFIXES);

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    return loginRedirect(request);
  }

  try {
    const session = await verifySessionToken(token);
    if (needsSuperAdmin && session.role !== "SuperAdmin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    return loginRedirect(request);
  }
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/practice/:path*",
    "/problems/:path*",
    "/mock-interviews/:path*",
    "/admin-panel/:path*",
    "/api/admin-panel/:path*",
    "/api/learning/admin/:path*",
  ],
};
