"use client";

import Link from "next/link";
import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function MockInterviewBanner() {
  return (
    <section className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Expanded width for a fuller cart/banner feel */}
      <div className="w-full max-w-[96%] 2xl:max-w-322.5 mx-auto">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] max-h-162.5 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">

          {/* Subtle background gradient instead of a harsh skewed block */}
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-bl from-sky-50/80 to-pink-50/80 pointer-events-none" />

          {/* ── LEFT CONTENT ── */}
          <div className="flex-1 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-sky-600 font-bold text-xs uppercase tracking-widest">
                Free Mock Round
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-[1.15] mb-4">
              Unsure where to start your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">Career Journey?</span>
            </h3>

            <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Take our expert-curated mock technical interview designed for IT Professionals to pinpoint your gaps and excel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link
                href="/mock-interviews"
                className="w-full sm:w-auto px-10 py-4 bg-sky-500 text-white font-bold text-sm rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all hover:scale-[1.02] active:scale-95"
              >
                Attempt Now
              </Link>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-5">
                Our Learners Work At
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <span className="text-xl font-bold tracking-tight text-slate-800">Google</span>
                <span className="text-xl font-bold tracking-tight italic text-slate-800">amazon</span>
                <span className="text-xl font-bold tracking-tight text-slate-800">Microsoft</span>
                <span className="text-xl font-bold tracking-tight text-slate-800">Walmart</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ILLUSTRATION ── */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 group mt-10 lg:mt-0">
            {/* BIGGER ANIMATION: Massively increased glow, added pulse, and scale-up on hover */}
            <div className="absolute -inset-16 bg-gradient-to-tr from-sky-400/20 to-pink-400/20 rounded-full blur-[100px] opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:from-sky-400/30 group-hover:to-pink-400/30 transition-all duration-700 animate-pulse" />

            {/* Code Window */}
            <div className="relative bg-white rounded-3xl p-3 border border-slate-100 shadow-2xl shadow-slate-300/30 hover:-translate-y-2 transition-transform duration-500">
              <div className="aspect-4/3 sm:aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner flex flex-col z-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-3xl rounded-full" />

                {/* Mac-style Window Header */}
                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 shrink-0 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>

                {/* Editor Body */}
                <div className="p-6 md:p-8 flex-1 relative z-10">
                  <TypewriterHeadingParagraph
                    heading="Live technical mock interview"
                    paragraph="Timed prompts, realistic constraints, and gap feedback—built for IT professionals leveling up fast."
                    headingClassName="text-white font-semibold text-lg md:text-xl tracking-tight mb-4"
                    paragraphClassName="text-slate-400 text-sm leading-relaxed"
                    typeMs={38}
                    deleteMs={24}
                  />
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-6 right-6 bg-sky-500/20 border border-sky-500/20 backdrop-blur-md text-sky-400 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-20">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Live Editor
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}