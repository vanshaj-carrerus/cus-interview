import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import type { PublicUser } from "@/types/auth";

export async function requirePlatformAccess(nextPath?: string): Promise<PublicUser> {
  const user = await getSessionPublicUser();

  if (!user) {
    const next = encodeURIComponent(nextPath ?? "/pricing");
    redirect(`/login?reason=auth-required&next=${next}`);
  }

  if (user.role === "SuperAdmin" || user.subscription.hasPlatformAccess) {
    return user;
  }

  redirect("/pricing?reason=subscription-required");
}

export async function getPlatformAccessSession(): Promise<
  { user: PublicUser } | { error: NextResponse }
> {
  const user = await getSessionPublicUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  if (user.role === "SuperAdmin" || user.subscription.hasPlatformAccess) {
    return { user };
  }

  return {
    error: NextResponse.json(
      {
        error:
          "Subscribe to the monthly or quarterly plan to access this feature.",
        code: "SUBSCRIPTION_REQUIRED",
      },
      { status: 403 }
    ),
  };
}
