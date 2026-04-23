import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { LearningLanguage, LearningLevel, LearningQuestion, LearningTrack } from "@/models/learning";
import { cppData } from "@/app/practice/data/cpp-data";
import { csharpData } from "@/app/practice/data/csharp-data";
import { dataScienceData } from "@/app/practice/data/data-science-data";
import { dataStructureAndAlgorithamData } from "@/app/practice/data/data-structure-and-algoritham-data";
import { databasesData } from "@/app/practice/data/databases-data";
import { javaData } from "@/app/practice/data/java-data";
import { javascriptData } from "@/app/practice/data/javascript-data";
import { programmingData } from "@/app/practice/data/programming-data";
import { pythonData } from "@/app/practice/data/python-data";
import { puzzleData } from "@/app/practice/data/puzzle-data";
import { scriptingData } from "@/app/practice/data/scripting-data";
import { systemDesignData } from "@/app/practice/data/system-design-data";
import type { TopicData } from "@/app/practice/data/types";

const TRACK_SLUGS = new Set([
  "programming",
  "data-science",
  "system-design",
  "databases",
  "puzzle",
  "scripting",
  "data-structure-and-algoritham",
]);

const TOPICS: TopicData[] = [
  programmingData,
  dataStructureAndAlgorithamData,
  dataScienceData,
  systemDesignData,
  databasesData,
  puzzleData,
  scriptingData,
  javaData,
  javascriptData,
  pythonData,
  cppData,
  csharpData,
];

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

export async function seedLearningContent() {
  await connectDB();

  const languageBySlug = new Map<string, Types.ObjectId>();
  for (const topic of TOPICS) {
    const languageSlug = normalizeSlug(topic.slug);
    const language = await LearningLanguage.findOneAndUpdate(
      { slug: languageSlug },
      {
        $set: {
          name: topic.title,
          description: topic.intro,
          status: "published",
          order: 0,
        },
      },
      { upsert: true, new: true }
    );
    languageBySlug.set(languageSlug, language._id);
  }

  let trackCount = 0;
  let levelCount = 0;
  let questionCount = 0;
  for (const [topicIndex, topic] of TOPICS.entries()) {
    const languageId = languageBySlug.get(normalizeSlug(topic.slug));
    if (!languageId) continue;

    const track = await LearningTrack.findOneAndUpdate(
      { slug: normalizeSlug(topic.slug) },
      {
        $set: {
          languageId,
          title: topic.title,
          intro: topic.intro,
          kind: TRACK_SLUGS.has(topic.slug) ? "track" : "course",
          status: "published",
          order: topicIndex,
        },
      },
      { upsert: true, new: true }
    );
    trackCount += 1;

    for (const [levelIndex, level] of topic.levels.entries()) {
      const levelDoc = await LearningLevel.findOneAndUpdate(
        { trackId: track._id, levelNumber: level.level },
        {
          $set: {
            title: level.title,
            description: level.description,
            passScore: level.passScore,
            order: levelIndex,
            status: "published",
          },
        },
        { upsert: true, new: true }
      );
      levelCount += 1;

      const questions = level.questions.map((question, questionIndex) => ({
        levelId: levelDoc._id,
        externalId: question.id,
        prompt: question.question,
        options: question.options.map((option, optionIndex) => ({
          id: String(optionIndex),
          text: option,
        })),
        correctOptionId: String(question.answerIndex ?? 0),
        explanation: question.explanation,
        tags: [],
        difficulty: "medium" as const,
        order: questionIndex,
        status: "published" as const,
      }));
      await LearningQuestion.deleteMany({ levelId: levelDoc._id });
      if (questions.length > 0) {
        await LearningQuestion.collection.insertMany(questions);
      }
      questionCount += questions.length;
    }
  }

  return {
    languages: languageBySlug.size,
    tracks: trackCount,
    levels: levelCount,
    questions: questionCount,
  };
}
