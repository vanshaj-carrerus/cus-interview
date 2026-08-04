"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/components/providers/auth-provider";
import { useDashboardAuthModal } from "./dashboard-auth-modal-provider";

type SignupStep = "email" | "verify";

function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-[11px] font-semibold tracking-wider text-slate-400">
          OR CONTINUE WITH EMAIL
        </span>
      </div>
    </div>
  );
}

export default function DashboardAuthModal() {
  const { view, close, switchToLogin, switchToSignup } = useDashboardAuthModal();
  const { login, sendSignupCode, completeSignup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [signupStep, setSignupStep] = useState<SignupStep>("email");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [resendBusy, setResendBusy] = useState(false);

  useEffect(() => {
    if (!view) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setError(null);
      setInfo(null);
      setSubmitting(false);
      setSignupStep("email");
      setName("");
      setCode("");
      setResendBusy(false);
    }
  }, [view]);

  useEffect(() => {
    if (!view) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [view, close]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (!authError) return;

    setError(authError);
    switchToLogin();

    const url = new URL(window.location.href);
    url.searchParams.delete("auth_error");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [switchToLogin]);

  if (!view) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    if (result.error) {
      setSubmitting(false);
      setError(result.error);
      return;
    }
    window.location.assign("/dashboard");
  }

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
    setInfo(result.message ?? "Verification code sent.");
    setSignupStep("verify");
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
    window.location.assign("/dashboard");
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
    setInfo(result.message ?? "Verification code sent.");
    setCode("");
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.2)]"
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-7 pb-7 pt-8">
          {view === "login" ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-secondary">Log in</h2>
              <p className="mt-1.5 text-sm text-slate-500">To continue, log in to your account</p>

              <div className="mt-6">
                <GoogleSignInButton nextPath="/dashboard" onError={setError} />
              </div>

              <Divider />

              <form onSubmit={handleLogin} className="space-y-4">
                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <div>
                  <label htmlFor="modal-login-email" className="mb-1.5 block text-sm font-semibold text-secondary">
                    Email Address
                  </label>
                  <input
                    id="modal-login-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>

                <div>
                  <label htmlFor="modal-login-password" className="mb-1.5 block text-sm font-semibold text-secondary">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="modal-login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-secondary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Logging in…" : "Log in"}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  onClick={close}
                  className="text-slate-500 transition hover:text-secondary"
                >
                  Forgotten Password?
                </Link>
                <p className="text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToSignup}
                    className="font-semibold text-secondary hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-secondary">Sign up</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                {signupStep === "email"
                  ? "Create your account to access the dashboard"
                  : `Enter the code sent to ${email}`}
              </p>

              <div className="mt-6">
                <GoogleSignInButton nextPath="/dashboard" onError={setError} />
              </div>

              <Divider />

              {signupStep === "email" ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  {error ? (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <div>
                    <label htmlFor="modal-signup-email" className="mb-1.5 block text-sm font-semibold text-secondary">
                      Email Address
                    </label>
                    <input
                      id="modal-signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending code…" : "Continue"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteSignup} className="space-y-4">
                  {info ? (
                    <p className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900" role="status">
                      {info}
                    </p>
                  ) : null}
                  {error ? (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <div>
                    <label htmlFor="modal-signup-code" className="mb-1.5 block text-sm font-semibold text-secondary">
                      Verification code
                    </label>
                    <input
                      id="modal-signup-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono tracking-[0.3em] text-secondary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-signup-name" className="mb-1.5 block text-sm font-semibold text-secondary">
                      Name <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      id="modal-signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-signup-password" className="mb-1.5 block text-sm font-semibold text-secondary">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="modal-signup-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-secondary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Creating account…" : "Sign up"}
                  </button>

                  <div className="flex justify-between text-xs">
                    <button
                      type="button"
                      disabled={resendBusy}
                      onClick={() => void handleResendCode()}
                      className="font-semibold text-primary hover:underline disabled:opacity-50"
                    >
                      {resendBusy ? "Sending…" : "Resend code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignupStep("email");
                        setError(null);
                        setCode("");
                      }}
                      className="text-slate-500 hover:text-secondary"
                    >
                      Change email
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="font-semibold text-secondary hover:underline"
                >
                  Log in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
