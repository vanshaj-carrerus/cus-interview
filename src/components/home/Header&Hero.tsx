"use client";

import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function CusInterviewHero() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* ── HERO CONTENT ── */}
      <main className="relative pt-10 sm:pt-20 pb-24 overflow-hidden">
        {/* Background Elements - Bright & Professional */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-linear-to-l from-primary/5 to-transparent -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10" />

        <div className=" max-w-7xl md:container! mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                Global Staffing & Coaching
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-secondary leading-[0.95] tracking-tight mb-8">
              Discover your next <br />
              <span className="text-primary">Career Adventure</span> <br />
              with CUS.
            </h1>

            <p className="text-secondary/60 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Elevating career journeys through innovative IT solutions and our
              comprehensive job portal. Shape the future with CareerUs
              Solutions.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all">
                Apply for Jobs
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-secondary font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all">
                Hire Talent
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-8 lg:items-start group">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-2xl bg-slate-200 border-4 border-white shadow-lg overflow-hidden group-hover:translate-x-1 transition-transform"
                  />
                ))}
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-[10px] font-black border-4 border-white shadow-lg">
                  10k+
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-orange-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-secondary/50 text-xs font-black uppercase tracking-widest leading-none">
                  Empowering careers globally
                </p>
              </div>
            </div>
          </div>

          {/* Right: Unique Visual Dashboard */}
          <div className="flex-1 relative w-full perspective-[2000px]">
            <div className="relative z-10 bg-white rounded-[3rem] p-3 shadow-[0_50px_100px_rgba(31,61,143,0.12)] border border-slate-100 rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-1000">
              <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden aspect-4xl relative">
                {/* Top Header Mockup */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-12 h-3 rounded-full bg-slate-100" />
                  </div>
                  <div className="px-3 py-1 bg-primary/10 rounded-lg text-[8px] font-black uppercase text-primary tracking-widest">
                    CUS
                  </div>
                </div>

                {/* Content Mockup */}
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 mb-3" />
                      <div className="h-2 w-12 bg-slate-200" />
                    </div>
                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-400/20 mb-3" />
                      <div className="h-2 w-12 bg-slate-200" />
                    </div>
                  </div>
                  <div className="min-h-32 bg-secondary rounded-2xl shadow-lg p-6 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12" />
                    <TypewriterHeadingParagraph
                      heading="Your CUS hiring command center"
                      paragraph="Track open roles, shortlisted talent, and coaching touchpoints in one live workspace."
                      className="relative z-10"
                      headingClassName="text-white font-black text-base md:text-lg leading-snug mb-2"
                      paragraphClassName="text-white/70 text-xs md:text-sm font-medium leading-relaxed"
                      typeMs={42}
                      deleteMs={26}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Achievement Badges */}
            <div className="absolute -top-10 -right-10 bg-white pro-card p-6 shadow-2xl animate-float hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                  🏢
                </div>
                <div>
                  <p className="text-secondary font-black text-xs">
                    Top Staffing
                  </p>
                  <p className="text-secondary/40 text-[10px] font-bold">
                    2026 Award Winner
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 bg-white pro-card p-6 shadow-2xl animate-float [animation-delay:1.5s] hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                  AI
                </div>
                <div>
                  <p className="text-secondary font-black text-xs">
                    Career Coaching
                  </p>
                  <p className="text-secondary/40 text-[10px] font-bold">
                    AI-Powered Paths
                  </p>
                </div>
              </div>
            </div>

            {/* Background glow behind dashboard */}
            <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </main>
    </div>
  );
}
