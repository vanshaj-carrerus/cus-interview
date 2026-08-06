"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </motion.div>
  );
}

function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) return "/dashboard";
  if (!nextParam.startsWith("/") || nextParam.startsWith("//")) return "/dashboard";
  return nextParam;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAuthRequiredNotice = searchParams.get("reason") === "auth-required";
  const nextPath = getSafeNextPath(searchParams.get("next"));

  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError) {
      setError(authError);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    if (result.error) {
      setSubmitting(false);
      setError(result.error);
      return;
    }
    // Full navigation so the new session cookie is always sent to middleware on
    // the first request (avoids client transition races with protected `next` URLs).
    window.location.assign(nextPath);
  }

  if (submitting) {
    return <LoginPageLoading />;
  }

  return (
    <section className="section-soft py-16 md:py-24 px-6">
      <div className="max-w-md mx-auto">
        <div className="pro-card p-8 md:p-10">
            <h1 className="text-2xl font-black text-secondary tracking-tight mb-2">
              Log in
            </h1>
            <p className="text-sm text-secondary/70 mb-8">
              Welcome back. Use the email and password for your CareerUs
              account.
            </p>

            {isAuthRequiredNotice ? (
              <p
                className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
                role="status"
              >
                Please log in to access this page.
              </p>
            ) : null}

            <GoogleSignInButton
              nextPath={nextPath}
              onError={setError}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-secondary transition hover:bg-slate-50"
            />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] font-semibold tracking-wider text-slate-400">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error ? (
                <p
                  className="text-sm font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-black uppercase tracking-widest text-secondary/80"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-secondary py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-secondary/70">
              No account yet?{" "}
              <Link
                href="/signup"
                className="font-bold text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
        </div>
      </div>
    </section>
  );
}
