"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export function useSubscriptionGate() {
  const { user, loading } = useAuth();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const hasPlatformAccess =
    user?.role === "SuperAdmin" ||
    Boolean(user?.subscription.hasPlatformAccess);

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
    loading,
  };
}
