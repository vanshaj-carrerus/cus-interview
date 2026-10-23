"use client";

import { useCallback, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChartColumn,
  Code,
  GraduationCap,
  Monitor,
  type LucideIcon,
} from "lucide-react";

type HeroTheme = {
  /* gradient for bars + active icon */
  accent: string;
  /* resting icon chip */
  soft: string;
  /* badge + tag chips */
  chip: string;
  /* corner glow on the active card */
  glow: string;
  /* gradient border colours on the active card */
  border: [string, string];
  shadow: string;
  link: string;
};

type HeroCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge: string;
  tags: string[];
  theme: HeroTheme;
};

const heroCards: HeroCard[] = [
  {
    title: "AI Mock Interview",
    description:
      "Simulate realistic technical interviews with intelligent real-time conversational feedback.",
    href: "/dashboard/ai-mock-interview",
    icon: Monitor,
    badge: "AI",
    tags: ["Live feedback", "Voice", "Scorecard"],
    theme: {
      accent: "from-indigo-400 to-violet-500",
      soft: "bg-indigo-50 text-indigo-500 ring-indigo-100",
      chip: "bg-indigo-50/80 text-indigo-600 ring-indigo-100",
      glow: "bg-indigo-200/60",
      border: ["#a5b4fc", "#c4b5fd"],
      shadow: "rgba(99,102,241,0.4)",
      link: "text-indigo-600 hover:text-indigo-700",
    },
  },
  {
    title: "Practice Real Interviews",
    description:
      "Sharpen problem-solving skills with handpicked questions across key data structures & algorithms.",
    href: "/dashboard/practice-problems",
    icon: Code,
    badge: "DSA",
    tags: ["Arrays", "Graphs", "DP"],
    theme: {
      accent: "from-sky-400 to-cyan-400",
      soft: "bg-cyan-50 text-cyan-500 ring-cyan-100",
      chip: "bg-cyan-50/80 text-cyan-600 ring-cyan-100",
      glow: "bg-cyan-200/60",
      border: ["#7dd3fc", "#67e8f9"],
      shadow: "rgba(6,182,212,0.4)",
      link: "text-cyan-600 hover:text-cyan-700",
    },
  },
  {
    title: "Improve Your Skills",
    description:
      "Systematic mastery track for concurrency, memory management, and high-frequency company rounds.",
    href: "/dashboard/programming-languages",
    icon: ChartColumn,
    badge: "Core",
    tags: ["Concurrency", "Memory", "Systems"],
    theme: {
      accent: "from-sky-500 to-blue-600",
      soft: "bg-sky-50 text-sky-500 ring-sky-100",
      chip: "bg-sky-50/80 text-sky-600 ring-sky-100",
      glow: "bg-sky-200/60",
      border: ["#7dd3fc", "#93c5fd"],
      shadow: "rgba(14,165,233,0.45)",
      link: "text-sky-600 hover:text-sky-700",
    },
  },
  {
    title: "Get Personalized Learning Paths",
    description:
      "AI-curated roadmaps tailored to your target company level and current technical weaknesses.",
    href: "/dashboard",
    icon: GraduationCap,
    badge: "Paths",
    tags: ["Roadmaps", "Weak spots", "Goals"],
    theme: {
      accent: "from-purple-400 to-fuchsia-500",
      soft: "bg-purple-50 text-purple-500 ring-purple-100",
      chip: "bg-purple-50/80 text-purple-600 ring-purple-100",
      glow: "bg-purple-200/60",
      border: ["#d8b4fe", "#f0abfc"],
      shadow: "rgba(168,85,247,0.4)",
      link: "text-purple-600 hover:text-purple-700",
    },
  },
  {
    title: "Company Question Archives",
    description:
      "Questions categorized by tech stack, company tier, and specific interview rounds.",
    href: "/dashboard/company-interviews",
    icon: Building2,
    badge: "Archive",
    tags: ["By company", "By round", "Tech stack"],
    theme: {
      accent: "from-teal-400 to-emerald-500",
      soft: "bg-teal-50 text-teal-500 ring-teal-100",
      chip: "bg-teal-50/80 text-teal-600 ring-teal-100",
      glow: "bg-teal-200/60",
      border: ["#5eead4", "#6ee7b7"],
      shadow: "rgba(20,184,166,0.4)",
      link: "text-teal-600 hover:text-teal-700",
    },
  },
];

/* Position of each card relative to the active one: -2 … 2 */
function getOffset(index: number, active: number, total: number) {
  let d = index - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

const positions: Record<
  number,
  { x: number; scale: number; rotate: number; opacity: number; blur: number; z: number }
> = {
  0: { x: 0, scale: 1, rotate: 0, opacity: 1, blur: 0, z: 30 },
  1: { x: 1, scale: 0.86, rotate: 10, opacity: 1, blur: 0, z: 20 },
  2: { x: 1.72, scale: 0.72, rotate: 18, opacity: 0.5, blur: 1.5, z: 10 },
};

const AUTOPLAY_MS = 3000;

/* Horizontal gap between card centres, by breakpoint */
function getStep() {
  const w = window.innerWidth;
  if (w >= 1024) return 270;
  if (w >= 768) return 230;
  if (w >= 640) return 180;
  return 110;
}

function subscribeResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

const SPRING = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } as const;

export default function CusInterviewHero() {
  const total = heroCards.length;
  /* Keep the previous slide so a card wrapping round the ends can fade instead of sliding across */
  const [{ active, previous }, setSlide] = useState({ active: 2, previous: 2 });
  const setActive = useCallback(
    (update: number | ((a: number) => number)) =>
      setSlide((s) => ({
        active: typeof update === "function" ? update(s.active) : update,
        previous: s.active,
      })),
    [],
  );
  const step = useSyncExternalStore(subscribeResize, getStep, () => 270);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total, setActive]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total, setActive]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f5f9fe] to-[#f7fafd]">
      {/* Light beam from the top centre */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 45% at 50% -8%, rgba(125,211,252,0.45) 0%, rgba(186,230,253,0.18) 45%, transparent 75%)",
        }}
      />

      {/* Slowly drifting colour blobs */}
      <div
        className="pointer-events-none absolute -left-32 top-24 h-[30rem] w-[30rem] rounded-full bg-sky-200/50 blur-[110px] motion-safe:animate-[hero-drift_18s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-violet-200/45 blur-[110px] motion-safe:animate-[hero-drift_22s_ease-in-out_infinite_reverse]"
        aria-hidden
      />

      {/* Fine dot pattern, faded towards the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(rgba(100,116,139,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 65% 50% at 50% 28%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 50% at 50% 28%, black 10%, transparent 70%)",
        }}
      />

      {/* Glowing horizon arc behind the cards */}
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[1600px] w-[1600px] -translate-x-1/2 rounded-full"
        aria-hidden
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0) 92%, rgba(186,230,253,0.55) 98%, rgba(255,255,255,0) 100%)",
          boxShadow: "0 -30px 120px -40px rgba(56,189,248,0.35)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 35%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 35%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[1600px] w-[1600px] -translate-x-1/2 rounded-full border border-sky-200/70"
        aria-hidden
        style={{
          maskImage: "linear-gradient(to right, transparent 15%, black 50%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 15%, black 50%, transparent 85%)",
        }}
      />

      {/* Blend into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#f7fafd]"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-10 md:py-6">
        <h1 className="text-center text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
          Building the Future of
          <br />
          <span className="bg-gradient-to-r from-sky-500 via-sky-500 to-blue-600 bg-clip-text pb-1 text-transparent">
            AI–Driven Development.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-500 sm:text-base">
          CUS Interview enables skill improvement through automated assessments,
          AI-powered mock interviews, and personalized learning paths — helping
          developers and companies grow together.
        </p>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/for-companies"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-sky-400 to-sky-500 px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(14,165,233,0.7),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(14,165,233,0.75),inset_0_1px_0_rgba(255,255,255,0.25)] sm:w-auto"
          >
            For Companies
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-[15px] font-semibold text-slate-900 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.15)] transition-all hover:-translate-y-0.5 hover:border-slate-300 sm:w-auto"
          >
            Developer Dashboard
          </Link>
        </div>

        {/* Card carousel */}
        <div
          className="relative mt-14 h-[330px] w-full outline-none sm:h-[350px] md:mt-16 md:h-[360px]"
          role="region"
          aria-roledescription="carousel"
          aria-label="CUS Interview features"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            perspective: "1600px",
            maskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
          }}
        >
          {heroCards.map((card, i) => {
            const d = getOffset(i, active, total);
            const prevD = getOffset(i, previous, total);
            const pos = positions[Math.abs(d)];
            const isActive = d === 0;
            const Icon = card.icon;
            const { theme } = card;
            /* Card jumping from one end to the other: snap across and fade in */
            const wraps = Math.abs(d - prevD) > 2;

            return (
              <motion.div
                key={card.title}
                onClick={() => !isActive && setActive(i)}
                aria-current={isActive}
                aria-hidden={Math.abs(d) === 2}
                className={`group absolute left-1/2 top-0 -ml-[110px] flex h-[310px] w-[220px] flex-col overflow-hidden rounded-[22px] border p-5 text-left transition-[box-shadow,border-color,background-color] duration-500 sm:-ml-[130px] sm:h-[340px] sm:w-[260px] md:-ml-[145px] md:h-[350px] md:w-[290px] md:p-6 ${
                  isActive
                    ? "border-transparent"
                    : "cursor-pointer border-white/80 bg-white/75 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_14px_34px_-18px_rgba(15,23,42,0.22)] backdrop-blur-md hover:bg-white/90"
                }`}
                initial={false}
                animate={{
                  x: Math.sign(d) * pos.x * step,
                  scale: pos.scale,
                  rotateY: -Math.sign(d) * pos.rotate,
                  opacity: wraps ? [0, pos.opacity] : pos.opacity,
                  filter: `blur(${pos.blur}px)`,
                }}
                transition={
                  wraps
                    ? { x: { duration: 0 }, rotateY: { duration: 0 }, scale: { duration: 0 }, default: { duration: 0.45, ease: "easeOut" } }
                    : { ...SPRING, opacity: { duration: 0.35, ease: "easeOut" }, filter: { duration: 0.35 } }
                }
                style={{
                  zIndex: pos.z,
                  willChange: "transform",
                  ...(isActive && {
                    background: `linear-gradient(#fff, #fff) padding-box, linear-gradient(140deg, ${theme.border[0]}, #e2e8f0 45%, ${theme.border[1]}) border-box`,
                    boxShadow: "0 8px 20px -14px rgba(15,23,42,0.12), inset 0 1px 0 #fff",
                  }),
                }}
              >
                {/* Dot texture + corner glow */}
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}
                  aria-hidden
                  style={{
                    backgroundImage: "radial-gradient(rgba(148,163,184,0.22) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                    maskImage: "radial-gradient(circle at 100% 0%, black, transparent 55%)",
                    WebkitMaskImage: "radial-gradient(circle at 100% 0%, black, transparent 55%)",
                  }}
                />
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl transition-opacity duration-700 ${theme.glow} ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-500 md:h-12 md:w-12 ${
                      isActive
                        ? `bg-gradient-to-br ${theme.accent} text-white shadow-[0_10px_20px_-8px_var(--tw-shadow-color),inset_0_1px_0_rgba(255,255,255,0.35)]`
                        : `ring-1 ${theme.soft}`
                    }`}
                    style={isActive ? ({ "--tw-shadow-color": theme.shadow } as React.CSSProperties) : undefined}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 transition-all duration-500 ${theme.chip} ${
                      isActive ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3 className="relative mt-5 text-xl font-bold leading-snug tracking-tight text-slate-900 md:text-[22px]">
                  {card.title}
                </h3>
                <p className="relative mt-2.5 text-[13px] leading-relaxed text-slate-500 md:text-sm">
                  {card.description}
                </p>

                {isActive && (
                  <ul className="relative mt-4 flex flex-wrap gap-1.5">
                    {card.tags.map((tag, t) => (
                      <li
                        key={tag}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 motion-safe:animate-[hero-fade-up_0.5s_ease-out_both] ${theme.chip}`}
                        style={{ animationDelay: `${150 + t * 70}ms` }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="relative mt-auto">
                  {isActive ? (
                    <>
                      <Link
                        href={card.href}
                        className={`group/link inline-flex items-center gap-1.5 text-sm font-semibold ${theme.link}`}
                      >
                        Explore
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                      {/* Autoplay progress — finishing the bar advances the carousel */}
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          key={active}
                          className={`h-full rounded-full bg-gradient-to-r ${theme.accent} motion-safe:animate-[hero-progress_linear_forwards] motion-reduce:w-1/2`}
                          style={{
                            animationDuration: `${AUTOPLAY_MS}ms`,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                          onAnimationEnd={next}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className={`h-1 w-1/2 rounded-full bg-gradient-to-r ${theme.accent}`} />
                      <div className="h-1 w-1/4 rounded-full bg-slate-100" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
