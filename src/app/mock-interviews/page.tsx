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
    bg: "bg-blue-50/80",
    color: "text-blue-600",
  },
  {
    number: "02",
    title: "Adaptive AI interviewer",
    description:
      "Natural follow-ups, clarifying questions, and pressure similar to a real loop. Difficulty ramps based on how you answer.",
    icon: MessageSquare,
    bg: "bg-teal-50/80",
    color: "text-teal-600",
  },
  {
    number: "03",
    title: "Timed, structured rounds",
    description:
      "Fixed segments with hints off by default, whiteboard-style prompts, and optional voice-style pacing so you build interview stamina.",
    icon: Gauge,
    bg: "bg-purple-50/80",
    color: "text-purple-600",
  },
  {
    number: "04",
    title: "Instant scorecard & gaps",
    description:
      "Structured feedback on communication, depth, and correctness—plus a short study plan so your next session compounds.",
    icon: LineChart,
    bg: "bg-amber-50/80",
    color: "text-amber-600",
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 p-6 md:p-12 font-sans text-slate-900 overflow-hidden relative">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-sky-300/30 to-pink-300/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-300/30 to-purple-300/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-sky-300/30 to-emerald-300/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="lg:container mx-auto relative z-10">
        <header className="relative mb-16 md:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-10">
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-indigo-50/80 border border-indigo-100 px-3 py-1.5 rounded-full inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  AI interviewer online
                </span>
                <span className="hidden sm:inline w-12 h-px bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  24/7 · Private · Adaptive
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                <span className="">AI Mock </span>
                 
                Interview
              </h1>

              <p className="text-slate-400 text-lg md:text-md font-normal leading-relaxed max-w-2xl">
                Practice full technical loops with an AI that asks follow-ups,
                enforces time boxes, and delivers a clear scorecard so you walk
                into human panels prepared, not guessing.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                <Link
                  href="/mock-interviews/ai-mock"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-sky-500 border border-slate-100 font-bold text-sm rounded-full shadow-xl shadow-sky-200/40 hover:border-sky-300 hover:shadow-sky-300/50 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Start AI session
                  <ChevronRight className="w-4 h-4" />
                </Link>
             
              </div>
            </div>

            <aside className="w-full max-w-xl lg:self-stretch shrink-0">
              <div className="h-full rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-xl shadow-slate-200/40 flex flex-col">
                <Link
                  href="/mock-interviews/ai-mock"
                  className="group block rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-primary/30 hover:bg-white hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/80 text-primary">
                      <ClipboardList className="h-6 w-6" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                        Session setup
                      </p>
                      <p className="font-bold text-slate-900 text-base leading-snug">
                        Languages, framework, role and focus
                      </p>
                      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed font-normal">
                        Takes about 2 minutes and personalizes the interview flow
                        before the AI starts.
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary group-hover:gap-2.5 transition-all">
                        Configure now
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="mt-6 border-t border-slate-100 pt-6 md:mt-8 md:pt-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                    Live AI performance
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3.5"
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

          <div className="mt-16 md:mt-20 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        {/* AI session preview card */}
        <section className="mb-20 md:mb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/60 bg-white p-8 md:p-14 shadow-xl shadow-slate-200/40">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-16 md:translate-x-24 pointer-events-none" />
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
              <div className="flex flex-col gap-5">
                <div className="space-y-4">
                  <p className="text-primary font-semibold text-sm tracking-widest uppercase">
                    Inside the session
                  </p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                    Feels like a{" "}
                    <span className="text-primary">live panel</span>
                    —without the calendar Tetris.
                  </h2>
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                    The model tracks your thread, probes weak spots, and
                    summarizes what to fix before your next attempt. Use it for
                    warm-ups before peer mocks or as your default nightly drill.
                  </p>
                </div>

                <ul className="flex flex-wrap gap-3 pt-2">
                  {[
                    "System design",
                    "Coding rounds",
                    "Behavioral",
                    "Bar raiser style",
                  ].map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium transition-colors"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative group">
                <div className="relative bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl  ">
                  <div className="aspect-4/3 md:aspect-video bg-[#0A0A0B] rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col">
                    <div className="h-10 shrink-0 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-auto text-xs font-mono text-slate-500">
                        ai-session · live
                      </span>
                    </div>
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-h-[200px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                          Interviewer
                        </p>
                        <p className="text-slate-100 font-semibold text-base md:text-lg leading-relaxed mb-3">
                          “Walk me through how you&apos;d evolve this API if
                          traffic 10×’d overnight.”
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed font-normal">
                          Follow-up queued: failure modes → caching →
                          observability. Timer 18:42 remaining.
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-800">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                          Adaptive depth
                        </span>
                        <span className="shrink-0 bg-primary/20 text-primary border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-full">
                          AI MOCK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-8 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="mb-20 md:mb-28">
          <div className="mb-14 space-y-4 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              How your AI session works
            </h2>
            <p className="text-slate-600 text-lg font-normal max-w-2xl leading-relaxed">
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
                  className="group relative h-full bg-white border border-slate-200/60 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:border-slate-300 flex flex-col items-center text-center"
                >
                  <span className="absolute top-8 right-8 text-xs font-bold text-slate-200 select-none">
                    {step.number}
                  </span>
                  <div
                    className={`w-14 h-14 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed flex-1">
                {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="pt-8 pb-4 max-w-5xl mx-auto mb-10">
          <div className="relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 px-8 py-16 md:px-20 md:py-24 flex flex-col items-center justify-center gap-10 text-center shadow-2xl shadow-sky-100/60">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-200/40 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-200/40 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-2xl flex flex-col items-center">
              <h3 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-6">
                Ready for your next <br />
                <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">AI mock loop?</span>
              </h3>
              <p className="text-slate-500 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
                Create a free account, pick a track, and debrief with a
                scorecard in under an hour.
              </p>
            </div>
            <Link
              href="/signup"
              className="relative z-10 shrink-0 inline-flex items-center gap-3 bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-500 hover:to-pink-500 text-white px-10 py-5 rounded-full font-bold text-sm shadow-xl shadow-pink-200/50 hover:scale-[1.02] transition-all"
            >
              Get started free
              <ArrowRight className="w-5 h-5 text-white" />
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
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-slate-500 group-hover:text-primary transition-colors">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </span>
    </div>
  );
}