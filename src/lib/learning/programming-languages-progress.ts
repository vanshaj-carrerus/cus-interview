import { mergeProfileProgressByTrackSlug } from "@/lib/learning/home-cards";
import type { UserLearningProfile } from "@/types/profile";

export type ProgrammingLanguageCourse = {
  slug: string;
  levels?: number;
};

export function sumProgrammingLanguageModuleProgress(
  courses: ProgrammingLanguageCourse[],
  profile: UserLearningProfile | null
): { completedModules: number; totalModules: number } {
  const progressBySlug = mergeProfileProgressByTrackSlug(profile);
  let completedModules = 0;
  let totalModules = 0;

  for (const course of courses) {
    const courseTotal = Math.max(course.levels ?? 0, progressBySlug[course.slug]?.totalLevels ?? 0);
    const courseCompleted = Math.min(
      progressBySlug[course.slug]?.completedLevels ?? 0,
      courseTotal
    );
    totalModules += courseTotal;
    completedModules += courseCompleted;
  }

  return {
    completedModules: Math.min(completedModules, totalModules),
    totalModules,
  };
}
