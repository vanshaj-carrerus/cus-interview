"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-white  p-6 md:p-12 font-sans text-slate-900 overflow-hidden relative">

      <div className="lg:container mx-auto mt-10 relative z-10">
        <header className="relative mb-16 md:mb-20">
          <div className="flex flex-col items-center justify-center text-center gap-10">
            <div className="space-y-6 max-w-3xl flex  flex-col items-center">
              <div className="flex flex-wrap justify-center items-center gap-3">
                <span className="text-sm font-semibold uppercase tracking-widest text-sky-500 bg-sky-50/80 border border-sky-100 px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-40" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                  </span>
                  AI interviewer online
                </span>
                <span className="hidden sm:inline w-12 h-px bg-slate-200" />
                <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  24/7 · Private · Adaptive
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                AI Mock Interview
              </h1>

              <p className="text-[#4E6F80] text-sm sm:text-md font-medium leading-relaxed max-w-3xl mx-auto">
                Practice full technical loops with an AI that asks follow-ups,
                enforces time boxes, and delivers a clear scorecard so you walk
                into human panels prepared, not guessing.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-5 w-full px-4">
                <Link href="/mock-interviews/ai-mock" className="w-full sm:w-auto">
                  <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white text-md font-semibold rounded-full cursor-pointer active:scale-95 transition-all">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* AI session preview card */}
        <section className="mb-30 md:mb-34">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/60 bg-white p-8 md:p-14 shadow-xl shadow-slate-200/40">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
              <div className="flex flex-col gap-5">
                <div className="space-y-4">
                  <p className="text-sky-500 font-semibold text-sm tracking-widest uppercase">
                    Inside the session
                  </p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                    Feels like a{" "}
                    <span className="text-sky-500">live panel</span>
                    <br />
                    without the calendar tetris.
                  </h2>
                  <p className="text-[#4E6F80] text-sm md:text-md leading-relaxed max-w-2xl">
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

              <div className="relative group w-full max-w-md mx-auto lg:max-w-[550px] lg:ml-auto lg:mr-0">
                <div className="relative bg-white rounded-[1.25rem] p-2 border border-slate-100 shadow-sm  ">
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
        <section className="mb-10  md:mb-18">
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
        <section className="pt-8 pb-4 max-w-5xl mx-auto mb-10 px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0b] border border-white/10 px-8 py-12 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-sky-500/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex-1 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                Ready for your next AI mock loop?
              </h3>
              <p className="text-slate-400 text-base md:text-lg font-normal leading-relaxed max-w-lg mx-auto md:mx-0">
                Create a free account, pick a track, and debrief with a scorecard in under an hour. No scheduling required.
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full sm:w-auto">
              <Link href="/mock-interviews/ai-mock" className="block w-full">
                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-black text-[15px] font-semibold rounded-full cursor-pointer active:scale-95 transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const match = value.match(/([\d.]+)(.*)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const isFloat = match[1].includes(".");

    let start = 0;
    const duration = 1000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (target - start) * easeProgress;

      if (frame >= totalFrames) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        setDisplayValue((isFloat ? current.toFixed(1) : Math.floor(current)) + suffix);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group flex flex-col items-center justify-center gap-1.5 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500 ">
        <span className="text-xs font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
        {displayValue}
      </span>
    </div>
  );
}