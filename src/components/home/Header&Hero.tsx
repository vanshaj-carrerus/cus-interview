"use client";

import Link from "next/link";
import { HeroCompanyLogos } from "@/components/home/CompanyLogosBand";

export default function CusInterviewHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-mesh-base absolute inset-0" />

      <div className="hero-color-blob hero-blob-1" aria-hidden />
      <div className="hero-color-blob hero-blob-2" aria-hidden />
      <div className="hero-color-blob hero-blob-3" aria-hidden />
      <div className="hero-color-blob hero-blob-4" aria-hidden />
      <div className="hero-color-blob hero-blob-5" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 65% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 55% 45%, rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1px 1px at 10% 55%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 72% 85%, rgba(255,255,255,0.4) 0%, transparent 100%)
          `,
        }}
      />

      {/* Soft mid tones fade into a deep night ending with stars */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,78,92,0.25)_28%,rgba(2,20,30,0.85)_68%,#01060c_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 8% 20%, rgba(255,255,255,0.75) 0%, transparent 100%),
            radial-gradient(1px 1px at 18% 55%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 27% 35%, rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 78%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 44% 22%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 52% 62%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 61% 40%, rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 82%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 78% 28%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 86% 58%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 93% 75%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 12% 88%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 48% 92%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 66% 12%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 96% 45%, rgba(255,255,255,0.5) 0%, transparent 100%)
          `,
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col items-center px-6 py-10 sm:min-h-[780px] md:min-h-[840px] md:px-10 md:py-20">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="max-w-7xl text-2xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.9rem]">
            Architecting The Next <br />{" "}
            <span className="font-extrabold">Generation</span> of AI-Driven
            Developers.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-medium leading-relaxed text-white/90 sm:text-base md:text-[17px]">
            CUS Interview enables skill improvement through automated assessments,
            AI-powered mock interviews, and personalized learning paths — helping
            developers and companies grow together.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/for-companies"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-primary transition-colors hover:bg-white/90 sm:w-auto"
            >
              For Companies
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/80 bg-transparent px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
            >
              Developer Dashboard
            </Link>
          </div>
        </div>

        <HeroCompanyLogos />
      </div>
    </section>
  );
}
