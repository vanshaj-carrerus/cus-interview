import type {
  ImprovedResume,
  ImprovedResumeAchievement,
  ImprovedResumeCertification,
} from "@/lib/resume-analyzer/improved-resume-types";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNullableString(value: unknown): string | null {
  const trimmed = asString(value);
  return trimmed || null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCertifications(
  value: unknown
): ImprovedResumeCertification[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        const trimmed = item.trim();
        return trimmed ? { title: trimmed, issuer: "" } : null;
      }
      if (item && typeof item === "object") {
        const title = asString((item as { title?: string }).title);
        const issuer = asString((item as { issuer?: string }).issuer);
        return title ? { title, issuer } : null;
      }
      return null;
    })
    .filter((item): item is ImprovedResumeCertification => item !== null);
}

function normalizeAchievements(value: unknown): ImprovedResumeAchievement[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        const trimmed = item.trim();
        return trimmed ? { title: trimmed, description: "" } : null;
      }
      if (item && typeof item === "object") {
        const title = asString((item as { title?: string }).title);
        const description = asString((item as { description?: string }).description);
        return title ? { title, description } : null;
      }
      return null;
    })
    .filter((item): item is ImprovedResumeAchievement => item !== null);
}

export function normalizeImprovedResume(raw: Partial<ImprovedResume>): ImprovedResume {
  const experience = Array.isArray(raw.experience)
    ? raw.experience
        .map((item) => ({
          role: asString(item?.role),
          company: asString(item?.company),
          duration: asString(item?.duration),
          bullets: asStringArray(item?.bullets),
        }))
        .filter((item) => item.role || item.company || item.bullets.length > 0)
    : [];

  const title =
    asString(raw.title) ||
    experience[0]?.role ||
    "Software Developer";

  return {
    name: asString(raw.name),
    title,
    email: asString(raw.email),
    phone: asString(raw.phone),
    location: asNullableString(raw.location),
    linkedin: asNullableString(raw.linkedin),
    github: asNullableString(raw.github),
    summary: asString(raw.summary),
    skills: asStringArray(raw.skills),
    experience,
    projects: Array.isArray(raw.projects)
      ? raw.projects
          .map((item) => ({
            name: asString(item?.name),
            description: asString(item?.description),
            technologies: asStringArray(item?.technologies),
            bullets: asStringArray(item?.bullets),
          }))
          .filter((item) => item.name || item.bullets.length > 0)
      : [],
    education: Array.isArray(raw.education)
      ? raw.education
          .map((item) => ({
            degree: asString(item?.degree),
            institution: asString(item?.institution),
            year: asNullableString(item?.year),
          }))
          .filter((item) => item.degree || item.institution)
      : [],
    certifications: normalizeCertifications(raw.certifications),
    achievements: normalizeAchievements(raw.achievements),
    awards: asStringArray(raw.awards),
  };
}
