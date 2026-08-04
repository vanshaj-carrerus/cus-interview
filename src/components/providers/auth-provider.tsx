"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PublicUser } from "@/types/auth";
import {
  clearLocalProgressCache,
  hydrateUserProgressFromServer,
  UserProgressHydrator,
} from "@/hooks/use-sync-solved-questions";

type CompleteSignupFields = {
  email: string;
  code: string;
  password: string;
  name?: string;
};

type AuthResult = { error?: string; message?: string };

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  sendSignupCode: (email: string) => Promise<AuthResult>;
  completeSignup: (fields: CompleteSignupFields) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchSessionUser(): Promise<
  | { status: "ok"; user: PublicUser | null }
  | { status: "unauthorized" }
  | { status: "unknown" }
> {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "same-origin",
      cache: "no-store",
    });
    const data = (await res.json()) as { user?: PublicUser | null };
    if (res.status === 401) {
      return { status: "unauthorized" };
    }
    if (!res.ok) {
      return { status: "unknown" };
    }
    return { status: "ok", user: data.user ?? null };
  } catch {
    return { status: "unknown" };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const result = await fetchSessionUser();
    if (result.status === "ok") {
      setUser(result.user);
    } else if (result.status === "unauthorized") {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void fetchSessionUser().then((result) => {
      if (cancelled) return;
      if (result.status === "ok") {
        setUser(result.user);
        if (result.user) {
          void hydrateUserProgressFromServer();
        }
      } else if (result.status === "unauthorized") {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as { error?: string; user?: PublicUser };
        if (!res.ok) {
          return { error: data.error ?? "Login failed." };
        }
        if (data.user) {
          setUser(data.user);
          void hydrateUserProgressFromServer();
          return {};
        }
        const me = await fetchSessionUser();
        if (me.status === "ok") {
          setUser(me.user);
          if (me.user) {
            void hydrateUserProgressFromServer();
          }
        }
        return {};
      } catch {
        return { error: "Login failed." };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const sendSignupCode = useCallback(async (email: string) => {
    const res = await fetch("/api/auth/signup/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as {
      error?: string;
      message?: string;
      detail?: string;
    };
    if (!res.ok) {
      const base = data.error ?? "Could not send verification email.";
      const detail = data.detail ? ` ${data.detail}` : "";
      return { error: `${base}${detail}`.trim() };
    }
    return { message: data.message };
  }, []);

  const completeSignup = useCallback(async (fields: CompleteSignupFields) => {
    const res = await fetch("/api/auth/signup/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify(fields),
    });
    const data = (await res.json()) as { error?: string; user?: PublicUser };
    if (!res.ok) {
      return { error: data.error ?? "Could not create account." };
    }
    if (data.user) {
      setUser(data.user);
      void hydrateUserProgressFromServer();
    }
    return {};
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    });
    clearLocalProgressCache();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      login,
      sendSignupCode,
      completeSignup,
      logout,
    }),
    [user, loading, refreshUser, login, sendSignupCode, completeSignup, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      <UserProgressHydrator userId={user?.id} />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
