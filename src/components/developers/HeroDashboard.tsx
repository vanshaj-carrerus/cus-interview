"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bell,
  Bot,
  CheckCircle2,
  Code2,
  FileSearch,
  Flame,
  LayoutGrid,
  Loader2,
  Search,
  Target,
  Video,
  type LucideIcon,
} from "lucide-react";

/* Marketing preview inspired by the CUS Interview dashboard — a fresh layout, not a copy.
   Interactive with fake data. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Focus = "all" | "practice" | "interview" | "resume" | "streak";

const RAIL: { id: Focus; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "Overview", icon: LayoutGrid },
  { id: "practice", label: "Practice", icon: Code2 },
  { id: "interview", label: "AI interview", icon: Bot },
  { id: "resume", label: "Resume", icon: FileSearch },
  { id: "streak", label: "Streak", icon: Flame },
];

type Range = "week" | "month" | "year";

const CHART: Record<Range, { labels: string[]; values: number[]; total: string }> = {
  week: { labels: ["M", "T", "W", "T", "F", "S", "S"], values: [3, 5, 4, 7, 6, 9, 8], total: "42" },
  month: { labels: ["W1", "W2", "W3", "W4"], values: [18, 24, 21, 31], total: "94" },
  year: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], values: [20, 34, 41, 38, 52, 60, 74], total: "248" },
};

const TOPICS: Record<string, { label: string; value: number }[]> = {
  DSA: [
    { label: "Arrays", value: 86 },
    { label: "Trees", value: 62 },
    { label: "Graphs", value: 41 },
  ],
  "System design": [
    { label: "Caching", value: 74 },
    { label: "Databases", value: 58 },
    { label: "Scaling", value: 47 },
  ],
  Behavioral: [
    { label: "STAR stories", value: 80 },
    { label: "Leadership", value: 66 },
    { label: "Conflict", value: 52 },
  ],
};

/* Smooth curve through points */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* Card wrapper that dims when another area is in focus */
function Card({
  area,
  focus,
  className = "",
  children,
}: {
  area: Focus;
  focus: Focus;
  className?: string;
  children: React.ReactNode;
}) {
  const active = focus === "all" || focus === area;
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.985 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`rounded-2xl p-4 ${
        focus === area ? "ring-2 ring-slate-900" : "ring-1 ring-slate-900/5"
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SolvedChart() {
  const [range, setRange] = useState<Range>("year");
  const [hover, setHover] = useState<number | null>(null);
  const data = CHART[range];
  const w = 300;
  const h = 110;
  const max = Math.max(...data.values) * 1.15;
  const pts = data.values.map(
    (v, i) => [(i / (data.values.length - 1)) * w, h - (v / max) * h] as [number, number],
  );
  const line = smooth(pts);
  const shown = hover ?? data.values.length - 1;

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-slate-500">Problems solved</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{data.total}</p>
        </div>
        <div className="flex rounded-full bg-slate-100 p-0.5 text-[10px]">
          {(Object.keys(CHART) as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRange(r);
                setHover(null);
              }}
              className={`rounded-full px-2.5 py-1 capitalize transition-colors ${
                range === r ? "bg-white font-semibold text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-3 h-28" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="hero-solved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            key={`a-${range}`}
            d={`${line} L${w},${h} L0,${h} Z`}
            fill="url(#hero-solved)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            key={`l-${range}`}
            d={line}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </svg>
        {/* Hover columns */}
        <div className="absolute inset-0 flex">
          {data.values.map((_, i) => (
            <span key={i} className="h-full flex-1" onMouseEnter={() => setHover(i)} />
          ))}
        </div>
        <span
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-500 bg-white transition-all duration-200"
          style={{ left: `${(pts[shown][0] / w) * 100}%`, top: `${(pts[shown][1] / h) * 100}%` }}
        />
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[160%] whitespace-nowrap rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-white transition-all duration-200"
          style={{ left: `${(pts[shown][0] / w) * 100}%`, top: `${(pts[shown][1] / h) * 100}%` }}
        >
          {data.values[shown]} solved
        </span>
      </div>
      <div className="mt-1.5 flex justify-between text-[9px] text-slate-400">
        {data.labels.map((l, i) => (
          <span key={`${l}-${i}`} className={i === shown ? "font-semibold text-slate-800" : ""}>
            {l}
          </span>
        ))}
      </div>
    </>
  );
}

function TopicStrength() {
  const [topic, setTopic] = useState<keyof typeof TOPICS>("DSA");
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-slate-500">Topic strength</p>
        <Target className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {(Object.keys(TOPICS) as (keyof typeof TOPICS)[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
              topic === t ? "bg-slate-900 font-semibold text-white" : "bg-white/70 text-slate-600 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2.5">
        {TOPICS[topic].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-[10px]">
              <span className="font-medium text-slate-700">{row.label}</span>
              <span className="tabular-nums text-slate-500">{row.value}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/80">
              <motion.div
                className="h-full rounded-full bg-violet-500"
                initial={false}
                animate={{ width: `${row.value}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function NextSession() {
  const [state, setState] = useState<"idle" | "joining" | "live">("idle");
  const join = () => {
    setState("joining");
    setTimeout(() => setState("live"), 1100);
  };
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
          <Image src="/Ai-interview.jpeg" alt="" fill sizes="72px" className="object-cover object-top" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-slate-900">AI mock · System design</p>
          <p className="text-[10px] text-slate-500">Senior round · 45 min</p>
        </div>
      </div>
      <button
        type="button"
        onClick={state === "idle" ? join : () => setState("idle")}
        className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors ${
          state === "live" ? "bg-red-500 text-white" : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
      >
        {state === "idle" && (
          <>
            <Video className="h-3.5 w-3.5" /> Join session
          </>
        )}
        {state === "joining" && (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Connecting…
          </>
        )}
        {state === "live" && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" /> Live · tap to end
          </>
        )}
      </button>
    </>
  );
}

export default function HeroDashboard() {
  const [focus, setFocus] = useState<Focus>("all");

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <div className="mx-auto hidden w-full max-w-xs items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-400 sm:flex">
          <Search className="h-3.5 w-3.5" /> Search problems, tracks…
        </div>
        <span className="ml-auto flex items-center gap-2 sm:ml-0">
          <Bell className="h-4 w-4 text-slate-400" />
          <span className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-white">
            <Image src="/avatar3.png" alt="" fill sizes="56px" className="object-cover" />
          </span>
        </span>
      </div>

      <div className="flex">
        {/* Icon rail */}
        <nav className="hidden flex-col items-center gap-2 border-r border-slate-100 px-2.5 py-4 sm:flex" aria-label="Dashboard areas">
          <Image src="/cus-interview-icon.png" alt="" width={28} height={28} className="mb-2 h-7 w-7" />
          {RAIL.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFocus(id)}
              title={label}
              aria-label={label}
              aria-pressed={focus === id}
              className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                focus === id ? "bg-slate-950 text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Widgets */}
        <div className="min-w-0 flex-1 bg-slate-50/60 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] text-slate-500">Good evening, Aarav</p>
              <p className="text-lg font-semibold tracking-tight text-slate-950">Your interview readiness</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              ↗ 9% this month
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Readiness ring */}
            <Card area="interview" focus={focus} className="bg-gradient-to-br from-violet-100 to-fuchsia-50">
              <p className="text-[11px] font-medium text-slate-500">Readiness score</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="relative inline-flex h-20 w-20 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#ffffff" strokeWidth="3.5" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="94.2"
                      initial={{ strokeDashoffset: 94.2 }}
                      animate={{ strokeDashoffset: 94.2 * 0.22 }}
                      transition={{ duration: 1.2, ease: EASE }}
                    />
                  </svg>
                  <span className="text-xl font-semibold text-slate-950">78</span>
                </span>
                <div className="space-y-1 text-[10px] text-slate-600">
                  <p>Coding · 82</p>
                  <p>Communication · 76</p>
                  <p>Design · 71</p>
                </div>
              </div>
            </Card>

            {/* Chart */}
            <Card area="practice" focus={focus} className="bg-white sm:col-span-2 lg:col-span-2">
              <SolvedChart />
            </Card>

            {/* Streak */}
            <Card area="streak" focus={focus} className="bg-gradient-to-br from-amber-100 to-orange-50">
              <p className="text-[11px] font-medium text-slate-500">Daily streak</p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold text-slate-950">
                <Flame className="h-5 w-5 text-orange-500" /> 12
                <span className="text-[11px] font-medium text-slate-500">days</span>
              </p>
              <div className="mt-3 grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }, (_, i) => (
                  <motion.span
                    key={i}
                    className={`aspect-square rounded-md ${i < 12 ? "bg-orange-400" : "bg-white"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.03, type: "spring", stiffness: 400, damping: 20 }}
                  />
                ))}
              </div>
            </Card>

            {/* Next AI session */}
            <Card area="interview" focus={focus} className="bg-white">
              <p className="mb-2.5 text-[11px] font-medium text-slate-500">Next session</p>
              <NextSession />
            </Card>

            {/* ATS */}
            <Card area="resume" focus={focus} className="bg-gradient-to-br from-emerald-100 to-teal-50">
              <p className="text-[11px] font-medium text-slate-500">Resume ATS</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                86<span className="text-sm text-slate-500">/100</span>
              </p>
              <ul className="mt-2 space-y-1 text-[10px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Keywords matched
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Clean format
                </li>
              </ul>
            </Card>

            {/* Topics */}
            <Card area="practice" focus={focus} className="bg-gradient-to-br from-sky-100 to-indigo-50 sm:col-span-2 lg:col-span-2">
              <TopicStrength />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
