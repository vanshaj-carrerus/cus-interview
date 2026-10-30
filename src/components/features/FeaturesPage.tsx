"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Check,
  Code,
  FileCheck2,
  GraduationCap,
  ListChecks,
  Terminal,
  Users,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  id: string;
  group: string;
  title: string;
  tagline: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
  icon: LucideIcon;
  /* solid pastel panel — same set as the landing page cards */
  bg: string;
  chips: string[];
};

const FEATURES: Feature[] = [
  {
    id: "practice-problems",
    group: "Practice",
    title: "Practice Problems",
    tagline: "Build problem-solving skills, one topic at a time.",
    description:
      "Handpicked coding challenges organised into topic tracks and difficulty levels. Pick a track, solve problems in the built-in compiler, and watch your progress update on your dashboard.",
    points: [
      "Topic tracks — arrays, strings, math, stacks & queues, design and more",
      "Easy → Medium → Hard levels inside every track",
      "Solve right in the browser with the built-in compiler",
      "Solved problems are saved to your dashboard stats",
    ],
    href: "/dashboard/practice-problems",
    cta: "Open Practice Problems",
    icon: Code,
    bg: "bg-sky-200",
    chips: ["Topic tracks", "Difficulty levels", "Progress tracking"],
  },
  {
    id: "dsa-practice",
    group: "Practice",
    title: "DSA Practice",
    tagline: "The core of every technical interview.",
    description:
      "A focused data-structures & algorithms catalogue. Browse every problem track in one place and work through the patterns interviewers ask most.",
    points: [
      "Array, String, Math & Counting, Stack & Queue and Design problem sets",
      "Problems grouped by pattern so concepts build on each other",
      "Every problem opens straight in problem mode with auto-checking",
    ],
    href: "/problems",
    cta: "Browse DSA problems",
    icon: ListChecks,
    bg: "bg-emerald-200",
    chips: ["Pattern-based", "Auto-checked", "All tracks"],
  },
  {
    id: "interview-prep",
    group: "Practice",
    title: "Interview Prep",
    tagline: "Your personalised learning hub.",
    description:
      "The Practice Hub turns preparation into a roadmap. Choose a domain and follow a structured path instead of guessing what to study next.",
    points: [
      "Roadmap-based learning paths by domain",
      "Structured lessons that lead from basics to interview level",
      "Pick up exactly where you left off",
    ],
    href: "/practice",
    cta: "Open Interview Prep",
    icon: GraduationCap,
    bg: "bg-amber-200",
    chips: ["Roadmaps", "By domain", "Self-paced"],
  },
  {
    id: "programming-languages",
    group: "Learn",
    title: "Programming Languages & Courses",
    tagline: "Master the languages your target role needs.",
    description:
      "Career tracks and language quizzes in one place. Follow a role-based track or jump into any language and test yourself as you go.",
    points: [
      "Career tracks that bundle the right languages for a role",
      "Language quizzes and mastery courses — e.g. .NET, ASP.NET Core, AWS",
      "Completion progress shown for every course",
    ],
    href: "/dashboard/programming-languages",
    cta: "Open Programming Languages",
    icon: BookOpen,
    bg: "bg-violet-200",
    chips: ["Career tracks", "Quizzes", "Mastery courses"],
  },
  {
    id: "compiler",
    group: "Code",
    title: "Online Compiler",
    tagline: "Write and run code instantly — no setup.",
    description:
      "A full in-browser code editor with multiple languages and custom input. In problem mode it judges your solution in three steps: it runs your code, checks the output, then reviews your full method's logic before accepting it.",
    points: [
      "JavaScript, Python, Java and C++",
      "Custom input (stdin) and LeetCode-style function solutions",
      "3-step judge: runs → output check → logic review",
      "Hard-coded answers are caught by the logic review",
    ],
    href: "/dashboard/compiler",
    cta: "Open the Compiler",
    icon: Terminal,
    bg: "bg-sky-200",
    chips: ["Multi-language", "Custom input", "Smart judge"],
  },
  {
    id: "ai-mock-interview",
    group: "Interview",
    title: "AI Mock Interviews",
    tagline: "Practice with an interviewer that never gets tired.",
    description:
      "Sit a realistic interview with an AI interviewer. It asks role-specific questions, follows up on your answers, and gives you a structured feedback report at the end.",
    points: [
      "Choose your role and round before you start",
      "Adaptive follow-up questions, just like a real interviewer",
      "Instant feedback on clarity, depth and trade-offs",
    ],
    href: "/dashboard/ai-mock-interview",
    cta: "Start an AI mock interview",
    icon: Bot,
    bg: "bg-rose-200",
    chips: ["Role-based", "Follow-ups", "Feedback report"],
  },
  {
    id: "company-questions",
    group: "Interview",
    title: "Company Interview Questions",
    tagline: "Prepare with questions from real interview rounds.",
    description:
      "Questions organised by company and round, so you know what to expect before the real thing — from coding rounds to system design and HR.",
    points: [
      "Data structures & algorithms rounds",
      "System design for senior roles — scalability, caching, databases",
      "Behavioral & HR rounds using the STAR method",
      "Language-specific deep dives — Java, Python, JavaScript",
    ],
    href: "/dashboard/company-interviews",
    cta: "Open Company Questions",
    icon: Briefcase,
    bg: "bg-amber-200",
    chips: ["By company", "By round", "Real patterns"],
  },
  {
    id: "mock-interviews",
    group: "Interview",
    title: "Mock Interviews for Teams",
    tagline: "AI-run interviews companies can trust.",
    description:
      "For companies: full AI technical interviews that test candidates, adapt in real time, probe for depth, flag suspicious behaviour, and deliver evidence-based reports.",
    points: [
      "Adaptive AI interviewer for technical roles",
      "Integrity checks that flag suspicious behaviour",
      "Evidence-based candidate reports for hiring teams",
    ],
    href: "/mock-interviews",
    cta: "See Mock Interviews",
    icon: Users,
    bg: "bg-violet-200",
    chips: ["For companies", "Integrity checks", "Reports"],
  },
  {
    id: "resume-analyzer",
    group: "Career",
    title: "Resume Analyzer",
    tagline: "Get past the ATS and in front of recruiters.",
    description:
      "Upload your resume and get an ATS score, the keywords you're missing, and AI-powered tips to improve it — in seconds.",
    points: [
      "Upload a PDF or DOCX",
      "ATS score with keyword-gap analysis",
      "Actionable AI tips to strengthen every section",
    ],
    href: "/dashboard/resume-analyzer",
    cta: "Analyze my resume",
    icon: FileCheck2,
    bg: "bg-emerald-200",
    chips: ["ATS score", "Keyword gaps", "AI tips"],
  },
];

const GROUPS = Array.from(new Set(FEATURES.map((f) => f.group)));

const STATS = [
  { value: String(FEATURES.length), label: "Tools in one dashboard" },
  { value: "4", label: "Compiler languages" },
  { value: "3-step", label: "Smart code judge" },
  { value: "24/7", label: "AI interviewer" },
];

/* Mini product window shown on each feature's pastel panel (decorative) */
function FeatureWindow({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        </span>
        <span className="ml-1 truncate text-[11px] font-medium text-slate-400">cusinterview / {feature.id}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 -rotate-3 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{feature.title}</p>
            <p className="text-[11px] text-slate-400">{feature.group}</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {feature.chips.map((chip, i) => (
            <li key={chip} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
              </span>
              <span className="text-xs font-medium text-slate-700">{chip}</span>
              <span className="ml-auto h-1.5 w-12 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-slate-900" style={{ width: `${90 - i * 18}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const [active, setActive] = useState(FEATURES[0].id);
  const [progress, setProgress] = useState(0);

  /* Scroll spy: highlight the topic whose section is in the reading area */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    FEATURES.forEach((f) => {
      const el = document.getElementById(f.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Reading progress through the feature list */
  useEffect(() => {
    const onScroll = () => {
      const list = document.getElementById("feature-list");
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.4 - rect.top) / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = FEATURES.findIndex((f) => f.id === active);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div
          className="pointer-events-none absolute inset-0"
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

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Product tour
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-slate-950 md:text-[4rem]">
              Everything you need to <em className="italic">get hired</em>, in one dashboard
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Practice problems, courses, a smart compiler, AI mock interviews, real company questions and
              resume analysis — here&apos;s what each tool does and how it helps you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Start Practicing <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#feature-list"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Explore features
              </a>
            </div>
          </div>

          {/* Stats */}
          <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-6 py-5 text-center">
                <dt className="font-serif text-3xl text-slate-950">{s.value}</dt>
                <dd className="mt-1 text-xs text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>

          {/* Jump grid, grouped by category */}
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GROUPS.map((group) => (
              <div key={group} className="rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{group}</p>
                <ul className="mt-3 space-y-1.5">
                  {FEATURES.filter((f) => f.group === group).map((f) => {
                    const Icon = f.icon;
                    return (
                      <li key={f.id}>
                        <a
                          href={`#${f.id}`}
                          className="group flex items-center gap-2 text-sm text-slate-700 transition-colors hover:text-slate-950"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-900" />
                          <span className="truncate">{f.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile: sticky horizontal topic bar */}
      <div className="sticky top-16 z-30 border-b border-slate-100 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none]">
          {FEATURES.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active === f.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {f.title}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-16 md:py-24 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Desktop: sticky topic list with progress */}
        <nav className="hidden lg:block" aria-label="Features">
          <div className="sticky top-28">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">On this page</span>
              <span className="tabular-nums">
                {activeIndex + 1}/{FEATURES.length}
              </span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-950 transition-[width] duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="mt-6 space-y-6">
              {GROUPS.map((group) => (
                <div key={group}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{group}</p>
                  <ul className="mt-2 border-l border-slate-200">
                    {FEATURES.filter((f) => f.group === group).map((f) => (
                      <li key={f.id}>
                        <a
                          href={`#${f.id}`}
                          className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                            active === f.id
                              ? "border-slate-950 font-semibold text-slate-950"
                              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          {f.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Feature sections */}
        <div id="feature-list" className="scroll-mt-24 divide-y divide-slate-100">
          {FEATURES.map((f, i) => (
            <section
              key={f.id}
              id={f.id}
              className="grid scroll-mt-28 grid-cols-1 items-center gap-10 py-14 first:pt-0 md:grid-cols-2 md:gap-12"
            >
              <div className={i % 2 ? "md:order-2" : ""}>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-5xl leading-none text-slate-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {f.group}
                  </span>
                </div>
                <h2 className="mt-4 font-serif text-3xl leading-tight tracking-[-0.015em] text-slate-950 md:text-[2.5rem]">
                  {f.title}
                </h2>
                <p className="mt-2 text-base font-medium text-slate-800">{f.tagline}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{f.description}</p>

                <ul className="mt-6 space-y-3">
                  {f.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href={f.href}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  {f.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Pastel panel with a mini product window */}
              <div
                className={`relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[28px] p-8 ${f.bg} ${
                  i % 2 ? "md:order-1" : ""
                }`}
                aria-hidden
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    backgroundImage: "radial-gradient(rgba(15,23,42,0.12) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />
                <div className="relative w-full transition-transform duration-500 hover:-translate-y-1">
                  <div className="flex justify-center">
                    <FeatureWindow feature={f} />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── Closing CTA ── */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-slate-950 px-8 py-14 text-center text-white md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-[90px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]" aria-hidden />
          <h2 className="relative font-serif text-3xl tracking-[-0.02em] md:text-5xl">Ready to get started?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
            Create a free account and open your dashboard to try every tool above.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
            >
              Create a free account
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
