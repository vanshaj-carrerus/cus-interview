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
import { getTrackCards } from "@/lib/learning/server";

const SKELETON_CARD_COUNT = 6;

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

export function PracticeProblemsSkeleton() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" aria-busy="true" aria-label="Loading skill assessments">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl md:container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="mx-auto h-4 w-40 rounded-full bg-slate-200 animate-pulse" />
          <div className="mx-auto h-10 w-full max-w-xl rounded-xl bg-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div
              key={index}
              className="p-6 flex flex-col items-center text-center bg-white border border-slate-200/60 rounded-2xl animate-pulse shadow-sm"
              aria-hidden
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 mb-5" />
              <div className="h-4 w-3/4 rounded bg-slate-200 mb-3" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="h-12 w-48 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export async function PracticeProblemsSection() {
  const tracks = await getTrackCards("track");
  return <PracticeProblems tracks={tracks} />;
}

export default function PracticeProblems({ tracks }: PracticeProblemsProps) {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl md:container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
            Workforce Solutions
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight leading-tight">
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
                  className="group bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-5 text-white shadow-sm transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {track.title}
                  </h4>
                  <div className="mt-auto">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      {countLabel}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary text-white font-semibold text-base rounded-xl shadow-md hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            Start Solving Now
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}