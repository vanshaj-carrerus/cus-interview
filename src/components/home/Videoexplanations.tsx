import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function VideoExplanations() {
  return (
    <section className="py-16  relative overflow-hidden">
      <div className="max-w-6xl md:container mx-auto px-19">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* ── LEFT CONTENT ── */}
          <div className="flex-1 w-full text-center lg:text-left">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-2.5">
              Expert Guidance
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              Crystal clear{" "}
              <span className="">Video Explanations</span>
            </h3>
            <p className="text-slate-500 text-base font-medium leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Don&apos;t just see the code. Understand the intuition behind
              every solution with<br/> high-quality videos recorded by industry
              veterans.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-10 text-left">
              {[
                {
                  title: "Visual Intuition",
                  desc: "Detailed whiteboard sessions",
                },
                {
                  title: "Multiple Approaches",
                  desc: "From brute force to optimal",
                },
                { 
                  title: "Code Walkthrough", 
                  desc: "Line by line explanation" 
                },
                {
                  title: "Complexity Analysis",
                  desc: "Time & Space breakdown",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-50/80 flex items-center justify-center shrink-0 border border-blue-100">
                    <svg
                      className="w-3.5 h-3.5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              Explore Videos
              <svg 
                className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* ── RIGHT VISUAL ── */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative group">
            
            {/* Soft background glow */}
            <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            {/* Main Video Card Mockup */}
            <div className="relative z-10 aspect-video bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col hover:-translate-y-2 transition-transform duration-500 ease-out">
              
              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent-purple/10 pointer-events-none" />

              {/* Video Content Overlay */}
              <div className="relative z-20 p-6 md:p-8 pt-8 md:pt-10 flex-1 pointer-events-none">
                <TypewriterHeadingParagraph
                  heading="See the intuition, not just the code"
                  paragraph="Veteran engineers narrate every tradeoff so video explanations feel like a 1:1 walkthrough."
                  headingClassName="text-white font-semibold text-base md:text-lg tracking-tight mb-2 drop-shadow-md"
                  paragraphClassName="text-slate-400 text-xs font-medium max-w-sm leading-relaxed"
                  typeMs={40}
                  deleteMs={24}
                />
              </div>

              {/* Modern Media Footer Bar */}
              <div className="relative z-20 mt-auto p-4 md:p-5 bg-slate-900/60 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-200 text-xs font-semibold mb-0.5">
                      Dynamic Programming Masterclass
                    </p>
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                      SDE at Google
                    </p>
                  </div>
                </div>
                
                {/* Visual Play Icon */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                   <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M8 5v14l11-7z" />
                   </svg>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}