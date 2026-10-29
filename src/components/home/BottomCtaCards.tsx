"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check, Code, ShieldCheck, Users } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Mini previews (decorative) — they "come alive" once the card scrolls into view ─── */

function DeveloperPreview({ play }: { play: boolean }) {
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(reduceMotion ? 72 : 0);
  const percent = useTransform(progress, (v) => `${Math.round(v)}%`);
  const width = useTransform(progress, (v) => `${v}%`);

  useEffect(() => {
    if (!play || reduceMotion) return;
    const controls = animate(progress, 72, { duration: 1.4, ease: EASE, delay: 0.5 });
    return () => controls.stop();
  }, [play, reduceMotion, progress]);

  return (
    <div className="w-[230px] rounded-2xl bg-white p-4 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between">
        <span className="flex -space-x-2">
          {["/avatar1.png", "/avatar2.png", "/avatar3.png"].map((src, i) => (
            <motion.span
              key={src}
              className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-white"
              initial={reduceMotion ? false : { opacity: 0, x: -10, scale: 0.6 }}
              animate={play ? { opacity: 1, x: 0, scale: 1 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.15 + i * 0.1 }}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </motion.span>
          ))}
          <motion.span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[9px] font-bold text-white ring-2 ring-white"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={play ? { opacity: 1, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.45 }}
          >
            +2k
          </motion.span>
        </span>
        <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">Today</span>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
        Two Sum · solved
        <motion.span
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
          initial={reduceMotion ? false : { scale: 0, rotate: -90 }}
          animate={play ? { scale: 1, rotate: 0 } : undefined}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 1.9 }}
        >
          <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
        </motion.span>
      </p>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <motion.div className="h-full rounded-full bg-slate-900" style={{ width }} />
        </div>
        <motion.span className="w-7 text-right text-[10px] tabular-nums text-slate-500">{percent}</motion.span>
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">Weekly goal · 18 of 25 problems</p>
    </div>
  );
}

const SKILLS = [
  ["Problem solving", "88%"],
  ["Code quality", "76%"],
  ["Communication", "82%"],
] as const;

function CompanyPreview({ play }: { play: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-[230px] rounded-2xl bg-white p-4 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-slate-900">Candidate report</p>
        {/* Stamped on once the scores are in */}
        <motion.span
          className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200"
          initial={reduceMotion ? false : { opacity: 0, scale: 2.4, rotate: -18 }}
          animate={play ? { opacity: 1, scale: 1, rotate: -4 } : undefined}
          transition={{ type: "spring", stiffness: 500, damping: 18, delay: 1.7 }}
        >
          <Check className="h-3 w-3" /> Pass
        </motion.span>
      </div>

      <div className="mt-3 space-y-2">
        {SKILLS.map(([label, width], i) => (
          <div key={label}>
            <p className="text-[10px] text-slate-500">{label}</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-slate-900"
                initial={reduceMotion ? false : { width: 0 }}
                animate={play ? { width } : undefined}
                style={reduceMotion ? { width } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: 0.4 + i * 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>

      <motion.p
        className="mt-3 inline-flex items-center gap-1 text-[10px] text-slate-400"
        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, delay: 2 }}
      >
        <ShieldCheck className="h-3 w-3" /> Integrity check passed
      </motion.p>
    </div>
  );
}

/* ─── Die-cut sticker that "slaps" on last ──────────────────── */

function Sticker({ children, className, play }: { children: ReactNode; className: string; play: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={`absolute inline-flex items-center gap-1.5 rounded-full border-[3px] border-white px-3.5 py-1.5 text-[12px] font-bold drop-shadow-[0_10px_14px_rgba(15,23,42,0.22)] ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 1.8, rotate: -25 }}
      animate={play ? { opacity: 1, scale: 1, rotate: 4 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 16, delay: 2.2 }}
    >
      {children}
    </motion.span>
  );
}

/* ─── Card ──────────────────────────────────────────────────── */

type CardData = {
  key: string;
  label: string;
  description: string;
  href: string;
  cta: string;
  bg: string;
  icon: typeof Code;
  Preview: (props: { play: boolean }) => ReactNode;
  sticker: { text: ReactNode; className: string };
};

const CARDS: CardData[] = [
  {
    key: "dev",
    label: "Developers",
    description:
      "Join thousands of developers practicing problems, taking mock interviews, and landing their dream roles.",
    href: "/signup",
    cta: "Let's start",
    bg: "bg-sky-200",
    icon: Code,
    Preview: DeveloperPreview,
    sticker: { text: "★ Free to start", className: "-right-4 -top-7 bg-amber-200 text-slate-900" },
  },
  {
    key: "company",
    label: "Companies",
    description:
      "Assess candidates fairly with structured take-home challenges and integrity-focused evaluation tools.",
    href: "/for-companies",
    cta: "Let's connect with us",
    bg: "bg-violet-200",
    icon: Users,
    Preview: CompanyPreview,
    sticker: { text: "✓ Fair hiring", className: "-left-4 -top-7 bg-emerald-200 text-slate-900" },
  },
];

/* Button that leans towards the cursor */
function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 18 });
  const sy = useSpring(y, { stiffness: 300, damping: 18 });

  return (
    <motion.span
      className="mt-7 inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link
        href={href}
        className="group/btn inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-950 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-slate-800"
      >
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </motion.span>
  );
}

const DEPTH_SPRING = { stiffness: 160, damping: 20, mass: 0.6 };

function CtaCard({ card }: { card: CardData }) {
  const ref = useRef<HTMLDivElement>(null);
  const play = useInView(ref, { once: true, margin: "-120px" });
  const reduceMotion = useReducedMotion();
  const Icon = card.icon;
  const { Preview } = card;

  /* Cursor position in the card, from -0.5 to 0.5 on each axis */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, DEPTH_SPRING);
  const sy = useSpring(py, DEPTH_SPRING);

  /* Depth: the card tilts, and each layer drifts by a different amount */
  const rotateX = useTransform(sy, (v) => v * -6);
  const rotateY = useTransform(sx, (v) => v * 8);
  const textX = useTransform(sx, (v) => v * -10);
  const textY = useTransform(sy, (v) => v * -6);
  const previewX = useTransform(sx, (v) => v * 22);
  const previewY = useTransform(sy, (v) => v * 16);
  const previewRotate = useTransform(sx, (v) => v * 4);
  const stickerX = useTransform(sx, (v) => v * 40);
  const stickerY = useTransform(sy, (v) => v * 30);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    /* Spotlight position */
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    if (e.pointerType !== "mouse" || reduceMotion) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-[32px] p-8 transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(15,23,42,0.5)] md:p-10 ${card.bg}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.55), transparent 60%)",
        }}
        aria-hidden
      />

      {/* Top row: label + dark icon chip */}
      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{card.label}</span>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_10px_20px_-10px_rgba(15,23,42,0.6)] transition-transform duration-500 group-hover:-rotate-6">
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
      </div>

      <div className="relative mt-auto flex items-end justify-between gap-8 pt-12">
        <motion.div className="min-w-0 max-w-sm flex-1" style={{ x: textX, y: textY }}>
          <h3 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-slate-950 md:text-[2.75rem]">
            For {card.label}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{card.description}</p>
          <MagneticLink href={card.href}>{card.cta}</MagneticLink>
        </motion.div>

        {/* Preview — only where the card is wide enough to sit beside the text */}
        <motion.div
          className="relative hidden shrink-0 sm:block lg:hidden xl:block"
          initial={{ opacity: 0, y: 24 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE }}
          aria-hidden
        >
          <motion.div style={{ x: previewX, y: previewY, rotate: previewRotate }}>
            <Preview play={play} />
            <motion.div className="absolute inset-0" style={{ x: stickerX, y: stickerY }}>
              <Sticker className={card.sticker.className} play={play}>
                {card.sticker.text}
              </Sticker>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function BottomCtaCards() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-2">
        {CARDS.map((card) => (
          <CtaCard key={card.key} card={card} />
        ))}
      </div>
    </section>
  );
}
