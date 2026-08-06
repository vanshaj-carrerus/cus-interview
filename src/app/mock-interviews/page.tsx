"use client";

import Link from "next/link";
import { useState } from "react";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";
import {
  Play,
  ShieldCheck,
  Layers,
  Sparkles,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Bot,
  Zap,
  Brain,
  Code2,
  Terminal,
  Cpu,
  Lock,
  BarChart3,
  HelpCircle,
  Mail,
} from "lucide-react";

const rolesList = [
  {
    id: "backend",
    title: "Backend Developer",
    desc: "Node.js, System Design, SQL, API Scalability",
    icon: Terminal,
    tags: ["Node.js", "PostgreSQL", "System Architecture"],
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    desc: "LLMs, RAG, PyTorch, Model Fine-Tuning & Evaluation",
    icon: Brain,
    tags: ["Python", "LangChain", "Vector DBs"],
  },
  {
    id: "senior-devops",
    title: "Senior DevOps",
    desc: "Kubernetes, CI/CD pipelines, Cloud Infra & Security",
    icon: Cpu,
    tags: ["Docker", "Kubernetes", "AWS / Terraform"],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    desc: "Product Sense, System Architecture & Metric Prioritization",
    icon: Layers,
    tags: ["Strategy", "Roadmapping", "Tech Specs"],
  },
];

const faqItems = [
  {
    q: "Will CUS integrate with my existing ATS?",
    a: "Yes, CUS seamlessly connects with major ATS platforms (Greenhouse, Lever, Workday) and provides robust webhooks and REST APIs to sync candidate scorecards automatically.",
  },
  {
    q: "Does CUS evaluate coding speed and depth?",
    a: "CUS measures solution correctness, time complexity, code cleanliness, edge case handling, and adaptive follow-up responses in real time.",
  },
  {
    q: "Why should I use an AI interviewer for my hiring process?",
    a: "Reduce interviewer fatigue, eliminate scheduling bottlenecks, eliminate human bias with standardized rubrics, and 10x your candidate screening capacity without adding engineering hours.",
  },
  {
    q: "Will this replace my team's final interview decision?",
    a: "No, CUS acts as your force multiplier—delivering evidence-based scores, full video recordings, and granular transcripts so human panels can focus on high-touch final cultural & leadership rounds.",
  },
];

export default function MockInterviewPage() {
  const { gatedNavigate, paywallOpen, closePaywall } = useSubscriptionGate();
  const [activeRole, setActiveRole] = useState("backend");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStartInterview = (roleId?: string) => {
    const targetRole = roleId || activeRole;
    gatedNavigate(`/mock-interviews/ai-mock?role=${targetRole}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      {/* ── Top Hero Section ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/60 border border-slate-300/50 text-xs font-semibold text-slate-700 tracking-wide mb-8">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Next-Gen AI Technical Interviewer</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-950 leading-[1.1] max-w-4xl mx-auto mb-6">
          Finally, an AI Interviewer that <span className="italic font-serif font-normal text-slate-800">actually works.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          <strong className="text-slate-900 font-semibold">CUS Interview:</strong> Full-stack AI interviews that test candidates, adapt in real-time, probe for depth, flag suspicious behavior, and deliver evidence-based reports you can trust.
        </p>

        {/* ── Dark Hero Player Card ── */}
        <div className="mt-8 relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-[#090D14] border border-slate-800 p-4 md:p-8 shadow-2xl overflow-hidden group">
            {/* Glow accent behind player */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative aspect-video md:aspect-[21/9] rounded-2xl bg-[#05070A] border border-slate-800/80 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Subtle mesh background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Watermark Logo */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">CUS Interviewer</span>
              </div>

              {/* Interactive Video / Demo Player view */}
              {!isVideoPlaying ? (
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-5">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:border-sky-400 cursor-pointer"
                       onClick={() => setIsVideoPlaying(true)}>
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Your hiring superpower</h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-1 font-mono">cusinterview.com/ai-interview</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-sky-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI Session Simulation
                    </span>
                    <button 
                      onClick={() => setIsVideoPlaying(false)} 
                      className="text-xs font-mono text-slate-400 hover:text-white"
                    >
                      Close Demo
                    </button>
                  </div>
                  <div className="space-y-3 my-auto max-w-xl">
                    <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm font-mono leading-relaxed">
                      <span className="text-sky-400 font-semibold">AI Interviewer:</span> "Can you optimize your SQL query when dealing with millions of concurrent read requests?"
                    </div>
                    <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-4 text-slate-100 text-sm font-mono leading-relaxed ml-6">
                      <span className="text-emerald-400 font-semibold">Candidate:</span> "I would implement read replicas, add indexing on high-frequency filters, and introduce Redis caching..."
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
                    <span>Adaptive Depth: High</span>
                    <span>Proctoring Status: Active</span>
                  </div>
                </div>
              )}

              {/* Bottom Play bar simulation */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStartInterview()}
                  className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg transition-all"
                >
                  Start Live Session →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark Features Grid Section ── */}
      <section className="bg-[#090D14] text-white py-20 px-6 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Quick email action row */}
          <div className="max-w-xl mx-auto flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-full p-1.5 shadow-inner">
            <input
              type="email"
              placeholder="Enter your work email for a demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-slate-400 px-5 focus:outline-none flex-1"
            />
            <button
              type="button"
              onClick={() => handleStartInterview()}
              className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all shrink-0 shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* 2-Column Cards */}
          <div className="grid md:grid-cols-2 gap-8 pt-6">
            {/* Card 1 */}
            <div className="bg-[#0D131F] border border-slate-800 rounded-3xl p-8 md:p-10 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">Integrity Built In</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Real-time proctoring, tab switch tracking, and audio/video analysis ensure you can make hiring decisions based strictly on true candidate performance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0D131F] border border-slate-800 rounded-3xl p-8 md:p-10 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">Consistent by Design</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Slide into any role, seniority level, or tech stack—evaluations follow a standardized rubric framework so feedback remains objective every single time.
              </p>
            </div>
          </div>

          {/* Center Callout */}
          <div className="text-center pt-8 max-w-2xl mx-auto space-y-3">
            <h4 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Get Started Quickly</h4>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Set up a job role in under 2 minutes and share a link to start interviewing candidates right away.
            </p>
          </div>
        </div>
      </section>

      {/* ── Try CUS for yourself (Interactive Role Selector) ── */}
      <section className="bg-[#090D14] text-white py-20 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Try CUS for yourself</h2>
            <p className="text-slate-400 text-sm md:text-base mt-2">Select a role below to start a live trial session:</p>
          </div>

          {/* Role selector buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {rolesList.map((role) => {
              const isSelected = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={`py-3.5 px-4 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 text-center border ${
                    isSelected
                      ? "bg-slate-800 border-slate-600 text-white shadow-lg ring-1 ring-slate-500"
                      : "bg-[#0D131F] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  {role.title}
                </button>
              );
            })}
          </div>

          {/* Selected Role Card Details */}
          {rolesList.find((r) => r.id === activeRole) && (
            <div className="bg-[#0D131F] border border-slate-800 rounded-3xl p-8 md:p-10 max-w-3xl mx-auto text-left space-y-6 shadow-2xl">
              {(() => {
                const current = rolesList.find((r) => r.id === activeRole)!;
                const IconComponent = current.icon;
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{current.title}</h4>
                          <p className="text-xs text-slate-400">{current.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full">
                        Ready to launch
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Evaluated Tech Stack & Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {current.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <p className="text-xs text-slate-400">Full 30-min adaptive session with AI instant scorecard report.</p>
                      <button
                        type="button"
                        onClick={() => handleStartInterview(current.id)}
                        className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs md:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 shadow-lg"
                      >
                        Launch Interview <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">Frequently asked questions</h2>
          <p className="text-slate-600 text-sm sm:text-base">Everything you need to know about CUS AI Interviewer.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-base md:text-lg hover:text-sky-600 transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-slate-400 shrink-0">
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-sky-600" : ""}`} />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          Have more questions?{" "}
          <a href="mailto:support@cusinterview.com" className="text-sky-600 hover:underline font-medium">
            Contact us at support@cusinterview.com
          </a>
        </div>
      </section>

      {/* ── Dark Bottom CTA Banner ── */}
      <section className="bg-[#090D14] text-white py-16 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-100 tracking-tight leading-relaxed max-w-3xl mx-auto">
            Quick setup, seamless interview, built-in integrity, instant report. See for yourself and get CUS for your team.
          </p>

          <div className="max-w-md mx-auto flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-full p-1.5 shadow-inner">
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-slate-400 px-5 focus:outline-none flex-1"
            />
            <button
              type="button"
              onClick={() => handleStartInterview()}
              className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all shrink-0 shadow-md"
            >
              Get Started
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">CUS Interviewer</span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </section>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
    </div>
  );
}