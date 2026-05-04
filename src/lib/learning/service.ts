import { Types } from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import {
  LearningLanguage,
  LearningLevel,
  LearningQuestion,
  LearningTask,
  LearningTrack,
  getTrackingModels,
} from "@/models/learning";
import type {
  LearningLanguageDto,
  LearningLevelDto,
  LearningLevelWithContentDto,
  LearningQuestionDto,
  LearningTaskDto,
  LearningTrackDto,
} from "@/types/learning/content";
import type { LearningAttemptDto } from "@/types/learning/progress";
import type { UserLearningProfile as UserLearningProfileType } from "@/types/profile";

function toId(value: unknown) {
  return String(value);
}

async function getTrackingModelsSafe() {
  try {
    return await getTrackingModels();
  } catch (error) {
    console.error("tracking-db-unavailable", error);
    return null;
  }
}

function toLanguageDto(language: Record<string, unknown>): LearningLanguageDto {
  return {
    id: toId(language._id),
    slug: String(language.slug),
    name: String(language.name),
    description: String(language.description ?? ""),
    status: language.status as LearningLanguageDto["status"],
    order: Number(language.order ?? 0),
    icon: String(language.icon ?? ""),
  };
}

function toTrackDto(track: Record<string, unknown>, summary?: { levels: number; questions: number; tasks: number }): LearningTrackDto {
  return {
    id: toId(track._id),
    languageId: toId(track.languageId),
    slug: String(track.slug),
    title: String(track.title),
    intro: String(track.intro ?? ""),
    kind: track.kind as LearningTrackDto["kind"],
    status: track.status as LearningTrackDto["status"],
    order: Number(track.order ?? 0),
    totalLevels: summary?.levels ?? 0,
    totalQuestions: summary?.questions ?? 0,
    totalTasks: summary?.tasks ?? 0,
  };
}

function toLevelDto(level: Record<string, unknown>, questionCount = 0, taskCount = 0): LearningLevelDto {
  return {
    id: toId(level._id),
    trackId: toId(level.trackId),
    levelNumber: Number(level.levelNumber),
    title: String(level.title),
    description: String(level.description ?? ""),
    passScore: Number(level.passScore),
    order: Number(level.order ?? 0),
    questionCount,
    taskCount,
  };
}

function toQuestionDto(question: Record<string, unknown>): LearningQuestionDto {
  return {
    id: toId(question._id),
    levelId: toId(question.levelId),
    externalId: String(question.externalId ?? ""),
    prompt: String(question.prompt ?? ""),
    options: Array.isArray(question.options)
      ? question.options.map((option) => ({
          id: String((option as Record<string, unknown>).id ?? ""),
          text: String((option as Record<string, unknown>).text ?? ""),
        }))
      : [],
    explanation: String(question.explanation ?? ""),
    order: Number(question.order ?? 0),
    tags: Array.isArray(question.tags) ? question.tags.map(String) : [],
    difficulty: (question.difficulty as LearningQuestionDto["difficulty"]) ?? "medium",
  };
}

function toTaskDto(task: Record<string, unknown>): LearningTaskDto {
  return {
    id: toId(task._id),
    levelId: toId(task.levelId),
    externalId: String(task.externalId ?? ""),
    prompt: String(task.prompt ?? ""),
    instructions: String(task.instructions ?? ""),
    order: Number(task.order ?? 0),
    tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
    difficulty: (task.difficulty as LearningTaskDto["difficulty"]) ?? "medium",
  };
}

const getCachedLanguages = unstable_cache(
  async () => {
    await connectDB();
    const languages = await LearningLanguage.find({ status: "published" })
      .sort({ order: 1, slug: 1 })
      .lean();
    return languages.map((item) => toLanguageDto(item as unknown as Record<string, unknown>));
  },
  ["learning-languages"],
  { revalidate: 60 }
);

export async function listLanguages() {
  return getCachedLanguages();
}

export async function listTracksByLanguageSlug(languageSlug: string, kind?: "track" | "course") {
  await connectDB();
  const language = await LearningLanguage.findOne({ slug: languageSlug, status: "published" }).lean();
  if (!language) return null;

  const filter: Record<string, unknown> = {
    languageId: language._id,
    status: "published",
  };
  if (kind) filter.kind = kind;

  const tracks = await LearningTrack.find(filter).sort({ order: 1, slug: 1 }).lean();
  const levels = await LearningLevel.find({
    trackId: { $in: tracks.map((track) => track._id) },
    status: "published",
  })
    .select({ _id: 1, trackId: 1 })
    .lean();
  const trackLevelCount = new Map<string, number>();
  levels.forEach((level) => {
    const key = toId(level.trackId);
    trackLevelCount.set(key, (trackLevelCount.get(key) ?? 0) + 1);
  });
  return {
    language: toLanguageDto(language as unknown as Record<string, unknown>),
    tracks: tracks.map((track) =>
      toTrackDto(track as unknown as Record<string, unknown>, {
        levels: trackLevelCount.get(toId(track._id)) ?? 0,
        questions: 0,
        tasks: 0,
      })
    ),
  };
}

export async function getTrackBySlug(trackSlug: string) {
  await connectDB();
  const track = await LearningTrack.findOne({ slug: trackSlug, status: "published" }).lean();
  if (!track) return null;
  const levels = await LearningLevel.find({ trackId: track._id, status: "published" })
    .sort({ levelNumber: 1, order: 1 })
    .lean();
  const levelIds = levels.map((level) => level._id);
  const [questionCounts, taskCounts] = await Promise.all([
    LearningQuestion.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { levelId: { $in: levelIds }, status: "published" } },
      { $group: { _id: "$levelId", count: { $sum: 1 } } },
    ]),
    LearningTask.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { levelId: { $in: levelIds }, status: "published" } },
      { $group: { _id: "$levelId", count: { $sum: 1 } } },
    ]),
  ]);

  const questionCountMap = new Map(questionCounts.map((item) => [toId(item._id), item.count]));
  const taskCountMap = new Map(taskCounts.map((item) => [toId(item._id), item.count]));
  const levelDtos = levels.map((level) =>
    toLevelDto(
      level as unknown as Record<string, unknown>,
      questionCountMap.get(toId(level._id)) ?? 0,
      taskCountMap.get(toId(level._id)) ?? 0
    )
  );
  const totalQuestions = levelDtos.reduce((sum, item) => sum + item.questionCount, 0);
  const totalTasks = levelDtos.reduce((sum, item) => sum + item.taskCount, 0);
  return {
    track: toTrackDto(track as unknown as Record<string, unknown>, {
      levels: levelDtos.length,
      questions: totalQuestions,
      tasks: totalTasks,
    }),
    levels: levelDtos,
  };
}

export async function getTrackLevelContent(trackSlug: string, levelNumber: number): Promise<LearningLevelWithContentDto | null> {
  await connectDB();
  const track = await LearningTrack.findOne({ slug: trackSlug, status: "published" }).lean();
  if (!track) return null;
  const level = await LearningLevel.findOne({
    trackId: track._id,
    levelNumber,
    status: "published",
  }).lean();
  if (!level) return null;

  const [questions, tasks] = await Promise.all([
    LearningQuestion.find({ levelId: level._id, status: "published" })
      .select({ correctOptionId: 0 })
      .sort({ order: 1, createdAt: 1 })
      .lean(),
    LearningTask.find({ levelId: level._id, status: "published" })
      .select({ expectedAnswer: 0 })
      .sort({ order: 1, createdAt: 1 })
      .lean(),
  ]);

  return {
    level: toLevelDto(level as unknown as Record<string, unknown>, questions.length, tasks.length),
    questions: questions.map((item) => toQuestionDto(item as unknown as Record<string, unknown>)),
    tasks: tasks.map((item) => toTaskDto(item as unknown as Record<string, unknown>)),
  };
}

export async function getQuestionPublic(questionId: string) {
  await connectDB();
  const question = await LearningQuestion.findById(questionId).select({ correctOptionId: 0 }).lean();
  if (!question || question.status !== "published") {
    return null;
  }
  return toQuestionDto(question as unknown as Record<string, unknown>);
}

type AttemptContext = {
  languageId: Types.ObjectId;
  languageSlug: string;
  trackId: Types.ObjectId;
  trackSlug: string;
  levelId: Types.ObjectId;
  levelNumber: number;
  passScore: number;
};

async function getAttemptContextFromLevel(levelId: Types.ObjectId): Promise<AttemptContext | null> {
  const level = await LearningLevel.findById(levelId).lean();
  if (!level) return null;
  const track = await LearningTrack.findById(level.trackId).lean();
  if (!track) return null;
  const language = await LearningLanguage.findById(track.languageId).lean();
  if (!language) return null;

  return {
    languageId: language._id,
    languageSlug: String(language.slug),
    trackId: track._id,
    trackSlug: String(track.slug),
    levelId: level._id,
    levelNumber: Number(level.levelNumber),
    passScore: Number(level.passScore),
  };
}

async function refreshUserProfile(userId: string) {
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) return;
  const { UserLearningAttempt, UserLearningProfile } = trackingModels;
  const objectUserId = new Types.ObjectId(userId);
  const attempts = await UserLearningAttempt.find({ userId: objectUserId })
    .sort({ attemptedAt: -1 })
    .limit(500)
    .lean();

  const totals = {
    totalAttempts: attempts.length,
    totalCleared: attempts.filter((item) => item.isCorrect).length,
    totalQuestionsAttempted: attempts.filter((item) => item.entityType === "question").length,
    totalTasksAttempted: attempts.filter((item) => item.entityType === "task").length,
    totalLevelsCompleted: 0,
  };

  const perLanguage = new Map<string, {
    languageId: string;
    languageSlug: string;
    attempts: number;
    cleared: number;
    tracks: Map<string, {
      trackId: string;
      trackSlug: string;
      attempts: number;
      cleared: number;
      levels: Map<string, { levelId: string; levelNumber: number; attempts: number; cleared: number; lastAttemptAt?: Date }>;
    }>;
  }>();

  for (const attempt of attempts) {
    const languageKey = toId(attempt.languageId);
    const trackKey = toId(attempt.trackId);
    const levelKey = toId(attempt.levelId);
    const languageState = perLanguage.get(languageKey) ?? {
      languageId: languageKey,
      languageSlug: "",
      attempts: 0,
      cleared: 0,
      tracks: new Map(),
    };
    languageState.attempts += 1;
    if (attempt.isCorrect) languageState.cleared += 1;

    const trackState = languageState.tracks.get(trackKey) ?? {
      trackId: trackKey,
      trackSlug: "",
      attempts: 0,
      cleared: 0,
      levels: new Map(),
    };
    trackState.attempts += 1;
    if (attempt.isCorrect) trackState.cleared += 1;

    const levelState = trackState.levels.get(levelKey) ?? {
      levelId: levelKey,
      levelNumber: attempt.levelNumber,
      attempts: 0,
      cleared: 0,
      lastAttemptAt: undefined,
    };
    levelState.attempts += 1;
    if (attempt.isCorrect) levelState.cleared += 1;
    levelState.lastAttemptAt = attempt.attemptedAt;
    trackState.levels.set(levelKey, levelState);

    languageState.tracks.set(trackKey, trackState);
    perLanguage.set(languageKey, languageState);
  }

  const trackIds = Array.from(new Set(attempts.map((item) => toId(item.trackId))));
  const languageIds = Array.from(new Set(attempts.map((item) => toId(item.languageId))));
  const [tracks, languages, levels] = await Promise.all([
    LearningTrack.find({ _id: { $in: trackIds } }).lean(),
    LearningLanguage.find({ _id: { $in: languageIds } }).lean(),
    LearningLevel.find({ trackId: { $in: trackIds }, status: "published" }).lean(),
  ]);

  const languageSlugMap = new Map(languages.map((item) => [toId(item._id), String(item.slug)]));
  const trackSlugMap = new Map(tracks.map((item) => [toId(item._id), String(item.slug)]));
  const trackLevelCountMap = new Map<string, number>();
  levels.forEach((level) => {
    const key = toId(level.trackId);
    trackLevelCountMap.set(key, (trackLevelCountMap.get(key) ?? 0) + 1);
  });

  const languageDocs = Array.from(perLanguage.values()).map((languageState) => {
    languageState.languageSlug = languageSlugMap.get(languageState.languageId) ?? "unknown";
    const tracksDoc = Array.from(languageState.tracks.values()).map((trackState) => {
      trackState.trackSlug = trackSlugMap.get(trackState.trackId) ?? "unknown";
      const levelDocs = Array.from(trackState.levels.values())
        .sort((a, b) => a.levelNumber - b.levelNumber)
        .map((levelState) => {
          const completed = levelState.cleared > 0;
          return {
            levelId: new Types.ObjectId(levelState.levelId),
            levelNumber: levelState.levelNumber,
            attempts: levelState.attempts,
            cleared: levelState.cleared,
            completed,
            firstPassedAt: completed ? levelState.lastAttemptAt : null,
            lastAttemptAt: levelState.lastAttemptAt ?? null,
          };
        });

      const completedLevels = levelDocs.filter((item) => item.completed).length;
      totals.totalLevelsCompleted += completedLevels;

      return {
        trackId: new Types.ObjectId(trackState.trackId),
        trackSlug: trackState.trackSlug,
        totalLevels: trackLevelCountMap.get(trackState.trackId) ?? levelDocs.length,
        completedLevels,
        attempts: trackState.attempts,
        cleared: trackState.cleared,
        levels: levelDocs,
      };
    });

    return {
      languageId: new Types.ObjectId(languageState.languageId),
      languageSlug: languageState.languageSlug,
      attempts: languageState.attempts,
      cleared: languageState.cleared,
      tracks: tracksDoc,
    };
  });

  await UserLearningProfile.findOneAndUpdate(
    { userId: objectUserId },
    {
      $set: {
        totals,
        languages: languageDocs,
        lastActiveAt: attempts[0]?.attemptedAt ?? null,
      },
      $setOnInsert: { userId: objectUserId },
    },
    { upsert: true, new: true }
  );
}

export async function attemptQuestion(params: {
  userId: string;
  questionId: string;
  answer: string | number | string[] | null;
  latencyMs?: number;
}) {
  await connectDB();
  const question = await LearningQuestion.findById(params.questionId).select("+correctOptionId").lean();
  if (!question || question.status !== "published") return null;
  const context = await getAttemptContextFromLevel(question.levelId as Types.ObjectId);
  if (!context) return null;

  const normalizedAnswer = String(params.answer ?? "").trim();
  const correctOptionId = String(question.correctOptionId ?? "").trim();
  const optionMap = new Map(
    (question.options ?? []).map((option) => [
      String((option as unknown as { id?: unknown }).id ?? ""),
      String((option as unknown as { text?: unknown }).text ?? ""),
    ])
  );
  const numericAnswer = Number(normalizedAnswer);
  const answerByIndexId =
    Number.isFinite(numericAnswer) && numericAnswer >= 0
      ? String(
          ((question.options?.[numericAnswer] as unknown as { id?: unknown } | undefined)
            ?.id ?? "")
        )
      : "";
  const answerByTextOptionId =
    Array.from(optionMap.entries()).find(
      ([, optionText]) => optionText.trim().toLowerCase() === normalizedAnswer.toLowerCase()
    )?.[0] ?? "";
  const isCorrect =
    normalizedAnswer === correctOptionId ||
    answerByIndexId === correctOptionId ||
    answerByTextOptionId === correctOptionId;
  const scoreAwarded = isCorrect ? 1 : 0;
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) {
    return {
      attemptId: "tracking-unavailable",
      entityType: "question" as const,
      entityId: toId(question._id),
      isCorrect,
      scoreAwarded,
      requiredPassScore: context.passScore,
      explanation: String(question.explanation ?? ""),
      levelCompleted: false,
      levelProgress: {
        attempted: 0,
        cleared: 0,
        completionPercent: 0,
      },
      tracked: false,
    };
  }
  const { UserLearningAttempt } = trackingModels;

  const attempt = await UserLearningAttempt.create({
    userId: new Types.ObjectId(params.userId),
    entityType: "question",
    entityId: question._id,
    languageId: context.languageId,
    trackId: context.trackId,
    levelId: context.levelId,
    levelNumber: context.levelNumber,
    submittedAnswer: params.answer,
    isCorrect,
    scoreAwarded,
    outcome: isCorrect ? "passed" : "failed",
    latencyMs: params.latencyMs ?? null,
    attemptedAt: new Date(),
  });

  const [levelAttempts, levelCleared] = await Promise.all([
    UserLearningAttempt.countDocuments({
      userId: new Types.ObjectId(params.userId),
      levelId: context.levelId,
      entityType: "question",
    }),
    UserLearningAttempt.countDocuments({
      userId: new Types.ObjectId(params.userId),
      levelId: context.levelId,
      entityType: "question",
      isCorrect: true,
    }),
  ]);

  await refreshUserProfile(params.userId);
  return {
    attemptId: toId(attempt._id),
    entityType: "question" as const,
    entityId: toId(question._id),
    isCorrect,
    scoreAwarded,
    requiredPassScore: context.passScore,
    explanation: String(question.explanation ?? ""),
    levelCompleted: levelCleared >= context.passScore,
    levelProgress: {
      attempted: levelAttempts,
      cleared: levelCleared,
      completionPercent: Math.min(100, Math.round((levelCleared / context.passScore) * 100)),
    },
    tracked: true,
  };
}

export async function verifyQuestionWithoutTracking(params: {
  questionId: string;
  answer: string | number | string[] | null;
}) {
  await connectDB();
  const question = await LearningQuestion.findById(params.questionId).select("+correctOptionId").lean();
  if (!question || question.status !== "published") return null;
  const context = await getAttemptContextFromLevel(question.levelId as Types.ObjectId);
  if (!context) return null;

  const normalizedAnswer = String(params.answer ?? "").trim();
  const correctOptionId = String(question.correctOptionId ?? "").trim();
  const optionMap = new Map(
    (question.options ?? []).map((option) => [
      String((option as unknown as { id?: unknown }).id ?? ""),
      String((option as unknown as { text?: unknown }).text ?? ""),
    ])
  );
  const numericAnswer = Number(normalizedAnswer);
  const answerByIndexId =
    Number.isFinite(numericAnswer) && numericAnswer >= 0
      ? String(
          ((question.options?.[numericAnswer] as unknown as { id?: unknown } | undefined)?.id ?? "")
        )
      : "";
  const answerByTextOptionId =
    Array.from(optionMap.entries()).find(
      ([, optionText]) => optionText.trim().toLowerCase() === normalizedAnswer.toLowerCase()
    )?.[0] ?? "";
  const isCorrect =
    normalizedAnswer === correctOptionId ||
    answerByIndexId === correctOptionId ||
    answerByTextOptionId === correctOptionId;

  return {
    attemptId: "guest",
    entityType: "question" as const,
    entityId: toId(question._id),
    isCorrect,
    scoreAwarded: isCorrect ? 1 : 0,
    requiredPassScore: context.passScore,
    explanation: String(question.explanation ?? ""),
    levelCompleted: false,
    levelProgress: {
      attempted: 0,
      cleared: 0,
      completionPercent: 0,
    },
    tracked: false,
  };
}

export async function attemptTask(params: {
  userId: string;
  taskId: string;
  answer: string | number | string[] | null;
  latencyMs?: number;
}) {
  await connectDB();
  const task = await LearningTask.findById(params.taskId).select("+expectedAnswer").lean();
  if (!task || task.status !== "published") return null;
  const context = await getAttemptContextFromLevel(task.levelId as Types.ObjectId);
  if (!context) return null;

  const expected = task.expectedAnswer;
  const isCorrect =
    task.evaluationType === "exact_match"
      ? String(params.answer ?? "").trim().toLowerCase() === String(expected ?? "").trim().toLowerCase()
      : false;
  const scoreAwarded = isCorrect ? 1 : 0;
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) {
    return {
      attemptId: "tracking-unavailable",
      entityType: "task" as const,
      entityId: toId(task._id),
      isCorrect,
      scoreAwarded,
      requiredPassScore: context.passScore,
      explanation: task.evaluationType === "manual" ? "Manual review required." : "",
      levelCompleted: false,
      levelProgress: {
        attempted: 0,
        cleared: 0,
        completionPercent: 0,
      },
      tracked: false,
    };
  }
  const { UserLearningAttempt } = trackingModels;

  const attempt = await UserLearningAttempt.create({
    userId: new Types.ObjectId(params.userId),
    entityType: "task",
    entityId: task._id,
    languageId: context.languageId,
    trackId: context.trackId,
    levelId: context.levelId,
    levelNumber: context.levelNumber,
    submittedAnswer: params.answer,
    isCorrect,
    scoreAwarded,
    outcome: isCorrect ? "passed" : "failed",
    latencyMs: params.latencyMs ?? null,
    attemptedAt: new Date(),
  });

  const [levelAttempts, levelCleared] = await Promise.all([
    UserLearningAttempt.countDocuments({
      userId: new Types.ObjectId(params.userId),
      levelId: context.levelId,
      entityType: "task",
    }),
    UserLearningAttempt.countDocuments({
      userId: new Types.ObjectId(params.userId),
      levelId: context.levelId,
      entityType: "task",
      isCorrect: true,
    }),
  ]);

  await refreshUserProfile(params.userId);
  return {
    attemptId: toId(attempt._id),
    entityType: "task" as const,
    entityId: toId(task._id),
    isCorrect,
    scoreAwarded,
    requiredPassScore: context.passScore,
    explanation: task.evaluationType === "manual" ? "Manual review required." : "",
    levelCompleted: levelCleared >= context.passScore,
    levelProgress: {
      attempted: levelAttempts,
      cleared: levelCleared,
      completionPercent: Math.min(100, Math.round((levelCleared / context.passScore) * 100)),
    },
    tracked: true,
  };
}

export async function getUserLearningProfile(userId: string, displayName: string): Promise<UserLearningProfileType> {
  await connectDB();
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) {
    return {
      userId,
      displayName,
      totals: {
        totalAttempts: 0,
        totalCleared: 0,
        totalQuestionsAttempted: 0,
        totalTasksAttempted: 0,
        totalLevelsCompleted: 0,
      },
      languages: [],
      recentAttempts: [],
    };
  }
  const { UserLearningAttempt, UserLearningProfile } = trackingModels;
  const profile = await UserLearningProfile.findOne({ userId: new Types.ObjectId(userId) }).lean();
  if (!profile) {
    return {
      userId,
      displayName,
      totals: {
        totalAttempts: 0,
        totalCleared: 0,
        totalQuestionsAttempted: 0,
        totalTasksAttempted: 0,
        totalLevelsCompleted: 0,
      },
      languages: [],
      recentAttempts: [],
    };
  }

  const recentAttempts = await UserLearningAttempt.find({ userId: new Types.ObjectId(userId) })
    .sort({ attemptedAt: -1 })
    .limit(25)
    .lean();

  const attemptsDto: LearningAttemptDto[] = recentAttempts.map((item) => ({
    id: toId(item._id),
    userId: toId(item.userId),
    entityType: item.entityType,
    entityId: toId(item.entityId),
    languageId: toId(item.languageId),
    trackId: toId(item.trackId),
    levelId: toId(item.levelId),
    levelNumber: item.levelNumber,
    isCorrect: item.isCorrect,
    scoreAwarded: item.scoreAwarded,
    outcome: item.outcome,
    attemptedAt: new Date(item.attemptedAt).toISOString(),
  }));

  return {
    userId,
    displayName,
    totals: {
      totalAttempts: Number(profile.totals?.totalAttempts ?? 0),
      totalCleared: Number(profile.totals?.totalCleared ?? 0),
      totalQuestionsAttempted: Number(profile.totals?.totalQuestionsAttempted ?? 0),
      totalTasksAttempted: Number(profile.totals?.totalTasksAttempted ?? 0),
      totalLevelsCompleted: Number(profile.totals?.totalLevelsCompleted ?? 0),
    },
    languages: (profile.languages ?? []).map((language) => ({
      languageId: toId(language.languageId),
      languageSlug: String(language.languageSlug),
      attempts: Number(language.attempts ?? 0),
      cleared: Number(language.cleared ?? 0),
      tracks: (language.tracks ?? []).map((track) => ({
        trackId: toId(track.trackId),
        trackSlug: String(track.trackSlug),
        totalLevels: Number(track.totalLevels ?? 0),
        completedLevels: Number(track.completedLevels ?? 0),
        attempts: Number(track.attempts ?? 0),
        cleared: Number(track.cleared ?? 0),
        levels: (track.levels ?? []).map((level) => ({
          levelId: toId(level.levelId),
          levelNumber: Number(level.levelNumber),
          attempts: Number(level.attempts ?? 0),
          cleared: Number(level.cleared ?? 0),
          completed: Boolean(level.completed),
          firstPassedAt: level.firstPassedAt ? new Date(level.firstPassedAt).toISOString() : undefined,
          lastAttemptAt: level.lastAttemptAt ? new Date(level.lastAttemptAt).toISOString() : undefined,
        })),
      })),
    })),
    recentAttempts: attemptsDto,
    lastActiveAt: profile.lastActiveAt ? new Date(profile.lastActiveAt).toISOString() : undefined,
  };
}

export async function getUserAttempts(userId: string, limit = 100) {
  await connectDB();
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) return [];
  const { UserLearningAttempt } = trackingModels;
  const attempts = await UserLearningAttempt.find({ userId: new Types.ObjectId(userId) })
    .sort({ attemptedAt: -1 })
    .limit(Math.min(limit, 200))
    .lean();
  return attempts.map((item) => ({
    id: toId(item._id),
    userId: toId(item.userId),
    entityType: item.entityType,
    entityId: toId(item.entityId),
    languageId: toId(item.languageId),
    trackId: toId(item.trackId),
    levelId: toId(item.levelId),
    levelNumber: item.levelNumber,
    isCorrect: item.isCorrect,
    scoreAwarded: item.scoreAwarded,
    outcome: item.outcome,
    attemptedAt: new Date(item.attemptedAt).toISOString(),
  }));
}

export type UserLearningActivityRollup = {
  totalScoreAwarded: number;
  /** UTC calendar day → attempt count (all time). */
  dayCounts: { dateKey: string; count: number }[];
  questionAttempts: number;
  taskAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
};

const emptyRollup: UserLearningActivityRollup = {
  totalScoreAwarded: 0,
  dayCounts: [],
  questionAttempts: 0,
  taskAttempts: 0,
  correctAttempts: 0,
  incorrectAttempts: 0,
};

/** Aggregates all attempts for charts / streaks (not limited to last N rows). */
export async function getUserLearningActivityRollup(userId: string): Promise<UserLearningActivityRollup> {
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) return emptyRollup;
  const { UserLearningAttempt } = trackingModels;
  const uid = new Types.ObjectId(userId);

  const [scoreAgg, dayAgg, typeAgg, correctAgg] = await Promise.all([
    UserLearningAttempt.aggregate<{ _id: null; s: number }>([
      { $match: { userId: uid } },
      { $group: { _id: null, s: { $sum: "$scoreAwarded" } } },
    ]),
    UserLearningAttempt.aggregate<{ _id: string; c: number }>([
      { $match: { userId: uid } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$attemptedAt", timezone: "UTC" },
          },
          c: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    UserLearningAttempt.aggregate<{ _id: string; c: number }>([
      { $match: { userId: uid } },
      { $group: { _id: "$entityType", c: { $sum: 1 } } },
    ]),
    UserLearningAttempt.aggregate<{ _id: boolean; c: number }>([
      { $match: { userId: uid } },
      { $group: { _id: "$isCorrect", c: { $sum: 1 } } },
    ]),
  ]);

  const totalScoreAwarded = Number(scoreAgg[0]?.s ?? 0);
  const dayCounts = dayAgg.map((row) => ({ dateKey: String(row._id), count: Number(row.c ?? 0) }));

  let questionAttempts = 0;
  let taskAttempts = 0;
  for (const row of typeAgg) {
    if (row._id === "question") questionAttempts = Number(row.c ?? 0);
    if (row._id === "task") taskAttempts = Number(row.c ?? 0);
  }

  let correctAttempts = 0;
  let incorrectAttempts = 0;
  for (const row of correctAgg) {
    if (row._id === true) correctAttempts = Number(row.c ?? 0);
    if (row._id === false) incorrectAttempts = Number(row.c ?? 0);
  }

  return {
    totalScoreAwarded,
    dayCounts,
    questionAttempts,
    taskAttempts,
    correctAttempts,
    incorrectAttempts,
  };
}
