"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";

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
};

// Placeholder icons for "Asked In"
const companyIcons = [
  "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b8/Netlify_logo.svg"
];

function getRandomCompanies(seed: string) {
  // Simple deterministic random based on string to keep it consistent
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const count = (Math.abs(hash) % 3) + 1; // 1 to 3 companies
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    const iconIndex = Math.abs(hash + i * 13) % companyIcons.length;
    if (!picked.includes(companyIcons[iconIndex])) {
      picked.push(companyIcons[iconIndex]);
    }
  }
  return picked;
}

export default function ProblemsSheetClient({ tracks, initialSolvedQuestionIds, userSession }: Props) {
  const { checkAccess, paywallOpen, closePaywall } = useSubscriptionGate();
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set(initialSolvedQuestionIds));

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery, difficultyFilter, topicFilter, selectedCategoryId]);

  useEffect(() => {
    const localChecked = localStorage.getItem("cus_solved_questions");
    const merged = new Set(initialSolvedQuestionIds);
    if (localChecked) {
      try {
        const parsed = JSON.parse(localChecked) as string[];
        parsed.forEach((id) => merged.add(id));
      } catch (e) {
        console.warn("Failed to parse local checked questions:", e);
      }
    }
    setCheckedQuestions(merged);
  }, [initialSolvedQuestionIds]);

  const toggleSolved = (questionId: string) => {
    const next = new Set(checkedQuestions);
    if (next.has(questionId)) {
      next.delete(questionId);
    } else {
      next.add(questionId);
    }
    setCheckedQuestions(next);
    localStorage.setItem("cus_solved_questions", JSON.stringify(Array.from(next)));
  };

  // Extract all levels as Categories
  const categories = useMemo(() => {
    const catMap = new Map<string, { id: string; name: string; number: number; total: number; solved: number }>();
    tracks.forEach((track) => {
      track.levels.forEach((level) => {
        const catId = level.id;
        const total = level.questions.length;
        const solved = level.questions.filter((q) => checkedQuestions.has(q.id)).length;
        if (!catMap.has(catId)) {
          catMap.set(catId, { id: catId, name: level.title, number: level.levelNumber, total, solved });
        }
      });
    });
    return Array.from(catMap.values()).sort((a, b) => a.number - b.number);
  }, [tracks, checkedQuestions]);

  // Flatten questions
  const allQuestions = useMemo(() => {
    const list: (QuestionItem & { categoryId: string; categoryName: string; trackSlug: string; levelNumber: number; companies: string[] })[] = [];
    tracks.forEach((track) => {
      track.levels.forEach((level) => {
        level.questions.forEach((q) => {
          list.push({
            ...q,
            categoryId: level.id,
            categoryName: level.title,
            trackSlug: track.slug,
            levelNumber: level.levelNumber,
            companies: getRandomCompanies(q.id)
          });
        });
      });
    });
    // Sort broadly by order/level
    return list.sort((a, b) => a.levelNumber - b.levelNumber || a.order - b.order);
  }, [tracks]);

  // Stats
  const totalQuestions = allQuestions.length;
  const totalSolved = checkedQuestions.size;
  const percentSolved = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  // Filtered List
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchSearch = q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || q.externalId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchTopic = topicFilter === "all" || q.categoryId === topicFilter;
      const matchCategoryClick = selectedCategoryId === null || q.categoryId === selectedCategoryId;
      return matchSearch && matchDiff && matchTopic && matchCategoryClick;
    });
  }, [allQuestions, searchQuery, difficultyFilter, topicFilter, selectedCategoryId]);

  return (
    <div className="min-h-screen mt-5 bg-slate-50/50 font-sans p-4 md:p-8 text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Coding Problems</h1>
            <p className="text-slate-500 text-sm mt-1">Practice DSA and SQL problems.</p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">{totalSolved} <span className="text-slate-400 font-normal">/ {totalQuestions} solved</span></span>
              <span className="text-slate-500 text-xs">{percentSolved}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentSolved}%` }}
              />
            </div>
          </div>
        </div>

        {/* Browse by Category Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-800">Browse by category</h2>
            <span className="text-xs text-slate-400 font-medium">Step through topics in order</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full border text-sm font-medium transition-all shrink-0 ${isSelected
                    ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${isSelected ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"}`}>
                    {cat.number}
                  </span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? "bg-sky-100/50" : "text-slate-400 bg-slate-50"}`}>
                    {cat.solved}/{cat.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border--500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700  cursor-pointer max-w-[150px] truncate"
              >
                <option value="all">Topics</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">Status</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Problem</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Category</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Difficulty</th>
             
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                      No matching problems found.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.slice(0, visibleCount).map((q) => {
                    const isSolved = checkedQuestions.has(q.id);
                    return (
                      <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Status Checkbox */}
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => toggleSolved(q.id)}
                            className={`mx-auto w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${isSolved
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-300 text-transparent group-hover:border-slate-400"
                              }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </button>
                        </td>

                        {/* Problem */}
                        <td className="py-4 px-6 text-slate-700 font-medium whitespace-normal min-w-[250px]">
                          <button
                            type="button"
                            onClick={() =>
                              checkAccess(() => {
                                window.location.href = `/compiler?question=${encodeURIComponent(q.prompt)}`;
                              })
                            }
                            className="line-clamp-1 text-left font-medium text-slate-700 transition-colors hover:text-sky-600"
                          >
                            {q.prompt}
                          </button>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 truncate max-w-[130px]">
                            {q.categoryName}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="py-4 px-6">
                          {q.difficulty === "easy" && <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-500/20">Easy</span>}
                          {q.difficulty === "medium" && <span className="text-[11px] font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-amber-500/20">Medium</span>}
                          {q.difficulty === "hard" && <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full ring-1 ring-rose-500/20">Hard</span>}
                        </td>

                        {/* Asked In (Icons) */}
                        
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {visibleCount < filteredQuestions.length && (
            <div className="p-4 border-t border-slate-100 flex justify-center bg-slate-50/30">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-6 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
              >
                Show More
              </button>
            </div>
          )}
        </div>

      </div>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
    </div>
  );
}
