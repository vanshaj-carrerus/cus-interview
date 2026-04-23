"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TopicData } from "../data/types";

type Props = {
  topic: TopicData;
};

type AnswersState = Record<number, Record<string, number>>;

function progressKey(slug: string) {
  return `practice-progress-${slug}`;
}

type PracticeProgressStats = {
  attemptedProblems: number;
  solvedProblems: number;
  attemptedLevels: number;
  solvedLevels: number;
};

type PracticeProgressState = {
  passedLevels: number[];
  stats: PracticeProgressStats;
};

const defaultStats: PracticeProgressStats = {
  attemptedProblems: 0,
  solvedProblems: 0,
  attemptedLevels: 0,
  solvedLevels: 0,
};

function readProgressState(slug: string): PracticeProgressState {
  if (typeof window === "undefined") {
    return { passedLevels: [], stats: defaultStats };
  }

  const raw = window.localStorage.getItem(progressKey(slug));
  if (!raw) return { passedLevels: [], stats: defaultStats };

  try {
    const parsed = JSON.parse(raw) as {
      passedLevels?: number[];
      stats?: Partial<PracticeProgressStats>;
    };
    return {
      passedLevels: Array.from(new Set(parsed.passedLevels ?? [])),
      stats: {
        attemptedProblems: Number(parsed.stats?.attemptedProblems ?? 0),
        solvedProblems: Number(parsed.stats?.solvedProblems ?? 0),
        attemptedLevels: Number(parsed.stats?.attemptedLevels ?? 0),
        solvedLevels: Number(parsed.stats?.solvedLevels ?? 0),
      },
    };
  } catch {
    return { passedLevels: [], stats: defaultStats };
  }
}

export default function TopicTutorPage({ topic }: Props) {
  const [passedLevels, setPassedLevels] = useState<number[]>(
    () => readProgressState(topic.slug).passedLevels,
  );
  const [answers, setAnswers] = useState<AnswersState>({});
  const [submittedLevels, setSubmittedLevels] = useState<number[]>([]);

  const unlockedLevels = useMemo(() => {
    return topic.levels.map((level) => {
      if (level.level === 1) return true;
      return passedLevels.includes(level.level - 1);
    });
  }, [passedLevels, topic.levels]);

  const onPick = (levelNumber: number, questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [levelNumber]: {
        ...(prev[levelNumber] ?? {}),
        [questionId]: optionIndex,
      },
    }));
  };

  const submitLevel = (levelNumber: number) => {
    if (submittedLevels.includes(levelNumber)) return;

    setSubmittedLevels((prev) => [...prev, levelNumber]);
    const level = topic.levels.find((entry) => entry.level === levelNumber);
    if (!level) return;

    const selected = answers[levelNumber] ?? {};
    const score = level.questions.reduce((acc, q) => {
      return selected[q.id] === q.answerIndex ? acc + 1 : acc;
    }, 0);

    const passed = score >= level.passScore;
    const nextPassed = passed
      ? Array.from(new Set([...passedLevels, levelNumber])).sort((a, b) => a - b)
      : passedLevels;
    if (passed) {
      setPassedLevels(nextPassed);
    }
    const previous = readProgressState(topic.slug);
    const nextStats: PracticeProgressStats = {
      attemptedProblems: previous.stats.attemptedProblems + level.questions.length,
      solvedProblems: previous.stats.solvedProblems + score,
      attemptedLevels: previous.stats.attemptedLevels + 1,
      solvedLevels: previous.stats.solvedLevels + (passed ? 1 : 0),
    };
    window.localStorage.setItem(
      progressKey(topic.slug),
      JSON.stringify({
        passedLevels: nextPassed,
        stats: nextStats,
      }),
    );
    window.dispatchEvent(new Event("practice-progress-updated"));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mb-6">
        <Link href="/practice" className="text-sm text-primary font-semibold hover:underline">
          ← Back to Practice Tracks
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{topic.title}</h1>
        <p className="text-gray-600 mt-2 max-w-3xl text-sm sm:text-base">{topic.intro}</p>
      </div>

      <div className="space-y-5">
        {topic.levels.map((level, idx) => {
          const isUnlocked = unlockedLevels[idx];
          const levelAnswers = answers[level.level] ?? {};
          const answeredCount = Object.keys(levelAnswers).length;
          const isSubmitted = submittedLevels.includes(level.level);
          const score = level.questions.reduce((acc, q) => {
            return levelAnswers[q.id] === q.answerIndex ? acc + 1 : acc;
          }, 0);
          const passed = score >= level.passScore;

          return (
            <section
              key={level.level}
              className={`rounded-2xl shadow-sm border p-4 sm:p-6 ${
                isUnlocked ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Level {level.level}: {level.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{level.description}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Pass Rule</p>
                  <p className="font-semibold text-gray-700">
                    {level.passScore}/{level.questions.length} correct
                  </p>
                </div>
              </div>

              {!isUnlocked ? (
                <div className="rounded-xl bg-white border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                  This level is locked. Pass Level {level.level - 1} to unlock it.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {level.questions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="rounded-xl border border-slate-200 p-4 bg-slate-50"
                      >
                        <p className="font-semibold text-gray-800">
                          Q{qIndex + 1}. {question.question}
                        </p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optionIndex) => {
                            const selected = levelAnswers[question.id] === optionIndex;
                            return (
                              <button
                                key={option}
                                type="button"
                                className={`text-left rounded-lg px-3 py-2 border text-sm transition ${
                                  selected
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-slate-200 bg-white hover:border-slate-300 text-gray-700"
                                }`}
                                onClick={() => onPick(level.level, question.id, optionIndex)}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        {isSubmitted && (
                          <p className="mt-2 text-xs text-slate-500">
                            Answer: {question.options[question.answerIndex]} — {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => submitLevel(level.level)}
                      className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                      disabled={answeredCount < level.questions.length || isSubmitted}
                    >
                      {isSubmitted ? "Submitted" : "Submit Level Test"}
                    </button>
                    <p className="text-sm text-gray-500">
                      {answeredCount}/{level.questions.length} answered
                    </p>
                    {isSubmitted && (
                      <p
                        className={`text-sm font-semibold ${
                          passed ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        Score: {score}/{level.questions.length} ({passed ? "Passed" : "Not passed"})
                      </p>
                    )}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
