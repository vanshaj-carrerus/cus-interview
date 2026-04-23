import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function VideoExplanations() {
  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* ── LEFT CONTENT ── */}
          <div className="flex-1">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">
              Expert Guidance
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-8">
              Crystal clear{" "}
              <span className="premium-text-gradient">Video Explanations</span>
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
              Don&apos;t just see the code. Understand the intuition behind
              every solution with high-quality videos recorded by industry
              veterans.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: "Visual Intuition",
                  desc: "Detailed whiteboard sessions",
                },
                {
                  title: "Multiple Approaches",
                  desc: "From brute force to optimal",
                },
                { title: "Code Walkthrough", desc: "Line by line explanation" },
                {
                  title: "Complexity Analysis",
                  desc: "Time & Space breakdown",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="px-10 py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
              Explore Videos
            </button>
          </div>

          {/* ── RIGHT VISUAL ── */}
          <div className="flex-1 relative group w-full lg:w-auto">
            {/* Main Video Card */}
            <div className="relative z-10 aspect-video bg-slate-900 rounded-4xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-slate-800">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-accent-purple/20" />

              <div className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8 pt-14 md:pt-16 pointer-events-none">
                <TypewriterHeadingParagraph
                  heading="See the intuition, not just the code"
                  paragraph="Veteran engineers narrate every tradeoff so video explanations feel like a 1:1 walkthrough."
                  headingClassName="text-white font-black text-sm md:text-base drop-shadow-md"
                  paragraphClassName="text-white/65 text-[11px] md:text-xs font-medium mt-1.5 max-w-md leading-relaxed"
                  typeMs={40}
                  deleteMs={24}
                />
              </div>

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-orange" />
                  <div>
                    <p className="text-white text-sm font-black">
                      Dynamic Programming Masterclass
                    </p>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                      SDE at Google
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
