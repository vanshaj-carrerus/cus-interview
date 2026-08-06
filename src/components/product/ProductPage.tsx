"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "🤖",
    tag: "AI-Powered",
    title: "Smart Mock Interviews",
    description:
      "Experience realistic, adaptive interview sessions powered by cutting-edge AI. Get instant, personalized feedback on your answers, communication style, and technical depth.",
    highlights: ["Adaptive difficulty", "Real-time feedback", "Industry-specific questions"],
    color: "from-[#4ba3e3] to-[#6c5ce7]",
    accent: "#4ba3e3",
  },
  {
    icon: "💻",
    tag: "Live Compiler",
    title: "In-Browser Code Editor",
    description:
      "Solve coding challenges in our powerful in-browser IDE with multi-language support, syntax highlighting, and instant execution — just like the real interview environment.",
    highlights: ["15+ languages", "Instant execution", "Interview-grade problems"],
    color: "from-[#0ea5a4] to-[#4ba3e3]",
    accent: "#0ea5a4",
  },
  {
    icon: "📊",
    tag: "Analytics",
    title: "Personalized Learning Paths",
    description:
      "Our AI analyzes your performance across sessions and builds a tailored roadmap that plugs your skill gaps — so you always improve where it matters most.",
    highlights: ["Skill gap analysis", "Progress tracking", "Curated resources"],
    color: "from-[#6c5ce7] to-[#e67e22]",
    accent: "#6c5ce7",
  },
  {
    icon: "🔍",
    tag: "Resume AI",
    title: "Resume Analyzer",
    description:
      "Paste your resume and get an ATS score, keyword suggestions, and impact-driven rewrites — all powered by AI that knows what top recruiters look for.",
    highlights: ["ATS optimization", "Keyword suggestions", "AI rewrites"],
    color: "from-[#e67e22] to-[#e74c3c]",
    accent: "#e67e22",
  },
  {
    icon: "🏢",
    tag: "For Companies",
    title: "Automated Candidate Screening",
    description:
      "Streamline hiring with automated technical assessments. Get detailed candidate reports, skill scores, and head-to-head comparisons — saving your team hundreds of hours.",
    highlights: ["Bulk assessments", "Detailed reports", "Team collaboration"],
    color: "from-[#3b82f6] to-[#0ea5a4]",
    accent: "#3b82f6",
  },
  {
    icon: "🏆",
    tag: "Practice",
    title: "Curated Problem Bank",
    description:
      "Access a growing library of 500+ problems tagged by company, role, and difficulty. Practice exactly what you'll face in interviews at FAANG, startups, and everything in between.",
    highlights: ["500+ problems", "Company-tagged", "Difficulty levels"],
    color: "from-[#e74c3c] to-[#6c5ce7]",
    accent: "#e74c3c",
  },
];

const stats = [
  { value: "10K+", label: "Developers trained", icon: "👨‍💻" },
  { value: "500+", label: "Coding problems", icon: "🧩" },
  { value: "95%", label: "Interview success rate", icon: "🎯" },
  { value: "200+", label: "Companies hiring", icon: "🏢" },
];

const testimonials = [
  {
    quote:
      "CUS Interview's mock AI sessions were scarily close to my actual Meta interview. Landed the offer after just 3 weeks of prep.",
    name: "Arjun Mehta",
    role: "Software Engineer @ Meta",
    avatar: "AM",
    color: "#4ba3e3",
  },
  {
    quote:
      "The resume analyzer bumped my ATS score from 52 to 91. I started getting callbacks from companies that had ghosted me before.",
    name: "Priya Sharma",
    role: "Full-Stack Dev @ Razorpay",
    avatar: "PS",
    color: "#6c5ce7",
  },
  {
    quote:
      "We cut our screening time by 70% using CUS Interview for candidate assessments. The reports are incredibly detailed.",
    name: "Rohan Gupta",
    role: "Engineering Manager @ Flipkart",
    avatar: "RG",
    color: "#0ea5a4",
  },
];

export default function ProductPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        {/* Background blobs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(75,163,227,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(108,92,231,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4ba3e3]/30 bg-[#4ba3e3]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#4ba3e3]">
            ✦ The Complete Interview OS
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0f172a] sm:text-5xl md:text-6xl">
            Everything you need to{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #4ba3e3 0%, #6c5ce7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ace any interview
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#475569] leading-relaxed">
            From AI mock interviews to live coding practice, resume analysis to company screening —
            CUS Interview is the single platform that turns developers into top candidates and helps
            companies hire faster.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#4ba3e3] px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#4ba3e3]/30 transition-all hover:bg-[#3a8fd4] hover:shadow-[#4ba3e3]/40 hover:-translate-y-0.5"
            >
              Start for free <span>→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0f172a]/15 bg-white px-8 py-3.5 text-[15px] font-semibold text-[#0f172a] transition-all hover:border-[#4ba3e3]/40 hover:-translate-y-0.5"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center p-2">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-3xl font-extrabold text-[#0f172a]">{s.value}</span>
                <span className="text-sm text-[#64748b]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Deep-dive ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
              Built for every stage of your journey
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#64748b]">
              Six powerful modules. One seamless platform. No jumping between tools.
            </p>
          </div>

          {/* Tab selector */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {features.map((f, i) => (
              <button
                key={f.title}
                onClick={() => setActiveFeature(i)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeFeature === i
                    ? "bg-[#0f172a] text-white shadow-md"
                    : "border border-slate-200 bg-white text-[#475569] hover:border-[#4ba3e3]/40 hover:text-[#4ba3e3]"
                }`}
              >
                <span>{f.icon}</span> {f.tag}
              </button>
            ))}
          </div>

          {/* Active feature card */}
          {features.map((f, i) =>
            activeFeature === i ? (
              <div
                key={f.title}
                className="grid gap-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-lg lg:grid-cols-2 lg:p-12"
              >
                {/* Left */}
                <div className="flex flex-col justify-center">
                  <span
                    className="mb-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                    style={{ background: `linear-gradient(135deg, ${f.accent}, #0f172a)` }}
                  >
                    {f.icon} {f.tag}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">{f.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-[#475569]">{f.description}</p>
                  <ul className="mt-6 space-y-3">
                    {f.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3 text-sm font-medium text-[#0f172a]">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs"
                          style={{ background: f.accent }}
                        >
                          ✓
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  {f.tag === "For Companies" ? (
                    <Link
                      href="/for-companies"
                      className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: `linear-gradient(135deg, ${f.accent} 0%, #0f172a 200%)` }}
                    >
                      Request Demo <span>→</span>
                    </Link>
                  ) : (
                    <Link
                      href="/signup"
                      className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: `linear-gradient(135deg, ${f.accent} 0%, #0f172a 200%)` }}
                    >
                      Try it free <span>→</span>
                    </Link>
                  )}
                </div>

                {/* Right: decorative visual */}
                <div className="flex items-center justify-center">
                  <div
                    className="relative h-64 w-full max-w-sm rounded-2xl lg:h-80"
                    style={{
                      background: `linear-gradient(135deg, ${f.accent}18 0%, ${f.accent}08 100%)`,
                      border: `1.5px solid ${f.accent}30`,
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl opacity-20"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${f.accent} 0%, transparent 70%)`,
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <span className="text-7xl drop-shadow-lg">{f.icon}</span>
                      <div
                        className="rounded-xl px-4 py-2 text-lg font-bold text-white"
                        style={{ background: f.accent }}
                      >
                        {f.tag}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
              All features at a glance
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-[#f8fafc] p-6 transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${f.accent}12 0%, ${f.accent}04 100%)`,
                  }}
                />
                <div className="relative">
                  <span className="text-4xl">{f.icon}</span>
                  <span
                    className="mt-3 mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ background: f.accent }}
                  >
                    {f.tag}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-[#0f172a]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
              Loved by developers & teams
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#64748b]">
              Real stories from people who levelled up with CUS Interview.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="absolute top-0 left-0 h-1 w-full rounded-t-2xl"
                  style={{ background: t.color }}
                />
                <p className="text-sm leading-relaxed text-[#475569]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{t.name}</p>
                    <p className="text-xs text-[#64748b]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div
            className="relative overflow-hidden rounded-3xl p-10 text-center text-white md:p-16"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f2744 100%)",
            }}
          >
            {/* Blobs */}
            <div
              className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, #4ba3e3 0%, transparent 70%)", filter: "blur(50px)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #6c5ce7 0%, transparent 70%)", filter: "blur(50px)" }}
            />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to land your dream role?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/75">
                Join thousands of developers who already use CUS Interview to sharpen their skills and
                impress top recruiters.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-[#4ba3e3] px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#4ba3e3]/30 transition-all hover:bg-[#3a8fd4] hover:-translate-y-0.5"
                >
                  Get started free <span>→</span>
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-8 py-3.5 text-[15px] font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:-translate-y-0.5"
                >
                  See plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
