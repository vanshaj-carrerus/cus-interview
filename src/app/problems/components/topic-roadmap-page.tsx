"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Lock,
  CheckCircle2,
  Trophy,
  Target,
  Code2,
} from "lucide-react";

import { LevelItem, QuestionItem, TopicData } from "../../practice/data/types";
import { isCodingLevel } from "@/lib/learning/question-kind";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";
import { logLearningProgress } from "@/lib/learning-progress-debug";
import { buildProblemCompilerUrl } from "@/app/compiler/lib/problem-templates";
import { formatLevelTitle, parseProblemPrompt } from "@/lib/learning/problem-prompt";

type Props = {
  topic: TopicData;
  basePath?: string;
  mode?: "roadmap" | "quiz";
};

type RoadmapStep =
  | {
      kind: "mcq-level";
      level: LevelItem;
      levelIndex: number;
      stepNumber: number;
    }
  | {
      kind: "coding-problem";
      level: LevelItem;
      levelIndex: number;
      question: QuestionItem;
      questionIndex: number;
      stepNumber: number;
    };

function buildRoadmapSteps(levels: LevelItem[]): RoadmapStep[] {
  const steps: RoadmapStep[] = [];
  let stepNumber = 0;

  levels.forEach((level, levelIndex) => {
    if (isCodingLevel(level)) {
      level.questions.forEach((question, questionIndex) => {
        stepNumber += 1;
        steps.push({
          kind: "coding-problem",
          level,
          levelIndex,
          question,
          questionIndex,
          stepNumber,
        });
      });
      return;
    }

    stepNumber += 1;
    steps.push({
      kind: "mcq-level",
      level,
      levelIndex,
      stepNumber,
    });
  });

  return steps;
}

function difficultyClass(difficulty?: QuestionItem["difficulty"]) {
  if (difficulty === "easy") {
    return "text-emerald-600 bg-emerald-50 ring-emerald-500/20";
  }
  if (difficulty === "hard") {
    return "text-rose-600 bg-rose-50 ring-rose-500/20";
  }
  return "text-amber-600 bg-amber-50 ring-amber-500/20";
}

function isCodingStepUnlocked(
  stepIndex: number,
  steps: RoadmapStep[],
  unlockedLevels: boolean[],
  solvedQuestionIds: Set<string>,
  passedLevels: number[],
) {
  const step = steps[stepIndex];
  if (step.kind !== "coding-problem") {
    return unlockedLevels[step.levelIndex];
  }

  if (!unlockedLevels[step.levelIndex]) return false;
  if (stepIndex === 0) return true;

  for (let i = stepIndex - 1; i >= 0; i -= 1) {
    const previous = steps[i];
    if (previous.kind === "coding-problem") {
      return solvedQuestionIds.has(previous.question.id);
    }
    if (previous.kind === "mcq-level") {
      return passedLevels.includes(previous.level.level);
    }
  }

  return true;
}

export default function TopicRoadmapPage({
  topic,
  basePath = "/problems",
  mode = "roadmap",
}: Props) {
  const { checkAccess, paywallOpen, closePaywall } = useSubscriptionGate();
  const [passedLevels, setPassedLevels] = useState<number[]>([]);
  const [solvedQuestionIds, setSolvedQuestionIds] = useState<Set<string>>(new Set());
  const [progressLoadError, setProgressLoadError] = useState<string | null>(null);

  const isQuizMode = mode === "quiz";

  const roadmapSteps = useMemo(() => {
    const steps = buildRoadmapSteps(topic.levels);
    if (isQuizMode) {
      return steps.filter((step) => step.kind === "mcq-level");
    }
    return steps;
  }, [topic.levels, isQuizMode]);

  const isCodingTrack =
    !isQuizMode && roadmapSteps.some((step) => step.kind === "coding-problem");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cus_solved_questions");
      if (!stored) return;
      const parsed = JSON.parse(stored) as string[];
      setSolvedQuestionIds(new Set(parsed));
    } catch {
      // ignore malformed local storage
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProgress() {
      try {
        setProgressLoadError(null);
        const res = await fetch("/api/learning/me/progress", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        logLearningProgress("roadmap", "/api/learning/me/progress", {
          status: res.status,
          topicSlug: topic.slug,
        });
        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as { error?: string };
          if (!ignore) {
            setPassedLevels([]);
            setProgressLoadError(
              res.status === 401
                ? "Sign in to sync level unlocks and progress."
                : (errBody.error ?? `Progress unavailable (HTTP ${res.status}).`),
            );
          }
          return;
        }
        const data = (await res.json()) as {
          progress?: {
            tracks: { trackSlug: string; levels: { levelNumber: number; completed: boolean }[] }[];
          }[];
        };
        const languageTrack = data.progress
          ?.flatMap((language) => language.tracks)
          .find((track) => track.trackSlug === topic.slug);
        logLearningProgress("roadmap", "parsed track progress", {
          topicSlug: topic.slug,
          foundTrack: Boolean(languageTrack),
          completedLevels:
            languageTrack?.levels.filter((l) => l.completed).map((l) => l.levelNumber) ?? [],
        });
        if (!ignore && languageTrack) {
          setPassedLevels(
            languageTrack.levels
              .filter((level) => level.completed)
              .map((level) => level.levelNumber),
          );
        } else if (!ignore) {
          setPassedLevels([]);
        }
      } catch {
        if (!ignore) {
          setPassedLevels([]);
          setProgressLoadError("Could not load progress. Check the network tab and Vercel logs.");
        }
      }
    }

    void loadProgress();
    return () => {
      ignore = true;
    };
  }, [topic.slug]);

  const unlockedLevels = useMemo(() => {
    return topic.levels.map((level) => {
      if (level.level === 1) return true;
      return passedLevels.includes(level.level - 1);
    });
  }, [passedLevels, topic.levels]);

  const totalProgressItems = isCodingTrack
    ? roadmapSteps.filter((step) => step.kind === "coding-problem").length
    : topic.levels.length;

  const completedProgressItems = isCodingTrack
    ? roadmapSteps.filter(
        (step) => step.kind === "coding-problem" && solvedQuestionIds.has(step.question.id),
      ).length
    : passedLevels.length;

  const completionPercent =
    totalProgressItems > 0
      ? Math.round((completedProgressItems / totalProgressItems) * 100)
      : 0;

  const progressLabel = isQuizMode ? "Quiz Levels" : isCodingTrack ? "Problems" : "Levels";

  const isCourseContext =
    basePath === "/problems/courses" || basePath === "/dashboard/programming-languages";

  const backLabel = isQuizMode
    ? "Back to Quizzes"
    : isCourseContext
      ? "Back to Course Roadmaps"
      : "Back to Practice Tracks";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-secondary">
      <div className="max-w-6xl mx-auto">
        <Link
          href={isCourseContext ? basePath : "/practice"}
          className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>

        {progressLoadError ? (
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {progressLoadError}
          </p>
        ) : null}

        <header className="relative mb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  {isQuizMode ? "Quiz Course" : "Curriculum"}
                </span>
                <span className="w-8 h-px bg-sky-100" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {isQuizMode ? "Levels" : "Roadmap"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">
                {topic.title}
              </h1>

              <p className="text-slate-500 text-sm md:text-xl max-w-2xl leading-relaxed font-light">
                {topic.intro}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-6 p-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />

                <svg className="w-24 h-24 transform -rotate-90 relative">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    initial={{ strokeDashoffset: 263.89 }}
                    animate={{
                      strokeDashoffset: 263.89 - (263.89 * completionPercent) / 100,
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
                  <span className="text-2xl font-bold text-secondary leading-none">
                    {completionPercent}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Your Progress
                </span>
                <span className="text-sm font-medium text-slate-700 mt-1">
                  {completedProgressItems}
                  <span className="text-slate-400 mx-1">/</span>
                  {totalProgressItems} {progressLabel}
                </span>
                <div className="mt-2 flex flex-wrap gap-1 max-w-[160px]">
                  {Array.from({ length: Math.min(totalProgressItems, 20) }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-3 rounded-full transition-colors duration-500 ${
                        i < completedProgressItems ? "bg-primary" : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        <div className="relative pb-12">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 z-0" />

          <div className="space-y-6 relative z-10">
            {roadmapSteps.map((step, index) => {
              const isLeft = index % 2 !== 0;

              if (step.kind === "coding-problem") {
                const parsed = parseProblemPrompt(step.question.question);
                const isUnlocked = isCodingStepUnlocked(
                  index,
                  roadmapSteps,
                  unlockedLevels,
                  solvedQuestionIds,
                  passedLevels,
                );
                const isSolved = solvedQuestionIds.has(step.question.id);
                const isCurrent = isUnlocked && !isSolved;
                const compilerUrl = buildProblemCompilerUrl(
                  step.question.id,
                  step.question.question,
                );

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.4) }}
                    key={`${step.level.level}-${step.question.id}`}
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      isLeft ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-1 w-full flex ${
                        isLeft ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`group relative p-5 rounded-2xl border transition-all duration-300 w-full max-w-[500px] ${
                          isCurrent
                            ? "bg-white border-primary/30 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                            : "bg-white border-slate-200 shadow-sm"
                        } ${!isUnlocked ? "opacity-70" : "hover:border-primary/40"}`}
                      >
                        <div className="flex justify-between items-start mb-3 gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isSolved
                                ? "bg-emerald-50 text-emerald-600"
                                : isUnlocked
                                  ? "bg-sky-50 text-primary"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isSolved ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : isUnlocked ? (
                              <Code2 className="w-5 h-5" />
                            ) : (
                              <Lock className="w-5 h-5" />
                            )}
                          </div>
                          {step.question.difficulty ? (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ring-1 ${difficultyClass(step.question.difficulty)}`}
                            >
                              {step.question.difficulty}
                            </span>
                          ) : null}
                        </div>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Problem {step.stepNumber}
                        </p>
                        <h3 className="text-base sm:text-lg font-bold text-secondary leading-snug">
                          {parsed.title}
                        </h3>
                        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                          {parsed.description ||
                            "Open this problem in the compiler and submit your solution."}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>{topic.title}</span>
                          </div>

                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() =>
                                checkAccess(() => {
                                  window.location.href = compilerUrl;
                                })
                              }
                              className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-secondary/10 transition-all hover:bg-primary active:scale-95"
                            >
                              {isSolved ? "Review" : "Open"}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-5 py-2 rounded-xl text-sm font-bold cursor-not-allowed">
                              Locked
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold text-sm transition-all duration-500 ${
                          isSolved
                            ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                            : isUnlocked
                              ? "bg-primary text-white ring-4 ring-sky-50 shadow-lg shadow-primary/20"
                              : "bg-slate-200 text-slate-500 ring-4 ring-white"
                        }`}
                      >
                        {isSolved ? <CheckCircle2 className="w-5 h-5" /> : step.stepNumber}
                      </div>
                      {isCurrent ? (
                        <span className="absolute inset-0 rounded-full bg-primary opacity-20" />
                      ) : null}
                    </div>

                    <div className="hidden md:block flex-1" />
                  </motion.div>
                );
              }

              const { level, levelIndex } = step;
              const isUnlocked = unlockedLevels[levelIndex];
              const isPassed = passedLevels.includes(level.level);
              const isCurrent = isUnlocked && !isPassed;
              const nextPath = `${basePath}/${topic.slug}/step-${level.level}`;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.4) }}
                  key={level.level}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-1 w-full flex ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`group relative p-5 rounded-2xl border transition-all duration-300 w-full max-w-[500px] ${
                        isCurrent
                          ? "bg-white border-primary/30 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                          : "bg-white border-slate-200 shadow-sm"
                      } ${!isUnlocked ? "opacity-70 grayscale-[0.5]" : "hover:border-primary/40"}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`p-2 rounded-xl ${
                            isPassed
                              ? "bg-emerald-50 text-emerald-600"
                              : isUnlocked
                                ? "bg-sky-50 text-primary"
                                : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isUnlocked ? (
                            <Target className="w-5 h-5" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-secondary">
                        {formatLevelTitle(level.title, level.level)}
                      </h3>
                      <p className="text-slate-500 mt-2 text-sm leading-relaxed line-clamp-2">
                        {level.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{isQuizMode ? "Pass Score" : "Min. Score"}: {level.passScore}</span>
                        </div>

                        {isUnlocked ? (
                          <button
                            type="button"
                            onClick={() =>
                              checkAccess(() => {
                                window.location.href = nextPath;
                              })
                            }
                            className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-secondary/10 transition-all hover:bg-primary active:scale-95"
                          >
                            {isPassed ? (isQuizMode ? "Review Quiz" : "Review") : isQuizMode ? "Start Quiz" : "Start"}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-5 py-2 rounded-xl text-sm font-bold cursor-not-allowed">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold text-sm transition-all duration-500 ${
                        isPassed
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                          : isUnlocked
                            ? "bg-primary text-white ring-4 ring-sky-50 shadow-lg shadow-primary/20"
                            : "bg-slate-200 text-slate-500 ring-4 ring-white"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : level.level}
                    </div>
                    {isCurrent ? (
                      <span className="absolute inset-0 rounded-full bg-primary opacity-20" />
                    ) : null}
                  </div>

                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
    </div>
  );
}
