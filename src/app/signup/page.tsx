"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

type Step = "email" | "verify";

export default function SignupPage() {
  const router = useRouter();
  const { sendSignupCode, completeSignup } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const result = await sendSignupCode(email);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(result.message ?? null);
    setStep("verify");
    setCode("");
  }

  async function handleCompleteSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await completeSignup({
      email,
      code,
      password,
      name: name.trim() || undefined,
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleResendCode() {
    setError(null);
    setInfo(null);
    setResendBusy(true);
    const result = await sendSignupCode(email);
    setResendBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(result.message ?? null);
    setCode("");
  }

  return (
    <section className="section-soft py-16 md:py-24 px-6">
      <div className="max-w-md mx-auto">
        <div className="pro-card p-8 md:p-10">
          <h1 className="text-2xl font-black text-secondary tracking-tight mb-2">
            Create account
          </h1>
          <p className="text-sm text-secondary/70 mb-8">
            {step === "email"
              ? "Enter your email and we will send a 6-digit verification code."
              : `We sent a code to ${email}. Enter the code, then choose a password.`}
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
                  htmlFor="signup-email"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Email
                </label>
                <input
                  id="signup-email"
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
                {submitting ? "Sending code…" : "Send verification code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCompleteSignup} className="space-y-5">
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
                  htmlFor="signup-code"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Verification code
                </label>
                <input
                  id="signup-code"
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
                  htmlFor="signup-name"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Name{" "}
                  <span className="font-normal normal-case tracking-normal text-secondary/50">
                    (optional)
                  </span>
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-black uppercase tracking-widest text-secondary/80 mb-2"
                >
                  Password
                </label>
                <input
                  id="signup-password"
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-secondary py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Creating account…" : "Verify and sign up"}
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
                  }}
                  className="w-full text-center text-xs font-bold text-secondary/70 hover:text-primary"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-secondary/70">
            Already have an account?{" "}
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
