"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function ForDeveloperPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    isStudent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.github.trim()) {
      newErrors.github = "GitHub profile is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call for the application
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const developerFeatures = [
    {
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      title: "Advanced Tooling",
      description: "Access enterprise-grade IDEs, specialized mock interviews, and solve real-world system design challenges.",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-sky-500" />,
      title: "Detailed Skill Analytics",
      description: "Get granular insights into code quality, execution speed, edge-case coverage, and peer rankings.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      title: "Interview Prep Suite",
      description: "Practice with proctored assessments, get AI feedback on your code, and track your progress over time.",
    },
    {
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      title: "Developer Community",
      description: "Share evaluation reports, learn from team notes, and connect with other engineers to land jobs 3x faster.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-0 pb-20 overflow-x-hidden">
      {/* Top Banner Header Background */}
        <div className="relative overflow-hidden bg-[#091526] text-white py-16 md:py-20 mb-12">
          {/* Decorative Grid & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.2),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Supercharge Your Engineering Career with AI
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Assess your skills fairly, eliminate interview anxiety, and land top engineering roles with confidence.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Developer Benefits */}
            <div className="lg:col-span-6 space-y-8 pt-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Why Developers Choose CUS Interview
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed font-medium">
                  Our platform streamlines your engineering journey from initial learning to final round evaluations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {developerFeatures.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Form Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl relative">
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Application Submitted!
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-md mx-auto">
                      Thank you for applying, <span className="font-semibold text-slate-900">{formData.name}</span>. Our team will review your GitHub profile and get back to you at <span className="font-semibold text-slate-900">{formData.email}</span> with an invite link soon.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-md"
                      >
                        Back to Home <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Form Header */}
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 mb-3">
                        <Zap className="h-3.5 w-3.5 text-amber-700" /> Developer Access
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Apply for Developer Access
                      </h2>
                      <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                        Tell us a bit about yourself! Get in touch with our friendly team and we'll get back to you soon.
                      </p>
                    </div>

                    {/* Form Inputs */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="dev-name" className="block text-sm font-semibold text-slate-800 mb-1">
                          Name
                        </label>
                        <input
                          id="dev-name"
                          type="text"
                          placeholder="Enter Full Name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                            errors.name
                              ? "border-red-400 focus:ring-red-300"
                              : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                      </div>

                      {/* Work Email ID */}
                      <div>
                        <label htmlFor="dev-email" className="block text-sm font-semibold text-slate-800 mb-1">
                          Work Email ID
                        </label>
                        <input
                          id="dev-email"
                          type="email"
                          placeholder="Enter work email ID*"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                            errors.email
                              ? "border-red-400 focus:ring-red-300"
                              : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                      </div>

                      {/* Phone number */}
                      <div>
                        <label htmlFor="dev-phone" className="block text-sm font-semibold text-slate-800 mb-1">
                          Phone number
                        </label>
                        <input
                          id="dev-phone"
                          type="tel"
                          placeholder="Enter phone number*"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: "" });
                          }}
                          className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                            errors.phone
                              ? "border-red-400 focus:ring-red-300"
                              : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                          }`}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                      </div>

                      {/* GitHub Profile */}
                      <div>
                        <label htmlFor="dev-github" className="block text-sm font-semibold text-slate-800 mb-1">
                          GitHub Profile / Portfolio
                        </label>
                        <input
                          id="dev-github"
                          type="text"
                          placeholder="github.com/username*"
                          value={formData.github}
                          onChange={(e) => {
                            setFormData({ ...formData, github: e.target.value });
                            if (errors.github) setErrors({ ...errors, github: "" });
                          }}
                          className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                            errors.github
                              ? "border-red-400 focus:ring-red-300"
                              : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                          }`}
                        />
                        {errors.github && <p className="mt-1 text-xs text-red-500">{errors.github}</p>}
                      </div>

                      {/* Student/Job Seeker Checkbox */}
                      <div className="pt-1">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
                          <input
                            type="checkbox"
                            checked={formData.isStudent}
                            onChange={(e) =>
                              setFormData({ ...formData, isStudent: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <span>I am a Student/Job Seeker</span>
                        </label>
                      </div>

                      {/* Privacy policy note */}
                      <p className="text-xs leading-relaxed text-slate-500 pt-1">
                        By clicking on &quot;Submit Application&quot;, you acknowledge having read our{" "}
                        <Link href="/privacy" className="font-semibold text-slate-700 underline hover:text-slate-900">
                          Privacy Policy
                        </Link>
                        .
                      </p>

                      {/* Submit CTA */}
                      <div className="pt-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex items-center justify-center rounded-xl bg-[#a33318] hover:bg-[#8a2912] px-6 py-4 text-base font-bold text-white shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#a33318] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
