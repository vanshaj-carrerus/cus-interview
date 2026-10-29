"use client";

import { useState } from "react";
import Link from "next/link";
import FeatureShowcaseCard from "@/components/companies/FeatureShowcaseCard";
import {
  Building2,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Mail,
  Phone,
  User,
} from "lucide-react";

export default function ForCompaniesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    isStudent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // OTP states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Work Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else {
      const freeEmailDomains = [
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
        "aol.com", "icloud.com", "protonmail.com", "zoho.com",
        "yandex.com", "mail.com", "gmx.com"
      ];
      const domain = formData.email.split("@")[1]?.toLowerCase();
      if (domain && freeEmailDomains.includes(domain)) {
        newErrors.email = "Please use a work email address";
      }
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.isStudent && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setOtpError("");
    setOtpMessage("");

    try {
      const res = await fetch("/api/company/demo-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setErrors({ ...errors, email: data.error || "Failed to send verification code" });
        setIsSubmitting(false);
        return;
      }
      
      setOtpMessage(data.message || "Code sent successfully");
      setOtpStep(true);
    } catch (err) {
      setErrors({ ...errors, email: "Failed to send verification code" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    
    try {
      const res = await fetch("/api/company/demo-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          code: otpCode,
          name: formData.name,
          phone: formData.phone,
          companyName: formData.companyName,
          isStudent: formData.isStudent
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Invalid code");
        setIsVerifying(false);
        return;
      }
      
      setIsVerifying(false);
      setOtpStep(false);
      setIsSubmitted(true);
    } catch (err) {
      setOtpError("Failed to verify code");
      setIsVerifying(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
    }`;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white pb-24">
      {/* Fine dots + soft glow, as on the landing page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(rgba(100,116,139,0.18) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 60% 70% at 50% 0%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 0%, black 20%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-sky-100/70 blur-3xl"
        aria-hidden
      />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 pb-12 pt-16 text-center md:pt-20">
        <h1 className="font-serif text-4xl leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-5xl md:text-6xl">
          Accelerate Technical Hiring with{" "}
          <em className="italic text-sky-600">Structured AI Assessments</em>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
          Assess candidates fairly, eliminate screening fatigue, and hire top engineering talent with confidence.
        </p>
      </section>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Left: feature showcase */}
        <FeatureShowcaseCard />

        {/* Right: demo form */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)] sm:p-8">
          {isSubmitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="font-serif text-3xl tracking-[-0.02em] text-slate-950">Demo request submitted</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
                Thank you for getting in touch, <span className="font-semibold text-slate-900">{formData.name}</span>.
                Our enterprise team will reach out to you at{" "}
                <span className="font-semibold text-slate-900">{formData.email}</span> within 24 hours to schedule your
                personalized demo.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : otpStep ? (
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                <Mail className="h-3.5 w-3.5" /> Email verification
              </span>
              <h2 className="mt-4 font-serif text-3xl tracking-[-0.02em] text-slate-950">Verify your email</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {otpMessage || `We sent a 6-digit code to ${formData.email}`}
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="otp-code" className="mb-1.5 block text-sm font-medium text-slate-800">
                    Verification code
                  </label>
                  <input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setOtpError("");
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-center font-mono text-lg tracking-[0.5em] text-slate-900 placeholder:text-slate-300 transition focus:outline-none focus:ring-4 ${
                      otpError
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                    }`}
                  />
                  {otpError && <p className="mt-2 text-center text-sm text-red-500">{otpError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpCode.length !== 6}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify & submit"
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setOtpCode("");
                      setOtpError("");
                    }}
                    className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                <Building2 className="h-3.5 w-3.5" /> Enterprise demo
              </span>
              <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-slate-950">
                Sign up for a demo of <em className="whitespace-nowrap font-serif font-normal italic text-sky-600">CUS Interview</em> for
                Enterprises
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                You&apos;ll get a personalised demo. Get in touch with our friendly team and we&apos;ll get back to you
                soon.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="company-name" className="mb-1.5 block text-sm font-medium text-slate-800">
                    Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="company-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className={inputClass(Boolean(errors.name))}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Work email */}
                <div>
                  <label htmlFor="company-email" className="mb-1.5 block text-sm font-medium text-slate-800">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="company-email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={inputClass(Boolean(errors.email))}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone + company side by side */}
                <div className={`grid gap-4 ${formData.isStudent ? "" : "sm:grid-cols-2"}`}>
                  <div>
                    <label htmlFor="company-phone" className="mb-1.5 block text-sm font-medium text-slate-800">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="company-phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                        className={inputClass(Boolean(errors.phone))}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
  
                  {/* Company */}
                  {!formData.isStudent && (
                    <div>
                      <label htmlFor="company-org" className="mb-1.5 block text-sm font-medium text-slate-800">
                        Company name
                      </label>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="company-org"
                          type="text"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => {
                            setFormData({ ...formData, companyName: e.target.value });
                            if (errors.companyName) setErrors({ ...errors, companyName: "" });
                          }}
                          className={inputClass(Boolean(errors.companyName))}
                        />
                      </div>
                      {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
                    </div>
                  )}
                </div>

                <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={formData.isStudent}
                    onChange={(e) => setFormData({ ...formData, isStudent: e.target.checked })}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
                  />
                  I am a student / job seeker
                </label>

                <p className="text-xs leading-relaxed text-slate-500">
                  By clicking &quot;Access Free Demo&quot;, you acknowledge having read our{" "}
                  <Link href="/privacy" className="font-medium text-slate-800 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Access Free Demo"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
