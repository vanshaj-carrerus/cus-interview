"use client";

import Link from "next/link";
import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function MockInterviewBanner() {
  return (
    <section className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Expanded width for a fuller cart/banner feel */}
      <div className="w-full max-w-[96%] 2xl:max-w-322.5   mx-auto">
        <div className="bg-gray-50 rounded-4xl max-h-162.5 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 border border-gray-200 shadow-sm relative overflow-hidden">

          {/* Subtle background gradient instead of a harsh skewed block */}
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-linear-to-bl from-blue-50/50 to-transparent pointer-events-none" />

          {/* ── LEFT CONTENT ── */}
          <div className="flex-1 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-blue-700 font-semibold text-xs uppercase tracking-wider">
                Free Mock Round
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15] mb-3">
              Unsure where to start your <br className="hidden md:block" />
              <span className="text-blue-600">Career Journey?</span>
            </h3>

            <p className="text-gray-500   leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Take our expert-curated mock technical interview designed for IT Professionals to pinpoint your gaps and excel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link
                href="/mock-interviews"
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold text-base rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg "
              >
                Attempt Now
              </Link>


            </div>

            <div className="mt-12 pt-5 border-t border-gray-200/60">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-5">
                Our Learners Work At
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-xl font-bold tracking-tight text-gray-800">Google</span>
                <span className="text-xl font-bold tracking-tight italic text-gray-800">amazon</span>
                <span className="text-xl font-bold tracking-tight text-gray-800">Microsoft</span>
                <span className="text-xl font-bold tracking-tight text-gray-800">Walmart</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ILLUSTRATION ── */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 group">
            {/* BIGGER ANIMATION: Massively increased glow, added pulse, and scale-up on hover */}
            <div className="absolute -inset-16 bg-blue-500/20 rounded-full blur-[100px] opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-blue-400/30 transition-all duration-700 animate-pulse" />

            {/* Code Window */}
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 hover:-translate-y-2 transition-transform duration-500">
              <div className="aspect-4/3 sm:aspect-video bg-[#0f172a] rounded-xl overflow-hidden relative shadow-inner flex flex-col z-10">

                {/* Mac-style Window Header */}
                <div className="h-10 bg-[#1e293b] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>

                {/* Editor Body */}
                <div className="p-6 md:p-8 flex-1">
                  <TypewriterHeadingParagraph
                    heading="Live technical mock interview"
                    paragraph="Timed prompts, realistic constraints, and gap feedback—built for IT professionals leveling up fast."
                    headingClassName="text-white font-semibold text-base md:text-lg tracking-tight mb-3"
                    paragraphClassName="text-slate-400 text-sm leading-relaxed"
                    typeMs={38}
                    deleteMs={24}
                  />
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-4 right-4 bg-blue-600/10 border border-blue-500/20 backdrop-blur-md text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
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