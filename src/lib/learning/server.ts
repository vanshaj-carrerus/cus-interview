import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { LearningLanguage, LearningLevel, LearningQuestion, LearningTrack } from "@/models/learning";
import { getTrackBySlug, getTrackLevelContent } from "./service";

export type TopicQuestionView = {
  id: string;
  question: string;
  options: string[];
  explanation: string;
};

export type TopicLevelView = {
  id: string;
  level: number;
  title: string;
  description: string;
  passScore: number;
  questions: TopicQuestionView[];
};

export type TopicView = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  kind: "track" | "course";
  levels: TopicLevelView[];
};

const getCachedTrackCards = unstable_cache(
  async (kind: "track" | "course") => {
    try {
      await connectDB();
      const languages = await LearningLanguage.find({ status: "published" }).select({ _id: 1 }).lean();
      const tracks = await LearningTrack.find({
        status: "published",
        kind,
        languageId: { $in: languages.map((item) => item._id) },
      })
        .sort({ order: 1, title: 1 })
        .lean();
      const levels = await LearningLevel.find({
        trackId: { $in: tracks.map((track) => track._id) },
        status: "published",
      })
        .select({ _id: 1, trackId: 1 })
        .lean();
      const levelIds = levels.map((level) => level._id);
      const questions = await LearningQuestion.find({
        levelId: { $in: levelIds },
        status: "published",
      })
        .select({ _id: 1, levelId: 1 })
        .lean();
      const countByTrack = new Map<string, number>();
      levels.forEach((level) => {
        const key = String(level.trackId);
        countByTrack.set(key, (countByTrack.get(key) ?? 0) + 1);
      });
      const trackIdByLevelId = new Map<string, string>();
      levels.forEach((level) => {
        trackIdByLevelId.set(String(level._id), String(level.trackId));
      });
      const questionCountByTrack = new Map<string, number>();
      questions.forEach((question) => {
        const trackId = trackIdByLevelId.get(String(question.levelId));
        if (!trackId) return;
        questionCountByTrack.set(trackId, (questionCountByTrack.get(trackId) ?? 0) + 1);
      });
      return tracks.map((track) => ({
        id: String(track._id),
        slug: String(track.slug),
        title: String(track.title),
        intro: String(track.intro ?? ""),
        iconImage: String(track.iconImage ?? ""),
        kind: track.kind,
        levels: countByTrack.get(String(track._id)) ?? 0,
        questionCount: questionCountByTrack.get(String(track._id)) ?? 0,
      }));
    } catch (error) {
      console.warn(`[getTrackCards] Failed to fetch track cards for kind "${kind}":`, error);
      return [];
    }
  },
  ["learning-track-cards"],
  { revalidate: 60 }
);

export async function getTrackCards(kind: "track" | "course") {
  return getCachedTrackCards(kind);
}

export async function getTopicViewBySlug(trackSlug: string): Promise<TopicView | null> {
  const trackData = await getTrackBySlug(trackSlug);
  if (!trackData) return null;
  const levels = await Promise.all(
    trackData.levels.map(async (level) => {
      const content = await getTrackLevelContent(trackSlug, level.levelNumber);
      return {
        id: level.id,
        level: level.levelNumber,
        title: level.title,
        description: level.description,
        passScore: level.passScore,
        questions:
          content?.questions.map((question) => ({
            id: question.id,
            question: question.prompt,
            options: question.options.map((option) => option.text),
            explanation: question.explanation,
          })) ?? [],
      };
    })
  );

  return {
    id: trackData.track.id,
    slug: trackData.track.slug,
    title: trackData.track.title,
    intro: trackData.track.intro,
    kind: trackData.track.kind,
    levels,
  };
}
