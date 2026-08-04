"use client";

import { useEffect, useState } from "react";
import ProgrammingLanguagesProgressCard from "./programming-languages-progress-card";
import {
  sumProgrammingLanguageModuleProgress,
  type ProgrammingLanguageCourse,
} from "@/lib/learning/programming-languages-progress";
import type { UserLearningProfile } from "@/types/profile";

type Props = {
  initialCompleted: number;
  total: number;
  courses: ProgrammingLanguageCourse[];
};

/** Refreshes language-module progress after quiz levels are completed. */
export default function ProgrammingLanguagesProgress({
  initialCompleted,
  total,
  courses,
}: Props) {
  const [completedModules, setCompletedModules] = useState(initialCompleted);
  const [totalModules, setTotalModules] = useState(total);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/learning/me/progress", {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) return;

        const payload = (await response.json()) as {
          progress?: UserLearningProfile["languages"];
        };
        const profile = { languages: payload.progress ?? [], totals: {} } as UserLearningProfile;
        const { completedModules: completed, totalModules: moduleTotal } =
          sumProgrammingLanguageModuleProgress(courses, profile);

        if (!cancelled) {
          setCompletedModules(completed);
          setTotalModules(moduleTotal);
        }
      } catch {
        // Keep server-rendered value.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courses]);

  return (
    <ProgrammingLanguagesProgressCard
      completedModules={completedModules}
      totalModules={totalModules}
    />
  );
}
