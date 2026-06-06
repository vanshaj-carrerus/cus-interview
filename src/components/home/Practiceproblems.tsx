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
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden" aria-busy="true" aria-label="Loading skill assessments">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <div className="mx-auto h-3 w-40 rounded-full bg-slate-200 animate-pulse" />
          <div className="mx-auto h-10 w-full max-w-xl rounded-xl bg-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div
              key={index}
              className="p-6 flex flex-col items-start text-left bg-white border border-slate-200 rounded-xl animate-pulse shadow-sm"
              aria-hidden
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 mb-4" />
              <div className="h-4 w-full rounded bg-slate-200 mb-2" />
              <div className="h-4 w-2/3 rounded bg-slate-200 mb-6" />
              <div className="mt-auto pt-4 border-t border-slate-100 w-full flex justify-between">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-4 w-4 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-16 flex justify-center">
          <div className="h-11 w-40 rounded-lg bg-slate-200 animate-pulse" />
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
    <section className="py-16  bg-gray-50 md:py-14 border-b border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          {/* <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Workforce Solutions
          </h2> */}
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Comprehensive Skill Assessments
          </h3>
        </div>

        {tracks.length === 0 ? (
          <p className="text-center text-slate-500 font-medium mb-8">
            Learning tracks will appear here once they are published in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
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
                  className="group relative bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col items-start text-left shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-4 text-white shadow-sm shrink-0`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  
                  <h4 className="font-semibold text-slate-900 text-sm md:text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {track.title}
                  </h4>
                  
                  {/* SaaS-Style Footer Divider */}
                  <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-medium">
                      {countLabel}
                    </span>
                    
                    <svg
                      className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 md:mt-16 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-200 group w-full sm:w-auto"
          >
            Start Solving Now
            <svg
              className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all"
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