"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Lock,
  CheckCircle2,
  PlayCircle,
  Trophy,
  Target,
  ArrowRight,
} from "lucide-react";

import { TopicData } from "../../practice/data/types";

type Props = {
  topic: TopicData;
  basePath?: string;
};

export default function TopicRoadmapPage({
  topic,
  basePath = "/problems",
}: Props) {
  const [passedLevels, setPassedLevels] = useState<number[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadProgress() {
      try {
        const res = await fetch("/api/learning/me/progress", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          progress?: {
            tracks: { trackSlug: string; levels: { levelNumber: number; completed: boolean }[] }[];
          }[];
        };
        const languageTrack = data.progress
          ?.flatMap((language) => language.tracks)
          .find((track) => track.trackSlug === topic.slug);
        if (!ignore && languageTrack) {
          setPassedLevels(
            languageTrack.levels
              .filter((level) => level.completed)
              .map((level) => level.levelNumber)
          );
        }
      } catch {
        if (!ignore) setPassedLevels([]);
      }
    }

    void loadProgress();
    return () => {
      ignore = true;
    };
  }, [topic.slug]);

  const unlocked = useMemo(() => {
    return topic.levels.map((level) => {
      if (level.level === 1) return true;
      return passedLevels.includes(level.level - 1);
    });
  }, [passedLevels, topic.levels]);

  const completionPercent = Math.round(
    (passedLevels.length / topic.levels.length) * 100,
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <Link
          href="/practice"
          className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Practice Tracks
        </Link>

        {/* Header Hero Section */}
        <header className="relative mb-16 pt-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
            <div className="flex-1 space-y-4">
              {/* Breadcrumb / Category */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Curriculum
                </span>
                <span className="w-8 h-px bg-indigo-100" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Roadmap
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                {topic.title}
              </h1>

              <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
                {topic.intro}
              </p>
            </div>

            {/* Clean Minimalist Progress Ring */}
            <div className="shrink-0 flex items-center gap-6 p-2">
              <div className="relative group">
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />

                <svg className="w-24 h-24 transform -rotate-90 relative">
                  {/* Background Circle (Track) */}
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    initial={{ strokeDashoffset: 263.89 }}
                    animate={{
                      strokeDashoffset:
                        263.89 - (263.89 * completionPercent) / 100,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={263.89}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900 leading-none">
                    {completionPercent}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Your Progress
                </span>
                <span className="text-sm font-medium text-slate-700 mt-1">
                  {passedLevels.length}{" "}
                  <span className="text-slate-400 mx-1">/</span>{" "}
                  {topic.levels.length}
                </span>
                <div className="mt-2 flex gap-1">
                  {topic.levels.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-4 rounded-full transition-colors duration-500 ${
                        i < passedLevels.length
                          ? "bg-primary"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subtle bottom separator */}
          <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        {/* Main Roadmap */}
        <div className="relative">
          {/* Central Vertical Line (Desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 z-0" />

          <div className="space-y-12 relative z-10">
            {topic.levels.map((level, index) => {
              const isUnlocked = unlocked[index];
              const isPassed = passedLevels.includes(level.level);
              const isCurrent = isUnlocked && !isPassed;
              const nextPath = `${basePath}/${topic.slug}/step-${level.level}`;
              const isLeft = index % 2 !== 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={level.level}
                  className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Card Section */}
                  <div className="flex-1 w-full">
                    <div
                      className={`
                      group relative p-6 rounded-4xl border transition-all duration-300
                      ${isCurrent ? "bg-white border-indigo-200 shadow-xl shadow-primary/5 ring-1 ring-indigo-50" : "bg-white border-slate-100 shadow-sm"}
                      ${!isUnlocked ? "opacity-70 grayscale-[0.5]" : "hover:border-indigo-300"}
                    `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`p-2 rounded-xl ${isPassed ? "bg-emerald-50 text-emerald-600" : isUnlocked ? "bg-indigo-50 text-primary" : "bg-slate-100 text-slate-400"}`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isUnlocked ? (
                            <Target className="w-5 h-5" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-700"
                              : isUnlocked
                                ? "bg-indigo-100 text-primary"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isPassed
                            ? "Mastered"
                            : isUnlocked
                              ? "Current"
                              : "Locked"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800">
                        {level.title}
                      </h3>
                      <p className="text-slate-500 mt-2 text-sm leading-relaxed line-clamp-2">
                        {level.description}
                      </p>

                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Min. Score: {level.passScore}</span>
                        </div>

                        {isUnlocked ? (
                          <Link
                            href={nextPath}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                          >
                            {isPassed ? "Review" : "Start"}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-5 py-2 rounded-xl text-sm font-bold cursor-not-allowed">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Indicator Connector */}
                  <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold text-sm transition-all duration-500
                      ${
                        isPassed
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                          : isUnlocked
                            ? "bg-primary text-white ring-4 ring-indigo-50 shadow-lg shadow-primary/20"
                            : "bg-slate-200 text-slate-500 ring-4 ring-white"
                      }
                    `}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        level.level
                      )}
                    </div>
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Spacer for Desktop Alignment */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-8 rounded-4xl bg-primary flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold text-xl">
                Ready to push forward?
              </h4>
              <p className="text-white text-sm">
                Pick up exactly where you left off or reset your path.
              </p>
            </div>
          </div>
          <Link
            href={`${basePath}/${topic.slug}/step-1`}
            className="w-full md:w-auto bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-center"
          >
            Restart Journey
          </Link>
        </footer>
      </div>
    </div>
  );
}
