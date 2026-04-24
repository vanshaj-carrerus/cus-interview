import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  ClipboardList,
  Gauge,
  LineChart,
  MessageSquare,
  Mic,
  Sparkles,
  ChevronRight,
  Cpu,
  FileText,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick your stack & seniority",
    description:
      "Tell the AI your role, target company style, and topics—DSA, system design, or behavioral. It shapes the rubric before you start.",
    icon: Cpu,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    number: "02",
    title: "Adaptive AI interviewer",
    description:
      "Natural follow-ups, clarifying questions, and pressure similar to a real loop. Difficulty ramps based on how you answer.",
    icon: MessageSquare,
    bg: "bg-teal-50",
    color: "text-teal-600",
  },
  {
    number: "03",
    title: "Timed, structured rounds",
    description:
      "Fixed segments with hints off by default, whiteboard-style prompts, and optional voice-style pacing so you build interview stamina.",
    icon: Gauge,
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
  {
    number: "04",
    title: "Instant scorecard & gaps",
    description:
      "Structured feedback on communication, depth, and correctness—plus a short study plan so your next session compounds.",
    icon: LineChart,
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
];

const stats = [
  { label: "AI sessions run", value: "120K+", icon: Bot },
  { label: "Avg. session length", value: "42 min", icon: Mic },
  { label: "Learner rating", value: "4.9★", icon: Sparkles },
];

const aiHighlights = [
  {
    title: "Role-aware prompts",
    body: "Questions mirror real loops for backend, frontend, full-stack, and data roles.",
    icon: Brain,
  },
  {
    title: "Consistent rubric",
    body: "Every answer is graded against the same criteria—no bad days or vague “you did fine.”",
    icon: FileText,
  },
  {
    title: "Repeat on demand",
    body: "Run another full loop tonight. No scheduling, no awkward small talk—just reps.",
    icon: Sparkles,
  },
];

export default function MockInterviewPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-12 font-sans text-slate-900 selection:bg-indigo-100 selection:text-primary">
      <div className="lg:container mx-auto">
        <header className="relative mb-16 md:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-10">
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary bg-indigo-50 px-3 py-1 rounded-full inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  AI interviewer online
                </span>
                <span className="hidden sm:inline w-12 h-px bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  24/7 · Private · Adaptive
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-secondary leading-[1.1]">
                <span className="premium-text-gradient">AI Mock</span>
                <br />
                Interview
              </h1>

              <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                Practice full technical loops with an AI that asks follow-ups,
                enforces time boxes, and delivers a clear scorecard so you walk
                into human panels prepared, not guessing.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
                <Link
                  href="/mock-interviews/ai-mock"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Start AI session
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-secondary font-black text-xs uppercase tracking-[0.15em] rounded-2xl hover:border-primary/30 hover:bg-slate-50 transition-all"
                >
                  Browse practice hub
                </Link>
              </div>
            </div>

            <aside className="w-full max-w-xl lg:self-stretch shrink-0">
              <div className="h-full rounded-4xl border border-slate-100 bg-white p-5 md:p-6 shadow-[0_24px_48px_-18px_rgba(0,0,0,0.08)] flex flex-col">
                <Link
                  href="/mock-interviews/ai-mock"
                  className="group block rounded-3xl border border-slate-200 bg-slate-50/70 p-5 transition-all hover:border-primary/35 hover:bg-white hover:shadow-[0_20px_44px_-14px_rgba(14,165,164,0.18)] hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
                      <ClipboardList className="h-6 w-6" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                        Session setup
                      </p>
                      <p className="font-black text-secondary text-sm leading-snug">
                        Languages, framework, role and focus
                      </p>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                        Takes about 2 minutes and personalizes the interview flow
                        before the AI starts.
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-2.5 transition-all">
                        Configure now
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="mt-5 border-t border-slate-100 pt-5 md:mt-6 md:pt-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Live AI performance
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                      >
                        <HeaderStat
                          label={s.label}
                          value={s.value}
                          icon={<s.icon className="w-4 h-4" />}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-14 md:mt-16 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        {/* AI session preview card — echoes home mock banner */}
        <section className="mb-20 md:mb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 bg-slate-50 p-8 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.05)]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-16 md:translate-x-24 pointer-events-none" />
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
              <div className="space-y-4">
                <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">
                  Inside the session
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-tight">
                  Feels like a{" "}
                  <span className="text-primary italic">live panel</span>
                  —without the calendar Tetris.
                </h2>
                <p className="text-secondary/60 text-base md:text-lg font-medium leading-relaxed">
                  The model tracks your thread, probes weak spots, and
                  summarizes what to fix before your next attempt. Use it for
                  warm-ups before peer mocks or as your default nightly drill.
                </p>
                <ul className="flex flex-wrap gap-2 pt-2">
                  {[
                    "System design",
                    "Coding rounds",
                    "Behavioral",
                    "Bar raiser style",
                  ].map((tag) => (
                    <li
                      key={tag}
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white border border-slate-200 text-secondary/70"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative group">
                <div className="relative bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl rotate-2 md:rotate-3 transition-transform duration-500 group-hover:rotate-0">
                  <div className="aspect-4/3 md:aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-inner flex flex-col">
                    <div className="h-9 shrink-0 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400/60" />
                      <span className="w-2 h-2 rounded-full bg-amber-400/60" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
                      <span className="ml-auto text-[10px] font-mono text-white/35">
                        ai-session · live
                      </span>
                    </div>
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-h-[200px]">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                          Interviewer
                        </p>
                        <p className="text-white font-black text-sm md:text-base leading-snug mb-3">
                          “Walk me through how you&apos;d evolve this API if
                          traffic 10×’d overnight.”
                        </p>
                        <p className="text-white/45 text-xs leading-relaxed font-medium">
                          Follow-up queued: failure modes → caching →
                          observability. Timer 18:42 remaining.
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                        <span className="text-white/35 text-[10px] font-black uppercase tracking-widest">
                          Adaptive depth
                        </span>
                        <span className="shrink-0 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                          AI MOCK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-8 bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20 md:mb-24">
          <div className="mb-12 space-y-2">
            <h2 className="text-3xl premium-text-gradient font-bold text-slate-900 tracking-tight">
              How your AI session works
            </h2>
            <p className="text-slate-500 text-lg font-light max-w-2xl">
              Four stages from setup to feedback—built to mirror how strong
              candidates actually prepare.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative h-full bg-white border border-slate-100 rounded-4xl p-8 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:border-indigo-100 hover:-translate-y-1 flex flex-col"
                >
                  <span className="absolute top-6 right-6 text-[10px] font-black tracking-[0.2em] text-slate-300 select-none">
                    {step.number}
                  </span>
                  <div
                    className={`w-14 h-14 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/10`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium flex-1">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pb-8 md:pb-12">
          <div className="mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tight">
              Why engineers use{" "}
              <span className="premium-text-gradient">AI first</span>
            </h2>
            <p className="text-slate-500 font-light">
              Short sessions, honest signal, zero scheduling friction.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {aiHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="pro-card p-8 md:p-10 rounded-4xl flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-secondary tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-secondary/55 text-sm font-medium leading-relaxed">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pt-8 pb-4">
          <div className="relative overflow-hidden rounded-4xl md:rounded-[2.5rem] premium-gradient px-8 py-12 md:px-12 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-12 left-1/4 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                Ready for your next AI mock loop?
              </h3>
              <p className="text-white/75 text-sm md:text-base font-medium mt-2">
                Create a free account, pick a track, and debrief with a
                scorecard in under an hour.
              </p>
            </div>
            <Link
              href="/signup"
              className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-white text-secondary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Get started free
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeaderStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-primary transition-colors">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold text-slate-800 tracking-tight">
        {value}
      </span>
    </div>
  );
}
