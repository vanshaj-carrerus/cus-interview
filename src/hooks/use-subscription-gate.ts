"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import type { CreditFeature } from "@/types/auth";

/**
 * Pass `feature` on pages a coupon's free uses unlock (mock interview, resume analyzer):
 * users with credits left for it get through without a plan.
 */
export function useSubscriptionGate(feature?: CreditFeature) {
  const { user, loading } = useAuth();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const featureCredits =
    feature ? user?.subscription.featureCredits?.[feature] ?? null : null;

  const hasPlan =
    user?.role === "SuperAdmin" || Boolean(user?.subscription.hasPlatformAccess);
  const hasPlatformAccess =
    hasPlan || Boolean(featureCredits && featureCredits.total > 0);
  /** Uses of `feature` count against coupon credits (no plan, or a capped free-access plan). */
  const creditLimited =
    user?.role !== "SuperAdmin" &&
    Boolean(featureCredits && featureCredits.total > 0) &&
    (!user?.subscription.hasPlatformAccess ||
      Boolean(user?.subscription.featureCredits?.planLimited));

  const closePaywall = useCallback(() => setPaywallOpen(false), []);

  const checkAccess = useCallback(
    (onAllowed: () => void) => {
      if (loading) {
        return;
      }

      if (!user) {
        const next = encodeURIComponent(
          `${window.location.pathname}${window.location.search}`
        );
        window.location.href = `/login?reason=auth-required&next=${next}`;
        return;
      }

      if (hasPlatformAccess) {
        onAllowed();
        return;
      }

      setPaywallOpen(true);
    },
    [user, loading, hasPlatformAccess]
  );

  const gatedNavigate = useCallback(
    (href: string) => {
      checkAccess(() => {
        window.location.href = href;
      });
    },
    [checkAccess]
  );

  return {
    paywallOpen,
    closePaywall,
    openPaywall: () => setPaywallOpen(true),
    checkAccess,
    gatedNavigate,
    hasPlatformAccess,
    /** Full plan (or admin), as opposed to access through coupon free uses only. */
    hasPlan,
    /** Coupon free uses for `feature`, when the user has any. */
    featureCredits,
    creditLimited,
    loading,
  };
}
