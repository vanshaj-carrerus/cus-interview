import type { ImprovedResume } from "@/lib/resume-analyzer/improved-resume-types";
import { normalizeImprovedResume } from "@/lib/resume-analyzer/normalize-improved-resume";

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function pickString(
  primary: string | null | undefined,
  fallback: string
): string {
  return hasText(primary) ? primary.trim() : fallback;
}

function pickNullable(
  primary: string | null | undefined,
  fallback: string | null
): string | null {
  return hasText(primary) ? primary.trim() : fallback;
}

function hasItems<T>(items: T[] | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

/** AI empty arrays must not wipe fallback resume sections. */
export function mergeAiWithFallbackResume(
  fallback: ImprovedResume,
  ai: Partial<ImprovedResume>
): ImprovedResume {
  return normalizeImprovedResume({
    name: pickString(ai.name, fallback.name),
    title: pickString(ai.title, fallback.title),
    email: pickString(ai.email, fallback.email),
    phone: pickString(ai.phone, fallback.phone),
    location: pickNullable(ai.location, fallback.location),
    linkedin: pickNullable(ai.linkedin, fallback.linkedin),
    github: pickNullable(ai.github, fallback.github),
    summary: pickString(ai.summary, fallback.summary),
    skills: hasItems(ai.skills) ? ai.skills : fallback.skills,
    experience: hasItems(ai.experience) ? ai.experience : fallback.experience,
    projects: hasItems(ai.projects) ? ai.projects : fallback.projects,
    education: hasItems(ai.education) ? ai.education : fallback.education,
    certifications: hasItems(ai.certifications)
      ? ai.certifications
      : fallback.certifications,
    achievements: hasItems(ai.achievements)
      ? ai.achievements
      : fallback.achievements,
    awards: hasItems(ai.awards) ? ai.awards : fallback.awards,
  });
}
