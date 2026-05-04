import Link from "next/link";
import {
  Code2,
  Cpu,
  Layout,
  Database,
  Puzzle,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { HomeLearningCard } from "@/lib/learning/home-cards";

const ICONS: LucideIcon[] = [Code2, Cpu, Layout, Database, Puzzle, Terminal];
const CARD_COLORS = [
  "bg-accent-teal",
  "bg-accent-purple",
  "bg-accent-blue",
  "bg-secondary",
  "bg-accent-orange",
  "bg-primary",
] as const;

type PracticeProblemsProps = {
  tracks: HomeLearningCard[];
};

export default function PracticeProblems({ tracks }: PracticeProblemsProps) {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className=" max-w-7xl md:container! mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Workforce Solutions</h2>
          <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
            Comprehensive <span className="premium-text-gradient">Skill Assessments</span>
          </h3>
        </div>

        {tracks.length === 0 ? (
          <p className="text-center text-secondary/60 font-medium mb-8">
            Learning tracks will appear here once they are published in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {tracks.map((track, index) => {
              const Icon = ICONS[index % ICONS.length];
              const color = CARD_COLORS[index % CARD_COLORS.length];
              const countLabel =
                track.questionCount === 1
                  ? "1 Question"
                  : `${track.questionCount} Questions`;
              return (
                <Link
                  key={track.id}
                  href={`/problems/${track.slug}`}
                  className="pro-card p-8 flex flex-col items-center text-center group bg-white"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6 text-white`}
                  >
                    <Icon className="w-8 h-8" strokeWidth={2.25} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mb-1">{track.title}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{countLabel}</p>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center gap-3 px-10 py-4 bg-secondary text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl hover:-translate-y-1 transition-all"
          >
            Start Solving Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
