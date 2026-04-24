"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  id: string;
  text: string;
  focusArea?: string;
  difficulty?: string;
};

type ResponseItem = {
  questionId: string;
  answer: string;
  scoreOutOf10: number;
  verdict: "correct" | "partially_correct" | "incorrect";
  strengths: string[];
  gaps: string[];
  provider?: string;
};

type InterviewData = {
  id: string;
  status: string;
  startedAt?: string | null;
  createdAt?: string | null;
  seniority: string;
  focusAreas: string[];
  notes: string;
  languages: string[];
  framework: string;
  role: string;
  questions: Question[];
  responses: ResponseItem[];
};

type Props = {
  interview: InterviewData;
};

export function AiMockLiveClient({ interview }: Props) {
  const [questions, setQuestions] = useState<Question[]>(interview.questions ?? []);
  const [responses, setResponses] = useState<ResponseItem[]>(interview.responses ?? []);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [status, setStatus] = useState(interview.status);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModel, setActiveModel] = useState("");
  const [error, setError] = useState("");
  const [interviewStartTimeMs, setInterviewStartTimeMs] = useState<number | null>(() => {
    const source = interview.startedAt ?? interview.createdAt;
    return source ? Date.parse(source) : null;
  });
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const estimatedTotalSeconds = useMemo(() => {
    if (questions.length === 0) return 0;
    return questions.reduce((sum, q) => {
      const difficulty = (q.difficulty ?? "").toLowerCase();
      const base = difficulty === "hard" ? 150 : difficulty === "easy" ? 90 : 120;
      const lengthBoost = Math.ceil((q.text?.length ?? 0) / 60) * 5;
      return sum + base + lengthBoost;
    }, 0);
  }, [questions]);
  const isTimeUp = remainingSeconds !== null && remainingSeconds <= 0;
  const isInterviewClosed = status === "completed" || isTimeUp;
  const unlockedCount = isInterviewClosed
    ? questions.length
    : Math.min(questions.length, responses.length + 1);
  const visibleQuestions = questions.slice(0, unlockedCount);
  const activeQuestion = visibleQuestions[activeQuestionIndex];
  const activeResponse = useMemo(
    () => responses.find((x) => x.questionId === activeQuestion?.id),
    [responses, activeQuestion?.id],
  );
  const isInterviewCompleted = isInterviewClosed;
  const isActiveQuestionAnswered = Boolean(activeResponse);
  const isLocked = isInterviewCompleted || isActiveQuestionAnswered;

  const averageScoreOutOf10 = useMemo(() => {
    if (responses.length === 0) return 0;
    const avg = responses.reduce((sum, item) => sum + item.scoreOutOf10, 0) / responses.length;
    return Number(avg.toFixed(1));
  }, [responses]);

  useEffect(() => {
    if (!activeQuestion) return;
    const existing = responses.find((x) => x.questionId === activeQuestion.id);
    setDraftAnswer(existing?.answer ?? "");
  }, [activeQuestion, responses]);

  useEffect(() => {
    if (activeQuestionIndex < unlockedCount) return;
    setActiveQuestionIndex(Math.max(0, unlockedCount - 1));
  }, [activeQuestionIndex, unlockedCount]);

  useEffect(() => {
    if (questions.length === 0 || estimatedTotalSeconds <= 0) {
      setRemainingSeconds(null);
      return;
    }
    const startAt = interviewStartTimeMs ?? Date.now();
    if (!interviewStartTimeMs) setInterviewStartTimeMs(startAt);

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startAt) / 1000);
      setRemainingSeconds(Math.max(estimatedTotalSeconds - elapsed, 0));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [questions.length, estimatedTotalSeconds, interviewStartTimeMs]);

  const handleStartInterview = async () => {
    setError("");
    setIsStarting(true);
    try {
      const response = await fetch(`/api/mock-interviews/ai-mock/${interview.id}/start`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        error?: string;
        questions?: Question[];
        status?: string;
        model?: string;
      };
      if (!response.ok || !data.questions) {
        setError(data.error || "Failed to generate interview questions.");
        return;
      }
      setQuestions(data.questions);
      setStatus(data.status || "in_progress");
      setActiveModel(data.model || "");
      setInterviewStartTimeMs(Date.now());
      setActiveQuestionIndex(0);
    } catch {
      setError("Unable to start interview right now. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEvaluate = async () => {
    if (!activeQuestion) return;
    const trimmed = draftAnswer.trim();
    if (!trimmed) {
      setError("Please enter your answer first.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/mock-interviews/ai-mock/${interview.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          answer: trimmed,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        evaluation?: ResponseItem;
        progress?: { status?: string };
      };
      if (!response.ok || !data.evaluation) {
        setError(data.error || "Failed to evaluate your answer.");
        return;
      }
      setResponses((prev) => {
        const index = prev.findIndex((x) => x.questionId === data.evaluation!.questionId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data.evaluation!;
          return updated;
        }
        return [...prev, data.evaluation!];
      });
      setStatus(data.progress?.status || "in_progress");
      setActiveQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
    } catch {
      setError("Evaluation service unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressLabel = `${responses.length}/${questions.length || 0}`;
  const minutes = remainingSeconds === null ? 0 : Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds === null ? 0 : remainingSeconds % 60;
  const timerLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-500">Status: {status}</span>
          <span className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-primary">
            Progress: {progressLabel}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
            Avg score: {averageScoreOutOf10}/10
          </span>
          {questions.length > 0 && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700">
              Time left: {timerLabel}
            </span>
          )}
          {activeModel && (
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-indigo-700">Model: {activeModel}</span>
          )}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-black tracking-tight text-secondary">Generate your interview round</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            We will create 8 tailored questions from your role, stack, seniority, and focus areas.
          </p>
          <button
            type="button"
            onClick={handleStartInterview}
            disabled={isStarting || isInterviewCompleted}
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-secondary px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white disabled:opacity-50"
          >
            {isStarting ? "Generating..." : "Start AI interview"}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]">
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">Questions</p>
            <div className="space-y-2">
              {visibleQuestions.map((q, idx) => {
                const answered = responses.some((x) => x.questionId === q.id);
                const active = idx === activeQuestionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`w-full rounded-2xl border px-3 py-2.5 text-left text-xs font-bold ${
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    Q{idx + 1} {answered ? " - scored" : ""}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] space-y-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Question {activeQuestionIndex + 1}
              </p>
              <h3 className="mt-2 text-xl font-black leading-snug text-secondary">{activeQuestion?.text}</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Focus: {activeQuestion?.focusArea || "general"} | Difficulty: {activeQuestion?.difficulty || "medium"}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-black uppercase tracking-widest text-secondary">
                Your answer
              </label>
              <textarea
                id="answer"
                value={draftAnswer}
                onChange={(e) => setDraftAnswer(e.target.value)}
                rows={7}
                placeholder="Write a clear, structured response. Mention tradeoffs, edge-cases, and practical decisions."
                disabled={isLocked || isSubmitting}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isSubmitting || isLocked || !activeQuestion}
              className="inline-flex items-center justify-center rounded-2xl bg-secondary px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white disabled:opacity-50"
            >
              {isSubmitting ? "Evaluating..." : "Evaluate answer"}
            </button>
            {isActiveQuestionAnswered && !isInterviewCompleted && (
              <p className="text-xs font-bold text-slate-500">
                This question is already scored. Select another question to continue.
              </p>
            )}
            {isInterviewCompleted && (
              <p className="text-xs font-bold text-emerald-700">
                Interview closed. Answers are locked and no further evaluation is allowed.
              </p>
            )}

            {activeResponse && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-secondary">
                  Score: {activeResponse.scoreOutOf10}/10 ({activeResponse.verdict.replaceAll("_", " ")})
                </p>
                {activeResponse.strengths.length > 0 && (
                  <p className="text-sm text-slate-700">
                    <span className="font-black">Strengths:</span> {activeResponse.strengths.join(" | ")}
                  </p>
                )}
                {activeResponse.gaps.length > 0 && (
                  <p className="text-sm text-slate-700">
                    <span className="font-black">Gaps:</span> {activeResponse.gaps.join(" | ")}
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
