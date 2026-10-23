"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Bell,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Code,
  Crown,
  Layers,
  Loader2,
  Mic,
  MicOff,
  Play,
  Search,
  Star,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { LOGO_ICON_SRC } from "@/components/global/Logo";
import UnderlineHighlight, { SECTION_HEADING } from "@/components/home/UnderlineHighlight";

type FeatureId = "practice" | "languages" | "compiler" | "companies" | "ai";

type Feature = {
  id: FeatureId;
  label: string;
  nav: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    id: "practice",
    label: "Practice Problems",
    nav: "Practice",
    description:
      "Build problem-solving skills with real coding challenges across key topics and difficulty levels.",
    href: "/dashboard/practice-problems",
    icon: Code,
  },
  {
    id: "languages",
    label: "Programming Languages",
    nav: "Languages",
    description:
      "Structured mastery tracks for Python, Java, C#, Rust and more — from fundamentals to advanced topics.",
    href: "/dashboard/programming-languages",
    icon: Layers,
  },
  {
    id: "compiler",
    label: "Compiler",
    nav: "Compiler",
    description:
      "Write, run and debug code instantly in the browser — no setup, multiple languages supported.",
    href: "/dashboard/compiler",
    icon: Terminal,
  },
  {
    id: "companies",
    label: "Company Interview Questions",
    nav: "Companies",
    description:
      "Real questions asked at top companies, organised by company, round and difficulty.",
    href: "/dashboard/company-interviews",
    icon: Briefcase,
  },
  {
    id: "ai",
    label: "AI Mock Interview",
    nav: "AI Interview",
    description:
      "Practice with an AI interviewer that asks follow-ups and gives instant, structured feedback.",
    href: "/dashboard/ai-mock-interview",
    icon: Bot,
  },
];

const AUTOPLAY_MS = 6000;

/* ─── Shared bits for the mock screens ──────────────────────── */
/* The window is a clickable demo: every control works on local, fake state only. */

function PaneHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <motion.div variants={rise} className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[17px] font-semibold tracking-tight text-slate-900">{title}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
      </div>
      {action}
    </motion.div>
  );
}

type RunState = "idle" | "running" | "done";

function RunButton({ label = "Run Code", state, onClick }: { label?: string; state: RunState; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "running"}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_16px_-8px_rgba(15,23,42,0.6)] transition-all hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 disabled:opacity-80"
    >
      {state === "running" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Play className="h-3 w-3 fill-current" />
      )}
      {state === "running" ? "Running…" : label}
    </button>
  );
}

/* Fake async run: idle → running → done */
function useFakeRun(ms = 900) {
  const [state, setState] = useState<RunState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const run = () => {
    setState("running");
    timer.current = setTimeout(() => setState("done"), ms);
  };
  return [state, run, setState] as const;
}

function Tag({ children, tone }: { children: ReactNode; tone: "green" | "amber" | "rose" | "sky" | "slate" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
  };
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ${tones[tone]}`}>{children}</span>
  );
}

/* Tiny syntax-highlighted code: each line is [text, colour] pairs */
type CodeLine = [string, string][];
const kw = "text-violet-300";
const fn = "text-sky-300";
const tx = "text-slate-300";
const st = "text-emerald-300";
const cm = "text-slate-500";

/* ─── Motion presets: each screen's pieces cascade in ───────── */

const EASE = [0.22, 1, 0.36, 1] as const;

const paneVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, staggerChildren: 0.07 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: "easeIn" } },
};

/* A block that rises in as part of its screen's cascade */
const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const codeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const codeLine: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
};

/* Dark editor: file tab, numbered lines with a blinking cursor, and a status bar */
function Editor({ file, lines, status }: { file: string; lines: CodeLine[]; status?: ReactNode }) {
  return (
    <motion.div
      variants={rise}
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-[#0b1220] shadow-[0_20px_40px_-24px_rgba(15,23,42,0.6)] ring-1 ring-white/5"
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300">{file}</span>
      </div>

      {/* Keyed by file so switching problems replays the line cascade */}
      <motion.div
        key={file}
        variants={codeVariants}
        initial="hidden"
        animate="show"
        className="min-h-0 flex-1 overflow-hidden px-3 py-3 font-mono text-[11px] leading-[1.85]"
      >
        {lines.map((line, i) => (
          <motion.div key={i} variants={codeLine} className="flex whitespace-pre">
            <span className="w-6 shrink-0 select-none text-slate-600">{i + 1}</span>
            {line.map(([text, color], j) => (
              <span key={j} className={color}>
                {text}
              </span>
            ))}
            {i === lines.length - 1 && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-sky-300 motion-safe:animate-[caret-blink_1s_steps(1)_infinite]" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {status && (
        <div className="border-t border-white/5 px-3 py-2 text-[10px] text-slate-400">{status}</div>
      )}
    </motion.div>
  );
}

/* ─── Mock screens ──────────────────────────────────────────── */

type Problem = {
  title: string;
  file: string;
  level: "Easy" | "Medium";
  topic: string;
  rate: string;
  runtime: string;
  beats: string;
  code: CodeLine[];
};

const PROBLEMS: Problem[] = [
  {
    title: "Two Sum",
    file: "two_sum.py",
    level: "Easy",
    topic: "Arrays",
    rate: "52%",
    runtime: "52 ms",
    beats: "91%",
    code: [
      [["class ", kw], ["Solution", fn], [":", tx]],
      [["  def ", kw], ["twoSum", fn], ["(self, nums, target):", tx]],
      [["    seen = {}", tx]],
      [["    for ", kw], ["i, n ", tx], ["in ", kw], ["enumerate", fn], ["(nums):", tx]],
      [["      need = target - n", tx]],
      [["      if ", kw], ["need ", tx], ["in ", kw], ["seen:", tx]],
      [["        return ", kw], ["[seen[need], i]", tx]],
      [["      seen[n] = i", tx]],
    ],
  },
  {
    title: "Valid Anagram",
    file: "valid_anagram.py",
    level: "Easy",
    topic: "Strings",
    rate: "64%",
    runtime: "38 ms",
    beats: "88%",
    code: [
      [["from ", kw], ["collections ", tx], ["import ", kw], ["Counter", fn]],
      [["", tx]],
      [["class ", kw], ["Solution", fn], [":", tx]],
      [["  def ", kw], ["isAnagram", fn], ["(self, s, t):", tx]],
      [["    return ", kw], ["Counter", fn], ["(s) == ", tx], ["Counter", fn], ["(t)", tx]],
    ],
  },
  {
    title: "Longest Substring Without Repeating",
    file: "longest_substring.py",
    level: "Medium",
    topic: "Strings",
    rate: "34%",
    runtime: "61 ms",
    beats: "79%",
    code: [
      [["class ", kw], ["Solution", fn], [":", tx]],
      [["  def ", kw], ["lengthOfLongest", fn], ["(self, s):", tx]],
      [["    last, start, best = {}, 0, 0", tx]],
      [["    for ", kw], ["i, c ", tx], ["in ", kw], ["enumerate", fn], ["(s):", tx]],
      [["      if ", kw], ["last.get(c, -1) >= start:", tx]],
      [["        start = last[c] + 1", tx]],
      [["      last[c] = i", tx]],
      [["      best = ", tx], ["max", fn], ["(best, i - start + 1)", tx]],
      [["    return ", kw], ["best", tx]],
    ],
  },
  {
    title: "Merge Intervals",
    file: "merge_intervals.py",
    level: "Medium",
    topic: "Arrays",
    rate: "47%",
    runtime: "84 ms",
    beats: "72%",
    code: [
      [["class ", kw], ["Solution", fn], [":", tx]],
      [["  def ", kw], ["merge", fn], ["(self, intervals):", tx]],
      [["    out = []", tx]],
      [["    for ", kw], ["s, e ", tx], ["in ", kw], ["sorted", fn], ["(intervals):", tx]],
      [["      if ", kw], ["out ", tx], ["and ", kw], ["s <= out[-1][1]:", tx]],
      [["        out[-1][1] = ", tx], ["max", fn], ["(out[-1][1], e)", tx]],
      [["      else", kw], [":", tx]],
      [["        out.append([s, e])", tx]],
      [["    return ", kw], ["out", tx]],
    ],
  },
];

const FILTERS = ["All", "Arrays", "Strings", "DP", "Trees", "Graphs"];

function PracticePane() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(PROBLEMS[0].title);
  const [solved, setSolved] = useState<string[]>(["Two Sum", "Valid Anagram"]);
  const [starred, setStarred] = useState<string[]>([]);
  const [runState, run, setRunState] = useFakeRun();

  const visible = PROBLEMS.filter((p) => filter === "All" || p.topic === filter);
  const problem = PROBLEMS.find((p) => p.title === selected) ?? PROBLEMS[0];

  const runCode = () => {
    run();
    setTimeout(() => setSolved((s) => (s.includes(problem.title) ? s : [...s, problem.title])), 900);
  };

  return (
    <>
      <PaneHeader
        title="Practice Problems"
        subtitle="Sharpen your coding skills with handpicked problems."
        action={<RunButton state={runState} onClick={runCode} />}
      />
      <motion.div variants={rise} className="mt-3 flex gap-1.5 text-[11px]">
        {FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              filter === t
                ? "bg-slate-950 font-semibold text-white"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </motion.div>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="min-h-0 space-y-2 overflow-hidden">
          {visible.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-[11px] text-slate-400">
              No problems in {filter} yet — try another topic.
            </p>
          )}
          {visible.map((p) => {
            const isSelected = p.title === selected;
            const isSolved = solved.includes(p.title);
            const isStarred = starred.includes(p.title);
            return (
              <motion.button
                key={p.title}
                type="button"
                variants={rise}
                onClick={() => {
                  setSelected(p.title);
                  setRunState("idle");
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl border bg-white px-3 py-2.5 text-left transition-[border-color,box-shadow] ${
                  isSelected
                    ? "border-sky-200 shadow-[0_0_0_3px_rgba(186,230,253,0.45)]"
                    : "border-slate-100 shadow-sm hover:border-slate-200"
                }`}
              >
                {isSolved ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-slate-800">{p.title}</span>
                  <span className="mt-1 flex gap-1.5">
                    <Tag tone={p.level === "Easy" ? "green" : "amber"}>{p.level}</Tag>
                    <Tag tone="slate">{p.topic}</Tag>
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <span
                    role="presentation"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStarred((s) => (isStarred ? s.filter((x) => x !== p.title) : [...s, p.title]));
                    }}
                    className="cursor-pointer"
                  >
                    <Star
                      className={`h-3.5 w-3.5 transition-colors ${isStarred ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-slate-400"}`}
                    />
                  </span>
                  <span className="text-[10px] tabular-nums text-slate-400">{p.rate}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="hidden min-h-0 md:block">
          <Editor
            file={problem.file}
            lines={problem.code}
            status={
              runState === "running" ? (
                <span className="flex items-center gap-1.5 text-sky-300">
                  <Loader2 className="h-3 w-3 animate-spin" /> Running test cases…
                </span>
              ) : runState === "done" ? (
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Accepted
                  </span>
                  <span>Runtime {problem.runtime}</span>
                  <span>Beats {problem.beats}</span>
                </span>
              ) : (
                <span>Ready · press Run Code</span>
              )
            }
          />
        </div>
      </div>
    </>
  );
}

const TRACKS = [
  { name: "Python", short: "Py", tile: "bg-sky-200", ring: "#0ea5e9", progress: 72, lessons: 48 },
  { name: "Java", short: "Jv", tile: "bg-amber-200", ring: "#f59e0b", progress: 48, lessons: 52 },
  { name: "C#", short: "C#", tile: "bg-violet-200", ring: "#8b5cf6", progress: 30, lessons: 40 },
  { name: "Rust", short: "Rs", tile: "bg-rose-200", ring: "#f43f5e", progress: 15, lessons: 36 },
];

function LanguagesPane() {
  const [selected, setSelected] = useState(TRACKS[0].name);
  const [progress, setProgress] = useState<Record<string, number>>(
    Object.fromEntries(TRACKS.map((t) => [t.name, t.progress])),
  );

  return (
    <>
      <PaneHeader title="Programming Languages" subtitle="Pick a track and master it step by step." />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {TRACKS.map((t) => {
          const value = progress[t.name];
          const isSelected = t.name === selected;
          return (
            <motion.div
              key={t.name}
              variants={rise}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(t.name)}
              onKeyDown={(e) => e.key === "Enter" && setSelected(t.name)}
              className={`cursor-pointer rounded-2xl border bg-white p-3.5 transition-[border-color,box-shadow] ${
                isSelected
                  ? "border-slate-900 shadow-[0_12px_24px_-16px_rgba(15,23,42,0.5)]"
                  : "border-slate-100 shadow-sm hover:border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-9 w-9 -rotate-3 items-center justify-center rounded-xl text-[12px] font-bold text-slate-900 ${t.tile}`}
                >
                  {t.short}
                </span>
                {/* Progress ring */}
                <span className="relative inline-flex h-10 w-10 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke={t.ring}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="94.2"
                      initial={{ strokeDashoffset: 94.2 }}
                      animate={{ strokeDashoffset: 94.2 * (1 - value / 100) }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </svg>
                  <span className="text-[9px] font-bold tabular-nums text-slate-700">{value}%</span>
                </span>
              </div>
              <p className="mt-3 text-[13px] font-semibold text-slate-900">{t.name} mastery</p>
              <p className="text-[10px] text-slate-400">{t.lessons} lessons · projects</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(t.name);
                  setProgress((p) => ({ ...p, [t.name]: Math.min(100, p[t.name] + 8) }));
                }}
                className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-900 transition-colors hover:bg-slate-200"
              >
                {value >= 100 ? "Completed ✓" : "Continue"}
                {value < 100 && <ChevronRight className="h-3 w-3" />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

const COMPILER_CODE: Record<"Python 3.12" | "JavaScript", { file: string; lines: CodeLine[]; cmd: string }> = {
  "Python 3.12": {
    file: "main.py",
    cmd: "python main.py",
    lines: [
      [["# Reverse a string", cm]],
      [["def ", kw], ["reverse", fn], ["(s: ", tx], ["str", fn], [") -> ", tx], ["str", fn], [":", tx]],
      [["    return ", kw], ["s[::-1]", tx]],
      [["", tx]],
      [["print", fn], ["(reverse(", tx], ['"weivretnI SUC"', st], ["))", tx]],
    ],
  },
  JavaScript: {
    file: "main.js",
    cmd: "node main.js",
    lines: [
      [["// Reverse a string", cm]],
      [["const ", kw], ["reverse", fn], [" = (s) =>", tx]],
      [["  [...s].", tx], ["reverse", fn], ["().", tx], ["join", fn], ["(", tx], ['""', st], [");", tx]],
      [["", tx]],
      [["console", tx], [".", tx], ["log", fn], ["(reverse(", tx], ['"weivretnI SUC"', st], ["));", tx]],
    ],
  },
};

function CompilerPane() {
  const [lang, setLang] = useState<keyof typeof COMPILER_CODE>("Python 3.12");
  const [runState, run, setRunState] = useFakeRun(800);
  const code = COMPILER_CODE[lang];

  return (
    <>
      <PaneHeader
        title="Online Compiler"
        subtitle="Write and run code instantly — no setup needed."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLang((l) => (l === "Python 3.12" ? "JavaScript" : "Python 3.12"));
                setRunState("idle");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 transition-colors hover:border-slate-300"
            >
              {lang} <ChevronDown className="h-3 w-3" />
            </button>
            <RunButton label="Run" state={runState} onClick={run} />
          </div>
        }
      />
      <div className="mt-4 grid min-h-0 flex-1 grid-rows-[1fr_auto] gap-3">
        <Editor file={code.file} lines={code.lines} />
        {/* Terminal */}
        <motion.div variants={rise} className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] leading-relaxed">
          <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">Terminal</p>
          {runState === "idle" && <p className="mt-1.5 text-slate-500">Press Run to execute {code.file}</p>}
          {runState !== "idle" && (
            <p className="mt-1.5 text-slate-500">
              <span className="text-sky-300">$</span> {code.cmd}
            </p>
          )}
          {runState === "running" && (
            <p className="flex items-center gap-1.5 text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin" /> running…
            </p>
          )}
          {runState === "done" && (
            <>
              <p className="text-white">CUS Interview</p>
              <p className="text-emerald-400">✓ Process finished in 0.04s</p>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

const COMPANIES = [
  {
    name: "Amazon",
    logo: "/logos/amazon.png",
    round: "Online assessment",
    questions: 42,
    level: "Medium",
    sample: ["LRU Cache", "Number of Islands"],
  },
  {
    name: "Goldman Sachs",
    logo: "/logos/goldman-sachs.png",
    round: "Technical round",
    questions: 28,
    level: "Hard",
    sample: ["Trapping Rain Water", "Median of Two Sorted Arrays"],
  },
  {
    name: "Accenture",
    logo: "/logos/accenture.png",
    round: "Coding round",
    questions: 35,
    level: "Easy",
    sample: ["Reverse a Linked List", "Valid Parentheses"],
  },
  {
    name: "TCS",
    logo: "/logos/tcs.png",
    round: "Aptitude + coding",
    questions: 50,
    level: "Easy",
    sample: ["Palindrome Number", "FizzBuzz"],
  },
];

function CompaniesPane() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <PaneHeader title="Company Interview Questions" subtitle="Prepare with questions from real interview rounds." />
      <div className="mt-4 space-y-2">
        {COMPANIES.map((c) => {
          const isOpen = open === c.name;
          return (
            <motion.div
              variants={rise}
              key={c.name}
              className={`rounded-xl border bg-white shadow-sm transition-colors ${isOpen ? "border-slate-300" : "border-slate-100"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : c.name)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
              >
                <span className="relative h-9 w-14 shrink-0 rounded-lg bg-slate-50 ring-1 ring-slate-100">
                  <Image src={c.logo} alt="" fill sizes="56px" className="object-contain p-1.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold text-slate-800">{c.name}</span>
                  <span className="block text-[10px] text-slate-400">
                    {c.round} · {c.questions} questions
                  </span>
                </span>
                <Tag tone={c.level === "Easy" ? "green" : c.level === "Medium" ? "amber" : "rose"}>{c.level}</Tag>
                <ChevronRight
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden px-3"
                  >
                    {c.sample.map((q) => (
                      <li
                        key={q}
                        className="flex items-center justify-between border-t border-slate-100 py-2 text-[11px] text-slate-600 last:mb-1"
                      >
                        {q}
                        <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[9px] font-semibold text-white">
                          Solve
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

const INTERVIEW = [
  {
    q: "How would you design a URL shortener that handles millions of requests per day?",
    a: "I'd start with a hashing service, a key-value store for lookups and a cache in front…",
    scores: ["9/10", "8/10", "7/10"],
  },
  {
    q: "How do you keep short links unique when many servers create them at once?",
    a: "Pre-allocate ID ranges per server, or use a central counter with batching…",
    scores: ["8/10", "9/10", "8/10"],
  },
  {
    q: "What would you cache, and how would you handle a hot link going viral?",
    a: "Cache popular redirects at the edge, with a short TTL and request coalescing…",
    scores: ["9/10", "9/10", "8/10"],
  },
];

function AiPane() {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(true);
  const item = INTERVIEW[step];

  return (
    <>
      <PaneHeader
        title="AI Mock Interview"
        subtitle={`System design · Senior round · Question ${step + 3} of 8`}
        action={
          <button
            type="button"
            onClick={() => setRecording((r) => !r)}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 transition-colors ${
              recording ? "bg-rose-50 text-rose-600 ring-rose-100" : "bg-slate-50 text-slate-500 ring-slate-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${recording ? "bg-rose-500 motion-safe:animate-pulse" : "bg-slate-400"}`}
            />
            {recording ? "Recording" : "Paused"}
          </button>
        }
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-4 space-y-3"
        >
          <div className="flex gap-2.5">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-sky-100">
              <Image src="/Ai-interview.jpeg" alt="" fill sizes="64px" className="object-cover object-top" />
            </span>
            <p className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white p-3 text-[12px] leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-100">
              {item.q}
            </p>
          </div>
          <div className="flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-tr-sm bg-slate-950 p-3 text-[12px] leading-relaxed text-white shadow-sm">
              {item.a}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Clarity", "Depth", "Trade-offs"].map((label, i) => (
              <span
                key={label}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-900 ${["bg-emerald-200", "bg-sky-200", "bg-amber-200"][i]}`}
              >
                {label} · {item.scores[i]}
              </span>
            ))}
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) % INTERVIEW.length)}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Next question <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div variants={rise} className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setRecording((r) => !r)}
          aria-label={recording ? "Pause recording" : "Resume recording"}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors ${recording ? "bg-slate-950" : "bg-slate-400"}`}
        >
          {recording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </button>
        {/* Live voice waveform — pulses only while recording */}
        <div className="flex h-6 flex-1 items-center gap-[3px]">
          {[40, 70, 35, 90, 55, 80, 30, 65, 45, 85, 50, 70, 35, 60, 40, 75, 55, 30].map((h, i) => (
            <motion.span
              key={i}
              className={`w-1 origin-center rounded-full ${recording ? "bg-sky-400" : "bg-slate-200"}`}
              style={{ height: `${h}%` }}
              animate={recording ? { scaleY: [1, 0.35, 1] } : { scaleY: 0.3 }}
              transition={
                recording
                  ? { duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: (i % 6) * 0.12 }
                  : { duration: 0.3 }
              }
            />
          ))}
        </div>
        <span className="text-[11px] tabular-nums text-slate-400">04:12</span>
      </motion.div>
    </>
  );
}

const PANES: Record<FeatureId, () => ReactNode> = {
  practice: PracticePane,
  languages: LanguagesPane,
  compiler: CompilerPane,
  companies: CompaniesPane,
  ai: AiPane,
};

/* ─── Section ───────────────────────────────────────────────── */

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* Desktop progress bar — fills as you scroll through this feature's slice of the section */
function ScrollProgress({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const scaleX = useTransform(progress, (v) =>
    Math.max(0, Math.min(1, v * FEATURES.length - index)),
  );
  return <motion.div className="h-full origin-left rounded-full bg-sky-500" style={{ scaleX }} />;
}

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Gentle 3D tilt of the app window towards the cursor */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 150, damping: 20 });
  /* Custom cursor inside the app window */
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { stiffness: 700, damping: 45, mass: 0.4 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 700, damping: 45, mass: 0.4 });
  const [cursor, setCursor] = useState({ visible: false, clickable: false, pressed: false });
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  const current = FEATURES[active];
  const Pane = PANES[current.id];

  /* Desktop: the section pins while scrolling, and scroll position picks the feature */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isDesktop) return;
    setActive(Math.min(FEATURES.length - 1, Math.floor(v * FEATURES.length)));
  });

  /* Mobile: features rotate on a timer instead */
  const next = () => setActive((i) => (i + 1) % FEATURES.length);

  const select = (i: number) => {
    const el = sectionRef.current;
    if (!isDesktop || !el) {
      setActive(i);
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / FEATURES.length) * scrollable, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative overflow-clip bg-[#f7fafd] lg:h-[400vh]">
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-100/60 blur-3xl"
        aria-hidden
      />

      <div className="py-20 md:py-28 lg:sticky lg:top-16 lg:flex lg:h-[calc(100svh-4rem)] lg:items-center lg:py-0">
        <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-500">Our Features</p>
          <h2 className={`mt-3 ${SECTION_HEADING}`}>
            Your next interview, <UnderlineHighlight>made easier.</UnderlineHighlight>
          </h2>

          <div
            className="mt-14 grid grid-cols-1 items-center gap-10 md:mt-20 lg:mt-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Feature list */}
            <ul className="divide-y divide-slate-200/70">
              {FEATURES.map((f, i) => {
                const isActive = i === active;
                const Icon = f.icon;
                return (
                  <li key={f.id} className="py-1.5">
                    <button
                      type="button"
                      onClick={() => select(i)}
                      aria-expanded={isActive}
                      className="group flex w-full items-center gap-4 rounded-xl px-2 py-2.5 text-left"
                    >
                      <span
                        className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors duration-300 ${isActive
                          ? "text-sky-600 ring-sky-100"
                          : "bg-white text-slate-400 ring-slate-200/80 group-hover:text-slate-600"
                          }`}
                      >
                        {/* Active icon tile glides down the list */}
                        {isActive && (
                          <motion.span
                            layoutId="showcase-list-icon"
                            className="absolute inset-0 rounded-xl bg-sky-50"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon className="relative h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
                      </span>
                      <span
                        className={`text-base font-semibold transition-colors duration-300 md:text-lg ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                          }`}
                      >
                        {f.label}
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-3 pl-[4.5rem] pr-2">
                          <p className="text-sm leading-relaxed text-slate-500">{f.description}</p>
                          <Link
                            href={f.href}
                            className="group/link mt-2 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
                          >
                            Explore
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                          </Link>
                          <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-slate-200/80">
                            {isDesktop ? (
                              <ScrollProgress progress={scrollYProgress} index={i} />
                            ) : (
                              isActive && (
                                /* Autoplay progress — finishing the bar moves to the next feature */
                                <div
                                  key={active}
                                  className="h-full rounded-full bg-sky-500 motion-safe:animate-[hero-progress_linear_forwards] motion-reduce:w-full"
                                  style={{
                                    animationDuration: `${AUTOPLAY_MS}ms`,
                                    animationPlayState: paused ? "paused" : "running",
                                  }}
                                  onAnimationEnd={next}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* App window — rises in on scroll, then tilts gently towards the cursor */}
            <div style={{ perspective: 1600 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              onPointerMove={(e) => {
                if (e.pointerType !== "mouse") return;
                const rect = e.currentTarget.getBoundingClientRect();
                tiltX.set(((e.clientY - rect.top) / rect.height - 0.5) * -5);
                tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 6);
                cursorX.set(e.clientX - rect.left);
                cursorY.set(e.clientY - rect.top);
                const clickable = !!(e.target as HTMLElement).closest("button, a, [role=button]");
                /* Only re-render when the cursor's look actually changes */
                setCursor((c) => (c.visible && c.clickable === clickable ? c : { ...c, visible: true, clickable }));
              }}
              onPointerLeave={() => {
                tiltX.set(0);
                tiltY.set(0);
                setCursor((c) => ({ ...c, visible: false, pressed: false }));
              }}
              onPointerDown={() => setCursor((c) => ({ ...c, pressed: true }))}
              onPointerUp={() => setCursor((c) => ({ ...c, pressed: false }))}
              style={{ rotateX: smoothTiltX, rotateY: smoothTiltY }}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.35)] lg:cursor-none lg:[&_*]:cursor-none"
            >
              {/* Custom cursor: a collaborator-style arrow with a name tag */}
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-50 hidden lg:block"
                style={{ x: smoothCursorX, y: smoothCursorY }}
                animate={{ opacity: cursor.visible ? 1 : 0, scale: cursor.pressed ? 0.82 : 1 }}
                transition={{ duration: 0.15 }}
                aria-hidden
              >
                <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-[0_4px_6px_rgba(15,23,42,0.3)]">
                  <path
                    d="M2 2 L17 8.5 L10.5 10.5 L8.5 17 Z"
                    fill={cursor.clickable ? "#0f172a" : "#0ea5e9"}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="transition-[fill] duration-200"
                  />
                </svg>
                <span
                  className={`absolute left-4 top-4 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm ring-2 ring-white transition-colors duration-200 ${
                    cursor.clickable ? "bg-slate-950" : "bg-sky-500"
                  }`}
                >
                  {cursor.clickable ? "Click" : "You"}
                </span>
              </motion.div>

              {/* Top bar */}
              <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-3">
                <span className="hidden gap-1.5 md:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </span>
                <div className="flex items-center gap-2">
                  <Image src={LOGO_ICON_SRC} alt="" width={24} height={24} className="h-6 w-6 rounded-md" />
                  <span className="text-[13px] font-bold text-slate-900">CUS Interview</span>
                  <span className="hidden text-[11px] text-slate-400 lg:inline">/ {current.nav}</span>
                </div>
                <div className="mx-auto hidden w-full max-w-xs items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-400 sm:flex">
                  <Search className="h-3.5 w-3.5" />
                  Search problems, topics or companies…
                  <kbd className="ml-auto rounded border border-slate-200 bg-white px-1 font-sans text-[9px] text-slate-400">⌘K</kbd>
                </div>
                <span className="ml-auto flex items-center gap-2 sm:ml-0">
                  <span className="relative inline-flex">
                    <Bell className="h-4 w-4 text-slate-400" />
                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </span>
                  <span className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-white">
                    <Image src="/avatar1.png" alt="" fill sizes="56px" className="object-cover object-top" />
                  </span>
                </span>
              </div>

              <div className="flex h-[420px]">
                {/* Sidebar */}
                <nav className="hidden w-44 shrink-0 flex-col border-r border-slate-100 p-3 sm:flex">
                  <p className="mb-2 px-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Menu</p>
                  <div className="space-y-1">
                  {FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <button
                        type="button"
                        onClick={() => select(i)}
                        key={f.id}
                        className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors duration-300 ${i === active ? "font-semibold text-sky-600" : "text-slate-500 hover:text-slate-800"
                          }`}
                      >
                        {/* Highlight slides between items */}
                        {i === active && (
                          <motion.span
                            layoutId="showcase-sidebar-pill"
                            className="absolute inset-0 rounded-lg bg-sky-50"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon className="relative h-3.5 w-3.5" />
                        <span className="relative">{f.nav}</span>
                      </button>
                    );
                  })}
                  </div>

                  {/* Upgrade card */}
                  <Link
                    href="/pricing"
                    className="group/pro relative mt-auto block overflow-hidden rounded-xl bg-amber-200 p-3 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <Crown className="h-4 w-4 text-slate-900" />
                    <p className="mt-1.5 text-[11px] font-semibold text-slate-900">Go Pro</p>
                    <p className="text-[10px] leading-snug text-slate-700">Unlock every track and mock round.</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-semibold text-white transition-colors group-hover/pro:bg-slate-800">
                      Upgrade
                      <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover/pro:translate-x-0.5" />
                    </span>
                  </Link>
                </nav>

                {/* Content */}
                <div className="relative min-w-0 flex-1 bg-slate-50/50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      variants={paneVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="flex h-full flex-col p-5"
                    >
                      <Pane />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
