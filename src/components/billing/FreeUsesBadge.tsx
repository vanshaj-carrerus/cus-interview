"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import type { CreditFeature } from "@/types/auth";

const FEATURE_LABEL: Record<CreditFeature, string> = {
  mockInterview: "AI mock interviews",
  resumeAnalyzer: "Resume analyses",
};

/** Header badge showing coupon free uses left for a feature. Hidden for plan users and users without credits. */
export default function FreeUsesBadge({ feature }: { feature: CreditFeature }) {
  const { user } = useAuth();
  const credits = user?.subscription.featureCredits?.[feature];
  // Plan users are unlimited unless their free-access coupon capped this feature.
  const planLimited = Boolean(user?.subscription.featureCredits?.planLimited);

  if (
    !user ||
    user.role === "SuperAdmin" ||
    (user.subscription.hasPlatformAccess && !planLimited) ||
    !credits ||
    credits.total <= 0
  ) {
    return null;
  }

  const usedUp = credits.remaining <= 0;
  const expiresAt = user.subscription.featureCredits?.expiresAt;

  return (
    <div
      className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm ${
        usedUp
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
        {FEATURE_LABEL[feature]}
      </p>
      <p className="mt-0.5 text-lg font-bold leading-tight">
        {credits.remaining} / {credits.total} left
      </p>
      {usedUp ? (
        <Link href="/pricing" className="text-xs font-semibold underline">
          {planLimited ? "Upgrade for unlimited access" : "Buy a plan for unlimited"}
        </Link>
      ) : expiresAt ? (
        <p className="text-xs opacity-70">
          Valid till{" "}
          {new Date(expiresAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      ) : null}
    </div>
  );
}
