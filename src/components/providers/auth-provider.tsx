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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    const data = (await res.json()) as { user?: PublicUser | null };
    return data.user ?? null;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const nextUser = await fetchCurrentUser();
      setUser(nextUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    let cancelled = false;

    void fetchCurrentUser()
      .then((nextUser) => {
        if (!cancelled) {
          setUser(nextUser);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as { error?: string; user?: PublicUser };
        if (!res.ok) {
          return { error: data.error ?? "Login failed." };
        }
        if (data.user) {
          setUser(data.user);
          return {};
        }
        const nextUser = await fetchCurrentUser();
        setUser(nextUser);
        return {};
      } catch {
        return { error: "Login failed." };
      } finally {
        setLoading(false);
      }
    },
    [fetchCurrentUser]
  );

  const sendSignupCode = useCallback(async (email: string) => {
    const res = await fetch("/api/auth/signup/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
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
      body: JSON.stringify(fields),
    });
    const data = (await res.json()) as { error?: string; user?: PublicUser };
    if (!res.ok) {
      return { error: data.error ?? "Could not create account." };
    }
    if (data.user) {
      setUser(data.user);
    }
    return {};
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
