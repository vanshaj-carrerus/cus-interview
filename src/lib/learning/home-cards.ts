import type { UserLearningProfile } from "@/types/profile";

/** Serializable card data for home sections (from getTrackCards). */
export type HomeLearningCard = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  iconImage: string;
  levels: number;
  questionCount: number;
};

/** Per-track slug: levels completed vs total (from user learning profile). */
export type HomeCourseProgressBySlug = Record<
  string,
  { completedLevels: number; totalLevels: number }
>;

/** Collapse profile.languages[].tracks[] into one entry per track slug (max completion if duplicated). */
export function mergeProfileProgressByTrackSlug(profile: UserLearningProfile | null): HomeCourseProgressBySlug {
  const out: HomeCourseProgressBySlug = {};
  if (!profile?.languages?.length) return out;
  for (const lang of profile.languages) {
    for (const track of lang.tracks) {
      const slug = track.trackSlug;
      const prev = out[slug];
      if (!prev) {
        out[slug] = { completedLevels: track.completedLevels, totalLevels: track.totalLevels };
      } else {
        out[slug] = {
          completedLevels: Math.max(prev.completedLevels, track.completedLevels),
          totalLevels: Math.max(prev.totalLevels, track.totalLevels),
        };
      }
    }
  }
  return out;
}
