"use client";

import Link from "next/link";
import { Network, Zap, Brain, Trophy, CheckCircle2, Mic } from "lucide-react";




const features = [
  {
    icon: <Brain size={18} className="text-sky-400" />,
    label: "AI-Powered Questions",
    bg: "bg-sky-500/10",
  },
  {
    icon: <Mic size={18} className="text-sky-400" />,
    label: "Voice Interviews",
    bg: "bg-sky-500/10",
  },
  {
    icon: <Zap size={18} className="text-sky-400" />,
    label: "Instant Feedback",
    bg: "bg-sky-500/10",
  },
  {
    icon: <Trophy size={18} className="text-sky-400" />,
    label: "Performance Tracking",
    bg: "bg-sky-500/10",
  },
];

export default function CareerGuidanceBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-md">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* ── Left: Text ── */}
          <div className="flex flex-col justify-center px-10 py-14">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-5">
              <Zap size={12} />
              AI-Powered Platform
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight ">
              Ace your next
            </h2>
            <h2
              className="text-4xl font-extrabold leading-tight mb-5 text-sky-500"
            >
              AI Mock Interview
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-sm">
              Practice with AI that simulates real interviewers. Get instant feedback,
              detailed scoring, and personalised improvement tips.
            </p>

            {/* Key points */}
            <ul className="space-y-2 mb-8">
              {["Real company interview patterns", "Instant AI scoring & feedback", "Track progress over time"].map((pt, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={15} className="text-sky-500 flex-shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/mock-interviews"
                className="inline-block px-7 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300  bg-sky-500"
              >
                Start Interview 
              </Link>

            </div>
          </div>

          {/* ── Right: Stats Panel ── */}
          <div className="flex flex-col justify-center items-center gap-6 px-10 py-14 bg-gradient-to-br from-slate-50 to-sky-50/50 border-l border-slate-100">

            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Platform at a Glance
            </p>

       

          </div>
        </div>

        {/* ── Bottom feature row ── */}


      </div>
    </section>
  );
}
