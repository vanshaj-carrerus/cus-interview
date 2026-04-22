"use client";

const CATEGORIES = [
  {
    label: "Programming",
    count: "450+",
    color: "bg-accent-teal",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6M12 4l-4 16" />
      </svg>
    ),
  },
  {
    label: "Data Science",
    count: "120+",
    color: "bg-accent-purple",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: "System Design",
    count: "80+",
    color: "bg-accent-blue",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    label: "Databases",
    count: "150+",
    color: "bg-secondary",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    label: "Puzzles",
    count: "100+",
    color: "bg-accent-orange",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.547.547A1 1 0 0112 18h0a1 1 0 01-.707-.293l-.547-.547z" />
      </svg>
    ),
  },
  {
    label: "Project Management",
    count: "100+",
    color: "bg-primary",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 17l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function PracticeProblems() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className=" max-w-7xl md:container! mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Workforce Solutions</h2>
          <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
            Comprehensive <span className="premium-text-gradient">Skill Assessments</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.label}
              href="#"
              className="pro-card p-8 flex flex-col items-center text-center group bg-white"
            >
              <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                {cat.icon}
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">{cat.label}</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{cat.count} Questions</p>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 px-10 py-4 bg-secondary text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl hover:-translate-y-1 transition-all"
          >
            Start Solving Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
