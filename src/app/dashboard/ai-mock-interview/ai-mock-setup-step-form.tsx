"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import TrialMockLimitModal from "@/components/billing/TrialMockLimitModal";
import MinimalSelect, { type MinimalSelectOption } from "@/components/minimal-select";
import { buildTrialMockLimitMessage } from "@/lib/billing/trial-limits";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";
import {
  AI_MOCK_SETUP_STORAGE_KEY,
  type AiMockSetupPayload,
} from "@/app/mock-interviews/ai-mock/ai-mock-setup-form";

const NOTE_MAX_LENGTH = 100;

const LANGUAGES = [
  "HTML", "CSS", "JavaScript", "TypeScript", "Python", "Java", "Go", "C#",
  "C++", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Dart", "Scala", "Elixir", "R", "SQL",
] as const;

const FRAMEWORKS = [
  "None / vanilla", "React", "Next.js", "Node.js", "Express", "Fastify", "NestJS",
  "Remix", "SvelteKit", "Nuxt", "Angular", "Vue", "React Native", "Flutter",
  "Spring Boot", "Quarkus", "Django", "FastAPI", "Flask", "Ruby on Rails",
  "Laravel", ".NET", "ASP.NET Core", "Phoenix", "TensorFlow / PyTorch",
] as const;

const ROLES = [
  "Software engineer", "Backend engineer", "Frontend engineer", "Full-stack engineer",
  "Mobile engineer", "Platform engineer", "Data engineer", "ML engineer", "AI engineer",
  "Data scientist", "QA / test automation engineer", "Cloud engineer", "DevOps / SRE",
  "Security engineer", "Site reliability engineer", "Engineering manager", "Staff engineer", "Architect",
] as const;

const LEVELS = ["Intern / new grad", "Junior", "Mid", "Senior"] as const;

const FOCUS_AREAS = [
  "Coding & algorithms",
  "System design",
  "API & data modeling",
  "Behavioral / leadership",
  "Debugging & tradeoffs",
] as const;

const STEPS = [
  {
    title: "Technical profile",
    subtitle: "Set your stack and seniority so the AI calibrates difficulty.",
  },
  {
    title: "Interview focus",
    subtitle: "Choose what the mock session should emphasize.",
  },
  {
    title: "Review & start",
    subtitle: "Add optional notes and launch your interview.",
  },
] as const;

type InterviewHistoryItem = {
  id: string;
  status: "created" | "in_progress" | "completed" | "cancelled";
  role: string;
  framework: string;
  seniority: string;
  questionsCount: number;
  answeredCount: number;
  averageScoreOutOf10: number;
};

type MockInterviewQuota = {
  dailyLimit: number | null;
  usedToday: number;
  remainingToday: number | null;
  unlimited: boolean;
};

function buildSelectOptions(items: readonly string[]): MinimalSelectOption[] {
  return items.map((item) => ({ value: item, label: item }));
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-medium text-secondary">
      {children}
      {required ? <span className="ml-0.5 text-primary">*</span> : null}
    </label>
  );
}

function ChoiceChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        selected
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
          : "border-primary/15 bg-white text-secondary/70 hover:border-primary/30 hover:bg-primary/5 hover:text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

export default function AiMockSetupStepForm({
  backHref = "/dashboard",
  backLabel = "Dashboard",
  interviewBasePath = "/dashboard/ai-mock-interview",
  hideBackLink = false,
  fullscreen = false,
}: {
  backHref?: string;
  backLabel?: string;
  interviewBasePath?: string;
  hideBackLink?: boolean;
  fullscreen?: boolean;
}) {
  const router = useRouter();
  const { checkAccess, gatedNavigate, paywallOpen, closePaywall, openPaywall } =
    useSubscriptionGate();

  const [step, setStep] = useState(0);
  const [trialLimitOpen, setTrialLimitOpen] = useState(false);
  const [mockQuota, setMockQuota] = useState<MockInterviewQuota | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [framework, setFramework] = useState("");
  const [role, setRole] = useState("");
  const [seniority, setSeniority] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingInterviewId, setDeletingInterviewId] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState("");
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [showStep2Errors, setShowStep2Errors] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await fetch("/api/mock-interviews/ai-mock/history", { cache: "no-store" });
        if (!response.ok) {
          if (mounted) setHistory([]);
          return;
        }
        const data = (await response.json()) as {
          interviews?: InterviewHistoryItem[];
          quota?: MockInterviewQuota;
        };
        if (mounted) {
          setHistory(data.interviews ?? []);
          setMockQuota(data.quota ?? null);
        }
      } catch {
        if (mounted) setHistory([]);
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    };
    void loadHistory();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFocus = useCallback((focus: string) => {
    setFocusAreas((prev) =>
      prev.includes(focus) ? prev.filter((item) => item !== focus) : [...prev, focus],
    );
  }, []);

  const payload = useMemo(
    (): AiMockSetupPayload => ({
      languages,
      framework,
      role,
      seniority,
      focusAreas,
      notes: notes.trim().slice(0, NOTE_MAX_LENGTH),
      updatedAt: new Date().toISOString(),
    }),
    [languages, framework, role, seniority, focusAreas, notes],
  );

  const hasRoleLanguageOrFramework =
    languages.length > 0 || Boolean(framework) || Boolean(role);

  const isStep1Valid = hasRoleLanguageOrFramework && Boolean(seniority);
  const isStep2Valid = focusAreas.length > 0;
  const isFormValid = isStep1Valid && isStep2Valid;

  const step1Progress = [
    Boolean(languages[0]),
    Boolean(framework || role),
    Boolean(seniority),
  ].filter(Boolean).length;

  const handleDeleteInterview = async (interviewId: string) => {
    if (!window.confirm("Remove this interview from your list?")) return;
    setHistoryError("");
    setDeletingInterviewId(interviewId);
    try {
      const response = await fetch(`/api/mock-interviews/ai-mock/${interviewId}`, { method: "DELETE" });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setHistoryError(data.error || "Failed to remove interview from your list.");
        return;
      }
      setHistory((prev) => prev.filter((item) => item.id !== interviewId));
    } catch {
      setHistoryError("Unable to remove interview right now. Please try again.");
    } finally {
      setDeletingInterviewId(null);
    }
  };

  const goNext = () => {
    if (step === 0) {
      setShowStep1Errors(true);
      if (!isStep1Valid) return;
    }
    if (step === 1) {
      setShowStep2Errors(true);
      if (!isStep2Valid) return;
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    checkAccess(async () => {
      if (mockQuota && !mockQuota.unlimited && (mockQuota.remainingToday ?? 0) <= 0) {
        setTrialLimitOpen(true);
        return;
      }

      setSubmitError("");
      setIsSubmitting(true);
      try {
        sessionStorage.setItem(AI_MOCK_SETUP_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* ignore */
      }

      try {
        const response = await fetch("/api/mock-interviews/ai-mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as {
          error?: string;
          code?: string;
          interview?: { id: string };
        };

        if (response.status === 401) {
          router.push("/signup?intent=ai-mock&next=/dashboard/ai-mock-interview");
          return;
        }
        if (response.status === 403) {
          openPaywall();
          return;
        }
        if (response.status === 429 && data.code === "TRIAL_MOCK_DAILY_LIMIT") {
          setTrialLimitOpen(true);
          return;
        }
        if (!response.ok || !data.interview?.id) {
          setSubmitError(data.error || "Failed to create mock interview. Please try again.");
          return;
        }
        router.push(`${interviewBasePath}/${data.interview.id}`);
      } catch {
        setSubmitError("Unable to create mock interview right now. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div
      className={`flex w-full flex-1 flex-col font-sans text-secondary ${
        fullscreen ? "min-h-0" : "mx-auto max-w-3xl"
      }`}
    >
      {!hideBackLink ? (
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm text-secondary/45 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      ) : null}

      {/* Step rail */}
      <div className="mb-8">
        <div className="flex items-center gap-0">
          {STEPS.map((item, index) => {
            const isActive = index === step;
            const isComplete = index < step;
            return (
              <div key={item.title} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (index < step) setStep(index);
                  }}
                  disabled={index > step}
                  className="group flex flex-col items-center gap-2 disabled:cursor-default"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isComplete
                        ? "bg-primary text-white"
                        : isActive
                          ? "bg-primary text-white ring-4 ring-primary/15"
                          : "border border-primary/20 bg-white text-secondary/40"
                    } ${index < step ? "cursor-pointer group-hover:ring-4 group-hover:ring-primary/10" : ""}`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={`hidden text-center text-[11px] font-medium sm:block ${
                      isActive ? "text-primary" : isComplete ? "text-secondary/70" : "text-secondary/35"
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
                {index < STEPS.length - 1 ? (
                  <div
                    className={`mx-2 h-px flex-1 transition-colors duration-500 ${
                      index < step ? "bg-primary" : "bg-primary/15"
                    }`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <form onSubmit={handleSubmit} className={fullscreen ? "flex min-h-0 flex-1 flex-col" : undefined}>
        <div
          className={`flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm ${
            fullscreen ? "min-h-0 flex-1" : ""
          }`}
        >
          {/* Card header */}
          <div className="border-b border-primary/8 px-6 py-5 sm:px-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                {step === 2 ? (
                  <Sparkles className="h-5 w-5 text-primary" />
                ) : (
                  <Bot className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-primary/70">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-secondary sm:text-xl">
                  {STEPS[step].title}
                </h2>
                <p className="mt-1 text-sm text-secondary/55">{STEPS[step].subtitle}</p>
              </div>
              {step === 0 ? (
                <span className="hidden shrink-0 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
                  {step1Progress}/3 set
                </span>
              ) : null}
            </div>
          </div>

          {/* Card body */}
          <div
            className={`px-6 py-6 sm:px-8 sm:py-7 ${fullscreen ? "min-h-0 flex-1 overflow-y-auto" : ""}`}
          >
            {mockQuota && !mockQuota.unlimited && step === 2 ? (
              <div className="mb-6 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-secondary">
                <p className="font-semibold">Free trial limit</p>
                <p className="mt-1 text-secondary/65">{buildTrialMockLimitMessage()}</p>
                <p className="mt-2 text-xs font-medium text-primary">
                  Today: {mockQuota.usedToday}/{mockQuota.dailyLimit} used
                </p>
              </div>
            ) : null}

            {step === 0 ? (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel required>Language</FieldLabel>
                    <MinimalSelect
                      id="languages"
                      value={languages[0] || ""}
                      onChange={(next) => setLanguages(next ? [next] : [])}
                      options={buildSelectOptions(LANGUAGES)}
                      placeholder="Choose a language"
                      emphasized={Boolean(languages[0])}
                    />
                  </div>

                  <div>
                    <FieldLabel>Framework</FieldLabel>
                    <MinimalSelect
                      id="framework"
                      value={framework}
                      onChange={setFramework}
                      options={buildSelectOptions(FRAMEWORKS)}
                      placeholder="Optional"
                      emphasized={Boolean(framework)}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Target role</FieldLabel>
                  <MinimalSelect
                    id="role"
                    value={role}
                    onChange={setRole}
                    options={buildSelectOptions(ROLES)}
                    placeholder="Optional — e.g. Backend engineer"
                    emphasized={Boolean(role)}
                  />
                </div>

                <div>
                  <FieldLabel required>Seniority level</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map((level) => (
                      <ChoiceChip
                        key={level}
                        selected={seniority === level}
                        onClick={() => setSeniority(level)}
                      >
                        {level}
                      </ChoiceChip>
                    ))}
                  </div>
                  {showStep1Errors && !seniority ? (
                    <p className="mt-2 text-xs text-red-500">Select your seniority level.</p>
                  ) : null}
                </div>

                {showStep1Errors && !hasRoleLanguageOrFramework ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    Add at least one of: language, framework, or role.
                  </p>
                ) : null}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="animate-in fade-in duration-300">
                <p className="mb-4 text-sm text-secondary/55">
                  Select one or more — we&apos;ll weight questions toward your picks.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {FOCUS_AREAS.map((focus) => {
                    const selected = focusAreas.includes(focus);
                    return (
                      <ChoiceChip key={focus} selected={selected} onClick={() => toggleFocus(focus)}>
                        {focus}
                      </ChoiceChip>
                    );
                  })}
                </div>
                {showStep2Errors && focusAreas.length === 0 ? (
                  <p className="mt-4 text-xs text-red-500">Pick at least one focus area.</p>
                ) : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <FieldLabel>Notes for the AI</FieldLabel>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, NOTE_MAX_LENGTH))}
                    maxLength={NOTE_MAX_LENGTH}
                    rows={3}
                    placeholder="Optional — company target, weak areas, interview style…"
                    className="w-full resize-none rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-secondary placeholder:text-secondary/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <p className="mt-1.5 text-right text-xs text-secondary/40">
                    {notes.length}/{NOTE_MAX_LENGTH}
                  </p>
                </div>

                <div className="rounded-xl border border-primary/10 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary/45">
                    Session summary
                  </p>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {[
                      ["Language", languages[0] || "—"],
                      ["Framework", framework || "—"],
                      ["Role", role || "—"],
                      ["Seniority", seniority || "—"],
                    ].map(([key, val]) => (
                      <div key={key} className="flex justify-between gap-3 sm:block">
                        <dt className="text-secondary/45">{key}</dt>
                        <dd className="font-medium text-secondary">{val}</dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className="text-secondary/45">Focus</dt>
                      <dd className="mt-1 font-medium text-secondary">
                        {focusAreas.length > 0 ? focusAreas.join(" · ") : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-secondary">Past interviews</p>
                    <span className="text-xs text-secondary/40">
                      {historyLoading ? "Loading…" : `${history.length} total`}
                    </span>
                  </div>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-primary/10 bg-white p-2">
                    {historyLoading ? (
                      <p className="px-2 py-3 text-sm text-secondary/45">Loading…</p>
                    ) : history.length === 0 ? (
                      <p className="px-2 py-3 text-sm text-secondary/45">No previous sessions yet.</p>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition hover:bg-primary/5"
                        >
                          <button
                            type="button"
                            onClick={() => gatedNavigate(`${interviewBasePath}/${item.id}`)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <p className="truncate text-sm font-medium text-secondary">
                              {item.role || item.framework || "General mock"}
                            </p>
                            <p className="text-xs text-secondary/45">
                              {item.answeredCount}/{item.questionsCount} answered · {item.averageScoreOutOf10}/10 avg
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteInterview(item.id)}
                            disabled={deletingInterviewId === item.id}
                            className="shrink-0 text-xs text-red-500/80 hover:text-red-600 disabled:opacity-50"
                          >
                            {deletingInterviewId === item.id ? "…" : "Remove"}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {historyError ? (
                    <p className="mt-2 text-xs text-red-500">{historyError}</p>
                  ) : null}
                </div>

                {submitError ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {submitError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-between gap-4 border-t border-primary/8 px-6 py-5 sm:px-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-secondary/60 transition hover:bg-primary/5 hover:text-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <span />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Starting…" : "Start interview"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
      <TrialMockLimitModal open={trialLimitOpen} onClose={() => setTrialLimitOpen(false)} />
    </div>
  );
}
