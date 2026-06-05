import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function VideoExplanations() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl md:container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* ── LEFT CONTENT ── */}
          <div className="flex-1 w-full text-center lg:text-left">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Expert Guidance
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Crystal clear{" "}
              <span className="">Video Explanations</span>
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Don&apos;t just see the code. Understand the intuition behind
              every solution with high-quality videos recorded by industry
              veterans.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mb-12 text-left">
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
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50/80 flex items-center justify-center shrink-0 border border-blue-100">
                    <svg
                      className="w-4 h-4 text-primary"
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

            <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
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
          <div className="flex-1 w-full max-w-2xl lg:max-w-none relative group">
            
            {/* Soft background glow */}
            <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            {/* Main Video Card Mockup */}
            <div className="relative z-10 aspect-video bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col hover:-translate-y-2 transition-transform duration-500 ease-out">
              
              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent-purple/10 pointer-events-none" />

              {/* Video Content Overlay */}
              <div className="relative z-20 p-8 md:p-10 pt-12 md:pt-14 flex-1 pointer-events-none">
                <TypewriterHeadingParagraph
                  heading="See the intuition, not just the code"
                  paragraph="Veteran engineers narrate every tradeoff so video explanations feel like a 1:1 walkthrough."
                  headingClassName="text-white font-semibold text-lg md:text-xl tracking-tight mb-3 drop-shadow-md"
                  paragraphClassName="text-slate-400 text-sm font-medium max-w-md leading-relaxed"
                  typeMs={40}
                  deleteMs={24}
                />
              </div>

              {/* Modern Media Footer Bar */}
              <div className="relative z-20 mt-auto p-5 md:p-6 bg-slate-900/60 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-accent-orange animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-200 text-sm font-semibold mb-0.5">
                      Dynamic Programming Masterclass
                    </p>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      SDE at Google
                    </p>
                  </div>
                </div>
                
                {/* Visual Play Icon */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                   <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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