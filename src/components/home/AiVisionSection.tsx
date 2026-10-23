"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  ChartColumn,
  Check,
  ChevronsLeftRight,
  Cloud,
  Inbox,
  Mail,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import UnderlineHighlight, { SECTION_HEADING } from "@/components/home/UnderlineHighlight";

const OLD_LINES = ["Memorize syntax.", "Grind alone.", "Hope for a callback."];

/* Same pastel set as the hero's floating cards */
const NEW_LINES: { text: string; icon: LucideIcon; pill: string }[] = [
  { text: "Orchestrate AI.", icon: Sparkles, pill: "bg-violet-200" },
  { text: "Ship at scale.", icon: Cloud, pill: "bg-amber-200" },
  { text: "Get hired.", icon: ChartColumn, pill: "bg-emerald-200" },
];

export default function AiVisionSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-120px" });
  const reduceMotion = useReducedMotion();
  /* Divider position in % from the left; the spring makes it glide after the mouse */
  const target = useMotionValue(50);
  const pos = useSpring(target, { stiffness: 260, damping: 32, mass: 0.6 });
  const hiddenRight = useTransform(pos, (v) => 100 - v);
  const clipPath = useMotionTemplate`inset(0 ${hiddenRight}% 0 0)`;
  const dividerLeft = useMotionTemplate`${pos}%`;
  /* Mirrors the target for the range input (keyboard + screen readers) */
  const [value, setValue] = useState(50);
  useMotionValueEvent(target, "change", (v) => setValue(Math.round(v)));
  const [touched, setTouched] = useState(false);

  /* "Try me" hint: the handle sweeps once when the card scrolls into view */
  useEffect(() => {
    if (!inView || reduceMotion || touched) return;
    const controls = animate(target, [50, 32, 68, 50], {
      duration: 2.2,
      ease: "easeInOut",
      delay: 0.4,
    });
    return () => controls.stop();
  }, [inView, reduceMotion, touched, target]);

  /* Mouse: the divider follows the cursor on hover — no click needed */
  const followPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTouched(true);
    target.set(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-32">
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <h2 className={SECTION_HEADING}>
            Master the Stack. <UnderlineHighlight>Command the AI.</UnderlineHighlight>
          </h2>        </div>

        {/* Before / after card */}
        <div
          ref={cardRef}
          onPointerMove={followPointer}
          onPointerLeave={(e) => e.pointerType === "mouse" && target.set(50)}
          className="relative mt-12 h-[380px] select-none overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.35)] md:mt-16 md:h-[440px]"
        >
          {/* Today — full background layer */}
          <div className="absolute inset-0 bg-white">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sky-100 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-violet-100 blur-3xl"
              aria-hidden
            />
            <div className="absolute inset-y-0 right-0 flex w-1/2 flex-col justify-center pl-8 pr-6 md:pl-14 md:pr-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 md:text-xs">
                Today&apos;s developer
              </p>
              <ul className="mt-4 space-y-2 font-serif text-2xl leading-tight text-slate-950 md:mt-6 md:space-y-3 md:text-[2.6rem]">
                {NEW_LINES.map(({ text, icon: Icon, pill }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 -rotate-6 items-center justify-center rounded-lg text-slate-900 md:h-10 md:w-10 md:rounded-xl ${pill}`}
                    >
                      <Icon className="h-3.5 w-3.5 md:h-5 md:w-5" strokeWidth={2.25} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-slate-500 md:mt-8 md:text-sm">With CUS Interview</p>
            </div>

            {/* Left half of the new side — only seen when the handle is dragged left */}
            <div className="absolute inset-y-0 left-0 hidden w-1/2 sm:block" aria-hidden>
              {/* Live AI interviewer chat */}
              <div className="absolute left-[10%] top-[14%] w-[66%] rotate-2 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-center gap-2.5">
                  <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-sky-200">
                    <Image src="/Ai-interview.jpeg" alt="" fill sizes="64px" className="object-cover object-top" />
                  </span>
                  <span className="text-[12px] font-semibold text-slate-900">AI Interviewer</span>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Live
                  </span>
                </div>
                <p className="mt-2.5 rounded-xl bg-slate-50 px-3 py-2 text-[13px] leading-snug text-slate-700">
                  Great answer! Now, how would you cache this at scale?
                </p>
              </div>

              {/* Resume score */}
              <div className="absolute bottom-[14%] left-[8%] flex -rotate-3 items-center gap-3 rounded-2xl bg-emerald-200 px-4 py-3">
                <span className="relative inline-flex h-11 w-11 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${0.92 * 94.2} 94.2`}
                    />
                  </svg>
                  <span className="text-[12px] font-bold text-slate-900">92</span>
                </span>
                <span className="text-[12px] leading-tight text-slate-800">
                  <span className="block font-semibold">Resume score</span>
                  ATS ready
                </span>
              </div>

              {/* Offer toast */}
              <div className="absolute bottom-[24%] right-[8%] flex rotate-2 items-center gap-2 rounded-full bg-slate-950 py-2 pl-2 pr-4 text-white shadow-[0_12px_28px_-12px_rgba(15,23,42,0.6)]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-[13px] font-semibold">Offer received</span>
              </div>
            </div>
          </div>

          {/* Yesterday — clipped to the left of the handle */}
          <motion.div className="absolute inset-0 bg-slate-100" style={{ clipPath }}>
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 31px, rgba(148,163,184,0.25) 31px 32px)",
              }}
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col justify-center pl-6 pr-8 md:pl-12 md:pr-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:text-xs">
                Yesterday&apos;s developer
              </p>
              <ul className="mt-4 space-y-2 font-serif text-2xl leading-tight text-slate-400 md:mt-6 md:space-y-3 md:text-[2.6rem]">
                {OLD_LINES.map((text) => (
                  <li key={text} className="line-through decoration-rose-300 decoration-2">
                    {text}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-slate-400 md:mt-8 md:text-sm">The old way</p>
            </div>

            {/* Right half of the old side — only seen when the handle is dragged right */}
            <div className="absolute inset-y-0 right-0 hidden w-1/2 sm:block" aria-hidden>
              {/* Rejection email */}
              <div className="absolute left-[12%] top-[16%] w-[62%] -rotate-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Re: Your application</span>
                </div>
                <p className="mt-2 text-sm leading-snug">
                  Unfortunately, we&apos;ve decided to move forward with other candidates…
                </p>
              </div>

              {/* Syntax book sticky note */}
              <div className="absolute bottom-[14%] left-[10%] w-[38%] rotate-3 rounded-md bg-slate-200 p-3 text-slate-500 shadow-sm">
                <BookOpen className="h-4 w-4" />
                <p className="mt-1.5 font-serif text-base leading-tight">Read the 600-page syntax book</p>
              </div>

              {/* Empty inbox */}
              <div className="absolute bottom-[20%] right-[10%] flex -rotate-2 items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-400">
                <Inbox className="h-5 w-5" />
                <span>
                  <span className="block font-serif text-2xl leading-none text-slate-500">0</span>
                  <span className="text-[11px]">callbacks this month</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Divider + handle */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-slate-900"
            style={{ left: dividerLeft }}
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_10px_24px_-8px_rgba(15,23,42,0.6)] ring-4 ring-white">
              <ChevronsLeftRight className="h-5 w-5" />
            </span>
          </motion.div>

          {/* Native range input on top: touch drag and arrow keys (mouse hover is handled by the card) */}
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={value}
            onChange={(e) => {
              setTouched(true);
              target.set(Number(e.target.value));
            }}
            onPointerDown={() => setTouched(true)}
            aria-label="Compare yesterday's developer with today's developer"
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
    </section>
  );
}
