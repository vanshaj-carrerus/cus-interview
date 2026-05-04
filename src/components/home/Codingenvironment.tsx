"use client";

import Link from "next/link";
import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function CodingEnvironment() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* ── VISUAL SIDE ── */}
          <div className="flex-1 order-2 lg:order-1 relative group w-full lg:w-auto">
            <div className="relative z-10 bg-slate-900 rounded-[2.5rem] p-4 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-slate-800 rotate-1 group-hover:rotate-0 transition-transform duration-700">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-lg text-[10px] font-black text-white/40 uppercase tracking-widest">
                  solution.cpp
                </div>
                <div className="w-12" />
              </div>

              {/* Editor Body */}
              <div className="p-8 font-mono text-sm leading-relaxed text-white">
                <div className="mb-6 pb-6 min-h-20 border-b border-white/10">
                  <TypewriterHeadingParagraph
                    heading="// CUS interview-grade editor"
                    paragraph="Multi-language runs, custom cases, and IDE ergonomics tuned for high-stakes screens."
                    headingClassName="text-accent-purple text-sm md:text-base font-bold"
                    paragraphClassName="text-white/45 text-xs leading-relaxed font-medium mt-1.5 max-w-lg"
                    typeMs={36}
                    deleteMs={22}
                  />
                </div>
                <div className="flex gap-4">
                  <span className="text-white/10 select-none">01</span>
                  <p className="text-accent-purple">
                    #include{" "}
                    <span className="text-accent-teal">&lt;iostream&gt;</span>
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/10 select-none">02</span>
                  <p className="text-white/40">
                    using namespace <span className="text-white">std</span>;
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/10 select-none">03</span>
                  <div className="h-4" />
                </div>
                <div className="flex gap-4">
                  <span className="text-white/10 select-none">04</span>
                  <p className="text-primary font-bold">
                    int <span className="text-white">main</span>() {"{"}
                  </p>
                </div>
                <div className="flex gap-4 pl-4">
                  <span className="text-white/10 select-none">05</span>
                  <p className="text-white/60">
                    vector&lt;int&gt; nums = {"{2, 7, 11, 15}"};
                  </p>
                </div>
                <div className="flex gap-4 pl-4">
                  <span className="text-white/10 select-none">06</span>
                  <p className="text-accent-orange">solve(nums, 9);</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/10 select-none">07</span>
                  <p className="text-white">{"}"}</p>
                </div>
              </div>

              {/* Floating Output Card */}
              <div className="absolute -bottom-10 right-0 sm:-right-10 pro-card p-6 bg-white shadow-2xl animate-float max-w-[60vw]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">
                    Execution Result
                  </span>
                </div>
                <p className="font-mono text-xs text-secondary bg-slate-50 p-3 rounded-lg border border-slate-100">
                  &gt; Process finished with exit code 0<br />
                  &gt; [0, 1]
                </p>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-20 bg-primary/20 rounded-full blur-[120px] -z-10 group-hover:bg-primary/30 transition-colors" />
          </div>

          {/* ── CONTENT SIDE ── */}
          <div className="flex-1 order-1 lg:order-2">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">
              World Class Editor
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none mb-8">
              A workspace built for <br />
              <span className="premium-text-gradient">Productivity</span>
            </h3>
            <p className="text-secondary/50 text-lg font-medium leading-relaxed mb-10">
              Practice in an environment that mimics top-tier IDEs. Designed
              specifically for coding interviews with 20+ language supports.
            </p>

            <div className="space-y-8 mb-12">
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
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-secondary text-base mb-1">
                      {item.title}
                    </h4>
                    <p className="text-secondary/40 text-sm font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={"/practice"}>
              <button className="w-full cursor-pointer sm:w-auto px-10 py-5 bg-secondary text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all">
                Start Coding
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
