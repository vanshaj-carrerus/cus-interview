"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password/send-code", {
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
        const base = data.error ?? "Could not send reset code.";
        const detail = data.detail ? ` ${data.detail}` : "";
        setError(`${base}${detail}`.trim());
        setSubmitting(false);
        return;
      }

      setInfo(
        data.message ??
          "If an account exists for this email, we sent a 6-digit reset code."
      );
      setStep("reset");
      setCode("");
    } catch {
      setError("Could not send reset code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ email, code, password }),
      });
      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not reset password.");
        setSubmitting(false);
        return;
      }

      await refreshUser();
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not reset password.");
      setSubmitting(false);
    }
  }

  async function handleResendCode() {
    setError(null);
    setInfo(null);
    setResendBusy(true);

    try {
      const res = await fetch("/api/auth/forgot-password/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not resend code.");
        return;
      }

      setInfo(data.message ?? "A new reset code was sent.");
      setCode("");
    } catch {
      setError("Could not resend code.");
    } finally {
      setResendBusy(false);
    }
  }

  return (
    <section className="section-soft py-16 md:py-24 px-6">
      <div className="max-w-md mx-auto">
        <div className="pro-card p-8 md:p-10">
          <h1 className="text-2xl font-black text-secondary tracking-tight mb-2">
            Forgot password
          </h1>
          <p className="text-sm text-secondary/70 mb-8">
            {step === "email"
              ? "Enter your account email and we will send a 6-digit reset code."
              : `Enter the code we sent to ${email}, then choose a new password.`}
          </p>

          {step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-5">
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
                  htmlFor="forgot-email"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Email
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-secondary py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Sending code…" : "Send reset code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {info ? (
                <p
                  className="text-sm font-medium text-sky-900 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2"
                  role="status"
                >
                  {info}
                </p>
              ) : null}
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
                  htmlFor="forgot-code"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Reset code
                </label>
                <input
                  id="forgot-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                  title="6-digit code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-[0.35em] font-mono text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="forgot-password"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  New password
                </label>
                <input
                  id="forgot-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
                <p className="mt-1.5 text-xs text-secondary/60">
                  At least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="forgot-confirm-password"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Confirm new password
                </label>
                <input
                  id="forgot-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-secondary py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Resetting password…" : "Reset password"}
              </button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={submitting || resendBusy}
                  onClick={() => void handleResendCode()}
                  className="w-full text-center text-xs font-bold text-primary hover:underline disabled:opacity-50"
                >
                  {resendBusy ? "Sending…" : "Resend code"}
                </button>
                <button
                  type="button"
                  disabled={submitting || resendBusy}
                  onClick={() => {
                    setStep("email");
                    setError(null);
                    setCode("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full text-center text-xs font-bold text-secondary/70 hover:text-primary"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-secondary/70">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
