"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthModalView = "login" | "signup";

type DashboardAuthModalContextValue = {
  view: AuthModalView | null;
  openLogin: () => void;
  openSignup: () => void;
  close: () => void;
  switchToLogin: () => void;
  switchToSignup: () => void;
};

const DashboardAuthModalContext = createContext<DashboardAuthModalContextValue | null>(null);

export function DashboardAuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthModalView | null>(null);

  const openLogin = useCallback(() => setView("login"), []);
  const openSignup = useCallback(() => setView("signup"), []);
  const close = useCallback(() => setView(null), []);
  const switchToLogin = useCallback(() => setView("login"), []);
  const switchToSignup = useCallback(() => setView("signup"), []);

  const value = useMemo(
    () => ({ view, openLogin, openSignup, close, switchToLogin, switchToSignup }),
    [view, openLogin, openSignup, close, switchToLogin, switchToSignup]
  );

  return (
    <DashboardAuthModalContext.Provider value={value}>{children}</DashboardAuthModalContext.Provider>
  );
}

export function useDashboardAuthModal() {
  const ctx = useContext(DashboardAuthModalContext);
  if (!ctx) {
    throw new Error("useDashboardAuthModal must be used within DashboardAuthModalProvider");
  }
  return ctx;
}

export function useOptionalDashboardAuthModal() {
  return useContext(DashboardAuthModalContext);
}
