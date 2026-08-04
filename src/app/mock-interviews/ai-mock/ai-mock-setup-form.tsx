"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import TrialMockLimitModal from "@/components/billing/TrialMockLimitModal";
import { buildTrialMockLimitMessage } from "@/lib/billing/trial-limits";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ChevronRight,
  Code2,
  Layers,
  Briefcase,
  GraduationCap,
  Target,
} from "lucide-react";

export const AI_MOCK_SETUP_STORAGE_KEY = "cusAiMockSetup";

const NOTE_MAX_LENGTH = 100;

const LANGUAGES = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "C#",
  "C++",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Dart",
  "Scala",
  "Elixir",
  "R",
  "SQL",
] as const;

const FRAMEWORKS = [
  "None / vanilla",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Fastify",
  "NestJS",
  "Remix",
  "SvelteKit",
  "Nuxt",
  "Angular",
  "Vue",
  "React Native",
  "Flutter",
  "Spring Boot",
  "Quarkus",
  "Django",
  "FastAPI",
  "Flask",
  "Ruby on Rails",
  "Laravel",
  ".NET",
  "ASP.NET Core",
  "Phoenix",
  "TensorFlow / PyTorch",
] as const;

const ROLES = [
  "Software engineer",
  "Backend engineer",
  "Frontend engineer",
  "Full-stack engineer",
  "Mobile engineer",
  "Platform engineer",
  "Data engineer",
  "ML engineer",
  "AI engineer",
  "Data scientist",
  "QA / test automation engineer",
  "Cloud engineer",
  "DevOps / SRE",
  "Security engineer",
  "Site reliability engineer",
  "Engineering manager",
  "Staff engineer",
  "Architect",
] as const;

const LEVELS = ["Intern / new grad", "Junior", "Mid", "Senior"] as const;

const FOCUS_AREAS = [
  "Coding & algorithms",
  "System design",
  "API & data modeling",
  "Behavioral / leadership",
  "Debugging & tradeoffs",
] as const;

export type AiMockSetupPayload = {
  languages: string[];
  framework: string;
  role: string;
  seniority: string;
  focusAreas: string[];
  notes: string;
  updatedAt: string;
};

type InterviewHistoryItem = {
  id: string;
  status: "created" | "in_progress" | "completed" | "cancelled";
  role: string;
  framework: string;
  seniority: string;
  createdAt: string;
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

export function AiMockSetupForm({
  backHref = "/mock-interviews",
  backLabel = "AI mock interviews",
  interviewBasePath = "/mock-interviews/ai-mock",
}: {
  backHref?: string;
  backLabel?: string;
  interviewBasePath?: string;
}) {
  const router = useRouter();
  const { checkAccess, gatedNavigate, paywallOpen, closePaywall, openPaywall } =
    useSubscriptionGate();
  const [trialLimitOpen, setTrialLimitOpen] = useState(false);
  const [mockQuota, setMockQuota] = useState<MockInterviewQuota | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [framework, setFramework] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [seniority, setSeniority] = useState<string>("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingInterviewId, setDeletingInterviewId] = useState<string | null>(
    null,
  );
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await fetch("/api/mock-interviews/ai-mock/history", {
          cache: "no-store",
        });
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
    loadHistory();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteInterview = useCallback(async (interviewId: string) => {
    if (!window.confirm("Remove this interview from your list?")) {
      return;
    }
    setHistoryError("");
    setDeletingInterviewId(interviewId);
    try {
      const response = await fetch(
        `/api/mock-interviews/ai-mock/${interviewId}`,
        {
          method: "DELETE",
        },
      );
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        setHistoryError(
          data.error || "Failed to remove interview from your list.",
        );
        return;
      }
      setHistory((prev) => prev.filter((item) => item.id !== interviewId));
    } catch {
      setHistoryError(
        "Unable to remove interview right now. Please try again.",
      );
    } finally {
      setDeletingInterviewId(null);
    }
  }, []);

  const toggleLanguage = useCallback((lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }, []);

  const toggleFocus = useCallback((f: string) => {
    setFocusAreas((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
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
  const isFormValid =
    hasRoleLanguageOrFramework && Boolean(seniority) && focusAreas.length > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasRoleLanguageOrFramework) return;
    if (!seniority) return;
    if (focusAreas.length === 0) return;

    checkAccess(async () => {
      if (
        mockQuota &&
        !mockQuota.unlimited &&
        (mockQuota.remainingToday ?? 0) <= 0
      ) {
        setTrialLimitOpen(true);
        return;
      }

      setSubmitError("");
      setIsSubmitting(true);
      try {
        sessionStorage.setItem(
          AI_MOCK_SETUP_STORAGE_KEY,
          JSON.stringify(payload),
        );
      } catch {
        /* ignore quota / private mode */
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
          router.push("/signup?intent=ai-mock");
          return;
        }
        if (response.status === 403) {
          openPaywall();
          return;
        }
        if (
          response.status === 429 &&
          data.code === "TRIAL_MOCK_DAILY_LIMIT"
        ) {
          setTrialLimitOpen(true);
          return;
        }
        if (!response.ok || !data.interview?.id) {
          setSubmitError(
            data.error || "Failed to create mock interview. Please try again.",
          );
          return;
        }
        router.push(`${interviewBasePath}/${data.interview.id}`);
      } catch {
        setSubmitError(
          "Unable to create mock interview right now. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="min-h-screen mb-10 bg-[#fcfcfd] p-6 md:p-12 font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-600">
      <div className="max-w-5xl mx-auto">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <header className="mb-10 md:mb-12">
          <p className="text-sky-500 font-black text-xs uppercase tracking-[0.3em] mb-3">
            Session setup
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-[1.1] mb-4">
            Tune your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">AI interviewer</span>
          </h1>
          <p className="text-slate-500 text-lg font-light leading-relaxed">
            We use this profile to pick question depth, examples, and time
            boxes. You can change it anytime before a run.
          </p>
          {mockQuota && !mockQuota.unlimited ? (
            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm leading-relaxed text-sky-900">
              <p className="font-semibold">Free trial mock interview limit</p>
              <p className="mt-1 text-sky-800/90">
                {buildTrialMockLimitMessage()}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                Today: {mockQuota.usedToday}/{mockQuota.dailyLimit} used
              </p>
            </div>
          ) : null}
        </header>

        <section className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Your past interviews
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {historyLoading ? "Loading..." : `${history.length} total`}
            </p>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {historyLoading ? (
              <p className="text-sm text-slate-500">
                Loading your previous interviews...
              </p>
            ) : history.length === 0 ? (
              <p className="text-sm text-slate-500">
                No previous interviews yet.
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        gatedNavigate(`${interviewBasePath}/${item.id}`)
                      }
                      className="min-w-0 flex-1 text-left transition-opacity hover:opacity-85"
                    >
                      <p className="truncate text-sm font-bold text-slate-800">
                        {item.role || item.framework || "General AI mock"}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">
                        {item.answeredCount}/{item.questionsCount} answered |
                        Avg {item.averageScoreOutOf10}/10
                      </p>
                    </button>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                        {item.status.replaceAll("_", " ")}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleDeleteInterview(item.id)}
                        disabled={deletingInterviewId === item.id}
                        className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {deletingInterviewId === item.id
                          ? "Removing..."
                          : "Delete This Interview"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {historyError && (
            <p className="mt-3 text-xs font-bold text-red-600">
              {historyError}
            </p>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 rounded-4xl border border-slate-100 bg-white p-6 md:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]"
        >
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
              <Code2 className="w-4 h-4  text-sky-500" />
              Languages you want to use
            </legend>
            <p className="text-xs text-slate-500 font-medium -mt-1 mb-3">
              Pick the language you&apos;re comfortable being questioned in.
            </p>
            <p className="text-[11px] text-slate-400 font-semibold -mt-2 mb-3">
              {LANGUAGES.length} language options
            </p>
            <select
              id="languages"
              value={languages[0] || ""}
              onChange={(e) => setLanguages(e.target.value ? [e.target.value] : [])}
              className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="">Select language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </fieldset>

          <div className="space-y-2">
            <label
              htmlFor="framework"
              className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest"
            >
              <Layers className="w-4 h-4 text-sky-500" />
              Primary framework / runtime
            </label>
            <select
              id="framework"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="">Select framework / runtime (optional)</option>
              {FRAMEWORKS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 font-semibold">
              {FRAMEWORKS.length} framework/runtime options
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest"
              >
                <Briefcase className="w-4 h-4 text-sky-500" />
                Expected role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-800 cursor-pointer outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Select expected role (optional)</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 font-semibold">
                {ROLES.length} role options
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="seniority"
                className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest"
              >
                <GraduationCap className="w-4 h-4 text-sky-500" />
                Seniority
              </label>
              <select
                id="seniority"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-800 cursor-pointer outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Select seniority</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {!seniority && (
                <p className="text-xs font-bold text-amber-600">
                  Seniority is required.
                </p>
              )}
            </div>
          </div>

          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
              <Target className="w-4 h-4 text-sky-500" />
              Interview focus
            </legend>
            <p className="text-xs text-slate-500 font-medium -mt-1 mb-3">
              We&apos;ll weight rounds toward what you select.
            </p>
            <div className="space-y-3">
              {FOCUS_AREAS.map((f) => {
                const on = focusAreas.includes(f);
                return (
                  <label
                    key={f}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                      on
                        ? "border-sky-500/40 bg-sky-50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleFocus(f)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-sm font-bold text-slate-800">
                      {f}
                    </span>
                  </label>
                );
              })}
            </div>
            {focusAreas.length === 0 && (
              <p className="text-xs font-bold text-amber-600">
                Pick at least one focus area.
              </p>
            )}
          </fieldset>

          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-sm font-black text-slate-800 uppercase tracking-widest"
            >
              Optional context
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value.slice(0, NOTE_MAX_LENGTH))
              }
              maxLength={NOTE_MAX_LENGTH}
              rows={3}
              placeholder="e.g. Targeting FAANG backend loop, weak on graphs, prefer async-style questions…"
              className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <p className="text-[11px] text-slate-400 font-semibold text-right">
              {notes.length}/{NOTE_MAX_LENGTH}
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-md">
              Preferences are stored in this browser until you clear site data.
              After sign-up we can attach them to your account.
            </p>
            {submitError && (
              <p className="text-xs font-bold text-red-600 sm:mr-auto">
                {submitError}
              </p>
            )}
            <div>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="inline-flex items-center justify-center gap-2 shrink-0 px-8 py-4 bg-sky-500 text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                {isSubmitting ? "Creating..." : "Save and continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
              {!hasRoleLanguageOrFramework && (
                <p className="text-xs mt-2 font-bold text-amber-600 sm:mr-auto">
                  Add at least one of: role, language, or framework.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
      <TrialMockLimitModal
        open={trialLimitOpen}
        onClose={() => setTrialLimitOpen(false)}
      />
    </div>
  );
}
