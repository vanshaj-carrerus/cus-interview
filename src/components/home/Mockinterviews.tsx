"use client";

const TYPES = [
  {
    title: "Self-Mock Round",
    description: "AI-powered environment to evaluate your technical skills before the actual recruiter round.",
    features: ["Real-time assessment", "Skill mapping", "Detailed report", "Infinite practice"],
    price: "Free",
    cta: "Start Assessment",
    bg: "bg-white",
    border: "border-slate-100",
    accent: "text-primary",
    innerAccent: "bg-primary/10 text-primary",
    btnStyle: "bg-slate-50 text-slate-900 hover:bg-primary hover:text-white"
  },
  {
    title: "Talent Acquisition Round",
    description: "Simulate real technical rounds with industry experts to get referred to top global enterprises.",
    features: ["Recruiter insights", "Direct referrals", "Skill certification", "Mock feedback"],
    price: "$29",
    cta: "Book Expert Round",
    bg: "bg-white",
    border: "border-primary/20 shadow-[0_20px_40px_rgba(14,165,164,0.1)]",
    accent: "text-secondary",
    innerAccent: "bg-secondary/10 text-secondary",
    btnStyle: "bg-secondary text-white hover:shadow-xl hover:-translate-y-0.5"
  }
];

export default function MockInterviews() {
  return (
    <section className="py-14 bg-white relative overflow-hidden">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Talent Acquisition</h2>
          <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
            Expert <span className="premium-text-gradient">Technical Assessments</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TYPES.map((type) => (
            <div
              key={type.title}
              className={`pro-card p-12 flex flex-col gap-8 ${type.bg} ${type.border} relative overflow-hidden group`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h4 className={`text-3xl font-black tracking-tight ${type.accent}`}>
                    {type.title}
                  </h4>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${type.title.includes('Expert') ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {type.price}
                  </span>
                </div>

                <p className="text-secondary/50 text-lg font-medium leading-relaxed mb-8">
                  {type.description}
                </p>

                <ul className="space-y-4 mb-10">
                  {type.features.map(feat => (
                    <li key={feat} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${type.innerAccent}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-secondary/70">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${type.btnStyle}`}>
                  {type.cta}
                </button>
              </div>

              {type.title.includes('Expert') && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
