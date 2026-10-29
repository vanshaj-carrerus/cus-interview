"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Bot, Code, FileCheck2, Flame, type LucideIcon } from "lucide-react";

/* ─── Deep-dive cards (gradient card + white chart card) ────── */

/* Smooth curve through the points (Catmull-Rom → cubic Bézier) */
function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

type ChartSpec = {
  title: string;
  yLabels: string[];
  xLabels: string[];
  values: number[]; // 0–100
  highlight: number; // index shown in the tooltip
  tooltip: string;
  color: string;
};

function GrowthChart({ chart }: { chart: ChartSpec }) {
  const w = 300;
  const h = 150;
  const pts = chart.values.map(
    (v, i) => [(i / (chart.values.length - 1)) * w, h - (v / 100) * (h - 10)] as [number, number],
  );
  const line = smoothPath(pts);
  const [hx, hy] = pts[chart.highlight];
  const gradientId = `grow-${chart.color.replace("#", "")}`;

  return (
    <div className="rounded-xl bg-white p-5 shadow-[0_8px_20px_-14px_rgba(15,23,42,0.2)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-slate-950">{chart.title}</p>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span className="px-2 py-1">Today</span>
          <span className="px-2 py-1">This week</span>
          <span className="rounded-full bg-lime-300 px-3 py-1 font-semibold text-slate-900">This year</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[32px_minmax(0,1fr)] gap-2">
        <div className="flex h-40 flex-col justify-between text-[11px] text-slate-400">
          {chart.yLabels.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
        <div className="relative h-40">
          <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chart.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${gradientId})`} />
            <path d={line} fill="none" stroke={chart.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <line x1={hx} y1={hy} x2={hx} y2={h} stroke="#94a3b8" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Point + tooltip, positioned in % so they stay on the stretched curve */}
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white"
            style={{ left: `${(hx / w) * 100}%`, top: `${(hy / h) * 100}%`, borderColor: chart.color }}
          />
          <span
            className="absolute -translate-x-1/2 -translate-y-[170%] whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white"
            style={{ left: `${(hx / w) * 100}%`, top: `${(hy / h) * 100}%` }}
          >
            {chart.tooltip}
          </span>
        </div>
      </div>
      <div className="ml-10 mt-2 flex justify-between text-[11px] text-slate-400">
        {chart.xLabels.map((x, i) => (
          <span key={x} className={i === chart.highlight ? "font-semibold text-slate-900" : ""}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

type DeepDive = {
  pill: string;
  icon: LucideIcon;
  /* [black part, sky-blue accent] */
  title: [string, string];
  text: string;
  cta: string;
  href: string;
  bg: string;
  chart: ChartSpec;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const DEEP_DIVES: DeepDive[] = [
  {
    pill: "AI Mock Interview",
    icon: Bot,
    title: ["Interview prep", "tailored to your level."],
    text: "Get personalized AI interviews tailored to your tech stack, experience, and career level. Practice with realistic questions and receive instant feedback to improve your performance.",
    cta: "Start a mock interview",
    href: "/dashboard/ai-mock-interview",
    bg: "bg-[linear-gradient(180deg,#bfdbfe_0%,#e0f2fe_55%,#ffffff_100%)]",
    chart: {
      title: "Interview Score",
      yLabels: ["10", "7.5", "5", "2.5"],
      xLabels: MONTHS,
      values: [30, 38, 42, 55, 60, 72, 86],
      highlight: 2,
      tooltip: "Score 6.4",
      color: "#2563eb",
    },
  },
  {
    pill: "Practice Problems",
    icon: Code,
    title: ["Master real", "interview patterns."],
    text: "Solve 119 curated coding problems across six topics. Practice in a built-in compiler, track your progress, and strengthen your problem-solving skills.",
    cta: "Browse problems",
    href: "/dashboard/practice-problems",
    bg: "bg-[linear-gradient(180deg,#fed7aa_0%,#ffedd5_55%,#ffffff_100%)]",
    chart: {
      title: "Problems Solved",
      yLabels: ["120", "80", "40", "0"],
      xLabels: MONTHS,
      values: [8, 14, 40, 44, 50, 46, 82],
      highlight: 2,
      tooltip: "48 solved",
      color: "#ea580c",
    },
  },
  {
    pill: "Resume Analyzer",
    icon: FileCheck2,
    title: ["Get your resume", "past the ATS."],
    text: "Upload your resume to get an instant ATS score, identify missing keywords, check formatting, and receive AI-powered suggestions to improve your chances of getting shortlisted.",
    cta: "Analyze my resume",
    href: "/dashboard/resume-analyzer",
    bg: "bg-[linear-gradient(180deg,#f5d0fe_0%,#fae8ff_55%,#ffffff_100%)]",
    chart: {
      title: "ATS Score",
      yLabels: ["100", "75", "50", "25"],
      xLabels: ["v1", "v2", "v3", "v4", "v5", "v6", "v7"],
      values: [40, 48, 55, 62, 70, 78, 88],
      highlight: 5,
      tooltip: "ATS 78",
      color: "#c026d3",
    },
  },
  {
    pill: "Progress & Streaks",
    icon: Flame,
    title: ["Track daily", "progress."],
    text: "Track your daily practice, correct answers, completed levels, and coding streaks. Monitor your growth with detailed activity history and progress insights.",
    cta: "See my progress",
    href: "/profile",
    bg: "bg-[linear-gradient(180deg,#bbf7d0_0%,#dcfce7_55%,#ffffff_100%)]",
    chart: {
      title: "Day Streak",
      yLabels: ["30", "20", "10", "0"],
      xLabels: MONTHS,
      values: [6, 12, 20, 34, 46, 58, 74],
      highlight: 3,
      tooltip: "12 days",
      color: "#16a34a",
    },
  },
];

/* ─── Pinned one-at-a-time slider ───────────────────────────── */

function CardBody({ d }: { d: DeepDive }) {
  const Icon = d.icon;
  return (
    <>
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
          <Icon className="h-4 w-4" /> {d.pill}
        </span>
        <h3 className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-slate-950 md:text-5xl">
          {d.title[0]} {d.title[1]}
        </h3>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-700">{d.text}</p>
        <Link
          href={d.href}
          className="mt-8 inline-flex items-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-slate-950 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5"
        >
          {d.cta}
        </Link>
      </div>
      <GrowthChart chart={d.chart} />
    </>
  );
}

const CARD_CLASS =
  "grid grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:p-14";

function SlideCard({
  d,
  index,
  total,
  progress,
}: {
  d: DeepDive;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / total;
  const isLast = index === total - 1;
  /* While the next card scrolls up over it: shrink a little (stays fully clear, no fade) */
  const scale = useTransform(progress, [index * step, (index + 1) * step], [1, isLast ? 1 : 0.94]);

  /* Every card waits at the same spot below the header, so the next one arrives from below and covers it */
  return (
    <div className="sticky top-24" style={{ zIndex: index }}>
      <motion.article
        style={{ scale }}
        className={`relative origin-top shadow-[0_-8px_20px_-16px_rgba(15,23,42,0.18)] ${CARD_CLASS} ${d.bg}`}
      >
        <CardBody d={d} />
      </motion.article>
    </div>
  );
}

/* Cards scroll normally; each new one comes up from below and slides over the previous one */
export default function StackedDeepDives() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const total = DEEP_DIVES.length;

  return (
    <section ref={ref} className="mx-auto max-w-6xl space-y-8 px-6 pb-16">
      {DEEP_DIVES.map((d, i) => (
        <SlideCard key={d.title[0]} d={d} index={i} total={total} progress={scrollYProgress} />
      ))}
    </section>
  );
}
