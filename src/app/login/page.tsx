"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageContent />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAuthRequiredNotice = searchParams.get("reason") === "auth-required";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <section className="section-soft py-16 md:py-24 px-6">
      <div className="max-w-md mx-auto">
        <div className="pro-card p-8 md:p-10">
          <h1 className="text-2xl font-black text-secondary tracking-tight mb-2">
            Log in
          </h1>
          <p className="text-sm text-secondary/70 mb-8">
            Welcome back. Use the email and password for your CareerUs account.
          </p>

          {isAuthRequiredNotice ? (
            <p
              className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
              role="status"
            >
              Please log in to access this page.
            </p>
          ) : null}

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
              <label
                htmlFor="login-password"
                className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
              >
                Password
              </label>
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
