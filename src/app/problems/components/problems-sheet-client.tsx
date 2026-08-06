"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Brackets,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Code2,
  GitBranch,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import YourProgressCard from "@/components/learning/your-progress-card";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";
import {
  buildProblemCompilerUrl,
  CUS_PROBLEM_SOLVED_EVENT,
} from "@/app/compiler/lib/problem-templates";
import { syncLocalSolvedQuestionsToServer } from "@/hooks/use-sync-solved-questions";

type QuestionItem = {
  id: string;
  externalId: string;
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
};

type LevelItem = {
  id: string;
  levelNumber: number;
  title: string;
  description: string;
  questions: QuestionItem[];
};

type TrackItem = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  iconImage?: string;
  levels: LevelItem[];
};

type Props = {
  tracks: TrackItem[];
  initialSolvedQuestionIds: string[];
  userSession: { id: string; email: string; name?: string } | null;
  compilerBasePath?: string;
};

const TRACK_STYLES = [
  {
    surface: "border border-orange-200/70 bg-gradient-to-r from-orange-100 via-amber-50 to-rose-100",
    iconClass: "text-orange-500",
    icon: Code2,
  },
  {
    surface: "border border-emerald-200/70 bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100",
    iconClass: "text-emerald-600",
    icon: Brackets,
  },
  {
    surface: "border border-sky-200/70 bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100",
    iconClass: "text-primary",
    icon: TreePine,
  },
  {
    surface: "border border-violet-200/70 bg-gradient-to-r from-violet-100 via-purple-50 to-fuchsia-100",
    iconClass: "text-violet-600",
    icon: GitBranch,
  },
  {
    surface: "border border-amber-200/70 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100",
    iconClass: "text-amber-600",
    icon: Calculator,
  },
  {
    surface: "border border-fuchsia-200/70 bg-gradient-to-r from-fuchsia-100 via-pink-50 to-purple-100",
    iconClass: "text-fuchsia-600",
    icon: ClipboardCheck,
  },
] as const;

function TrackCategoryCard({
  title,
  surface,
  iconClass,
  icon: Icon,
  selected,
  onClick,
}: {
  title: string;
  surface: string;
  iconClass: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-[104px] w-full overflow-hidden rounded-xl text-left transition hover:shadow-md ${surface} ${
        selected ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-slate-50" : ""
      }`}
    >
      <Icon
        className={`absolute bottom-3 right-3 h-8 w-8 opacity-40 transition group-hover:opacity-55 ${iconClass}`}
      />
      <span className="relative z-10 flex h-full max-w-[72%] items-center px-5 text-base font-bold leading-snug text-secondary">
        {title}
      </span>
    </button>
  );
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function formatAttempts(count: number): string {
  if (count >= 1000) {
    const k = count / 1000;
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`;
  }
  return String(count);
}

function getQuestionStats(id: string) {
  const hash = hashString(id);
  const attempts = (hash % 9000) + 800;
  const acceptance = (hash % 45) + 35;
  return { attempts, acceptance };
}

function getShortTitle(prompt: string): string {
  const colonMatch = prompt.match(/^([^:]{3,80}):/);
  if (colonMatch) return colonMatch[1].trim();

  const sentenceEnd = prompt.search(/[.!?]\s+/);
  if (sentenceEnd > 10 && sentenceEnd < 90) {
    return prompt.slice(0, sentenceEnd + 1).trim();
  }

  if (prompt.length > 64) return `${prompt.slice(0, 64).trim()}…`;
  return prompt;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  if (current > 4) pages.push("ellipsis");

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push("ellipsis");
  pages.push(total);
  return pages;
}


export default function ProblemsSheetClient({
  tracks,
  initialSolvedQuestionIds,
  compilerBasePath = "/compiler",
}: Props) {
  const router = useRouter();
  const { checkAccess, paywallOpen, closePaywall } = useSubscriptionGate();
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set(initialSolvedQuestionIds));

  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [difficultyFilter, statusFilter, selectedTrackId, selectedTagId, pageSize]);

  useEffect(() => {
    const mergeSolvedIds = (extraIds: string[] = []) => {
      const merged = new Set(initialSolvedQuestionIds);
      extraIds.forEach((id) => merged.add(id));
      try {
        const localChecked = localStorage.getItem("cus_solved_questions");
        if (localChecked) {
          const parsed = JSON.parse(localChecked) as string[];
          parsed.forEach((id) => merged.add(id));
        }
      } catch (e) {
        console.warn("Failed to parse local checked questions:", e);
      }
      setCheckedQuestions(merged);
    };

    const syncFromServer = async () => {
      mergeSolvedIds();
      const serverIds = await syncLocalSolvedQuestionsToServer();
      if (serverIds.length > 0) {
        setCheckedQuestions((prev) => {
          const merged = new Set(prev);
          serverIds.forEach((id) => merged.add(id));
          return merged;
        });
      }
      router.refresh();
    };

    void syncFromServer();

    const onProblemSolved = (event: Event) => {
      const questionId = (event as CustomEvent<{ questionId: string }>).detail?.questionId;
      if (questionId) {
        setCheckedQuestions((prev) => new Set([...prev, questionId]));
      }
    };

    const onFocus = () => void syncFromServer();
    const onPageShow = () => void syncFromServer();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncFromServer();
      }
    };

    window.addEventListener(CUS_PROBLEM_SOLVED_EVENT, onProblemSolved);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener(CUS_PROBLEM_SOLVED_EVENT, onProblemSolved);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [initialSolvedQuestionIds, router]);

  const openCompiler = useCallback(
    (questionId: string, prompt: string) => {
      checkAccess(() => {
        router.push(buildProblemCompilerUrl(questionId, prompt, compilerBasePath));
      });
    },
    [checkAccess, compilerBasePath, router]
  );

  const categories = useMemo(() => {
    const catMap = new Map<string, { id: string; name: string; trackId: string }>();
    tracks.forEach((track) => {
      track.levels.forEach((level) => {
        if (!catMap.has(level.id)) {
          catMap.set(level.id, { id: level.id, name: level.title, trackId: track.id });
        }
      });
    });
    return Array.from(catMap.values());
  }, [tracks]);

  const allQuestions = useMemo(() => {
    const list: (QuestionItem & {
      categoryId: string;
      categoryName: string;
      trackId: string;
      trackSlug: string;
      levelNumber: number;
    })[] = [];

    tracks.forEach((track) => {
      track.levels.forEach((level) => {
        level.questions.forEach((q) => {
          list.push({
            ...q,
            categoryId: level.id,
            categoryName: level.title,
            trackId: track.id,
            trackSlug: track.slug,
            levelNumber: level.levelNumber,
          });
        });
      });
    });

    return list.sort((a, b) => a.levelNumber - b.levelNumber || a.order - b.order);
  }, [tracks]);

  const totalQuestions = allQuestions.length;
  const totalSolved = allQuestions.filter((q) => checkedQuestions.has(q.id)).length;

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchDiff = difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const isSolved = checkedQuestions.has(q.id);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "solved" && isSolved) ||
        (statusFilter === "unsolved" && !isSolved);
      const matchTrack = selectedTrackId === null || q.trackId === selectedTrackId;
      const matchTag = selectedTagId === null || q.categoryId === selectedTagId;
      return matchDiff && matchStatus && matchTrack && matchTag;
    });
  }, [allQuestions, difficultyFilter, statusFilter, selectedTrackId, selectedTagId, checkedQuestions]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleTags = tagsExpanded ? categories : categories.slice(0, 8);

  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedQuestions = filteredQuestions.slice(pageStart, pageStart + pageSize);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <div className="min-h-0 font-sans text-secondary">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-secondary md:text-3xl">Practice</h1>
        <p className="mt-1 text-sm text-secondary/55">
          Sharpen your skills through hands-on coding practice
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tracks.map((track, index) => {
              const style = TRACK_STYLES[index % TRACK_STYLES.length];
              const isSelected = selectedTrackId === track.id;

              return (
                <TrackCategoryCard
                  key={track.id}
                  title={track.title}
                  surface={style.surface}
                  iconClass={style.iconClass}
                  icon={style.icon as LucideIcon}
                  selected={isSelected}
                  onClick={() => setSelectedTrackId(isSelected ? null : track.id)}
                />
              );
            })}
          </div>

          {categories.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTagId(null)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedTagId === null
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-secondary/70 hover:bg-slate-200/70"
                }`}
              >
                All Topics
              </button>
              {visibleTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedTagId === tag.id
                      ? "bg-primary/10 text-primary"
                      : "bg-slate-100 text-secondary/70 hover:bg-slate-200/70"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
              {categories.length > 8 ? (
                <button
                  type="button"
                  onClick={() => setTagsExpanded((v) => !v)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  {tagsExpanded ? "Show less" : "Expand"}
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
            </div>

            <div className="relative">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as typeof difficultyFilter)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-secondary/40">
                <th className="px-5 py-2.5 text-left">Title</th>
                <th className="w-24 px-5 py-2.5 text-right">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-16 text-center text-secondary/45">
                    No matching problems found.
                  </td>
                </tr>
              ) : (
                paginatedQuestions.map((q, index) => {
                  const stats = getQuestionStats(q.id);
                  const rowNumber = pageStart + index + 1;
                  const isSolved = checkedQuestions.has(q.id);

                  return (
                    <tr
                      key={q.id}
                      className={`transition hover:bg-slate-50/70 ${isSolved ? "bg-emerald-50/40" : ""}`}
                    >
                      <td className="px-5 py-2">
                        <button
                          type="button"
                          onClick={() => openCompiler(q.id, q.prompt)}
                          className="flex items-center gap-2.5 text-left"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                              isSolved
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-secondary/55"
                            }`}
                            aria-label={isSolved ? "Solved" : `Problem ${rowNumber}`}
                          >
                            {isSolved ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : rowNumber}
                          </span>
                          <span
                            className={`text-sm font-semibold transition hover:text-primary ${
                              isSolved ? "text-emerald-700" : "text-secondary"
                            }`}
                          >
                            {getShortTitle(q.prompt)}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-2 text-right">
                        {q.difficulty === "easy" && (
                          <span className="text-xs font-medium text-emerald-600">Easy</span>
                        )}
                        {q.difficulty === "medium" && (
                          <span className="text-xs font-medium text-amber-600">Med.</span>
                        )}
                        {q.difficulty === "hard" && (
                          <span className="text-xs font-medium text-rose-600">Hard</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-fit">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
                <option value={48}>48 / page</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((page, idx) =>
                page === "ellipsis" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-secondary/40">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
                      page === safePage
                        ? "border-secondary bg-secondary text-white"
                        : "border-slate-200 text-secondary hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
          </div>
        </div>

        <YourProgressCard
          completed={totalSolved}
          total={totalQuestions}
          unitLabel="solved"
          emptyMessage="Start your problem-solving journey today."
        />
      </div>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
    </div>
  );
}
