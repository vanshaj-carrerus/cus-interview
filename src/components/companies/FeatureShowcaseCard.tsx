"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, ShieldCheck, Users, Zap, type LucideIcon } from "lucide-react";

const AUTOPLAY_MS = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Shared dark window ─────────────────────────────────────── */

function DarkWindow({
  title,
  badge,
  children,
}: {
  title: ReactNode;
  badge: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 text-left shadow-[0_30px_60px_-30px_rgba(15,23,42,0.6)] ring-1 ring-white/5">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        {title}
        <span className="ml-auto">{badge}</span>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function Dots() {
  return (
    <span className="flex gap-1">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
    </span>
  );
}

function Badge({ children, tone = "emerald" }: { children: ReactNode; tone?: "emerald" | "sky" | "violet" }) {
  const tones = {
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
    sky: "bg-sky-400/10 text-sky-300 ring-sky-400/30",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/* ─── Previews ───────────────────────────────────────────────── */

function ScreeningPreview() {
  const lines: [string, string][][] = [
    [["def ", "text-violet-300"], ["eval_stream", "text-sky-300"], ["(nodes):", "text-slate-300"]],
    [["    # Distributed autonomous evaluation", "text-slate-500"]],
    [["    cluster = ", "text-slate-300"], ["ClusterRunner", "text-amber-300"], ["(workers=16)", "text-slate-300"]],
    [["    return ", "text-violet-300"], ["cluster.validate(nodes)", "text-slate-300"]],
  ];
  return (
    <DarkWindow
      title={
        <>
          <Dots />
          <span className="ml-2 font-mono text-[11px] text-slate-400">assessment.py</span>
        </>
      }
      badge={<Badge>14/14 Tests Passed</Badge>}
    >
      <div className="space-y-1 font-mono text-[12px] leading-relaxed">
        {lines.map((line, i) => (
          <p key={i} className="whitespace-pre">
            {line.map(([text, color], j) => (
              <span key={j} className={color}>
                {text}
              </span>
            ))}
          </p>
        ))}
      </div>
    </DarkWindow>
  );
}

function AnalyticsPreview() {
  const bars = [
    { label: "Algorithms & Complexity", value: 96 },
    { label: "Architecture & System Design", value: 94 },
  ];
  return (
    <DarkWindow
      title={
        <>
          <Dots />
          <span className="ml-2 font-mono text-[11px] text-slate-400">benchmark_summary.ts</span>
        </>
      }
      badge={<span className="font-mono text-[11px] font-semibold text-sky-300">Score 96.6</span>}
    >
      <div className="space-y-4">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> {bar.label}
              </span>
              <span className="font-mono text-sky-300">{bar.value}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                initial={{ width: 0 }}
                animate={{ width: `${bar.value}%` }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>
    </DarkWindow>
  );
}

function WorkflowPreview() {
  const rows = [
    { label: "System Architecture", score: "4.8" },
    { label: "Code Elegance & Clean Architecture", score: "4.9" },
    { label: "Live Collaboration & Problem Solving", score: "5.0" },
  ];
  return (
    <DarkWindow
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex -space-x-1.5">
            {[
              ["SL", "bg-violet-500"],
              ["TK", "bg-sky-500"],
              ["MR", "bg-rose-500"],
            ].map(([initials, bg]) => (
              <span
                key={initials}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-slate-950 ${bg}`}
              >
                {initials}
              </span>
            ))}
          </span>
          <span>
            <span className="block text-[11px] font-semibold text-white">Hiring Committee</span>
            <span className="block text-[10px] text-slate-500">3 reviewers aligned</span>
          </span>
        </span>
      }
      badge={<Badge>Strong Hire 3/3</Badge>}
    >
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> {row.label}
            </span>
            <span className="font-mono text-violet-300">
              {row.score} <span className="text-slate-600">/ 5.0</span>
            </span>
          </div>
        ))}
      </div>
    </DarkWindow>
  );
}

function IntegrityPreview() {
  const tiles = [
    { label: "Session focus", value: "100% Verified" },
    { label: "Input cadence", value: "Authentic Human" },
  ];
  const rhythm = [40, 70, 35, 85, 50, 65, 30, 75, 45, 60, 38, 80, 52, 68, 42, 72];
  return (
    <DarkWindow
      title={
        <span className="flex items-center gap-2 text-[11px] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" /> Telemetry Monitor
        </span>
      }
      badge={<Badge>0 Anomalies</Badge>}
    >
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-lg bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/5">
            <p className="text-[10px] text-slate-500">{tile.label}</p>
            <p className="mt-0.5 font-mono text-[12px] font-semibold text-white">{tile.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-lg bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-500">Keystroke rhythm</span>
          <span className="font-mono text-emerald-300">Normal</span>
        </div>
        <div className="mt-2 flex h-6 items-center gap-[3px]">
          {rhythm.map((h, i) => (
            <motion.span
              key={i}
              className="w-1 origin-center rounded-full bg-emerald-400/80"
              style={{ height: `${h}%` }}
              animate={{ scaleY: [1, 0.45, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.12 }}
            />
          ))}
        </div>
      </div>
    </DarkWindow>
  );
}

/* ─── Slides ─────────────────────────────────────────────────── */

type Slide = {
  tab: string;
  chip: string;
  icon: LucideIcon;
  title: [string, string];
  description: string;
  /* soft gradient behind the card, chip colour, accent colour */
  bg: string;
  chipClass: string;
  accent: string;
  preview: ReactNode;
};

const SLIDES: Slide[] = [
  {
    tab: "Screening",
    chip: "Screening engine",
    icon: Zap,
    title: ["Automated Initial", "Screening"],
    description:
      "Filter and shortlist candidates automatically with hyper-accurate, unbiased technical challenges.",
    bg: "bg-[linear-gradient(160deg,#ede9fe_0%,#fce7f3_55%,#fdf2f8_100%)]",
    chipClass: "text-violet-700 ring-violet-200",
    accent: "text-pink-600",
    preview: <ScreeningPreview />,
  },
  {
    tab: "Analytics",
    chip: "Skill analytics",
    icon: BarChart3,
    title: ["Detailed", "Skill Analytics"],
    description:
      "A multidimensional rubric across execution speed, distributed systems, clean patterns and edge-case resilience.",
    bg: "bg-[linear-gradient(160deg,#e0f2fe_0%,#cffafe_55%,#f0f9ff_100%)]",
    chipClass: "text-sky-700 ring-sky-200",
    accent: "text-sky-600",
    preview: <AnalyticsPreview />,
  },
  {
    tab: "Workflows",
    chip: "Collaborative workflows",
    icon: Users,
    title: ["Collaborative", "Workflows"],
    description: "Real-time consensus scorecards your whole hiring panel can review and agree on, fast.",
    bg: "bg-[linear-gradient(160deg,#f3e8ff_0%,#ede9fe_55%,#faf5ff_100%)]",
    chipClass: "text-violet-700 ring-violet-200",
    accent: "text-violet-600",
    preview: <WorkflowPreview />,
  },
  {
    tab: "Integrity",
    chip: "Integrity suite",
    icon: ShieldCheck,
    title: ["Integrity &", "Anti-Cheat"],
    description:
      "Keystroke dynamics, browser focus tracking and AI anomaly detection keep every assessment fair.",
    bg: "bg-[linear-gradient(160deg,#d1fae5_0%,#ecfdf5_55%,#f0fdfa_100%)]",
    chipClass: "text-emerald-700 ring-emerald-200",
    accent: "text-emerald-600",
    preview: <IntegrityPreview />,
  },
];

/* Auto-rotating enterprise feature card (pauses on hover; tabs jump to a slide).
   All slides share one grid cell, so the card keeps a steady height and slides truly crossfade. */
export default function FeatureShowcaseCard() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduceMotion]);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 sm:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background gradients crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={s.tab}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out ${s.bg} ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
      ))}

      <div className="relative grid flex-1">
        {SLIDES.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === index;
          return (
            <motion.div
              key={s.tab}
              className="col-start-1 row-start-1 flex flex-col"
              initial={false}
              animate={
                isActive
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 10, filter: "blur(6px)" }
              }
              transition={{ duration: 0.7, ease: EASE, delay: isActive ? 0.15 : 0 }}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
              aria-hidden={!isActive}
            >
              <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Icon className="h-3.5 w-3.5" />
                {s.chip}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {s.title[0]} <em className={`font-serif font-normal italic ${s.accent}`}>{s.title[1]}</em>
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{s.description}</p>

              <div className="mt-auto pt-8">{s.preview}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs with an autoplay progress bar */}
      <div className="relative mt-8 grid grid-cols-4 gap-3" role="tablist" aria-label="Enterprise features">
        {SLIDES.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className="group text-left"
          >
            <span className="block h-0.5 overflow-hidden rounded-full bg-slate-900/10">
              {i === index ? (
                <span
                  key={index}
                  className="block h-full rounded-full bg-slate-950 motion-safe:animate-[hero-progress_linear_forwards] motion-reduce:w-full"
                  style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                />
              ) : null}
            </span>
            <span
              className={`mt-2 block text-xs font-medium transition-colors duration-500 ${
                i === index ? "text-slate-950" : "text-slate-400 group-hover:text-slate-700"
              }`}
            >
              {s.tab}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
