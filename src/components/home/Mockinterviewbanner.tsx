import { TypewriterHeadingParagraph } from "./TypewriterHeadingParagraph";

export default function MockInterviewBanner() {
  return (
    <section className="bg-white px-6 pb-20 relative overflow-hidden">
      <div className=" max-w-7xl md:container! mx-auto">
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative shadow-[0_40px_80px_rgba(0,0,0,0.05)] border border-slate-100">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-20 pointer-events-none" />

          {/* ── LEFT CONTENT ── */}
          <div className="flex-1 text-center lg:text-left relative z-10">
            <h2 className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-6">Free Mock Round</h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-[1.1] mb-6">
              Unsure where to start your <br />
              <span className="text-primary italic">Career Journey?</span>
            </h3>
            <p className="text-secondary/60 text-lg md:text-xl font-medium mb-10 max-w-lg">
              Take our expert-curated mock technical interview designed for IT Professionals to pinpoint your gaps and excel.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black text-base rounded-2xl shadow-lg hover:-translate-y-1 transition-all"
              >
                Attempt Now
              </a>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <div className="pl-6 flex items-center">
                   <span className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">+50k Attempted</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-200">
              <p className="text-secondary/30 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Our Learners Work At</p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
                <span className="text-xl font-black tracking-tighter text-secondary">Google</span>
                <span className="text-xl font-black tracking-tighter italic text-secondary">amazon</span>
                <span className="text-xl font-black tracking-tighter text-secondary">Microsoft</span>
                <span className="text-xl font-black tracking-tighter text-secondary">Walmart</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ILLUSTRATION ── */}
          <div className="flex-1 relative group w-full max-w-lg lg:max-w-none">
            <div className="relative bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl rotate-3 transition-transform group-hover:rotate-0 duration-500">
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
                {/* Mock code editor visual remains dark for contrast/realism inside a bright section */}
                <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                  <div className="w-2 h-2 rounded-full bg-green-400/50" />
                </div>
                <div className="p-6 pt-12 min-h-34">
                  <TypewriterHeadingParagraph
                    heading="Live technical mock interview"
                    paragraph="Timed prompts, realistic constraints, and gap feedback—built for IT professionals leveling up fast."
                    headingClassName="text-white font-black text-sm md:text-base tracking-tight mb-2"
                    paragraphClassName="text-white/55 text-xs leading-relaxed font-medium"
                    typeMs={38}
                    deleteMs={24}
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-6 right-6 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                  LIVE MOCK
                </div>
              </div>
            </div>
            {/* Background glow */}
            <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
