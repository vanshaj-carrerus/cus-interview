"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SOLVED_QUESTIONS_KEY = "cus_solved_questions";

function readLocalSolvedQuestionIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SOLVED_QUESTIONS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as string[];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeLocalSolvedQuestionIds(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOLVED_QUESTIONS_KEY, JSON.stringify([...new Set(ids.filter(Boolean))]));
}

/** Clears browser-only progress cache on logout (database progress is kept). */
export function clearLocalProgressCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SOLVED_QUESTIONS_KEY);
}

/**
 * Merges any offline solves to the server, then loads the user's saved progress
 * from the database back into the browser so UI matches after login.
 */
export async function syncLocalSolvedQuestionsToServer(): Promise<string[]> {
  const localIds = readLocalSolvedQuestionIds();

  if (localIds.length > 0) {
    const response = await fetch("/api/learning/me/sync-solved-questions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionIds: localIds }),
    });

    if (!response.ok) {
      console.warn("[syncLocalSolvedQuestionsToServer] Sync failed:", response.status);
    }
  }

  try {
    const response = await fetch("/api/learning/me/solved-questions", {
      credentials: "include",
      cache: "no-store",
    });
    if (response.ok) {
      const payload = (await response.json()) as { questionIds?: string[] };
      const serverIds = payload.questionIds ?? [];
      writeLocalSolvedQuestionIds(serverIds);
      return serverIds;
    }
  } catch {
    // Ignore network errors.
  }

  return localIds;
}

/** Loads persisted progress from the database into local storage after sign-in. */
export async function hydrateUserProgressFromServer(): Promise<string[]> {
  try {
    const response = await fetch("/api/learning/me/solved-questions", {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as { questionIds?: string[] };
    const serverIds = payload.questionIds ?? [];
    writeLocalSolvedQuestionIds(serverIds);
    return serverIds;
  } catch {
    return [];
  }
}

export function useSyncSolvedQuestions(refreshOnSync = true) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await syncLocalSolvedQuestionsToServer();
      if (!cancelled && refreshOnSync) {
        router.refresh();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshOnSync, router]);
}

/** Restores saved progress whenever a user session becomes active. */
export function UserProgressHydrator({ userId }: { userId: string | null | undefined }) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    void (async () => {
      await syncLocalSolvedQuestionsToServer();
      if (!cancelled) {
        router.refresh();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, router]);

  return null;
}

export default function DashboardProgressSync() {
  useSyncSolvedQuestions(true);
  return null;
}
