"use client";


import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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

type SpeechRecognitionResult = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResult>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  webkitSpeechRecognition?: SpeechRecognitionCtor;
  SpeechRecognition?: SpeechRecognitionCtor;
};

type VoicePreference = "female" | "male";

export function AiMockLiveClient({ interview }: Props) {

  const interviewerVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const [questions, setQuestions] = useState<Question[]>(
    interview.questions ?? [],
  );
  const [responses, setResponses] = useState<ResponseItem[]>(
    interview.responses ?? [],
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState(interview.status);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setActiveModel] = useState("");
  const [error, setError] = useState("");
  const [interviewStartTimeMs, setInterviewStartTimeMs] = useState<
    number | null
  >(() => {
    const source = interview.startedAt ?? interview.createdAt;
    return source ? Date.parse(source) : null;
  });
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isSpeechOutputEnabled, setIsSpeechOutputEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    const speechWindow = window as SpeechWindow;
    return Boolean(
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition,
    );
  });
  const [speechError, setSpeechError] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>(
    [],
  );
  const [voicePreference, setVoicePreference] = useState<VoicePreference>("female");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceDraftBaseRef = useRef("");
  const timerPausedRef = useRef(false);
  const timerPauseStartedAtRef = useRef<number | null>(null);
  const timerPausedDurationMsRef = useRef(0);

  const estimatedTotalSeconds = useMemo(() => {
    if (questions.length === 0) return 0;
    return questions.reduce((sum, q) => {
      const difficulty = (q.difficulty ?? "").toLowerCase();
      const base =
        difficulty === "hard" ? 150 : difficulty === "easy" ? 90 : 120;
      const lengthBoost = Math.ceil((q.text?.length ?? 0) / 60) * 5;
      return sum + base + lengthBoost;
    }, 0);
  }, [questions]);
  const isTimeUp = remainingSeconds !== null && remainingSeconds <= 0;
  const isInterviewClosed = status === "completed" || isTimeUp;
  const unlockedCount = isInterviewClosed
    ? questions.length
    : Math.min(questions.length, responses.length + 1);
  const safeActiveQuestionIndex = Math.min(
    activeQuestionIndex,
    Math.max(0, unlockedCount - 1),
  );
  const visibleQuestions = questions.slice(0, unlockedCount);
  const activeQuestion = visibleQuestions[safeActiveQuestionIndex];
  const activeResponse = responses.find(
    (x) => x.questionId === activeQuestion?.id,
  );
  const draftAnswer = activeQuestion
    ? draftAnswers[activeQuestion.id] ?? activeResponse?.answer ?? ""
    : "";
  const isInterviewCompleted = isInterviewClosed;
  const isActiveQuestionAnswered = Boolean(activeResponse);
  const isLocked = isInterviewCompleted || isActiveQuestionAnswered;
  const speechSynthesisSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const averageScoreOutOf10 = useMemo(() => {
    if (responses.length === 0) return 0;
    const avg =
      responses.reduce((sum, item) => sum + item.scoreOutOf10, 0) /
      responses.length;
    return Number(avg.toFixed(1));
  }, [responses]);

  useEffect(() => {
    if (questions.length === 0 || estimatedTotalSeconds <= 0) return;
    const startAt = interviewStartTimeMs ?? Date.now();

    const tick = () => {
      if (timerPausedRef.current) return;
      const elapsed = Math.floor((Date.now() - startAt) / 1000);
      const pausedSeconds = Math.floor(timerPausedDurationMsRef.current / 1000);
      setRemainingSeconds(
        Math.max(estimatedTotalSeconds - elapsed + pausedSeconds, 0),
      );
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [questions.length, estimatedTotalSeconds, interviewStartTimeMs]);

  useEffect(() => {
    if (isAiSpeaking) {
      timerPausedRef.current = true;
      timerPauseStartedAtRef.current = Date.now();
      return;
    }
    const pauseStartedAt = timerPauseStartedAtRef.current;
    if (pauseStartedAt !== null) {
      timerPausedDurationMsRef.current += Date.now() - pauseStartedAt;
      timerPauseStartedAtRef.current = null;
    }
    timerPausedRef.current = false;
  }, [isAiSpeaking]);

  //  Control with isAiSpeaking

  useEffect(() => {
  const video = interviewerVideoRef.current;

  if (!video) return;

  if (isAiSpeaking) {
    video.currentTime = 0;
    video.play().catch(() => {});
  } else {
    video.pause();
  }
}, [isAiSpeaking]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        webcamStreamRef.current = stream;

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied", error);
      }
    };

    startCamera();

    return () => {
      webcamStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!speechSynthesisSupported) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [speechSynthesisSupported]);

  const pickPreferredVoice = (
    voices: SpeechSynthesisVoice[],
    preferred: VoicePreference,
  ) => {
    if (voices.length === 0) return null;
    const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    const pool = englishVoices.length ? englishVoices : voices;
    const femaleHints = /(female|woman|zira|samantha|aria|jenny|susan|heera|hazel|siri)/i;
    const maleHints = /(male|man|david|mark|george|ryan|alex|daniel|james)/i;
    const premiumHints = /(natural|neural|enhanced|premium|online)/i;
    const targetHints = preferred === "female" ? femaleHints : maleHints;
    const fallbackHints = preferred === "female" ? maleHints : femaleHints;

    const bestMatch =
      pool.find((v) => premiumHints.test(v.name) && targetHints.test(v.name)) ??
      pool.find((v) => targetHints.test(v.name)) ??
      pool.find((v) => premiumHints.test(v.name) && !fallbackHints.test(v.name)) ??
      pool.find((v) => !fallbackHints.test(v.name)) ??
      pool[0];
    return bestMatch ?? null;
  };

  const normalizeSpeechText = (text: string) => {
    return text
      .replace(/\bAPI\b/g, "A P I")
      .replace(/\bSQL\b/g, "sequel")
      .replace(/\bNoSQL\b/g, "No sequel")
      .replace(/\bUI\b/g, "U I")
      .replace(/\bUX\b/g, "U X")
      .replace(/\bCI\/CD\b/g, "C I C D")
      .replace(/\b(\d+)\s*x\b/gi, "$1 times")
      .replace(/\s+/g, " ")
      .trim();
  };

  const speakText = (text: string) => {
    if (!speechSynthesisSupported || !isSpeechOutputEnabled) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    const utterance = new SpeechSynthesisUtterance(normalizeSpeechText(trimmed));
    const selectedVoice = pickPreferredVoice(availableVoices, voicePreference);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = selectedVoice?.lang ?? "en-US";
    utterance.rate = 0.94;
    utterance.pitch = voicePreference === "female" ? 1.02 : 0.96;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const speakTextAsync = (text: string) =>
    new Promise<void>((resolve) => {
      if (!speechSynthesisSupported || !isSpeechOutputEnabled) {
        resolve();
        return;
      }
      const trimmed = text.trim();
      if (!trimmed) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(normalizeSpeechText(trimmed));
      const selectedVoice = pickPreferredVoice(availableVoices, voicePreference);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.lang = selectedVoice?.lang ?? "en-US";
      utterance.rate = 0.94;
      utterance.pitch = voicePreference === "female" ? 1.02 : 0.96;
      utterance.volume = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const setActiveDraftAnswer = (value: string) => {
    if (!activeQuestion) return;
    setDraftAnswers((prev) => ({ ...prev, [activeQuestion.id]: value }));
  };

  const handleStartListening = () => {
    if (typeof window === "undefined") return;
    setSpeechError("");
    const speechWindow = window as SpeechWindow;
    const SpeechRecognitionImpl =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionImpl();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0]?.transcript ?? "";
          if (event.results[i].isFinal) finalTranscript += transcript;
          else interimTranscript += transcript;
        }
        setActiveDraftAnswer(
          `${voiceDraftBaseRef.current}${finalTranscript}${interimTranscript}`.trimStart(),
        );
      };
      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission denied.");
        } else if (event.error && event.error !== "no-speech") {
          setSpeechError(`Voice input error: ${event.error}`);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        voiceDraftBaseRef.current = "";
      };
      recognitionRef.current = recognition;
    }

    voiceDraftBaseRef.current = draftAnswer ? `${draftAnswer.trimEnd()} ` : "";
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setSpeechError("Voice input is already running.");
    }
  };

  const handleStartInterview = async () => {
    setError("");
    setIsStarting(true);
    try {
      const response = await fetch(
        `/api/mock-interviews/ai-mock/${interview.id}/start`,
        {
          method: "POST",
        },
      );
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
      timerPausedRef.current = false;
      timerPauseStartedAtRef.current = null;
      timerPausedDurationMsRef.current = 0;
      setActiveQuestionIndex(0);
      if (data.questions[0]?.text) {
        speakText(data.questions[0].text);
      }
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
      const response = await fetch(
        `/api/mock-interviews/ai-mock/${interview.id}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: activeQuestion.id,
            answer: trimmed,
          }),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        evaluation?: ResponseItem;
        progress?: { status?: string };
      };
      if (!response.ok || !data.evaluation) {
        setError(data.error || "Failed to evaluate your answer.");
        return;
      }
      const spokenFeedback = [
        `Score ${data.evaluation.scoreOutOf10} out of 10.`,
        data.evaluation.strengths.length
          ? `Strengths: ${data.evaluation.strengths.join(", ")}.`
          : "",
        data.evaluation.gaps.length
          ? `Gaps: ${data.evaluation.gaps.join(", ")}.`
          : "",
      ]
        .filter(Boolean)
        .join(" ");
      setResponses((prev) => {
        const index = prev.findIndex(
          (x) => x.questionId === data.evaluation!.questionId,
        );
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data.evaluation!;
          return updated;
        }
        return [...prev, data.evaluation!];
      });
      setStatus(data.progress?.status || "in_progress");
      const nextQuestionIndex = Math.min(
        safeActiveQuestionIndex + 1,
        questions.length - 1,
      );
      const nextQuestionText = questions[nextQuestionIndex]?.text ?? "";

      setIsAiSpeaking(true);
      try {
        await speakTextAsync(spokenFeedback);
        setActiveQuestionIndex(nextQuestionIndex);
        if (
          nextQuestionText &&
          nextQuestionIndex !== safeActiveQuestionIndex
        ) {
          await speakTextAsync(nextQuestionText);
        }
      } finally {
        setIsAiSpeaking(false);
      }
    } catch {
      setError("Evaluation service unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressLabel = `${responses.length}/${questions.length || 0}`;
  const minutes =
    remainingSeconds === null ? 0 : Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds === null ? 0 : remainingSeconds % 60;
  const timerLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-500">
            Status: {status}
          </span>
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
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-black tracking-tight text-secondary">
            Generate your interview round
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            We will create 8 tailored questions from your role, stack,
            seniority, and focus areas.
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
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
              Questions
            </p>
            <div className="space-y-2">
              {visibleQuestions.map((q, idx) => {
                const answered = responses.some((x) => x.questionId === q.id);
                const active = idx === safeActiveQuestionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`w-full rounded-2xl border px-3 py-2.5 text-left text-xs font-bold ${active
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

            <div className="grid gap-4 lg:grid-cols-2">
              {/* AI Interviewer */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black">
                <Image
                  src="/Ai-interview.png"
                  alt="AI Interviewer"
                  width={800}
                  height={600}
                  className="h-[310px] w-full object-cover"
                />

                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">
                  👩 AI Interviewer
                </div>

                {isAiSpeaking && (
                  <div className="absolute bottom-3 left-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
                    🎤 Asking Question...
                  </div>
                )}
              </div>

              {/* User Camera */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black">
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-[310px] w-full object-cover"
                />

                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">
                  📷 You
                </div>

                <div className="absolute right-3 top-3 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Question {safeActiveQuestionIndex + 1}
              </p>
              <h3 className="mt-2 text-xl font-black leading-snug text-secondary">
                {activeQuestion?.text}
              </h3>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Focus: {activeQuestion?.focusArea || "general"} | Difficulty:{" "}
                {activeQuestion?.difficulty || "medium"}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSpeechOutputEnabled((prev) => !prev)}
                  disabled={!speechSynthesisSupported}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-50"
                >
                  AI voice: {isSpeechOutputEnabled ? "on" : "off"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setVoicePreference((prev) =>
                      prev === "female" ? "male" : "female",
                    )
                  }
                  disabled={!speechSynthesisSupported}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-50"
                >
                  Voice: {voicePreference}
                </button>
                <button
                  type="button"
                  onClick={() => speakText(activeQuestion?.text ?? "")}
                  disabled={!speechSynthesisSupported || !activeQuestion?.text}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-50"
                >
                  Replay question
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="answer"
                className="text-sm font-black uppercase tracking-widest text-secondary"
              >
                Your answer
              </label>
              <textarea
                id="answer"
                value={draftAnswer}
                onChange={(e) => setActiveDraftAnswer(e.target.value)}
                rows={7}
                placeholder="Write a clear, structured response. Mention tradeoffs, edge-cases, and practical decisions."
                disabled={isLocked || isSubmitting}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={isListening ? stopListening : handleStartListening}
                  disabled={!speechSupported || isLocked || isSubmitting || isAiSpeaking}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-50"
                >
                  {isListening ? "Stop voice input" : "Start voice input"}
                </button>
                {!speechSupported && (
                  <span className="text-xs font-semibold text-slate-500">
                    Voice input not supported in this browser.
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isSubmitting || isLocked || !activeQuestion || isAiSpeaking}
              className="inline-flex items-center justify-center rounded-2xl bg-secondary px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white disabled:opacity-50"
            >
              {isSubmitting ? "Evaluating..." : "Evaluate answer"}
            </button>
            {isActiveQuestionAnswered && !isInterviewCompleted && (
              <p className="text-xs font-bold text-slate-500">
                This question is already scored. Select another question to
                continue.
              </p>
            )}
            {isInterviewCompleted && (
              <p className="text-xs font-bold text-emerald-700">
                Interview closed. Answers are locked and no further evaluation
                is allowed.
              </p>
            )}

            {activeResponse && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-secondary">
                  Score: {activeResponse.scoreOutOf10}/10 (
                  {activeResponse.verdict.replaceAll("_", " ")})
                </p>
                {activeResponse.strengths.length > 0 && (
                  <p className="text-sm text-slate-700">
                    <span className="font-black">Strengths:</span>{" "}
                    {activeResponse.strengths.join(" | ")}
                  </p>
                )}
                {activeResponse.gaps.length > 0 && (
                  <p className="text-sm text-slate-700">
                    <span className="font-black">Gaps:</span>{" "}
                    {activeResponse.gaps.join(" | ")}
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            {speechError && (
              <p className="text-xs font-bold text-red-600">{speechError}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
