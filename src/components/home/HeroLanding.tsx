"use client";

import Image from "next/image";
import Link from "next/link";
import RotatingWord from "@/components/home/RotatingWord";
import { useAuth } from "@/components/providers/auth-provider";
import {
  ArrowUpRight,
  Check,
  Code2,
  Flame,
  Heart,
  MessageCircle,
  Play,
  Mic,
  Send,
  Star,
  Trophy,
  TrendingUp,
} from "lucide-react";


const LOGOS = [
  { name: "Amazon", src: "/logos/amazon.png" },
  { name: "Facebook", src: "/logos/facebook.png" },
  { name: "Goldman Sachs", src: "/logos/goldman-sachs.png" },
  { name: "TCS", src: "/logos/tcs.png" },
  { name: "Accenture", src: "/logos/accenture.png" },
  { name: "HCL", src: "/logos/HCL.png" },
  { name: "HP", src: "/logos/hp.png" },
  { name: "Comcast", src: "/logos/comcast.png" },
  { name: "Humana", src: "/logos/humana.png" },
];

/* Pops in on load, then floats (see .hero-card in globals.css); --enter staggers each card */
const float = "hero-card";

/* Solution typed into the monitor's editor: [text, colour] pairs per line */
const kw = "text-violet-300";
const fn = "text-sky-300";
const tx = "text-slate-300";
const cm = "text-slate-500";
const CODE: [string, string][][] = [
  [["# Two Sum — O(n) with a hash map", cm]],
  [["def ", kw], ["twoSum", fn], ["(nums, target):", tx]],
  [["    seen = {}", tx]],
  [["    for ", kw], ["i, n ", tx], ["in ", kw], ["enumerate", fn], ["(nums):", tx]],
  [["        need = target - n", tx]],
  [["        if ", kw], ["need ", tx], ["in ", kw], ["seen:", tx]],
  [["            return ", kw], ["[seen[need], i]", tx]],
  [["        seen[n] = i", tx]],
];

export default function HeroLanding() {
  const { user } = useAuth();
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-white">
      {/* Soft top glow + fine dots, faded towards the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 45% at 50% 0%, rgba(224,242,254,0.9) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(rgba(100,116,139,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 55% 45% at 50% 20%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 45% at 50% 20%, black 10%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-10 text-center md:pt-[clamp(2.5rem,7svh,5rem)]">
        <h1
          className={`hero-enter font-serif text-[2.5rem] font-normal leading-[1.06] tracking-[-0.025em] text-slate-950 sm:text-[3.25rem] md:text-[clamp(3rem,6.2svh,3.75rem)]`}
        >
          AI-Powered{" "}
          {/* Playful inline code chip */}
          <span
            className="inline-flex h-[0.78em] w-[1.35em] -rotate-6 items-center justify-center rounded-full bg-slate-950 align-[-0.04em] text-white shadow-[0_8px_18px_-8px_rgba(15,23,42,0.6)] transition-transform duration-300 hover:rotate-6"
            aria-hidden
          >
            <Code2 className="h-[0.4em] w-[0.4em]" strokeWidth={2.5} />
          </span>{" "}
          Interview Prep
          <br />
          That Gets You{" "}
          <RotatingWord />
        </h1>

        <p className="hero-enter mx-auto mt-4 [--enter:0.2s] max-w-xl text-[15px] leading-relaxed text-slate-600 md:text-base">
          From practice to offer — sharpen your skills with real coding problems, AI
          mock interviews, and resume insights, all in one place.
        </p>

        <div className="hero-enter mt-7 [--enter:0.35s] flex flex-col items-center justify-center gap-3 sm:flex-row md:mb-6">
          <Link
            href={user ? "/features" : "/signup"}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
          >
            Start Practicing
          </Link>
          <Link
            href="/for-companies"
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-900 bg-white px-6 py-3 text-[15px] font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-slate-50 sm:w-auto"
          >
            For Companies
          </Link>
        </div>

        {/* Stage — pushed to the bottom so the hero fills the screen and sits on the logo strip */}
        <div className="relative mx-auto mt-12 h-[320px] w-full max-w-6xl md:mt-auto md:h-[clamp(290px,37svh,420px)]">
          {/* Arc + glow behind the phone */}
          {/* A true half circle: a circle centred on the stage's bottom edge, clipped by the logo strip */}
          {/* Outer thin ring, passing behind the cards */}
          <div
            className="hero-glow-in pointer-events-none absolute bottom-0 left-1/2 [--enter:0.45s] h-[540px] w-[540px] -translate-x-1/2 translate-y-1/2 rounded-full border border-slate-200 md:h-[clamp(560px,66svh,760px)] md:w-[clamp(560px,66svh,760px)]"
            aria-hidden
          />
          {/* Inner filled glow disc behind the phone, soft at its edge */}
          <div
            className="hero-glow-in pointer-events-none absolute bottom-0 left-1/2 [--enter:0.55s] h-[440px] w-[440px] -translate-x-1/2 translate-y-1/2 rounded-full md:h-[clamp(460px,54svh,620px)] md:w-[clamp(460px,54svh,620px)]"
            aria-hidden
            style={{
              background:
                "radial-gradient(closest-side, rgba(56,189,248,0.45) 0%, rgba(125,211,252,0.45) 35%, rgba(186,230,253,0.45) 65%, rgba(224,242,254,0.35) 85%, rgba(240,249,255,0) 100%)",
            }}
          />

          {/* Desktop monitor — live AI mock interview */}
          <div className="hero-rise absolute bottom-0 left-1/2 z-20 [--enter:0.6s] flex w-[300px] -translate-x-1/2 flex-col items-center md:w-[clamp(380px,44svh,480px)]">
            {/* Screen + bezel */}
            <div className="relative w-full rounded-[18px] bg-slate-900 p-[7px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.55)]">
              {/* Webcam */}
              <span className="absolute left-1/2 top-[2px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-slate-600" aria-hidden />

              {/* Live coding interview: editor on the left, AI + candidate cams on the right */}
              <div className="relative flex aspect-[16/10] flex-col overflow-hidden rounded-[12px] bg-[#0b1220] text-left">
                {/* App bar */}
                <div className="flex items-center gap-2 border-b border-white/5 px-2.5 py-1.5">
                  <span className="flex gap-1" aria-hidden>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[8px] text-slate-300 md:text-[9px]">
                    two_sum.py
                  </span>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-semibold text-white md:text-[9px]">
                    <span className="h-1 w-1 rounded-full bg-white motion-safe:animate-pulse" />
                    Live · 04:12
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-900 md:text-[9px]">
                    <Play className="h-2 w-2 fill-current" /> Run
                  </span>
                </div>

                <div className="flex min-h-0 flex-1">
                  {/* Editor — lines type in one by one */}
                  <div className="min-w-0 flex-1 px-2.5 py-2 font-mono text-[8px] leading-[1.75] md:text-[9.5px]">
                    {CODE.map((line, i) => (
                      <div
                        key={i}
                        className="flex whitespace-pre opacity-0 motion-safe:animate-[hero-fade-up_0.4s_ease-out_forwards] motion-reduce:opacity-100"
                        style={{ animationDelay: `${1.3 + i * 0.16}s` }}
                      >
                        <span className="w-4 shrink-0 select-none text-slate-600">{i + 1}</span>
                        {line.map(([text, color], j) => (
                          <span key={j} className={color}>
                            {text}
                          </span>
                        ))}
                        {i === CODE.length - 1 && (
                          <span className="ml-0.5 inline-block h-[1.1em] w-[1.5px] translate-y-[0.2em] bg-sky-300 motion-safe:animate-[caret-blink_1s_steps(1)_infinite]" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cameras */}
                  <div className="flex w-[34%] shrink-0 flex-col gap-1.5 border-l border-white/5 p-1.5">
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
                      <Image
                        src="/Ai-interview.jpeg"
                        alt="CUS Interview AI interviewer in a live coding interview"
                        fill
                        sizes="(min-width: 768px) 320px, 200px"
                        quality={90}
                        priority
                        className="object-cover object-[50%_20%]"
                      />
                      <span className="absolute bottom-1 left-1 inline-flex items-center gap-0.5 rounded bg-black/55 px-1 text-[7px] font-medium text-white md:text-[8px]">
                        <Mic className="h-2 w-2" /> AI Interviewer
                      </span>
                    </div>
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
                      <Image src="/avatar1.png" alt="" fill sizes="200px" className="object-cover object-[50%_25%]" />
                      <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1 text-[7px] font-medium text-white md:text-[8px]">
                        You
                      </span>
                    </div>
                  </div>
                </div>

                {/* Question + test results */}
                <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.03] px-2.5 py-1.5">
                  <p className="min-w-0 flex-1 truncate text-[8px] text-slate-300 md:text-[9.5px]">
                    <span className="font-semibold text-sky-300">AI:</span> Nice — can you do it in O(n)?
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-300 md:text-[9px]">
                    <Check className="h-2 w-2" strokeWidth={3} /> 3/3 tests
                  </span>
                </div>

                {/* Glass sheen */}
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_35%)]"
                  aria-hidden
                />
              </div>
            </div>

            {/* Stand */}
            <div
              className="h-5 w-16 bg-gradient-to-b from-slate-300 to-slate-200 md:h-7 md:w-20"
              style={{ clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }}
              aria-hidden
            />
            <div className="h-2 w-32 rounded-t-xl bg-gradient-to-b from-slate-200 to-slate-300 md:w-40" aria-hidden />
          </div>

          {/* Daily streak card — top left */}
          <div
            className={`absolute left-[6%] top-[4%] z-10 hidden w-[160px] -rotate-2 lg:-top-8 lg:w-[190px] rounded-[20px] bg-slate-900 p-3.5 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 lg:left-auto lg:right-[calc(50%+clamp(190px,22svh,240px)+36px)] xl:right-[calc(50%+clamp(190px,22svh,240px)+72px)] text-left shadow-[0_20px_40px_-20px_rgba(15,23,42,0.5)] md:block ${float} [--enter:1.1s]`}
            aria-hidden
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-8 w-8 -rotate-6 items-center justify-center rounded-xl bg-amber-300 text-slate-900">
                <Flame className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300">This week</span>
            </div>
            <p className="mt-3 flex items-baseline gap-1.5 text-white">
              <span className="font-serif text-4xl leading-none">12</span>
              <span className="text-[12px] font-medium text-slate-300">day streak</span>
            </p>
            <div className="mt-3 flex justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <span key={i} className="flex flex-col items-center gap-1">
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${
                      i < 5 ? "bg-amber-300 text-slate-900" : "bg-white/10"
                    }`}
                  >
                    {i < 5 && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                  </span>
                  <span className="text-[8px] text-slate-500">{day}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Star rating pill */}
          <div
            className={`absolute left-[14%] top-[calc(4%+120px)] z-20 lg:left-auto lg:right-[calc(50%+clamp(190px,22svh,240px)+12px)] xl:right-[calc(50%+clamp(190px,22svh,240px)+48px)] lg:top-[88px] hidden items-center gap-1 rounded-full bg-sky-200 px-3 py-1.5 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.4)] ring-4 ring-white md:flex ${float} [--enter:1.55s]`}
            aria-hidden
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
            ))}
          </div>

          {/* Interview score — bottom left */}
          <div
            className={`absolute bottom-[16%] left-0 z-10 hidden w-[180px] rotate-1 lg:bottom-[6%] lg:left-auto lg:w-[190px] lg:right-[calc(50%+clamp(190px,22svh,240px)+72px)] xl:right-[calc(50%+clamp(190px,22svh,240px)+112px)] items-center gap-4 rounded-[20px] bg-amber-200 p-4 text-left shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] md:flex ${float} [--enter:1.4s]`}
            aria-hidden
          >
            <div className="flex h-10 items-end gap-1">
              {[60, 90, 45, 75].map((h, i) => (
                <span key={i} className="w-2.5 rounded-sm bg-slate-900" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div>
              <p className="text-[10px] text-slate-700">Interview score</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-2xl font-semibold text-slate-900">
                86%
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white">
                  <TrendingUp className="h-2.5 w-2.5" />
                </span>
              </p>
            </div>
          </div>

          {/* Problems solved — top right */}
          <div
            className={`absolute right-[4%] top-0 z-10 hidden w-[200px] rotate-2 lg:-top-8 lg:w-[190px] lg:left-[calc(50%+clamp(190px,22svh,240px)+36px)] xl:left-[calc(50%+clamp(190px,22svh,240px)+72px)] lg:right-auto overflow-hidden rounded-[20px] bg-emerald-200 p-4 text-left shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] md:block ${float} [--enter:1.25s]`}
            aria-hidden
          >
            <p className="flex items-baseline gap-1.5 text-slate-900">
              <span className="font-serif text-5xl leading-none">120</span>
              <span className="text-sm font-medium">problems</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-700">Solved this week</p>
            <span className="mt-3 inline-block rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900">
              +18%
            </span>
            <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-emerald-700 shadow-sm">
              <Trophy className="h-5 w-5" strokeWidth={2} />
            </span>
          </div>

          {/* Feedback card — bottom right */}
          <div
            className={`absolute bottom-[6%] right-0 z-10 hidden w-[200px] -rotate-1 lg:bottom-[6%] lg:w-[190px] lg:left-[calc(50%+clamp(190px,22svh,240px)+72px)] xl:left-[calc(50%+clamp(190px,22svh,240px)+112px)] lg:right-auto rounded-[20px] border border-slate-100 bg-white p-2.5 text-left shadow-[0_24px_48px_-24px_rgba(15,23,42,0.4)] md:block ${float} [--enter:1.7s]`}
            aria-hidden
          >
            <div className="relative">
              <div className="relative h-[clamp(60px,7.5svh,84px)] overflow-hidden rounded-xl bg-sky-100">
                <Image src="/avatar1.png" alt="" fill sizes="170px" className="object-cover object-[50%_18%]" />
              </div>
              <span className="absolute -bottom-2.5 left-2 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                Offer received
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2.5 px-1 text-slate-400">
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              <MessageCircle className="h-3.5 w-3.5" />
              <ArrowUpRight className="h-3.5 w-3.5" />
              <Send className="ml-auto h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Company logos */}
      <div className="hero-fade relative z-30 [--enter:1.2s] border-t border-slate-100 bg-white py-4 md:py-5">
        <div className="mx-auto max-w-6xl overflow-hidden px-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-company-logo-marquee flex w-max items-center hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-14 pr-14 md:gap-20 md:pr-20" aria-hidden={copy === 1}>
                {LOGOS.map((logo) => (
                  <div key={`${logo.name}-${copy}`} className="relative h-8 w-24 shrink-0 sm:w-28">
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.name : ""}
                      fill
                      sizes="112px"
                      className="object-contain opacity-70 grayscale brightness-0 transition-opacity hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
