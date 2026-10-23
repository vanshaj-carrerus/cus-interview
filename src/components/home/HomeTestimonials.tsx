"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import UnderlineHighlight, { SECTION_HEADING } from "@/components/home/UnderlineHighlight";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  /* pastel card colour — same set as the hero's floating cards */
  tone: string;
  glow: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "The platform engages you and you learn a lot — you gain real confidence. Today I have offers from two big companies. The moment I joined, things changed completely.",
    name: "Deepanshu",
    role: "Software Engineer",
    avatar: "/avatar1.png",
    tone: "bg-sky-200",
    glow: "bg-sky-200/50",
  },
  {
    id: 2,
    quote:
      "CUS Interview prepares you not only for interviews, but for the actual job too. You learn to write error-free code and master professional technical communication.",
    name: "Atif Ali",
    role: "Backend Developer",
    avatar: "/avatar3.png",
    tone: "bg-violet-200",
    glow: "bg-violet-200/50",
  },
  {
    id: 3,
    quote:
      "A super interactive platform. After two months of coaching, I finally got placed at a dream company with an amazing package.",
    name: "Prashant",
    role: "Full Stack Developer",
    tone: "bg-amber-200",
    glow: "bg-amber-200/50",
  },
  {
    id: 4,
    quote:
      "I had been struggling with technical concepts for months. The structured approach made everything click. The mentors really understand industry standards.",
    name: "Ananya",
    role: "Frontend Engineer",
    avatar: "/avatar2.png",
    tone: "bg-emerald-200",
    glow: "bg-emerald-200/50",
  },
];

const TOTAL = TESTIMONIALS.length;
const AUTOPLAY_MS = 7000;

/* Arc geometry (px) — avatars sit on a circle whose right edge peeks into view */
const RADIUS = 330;
const CENTER = { x: 150 - RADIUS, y: 210 };
const STEP_DEG = 28;
const ACTIVE_SIZE = 60;
const SIDE_SCALE = 40 / ACTIVE_SIZE;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/* Signed distance of an item from the (continuous) rotation, wrapped to [-TOTAL/2, TOTAL/2) */
const wrapOffset = (index: number, rotation: number) =>
  mod(index - rotation + TOTAL / 2, TOTAL) - TOTAL / 2;

function Avatar({ t, size }: { t: Testimonial; size: number }) {
  return (
    <span
      className="relative block overflow-hidden rounded-full bg-slate-900"
      style={{ width: size, height: size }}
    >
      {t.avatar ? (
        <Image src={t.avatar} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-base font-semibold text-white">
          {t.name.slice(0, 1)}
        </span>
      )}
    </span>
  );
}

function ArcItem({
  t,
  index,
  rotation,
  isActive,
  onSelect,
}: {
  t: Testimonial;
  index: number;
  rotation: MotionValue<number>;
  isActive: boolean;
  onSelect: () => void;
}) {
  /* Everything is derived from the rotation, so items glide along the circle itself */
  const offset = useTransform(rotation, (r) => wrapOffset(index, r));
  const x = useTransform(offset, (d) => CENTER.x + RADIUS * Math.cos((d * STEP_DEG * Math.PI) / 180));
  const y = useTransform(offset, (d) => CENTER.y + RADIUS * Math.sin((d * STEP_DEG * Math.PI) / 180));
  const scale = useTransform(offset, (d) => 1 - Math.min(Math.abs(d), 1) * (1 - SIDE_SCALE));
  const opacity = useTransform(offset, (d) => Math.max(0, Math.min(1, 1 - (Math.abs(d) - 1) / 0.6)));
  const labelX = useTransform(scale, (s) => (ACTIVE_SIZE / 2) * s + 16);
  const labelScale = useTransform(scale, [SIDE_SCALE, 1], [0.85, 1]);
  const visibility = useTransform(opacity, (o) => (o < 0.05 ? "hidden" : "visible"));

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      tabIndex={isActive ? -1 : 0}
      aria-label={`Show ${t.name}'s testimonial`}
      className="group absolute left-0 top-0"
      style={{ x, y, opacity, visibility }}
    >
      <motion.span
        className={`absolute -ml-[30px] -mt-[30px] block rounded-full bg-white p-[3px] transition-shadow duration-500 ${isActive
          ? "shadow-[0_0_0_2px_#0f172a,0_12px_24px_-8px_rgba(15,23,42,0.45)]"
          : "shadow-[0_6px_16px_-8px_rgba(15,23,42,0.35)] group-hover:shadow-[0_0_0_2px_#cbd5e1]"
          }`}
        style={{ scale }}
      >
        <Avatar t={t} size={ACTIVE_SIZE - 6} />
      </motion.span>
      <motion.span
        className="absolute left-0 top-0 block origin-left -translate-y-1/2 whitespace-nowrap text-left"
        style={{ x: labelX, scale: labelScale }}
      >
        <span className="block text-base font-semibold text-slate-900">{t.name}</span>
        <span className="block text-xs text-slate-500">{t.role}</span>
      </motion.span>
    </motion.button>
  );
}

export default function HomeTestimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Unwrapped rotation: keeps counting past TOTAL so the wheel always turns the short way */
  const rotation = useMotionValue(0);
  const target = useRef(0);

  const rotateTo = useCallback(
    (next: number) => {
      const steps = Math.abs(next - target.current);
      if (!steps) return;
      target.current = next;
      setActive(mod(next, TOTAL));
      /* Longer jumps roll through each person in between, one after another */
      animate(rotation, next, {
        duration: 0.6 + (steps - 1) * 0.35,
        ease: [0.65, 0, 0.35, 1],
      });
    },
    [rotation],
  );

  const goTo = useCallback(
    (index: number) => {
      const diff = wrapOffset(index, target.current);
      rotateTo(target.current + Math.round(diff));
    },
    [rotateTo],
  );
  const prev = useCallback(() => rotateTo(target.current - 1), [rotateTo]);
  const next = useCallback(() => rotateTo(target.current + 1), [rotateTo]);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, next]);

  const current = TESTIMONIALS[active];

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={SECTION_HEADING}>
            Loved by developers from <UnderlineHighlight>all backgrounds</UnderlineHighlight>
          </h2>        </div>

        <div
          className="mt-14 grid grid-cols-1 items-center gap-10 md:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Arc with avatars (desktop) */}
          <div className="relative hidden h-[420px] lg:block">
            <div
              className="pointer-events-none absolute -inset-y-16 -left-[60rem] right-0"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
              }}
              aria-hidden
            >
              <div
                className="absolute rounded-full border-[1.5px] border-slate-300"
                style={{
                  width: RADIUS * 2,
                  height: RADIUS * 2,
                  left: `calc(60rem + ${CENTER.x - RADIUS}px)`,
                  top: `calc(4rem + ${CENTER.y - RADIUS}px)`,
                }}
              />
            </div>

            {/* Soft glow behind the active avatar */}
            <div
              className={`pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-700 ${current.glow}`}
              style={{ left: CENTER.x + RADIUS + 40, top: CENTER.y }}
              aria-hidden
            />

            {TESTIMONIALS.map((t, i) => (
              <ArcItem
                key={t.id}
                t={t}
                index={i}
                rotation={rotation}
                isActive={i === active}
                onSelect={() => goTo(i)}
              />
            ))}
          </div>

          {/* Avatar row (mobile / tablet) */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${t.name}'s testimonial`}
                className={`rounded-full bg-white p-[3px] transition-all duration-300 ${i === active ? "shadow-[0_0_0_2px_#0f172a]" : "opacity-60"
                  }`}
              >
                <Avatar t={t} size={i === active ? 52 : 40} />
              </button>
            ))}
          </div>

          {/* Quote */}
          <div className="text-left">
            {/* Pastel quote card — its colour follows the active person */}
            <div
              className={`relative rounded-[28px] p-7 pt-10 transition-colors duration-700 ease-out md:p-10 md:pt-12 ${current.tone}`}
            >
              {/* Dark quote chip, tilted like the hero's code chip */}
              <span
                className="absolute -top-5 left-7 inline-flex h-12 w-12 -rotate-6 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_24px_-10px_rgba(15,23,42,0.6)] md:left-10"
                aria-hidden
              >
                <Quote className="h-5 w-5 fill-white" />
              </span>

              {/* Die-cut star sticker — pops in for each testimonial */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.id}
                  className="absolute -right-3 -top-5 inline-flex items-center gap-0.5 rounded-full border-[3px] border-white bg-white px-3 py-1.5 drop-shadow-[0_10px_14px_rgba(15,23,42,0.2)] md:-right-5"
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 8 }}
                  exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.2 }}
                  aria-hidden
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  ))}
                </motion.span>
              </AnimatePresence>

              <div className="relative min-h-[260px] md:min-h-[230px]" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={current.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <blockquote className="font-serif text-2xl font-normal leading-snug tracking-[-0.01em] text-slate-950 md:text-[30px] md:leading-[1.3]">
                      &ldquo;{current.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-7 flex items-center gap-3">
                      <span className="rounded-full bg-white p-[2px]">
                        <Avatar t={current} size={40} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-950">{current.name}</span>
                        <span className="block text-[13px] text-slate-700">{current.role}</span>
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-center gap-4 lg:justify-start">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-all hover:-translate-x-0.5 hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-slate-950" : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-all hover:translate-x-0.5 hover:bg-slate-800"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
