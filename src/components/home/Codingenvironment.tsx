"use client";

import Link from "next/link";
import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function CodingEnvironment() {
  return (
    <section className="py-24  relative overflow-hidden">
      <div className="max-w-6xl md:container mx-auto px-19">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── VISUAL SIDE ── */}
          <div className="flex-1 order-2 lg:order-1 relative group w-full lg:w-auto">
            {/* Soft background glow */}
            <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none" />

            {/* Code Editor Window */}
            <div className="relative z-10 bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 flex flex-col hover:-translate-y-1.5 transition-transform duration-500 ease-out overflow-hidden">

              {/* Editor Header (Mac-style) */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#1e293b] border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 bg-black/20 border border-white/5 rounded-md text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  solution.cpp
                </div>
                <div className="w-14" /> {/* Spacer to perfectly center the badge */}
              </div>

              {/* Editor Body */}
              <div className="p-6 md:p-8 font-mono text-[13px] md:text-sm leading-relaxed text-slate-300">
                <div className="mb-6 pb-6 min-h-20 border-b border-white/10">
                  <TypewriterHeadingParagraph
                    heading="// CUS interview-grade editor"
                    paragraph="Multi-language runs, custom cases, and IDE ergonomics tuned for high-stakes screens."
                    headingClassName="text-purple-400 text-sm md:text-base font-semibold"
                    paragraphClassName="text-slate-400 text-xs leading-relaxed font-medium mt-1.5 max-w-lg"
                    typeMs={36}
                    deleteMs={22}
                  />
                </div>

                {/* Code Lines */}
                <div className="space-y-1">
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">01</span>
                    <p className="text-purple-400">
                      #include{" "}
                      <span className="text-emerald-400">&lt;iostream&gt;</span>
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">02</span>
                    <p className="text-slate-400">
                      using namespace <span className="text-slate-200">std</span>;
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">03</span>
                    <div className="h-4" />
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">04</span>
                    <p className="text-blue-400 font-semibold">
                      int <span className="text-slate-200">main</span>() {"{"}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">05</span>
                    <p className="text-slate-400 pl-4">
                      vector&lt;int&gt; nums = {"{2, 7, 11, 15}"};
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">06</span>
                    <p className="text-amber-400 pl-4">solve(nums, 9);</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-600 select-none w-5 text-right">07</span>
                    <p className="text-slate-200">{"}"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Output Card */}
            <div className="absolute -bottom-8 right-0 sm:-right-8 p-5 bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-200 animate-float max-w-[85vw] sm:max-w-[300px] z-20">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Execution Result
                </span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                &gt; Process finished with exit code 0<br />
                &gt; [0, 1]
              </p>
            </div>
          </div>

          {/* ── CONTENT SIDE ── */}
          <div className="flex-1 order-1 lg:order-2 w-full text-center lg:text-left">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              World Class Editor
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              A workspace built for 
              Productivity
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Practice in an environment that mimics top-tier IDEs. Designed
              specifically <br/> for coding interviews with 20+ language supports.
            </p>

            <div className="space-y-6 mb-12 text-left max-w-2xl mx-auto lg:mx-0">
              {[
                {
                  title: "Multi-Language Support",
                  desc: "Write code in C++, Java, Python, Go, and more.",
                },
                {
                  title: "Custom Test Cases",
                  desc: "Run your code against specific inputs easily.",
                },
                {
                  title: "Auto-completion",
                  desc: "Intelligent suggestions to code faster.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="pt-0.5">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={"/practice"}>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                Start Coding
                <svg
                  className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
} 