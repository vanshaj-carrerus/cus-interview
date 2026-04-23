"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  BarChart3,
  Compass,
} from "lucide-react";

import { LevelItem, TopicData } from "../../practice/data/types";

type Props = {
  topic: TopicData;
  level: LevelItem;
  basePath?: string;
};

export default function TopicStepPage({
  topic,
  level,
  basePath = "/problems",
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const question = level.questions[currentIndex];
  const isLastQuestion = currentIndex === level.questions.length - 1;
  const passed = correctCount >= level.passScore;
  const progress =
    ((currentIndex + (showFeedback ? 1 : 0)) / level.questions.length) * 100;
  const nextLevel = topic.levels.find((item) => item.level === level.level + 1);

  const onSelectAnswer = async (optionIndex: number) => {
    if (showFeedback || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    setSelectedAnswer(optionIndex);
    try {
      const res = await fetch(`/api/learning/questions/${question.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ answer: String(optionIndex) }),
      });
      const payload = (await res.json()) as {
        error?: string;
        result?: {
          isCorrect: boolean;
          explanation?: string;
          scoreAwarded: number;
          tracked?: boolean;
        };
      };
      if (!res.ok) {
        setSelectedAnswer(null);
        setShowFeedback(false);
        setSubmitError(
          payload.error ??
            "Answer verification failed. Please sign in and ensure tracking DB is configured."
        );
        return;
      }
      const result = payload.result;
      if (result) {
        setIsAnswerCorrect(result.isCorrect);
        setFeedbackExplanation(
          result.tracked === false
            ? `${result.explanation ?? question.explanation} (Guest mode: sign in to save tracking.)`
            : (result.explanation ?? question.explanation)
        );
        if (result.scoreAwarded > 0) {
          setCorrectCount((prev) => prev + result.scoreAwarded);
        }
      } else {
        setIsAnswerCorrect(false);
        setFeedbackExplanation(question.explanation);
      }
      setShowFeedback(true);
    } catch {
      setSelectedAnswer(null);
      setShowFeedback(false);
      setSubmitError("Network/server error while verifying answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onNextQuestion = () => {
    if (isLastQuestion) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedbackExplanation("");
      setIsAnswerCorrect(false);
      setSubmitError("");
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
        >
          <div
            className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${passed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
          >
            {passed ? (
              <Trophy className="w-10 h-10" />
            ) : (
              <RotateCcw className="w-10 h-10" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            {passed ? "Step Mastered" : "Keep Practicing"}
          </h1>
          <p className="text-slate-500 mt-4 text-lg">
            {passed
              ? `You've successfully completed ${level.title}.`
              : `You scored ${correctCount}/${level.questions.length}. You need ${level.passScore} to pass.`}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Score
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {Math.round((correctCount / level.questions.length) * 100)}%
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status
              </p>
              <p
                className={`text-3xl font-bold mt-1 ${passed ? "text-emerald-600" : "text-slate-600"}`}
              >
                {passed ? "Passed" : "Retry"}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href={`${basePath}/${topic.slug}`}
              className="flex-1 bg-slate-900 text-white w-96! py-2 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg shadow-slate-900/10"
            >
              Back to Roadmap
            </Link>
            {nextLevel ? (
              <Link
                href={`${basePath}/${topic.slug}/step-${nextLevel.level}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 px-6 py-2 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                <Compass className="w-5 h-5" />
                <span>Next Step</span>
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-400 border border-slate-200 px-6 py-2 rounded-2xl font-bold cursor-not-allowed"
              >
                <Compass className="w-5 h-5" />
                <span>Next Step</span>
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-white text-slate-600 border border-slate-200 px-6 py-2 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link
              href={`${basePath}/${topic.slug}`}
              className="group inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              {topic.title}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{level.title}</h1>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/admin-panel?track=${topic.slug}&level=${level.level}`}
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
            >
              Add Question
            </Link>
            <StatBox
              label="Live Score"
              value={`${correctCount}/${level.questions.length}`}
              icon={<Target className="w-4 h-4" />}
            />
            <StatBox
              label="Goal"
              value={`${level.passScore}`}
              icon={<Trophy className="w-4 h-4" />}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
          {/* Main Question Area */}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="text-sm font-bold text-primary px-3 py-1 bg-indigo-50 rounded-lg">
                    Question {currentIndex + 1}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-semibold text-slate-800 leading-tight">
                    {question.question}
                  </h2>
                </div>

                <div className="grid gap-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = showFeedback && index === selectedAnswer && isAnswerCorrect;
                    const isWrong =
                      showFeedback &&
                      isSelected &&
                      !isAnswerCorrect;

                    return (
                      <button
                        key={index}
                        disabled={showFeedback}
                        onClick={() => onSelectAnswer(index)}
                        className={`
                          group relative w-full text-left p-6 rounded-3xl border-2 transition-all duration-200
                          ${
                            isCorrect
                              ? "border-emerald-500 bg-emerald-50/50"
                              : isWrong
                                ? "border-rose-500 bg-rose-50/50"
                                : isSelected
                                  ? "border-primary bg-white shadow-md"
                                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-lg font-medium ${isCorrect ? "text-emerald-700" : isWrong ? "text-rose-700" : "text-slate-700"}`}
                          >
                            {option}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          )}
                          {isWrong && (
                            <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feedback & Actions */}
            <div className="mt-10 min-h-[120px]">
              {submitError ? (
                <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {submitError}
                </p>
              ) : null}
              {showFeedback ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-slate-900 rounded-4xl text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Explanation
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      {feedbackExplanation}
                    </p>
                  </div>
                  <button
                    onClick={onNextQuestion}
                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg shadow-primary/20"
                  >
                    {isLastQuestion ? "View Results" : "Next Question"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  {submitting ? "Submitting..." : "Select an answer to continue..."}
                </p>
              )}
            </div>
          </main>

          {/* Sidebar Insights */}
          <aside className="hidden lg:block space-y-6">
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg text-primary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Session Stats</h3>
              </div>
              <div className="space-y-6">
                <SidebarStat
                  label="Current Accuracy"
                  value={`${Math.round((correctCount / (currentIndex + 1)) * 100)}%`}
                />
                <SidebarStat
                  label="Questions Left"
                  value={`${level.questions.length - (currentIndex + 1)}`}
                />
                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Topic Context
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {level.description}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 leading-none">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function SidebarStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
