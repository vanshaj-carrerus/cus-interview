"use client";

import Link from "next/link";
import { Network, Zap, Brain, Trophy, CheckCircle2, Mic } from "lucide-react";

const interviewStats = [
  { label: "Questions Asked", value: "10,000+", icon: <Brain size={16} className="text-purple-500" /> },
  { label: "Avg. Score Improvement", value: "38%", icon: <Trophy size={16} className="text-orange-500" /> },
  { label: "Mock Sessions Done", value: "25K+", icon: <Mic size={16} className="text-teal-500" /> },
];



const features = [
  {
    icon: <Brain size={18} className="text-purple-500" />,
    label: "AI-Powered Questions",
    bg: "bg-purple-50",
  },
  {
    icon: <Mic size={18} className="text-pink-500" />,
    label: "Voice Interviews",
    bg: "bg-pink-50",
  },
  {
    icon: <Zap size={18} className="text-teal-500" />,
    label: "Instant Feedback",
    bg: "bg-teal-50",
  },
  {
    icon: <Trophy size={18} className="text-orange-500" />,
    label: "Performance Tracking",
    bg: "bg-orange-50",
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
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-5">
              <Zap size={12} />
              AI-Powered Platform
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight ">
              Ace your next
            </h2>
            <h2
              className="text-4xl font-extrabold leading-tight mb-5"
              style={{ color: "#6c5ce7" }}
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
                  <CheckCircle2 size={15} className="text-purple-500 flex-shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/mock-interviews"
                className="inline-block px-7 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: "#6c5ce7",
                }}
              >
                Start Interview →
              </Link>
              <Link
                href="/mock-interviews"
                className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors"
              >
                View sample
              </Link>
            </div>
          </div>

          {/* ── Right: Stats Panel ── */}
          <div className="flex flex-col justify-center items-center gap-6 px-10 py-14 bg-gradient-to-br from-slate-50 to-purple-50/30">

            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Platform at a Glance
            </p>

            {/* Stats cards — stacked vertically, large & prominent */}
            <div className="flex flex-col gap-4 w-full max-w-xs">
              {interviewStats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-slate-50 flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Bottom feature row ── */}
        <div className="border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
            >
              <div className={`p-2 rounded-xl ${f.bg} group-hover:scale-110 transition-transform duration-200`}>
                {f.icon}
              </div>
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
