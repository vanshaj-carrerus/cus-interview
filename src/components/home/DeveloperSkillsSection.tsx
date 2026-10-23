"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Check, FileCheck2, Sparkles, Users } from "lucide-react";
import UnderlineHighlight, { SECTION_HEADING } from "@/components/home/UnderlineHighlight";

/* ─── Mini previews (decorative) ─────────────────────────────── */

function CommunityPreview() {
  return (
    <div className="w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-2">
        <span className="flex -space-x-2">
          {[
            ["AR", "bg-sky-500"],
            ["SK", "bg-violet-500"],
            ["MJ", "bg-amber-500"],
            ["PN", "bg-emerald-500"],
          ].map(([initials, bg]) => (
            <span
              key={initials}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-white ${bg}`}
            >
              {initials}
            </span>
          ))}
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </span>
      </div>
      <p className="mt-3 text-[13px] font-semibold text-slate-900">Mock interview room</p>
      <p className="text-[11px] text-slate-500">System design · Senior round</p>
    </div>
  );
}

function CoursesPreview() {
  return (
    <div className="w-full max-w-[260px] space-y-3 rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]">
      {[
        ["Python", "w-[78%]"],
        ["Java", "w-[52%]"],
        ["Rust", "w-[30%]"],
      ].map(([name, width]) => (
        <div key={name}>
          <div className="flex justify-between text-[11px] font-medium text-slate-600">
            <span>{name}</span>
            <span className="text-slate-400">Track</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
            <div className={`h-full rounded-full bg-slate-900 ${width}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ResumePreview() {
  return (
    <div className="w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-12 w-12 items-center justify-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${0.86 * 94.2} 94.2`}
            />
          </svg>
          <span className="text-[13px] font-bold text-slate-900">86</span>
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-slate-900">ATS score</span>
          <span className="text-[11px] text-emerald-600">Strong match</span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Keywords", "Format", "Impact"].map((chip) => (
          <span key={chip} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Stickers (decorative, die-cut look: white border + shadow) ─ */

const STICKER_SHADOW = "drop-shadow-[0_10px_14px_rgba(15,23,42,0.22)]";

/* Wavy-edged badge points, like a "new" sticker */
const STARBURST_POINTS = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const r = i % 2 === 0 ? 50 : 44;
  return `${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

function Starburst({ text, fill }: { text: string; fill: string }) {
  return (
    <span className={`relative inline-flex h-24 w-24 items-center justify-center ${STICKER_SHADOW}`}>
      <svg viewBox="-4 -4 108 108" className="absolute inset-0 h-full w-full">
        <polygon points={STARBURST_POINTS} fill={fill} stroke="white" strokeWidth="5" strokeLinejoin="round" />
      </svg>
      <span className="relative max-w-[4.5rem] text-center text-[11px] font-extrabold uppercase leading-tight tracking-wide text-slate-900">
        {text}
      </span>
    </span>
  );
}

function PillSticker({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[3px] border-white px-3.5 py-1.5 text-[12px] font-bold ${STICKER_SHADOW} ${className}`}
    >
      {children}
    </span>
  );
}

function CircleSticker({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white text-center ${STICKER_SHADOW} ${className}`}
    >
      {children}
    </span>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */

type Sticker = { node: ReactNode; className: string; rotate: number };

type Feature = {
  label: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Users;
  /* solid pastel panel — same set as the hero's floating cards */
  bg: string;
  preview: ReactNode;
  stickers: Sticker[];
};

const FEATURES: Feature[] = [
  {
    label: "Developer community",
    title: "Prepare for your dream job",
    description:
      "Join a growing community of developers who certify their skills, practice interviewing, and discover relevant roles.",
    href: "/problems",
    icon: Users,
    bg: "bg-sky-200",
    preview: <CommunityPreview />,
    stickers: [
      { node: <Starburst text="Join the crew" fill="#fcd34d" />, className: "right-[34%] top-2", rotate: -12 },
      {
        node: (
          <PillSticker className="bg-red-500 text-white">
            <span className="h-2 w-2 rounded-full bg-white" />
            Live rooms
          </PillSticker>
        ),
        className: "right-[8%] top-16",
        rotate: 8,
      },
    ],
  },
  {
    label: "Practice & learn",
    title: "Accelerate with fast-track courses",
    description:
      "Industry-ready language courses and career tracks — from Python to Java — with hands-on projects and real-world problems.",
    href: "/problems/courses",
    icon: BookOpen,
    bg: "bg-violet-200",
    preview: <CoursesPreview />,
    stickers: [
      { node: <Starburst text="New tracks" fill="#f9a8d4" />, className: "right-[30%] top-4", rotate: 10 },
      {
        node: <PillSticker className="bg-slate-950 text-white">Python · Java · Rust</PillSticker>,
        className: "right-[4%] top-20",
        rotate: -6,
      },
    ],
  },
  {
    label: "Resume solutions",
    title: "Optimize your resume for ATS and recruiters",
    description:
      "ATS scoring, keyword gaps, and AI-powered tips — upload a PDF or DOCX for instant, actionable feedback.",
    href: "/resume-analyzer",
    icon: FileCheck2,
    bg: "bg-emerald-200",
    preview: <ResumePreview />,
    stickers: [
      {
        node: (
          <CircleSticker className="bg-slate-950 text-white">
            <Check className="h-5 w-5 text-emerald-300" strokeWidth={3} />
            <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wide">ATS ready</span>
          </CircleSticker>
        ),
        className: "right-[34%] top-2",
        rotate: -10,
      },
      {
        node: (
          <PillSticker className="bg-violet-300 text-slate-900">
            <Sparkles className="h-3.5 w-3.5" />
            AI tips
          </PillSticker>
        ),
        className: "right-[10%] top-20",
        rotate: 7,
      },
    ],
  },
];

/* ─── Section ───────────────────────────────────────────────── */

/* Open panel = 3.2 / 5.2 of the row. Its content gets this fixed width so it never
   re-wraps while panels resize — a closing panel simply clips it. */
const OPEN_CONTENT_WIDTH = "lg:w-[calc((min(100vw,88rem)-8rem)*0.615-4rem)]";

export default function DeveloperSkillsSection() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="relative mx-auto max-w-[88rem] px-6 md:px-10">
        <h2 className={SECTION_HEADING}>
          The Developer <UnderlineHighlight>Skills Platform</UnderlineHighlight>
        </h2>

        {/* Expanding panels: the hovered one stretches, the others fold into slim strips */}
        <div className="mt-10 flex flex-col gap-4 md:mt-14 lg:h-[480px] lg:flex-row">
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            const Icon = f.icon;
            const number = String(i + 1).padStart(2, "0");

            return (
              <div
                key={f.label}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group relative overflow-hidden rounded-[28px] p-6 transition-[flex-grow,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-8 lg:min-w-0 lg:basis-0 ${f.bg} ${
                  isActive ? "lg:grow-[3.2]" : "lg:grow lg:cursor-pointer lg:hover:brightness-[1.03]"
                }`}
              >
                {/* Top row: number + icon chip */}
                <div className="relative z-10 flex items-start justify-between">
                  <span className="font-serif text-2xl text-slate-900/60">{number}</span>
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_10px_20px_-10px_rgba(15,23,42,0.6)] transition-transform duration-500 ${
                      isActive ? "-rotate-6 scale-105" : "rotate-0"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                </div>

                {/* Collapsed: vertical title (desktop only) */}
                <p
                  className={`absolute bottom-8 left-6 hidden font-serif text-[26px] leading-none text-slate-900 transition-[opacity,translate] md:left-8 lg:block ${
                    isActive
                      ? "pointer-events-none translate-y-2 opacity-0 duration-150"
                      : "translate-y-0 opacity-100 delay-300 duration-500"
                  }`}
                  style={{ writingMode: "vertical-rl", rotate: "180deg" }}
                  aria-hidden
                >
                  {f.label}
                </p>

                {/* Stickers — pop in with a spring when the panel opens (desktop only) */}
                <div
                  className={`pointer-events-none absolute left-8 top-20 hidden h-40 lg:block ${OPEN_CONTENT_WIDTH}`}
                  aria-hidden
                >
                  <AnimatePresence>
                    {isActive &&
                      f.stickers.map((s, si) => (
                        <motion.span
                          key={si}
                          className={`absolute ${s.className}`}
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: s.rotate - 25 }}
                          animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
                          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
                          transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.35 + si * 0.12 }}
                        >
                          {s.node}
                        </motion.span>
                      ))}
                  </AnimatePresence>
                </div>

                {/* Expanded content — fixed width on desktop so it never re-wraps; always shown below lg */}
                <div
                  className={`mt-8 flex flex-col gap-8 transition-[opacity,translate] lg:absolute lg:bottom-8 lg:left-8 lg:mt-0 lg:flex-row lg:items-end lg:justify-between ${OPEN_CONTENT_WIDTH} ${
                    isActive
                      ? "opacity-100 lg:translate-y-0 lg:delay-200 lg:duration-500"
                      : "lg:pointer-events-none lg:translate-y-3 lg:opacity-0 lg:duration-150"
                  }`}
                >
                  <div className="max-w-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                      {f.label}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-[1.1] tracking-[-0.015em] text-slate-950 md:text-[2.5rem]">
                      {f.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-slate-700">{f.description}</p>
                    <Link
                      href={f.href}
                      className="group/btn mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Explore
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>

                  <div className="hidden shrink-0 rotate-2 sm:block" aria-hidden>
                    {f.preview}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
