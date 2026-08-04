"use client";

import { useCallback, useEffect, useState } from "react";
import { CUS_PROBLEM_SOLVED_EVENT } from "@/app/compiler/lib/problem-templates";
import { syncLocalSolvedQuestionsToServer } from "@/hooks/use-sync-solved-questions";

export type LiveDashboardStats = {
  practiceSolved: number;
  totalLevels: number;
  points: number;
  problemsSolved: number;
  solutionsSubmitted: number;
  levelsCompleted: number;
  codingPracticesLabel: string;
  learnLabel: string;
  practiceSubtitle: string;
  currentStreak: number;
  bestStreak: number;
};

type Props = {
  onUpdate: (stats: LiveDashboardStats) => void;
};

/** Syncs browser progress to the server, then pushes fresh stats to the dashboard UI. */
export default function DashboardLiveStatsSync({ onUpdate }: Props) {
  const refreshStats = useCallback(async () => {
    await syncLocalSolvedQuestionsToServer();

    try {
      const response = await fetch("/api/learning/me/dashboard-stats", {
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        const stats = (await response.json()) as LiveDashboardStats;
        onUpdate(stats);
      }
    } catch {
      // Keep server-rendered values on failure.
    }
  }, [onUpdate]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await refreshStats();
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshStats]);

  useEffect(() => {
    if (!ready) return;

    const onRefresh = () => void refreshStats();
    const onProblemSolved = () => void refreshStats();

    window.addEventListener("focus", onRefresh);
    window.addEventListener("pageshow", onRefresh);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onRefresh();
    });
    window.addEventListener(CUS_PROBLEM_SOLVED_EVENT, onProblemSolved);

    return () => {
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener("pageshow", onRefresh);
      window.removeEventListener(CUS_PROBLEM_SOLVED_EVENT, onProblemSolved);
    };
  }, [ready, refreshStats]);

  return null;
}
