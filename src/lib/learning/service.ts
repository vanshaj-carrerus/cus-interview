import { Types } from "mongoose";
import { unstable_cache } from "next/cache";
import { logLearningProgress } from "@/lib/learning-progress-debug";
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
import type {
  AttemptTableSortField,
  LearningAttemptTableRowDto,
} from "@/types/learning/progress";
import type { UserLearningProfile as UserLearningProfileType } from "@/types/profile";

function toId(value: unknown) {
  return String(value);
}

/** Matches attempt rows whether `userId` was stored as ObjectId or string (imports / edge cases). */
function matchUserLearningAttempts(userId: string): Record<string, unknown> {
  const oid = new Types.ObjectId(userId);
  return {
    $or: [{ userId: oid }, { userId }],
  };
}

async function getTrackingModelsSafe() {
  try {
    return await getTrackingModels();
  } catch (error) {
    console.error("tracking-db-unavailable", error);
    logLearningProgress("getTrackingModelsSafe", "tracking connection/model init failed", {
      message: error instanceof Error ? error.message : String(error),
    });
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
    iconImage: String(track.iconImage ?? ""),
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

const getCachedAttemptContextFromLevel = unstable_cache(
  async (levelId: string): Promise<AttemptContext | null> => {
    const objectLevelId = new Types.ObjectId(levelId);
    const level = await LearningLevel.findById(objectLevelId).lean();
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
  },
  ["learning-attempt-context-from-level-id"],
  { revalidate: 60 }
);

async function getAttemptContextFromLevel(levelId: Types.ObjectId): Promise<AttemptContext | null> {
  return getCachedAttemptContextFromLevel(String(levelId));
}

async function refreshUserProfile(userId: string) {
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) return;
  const { UserLearningAttempt, UserLearningProfile } = trackingModels;
  const objectUserId = new Types.ObjectId(userId);
  const userAttemptMatch = matchUserLearningAttempts(userId);

  const attemptCount = await UserLearningAttempt.countDocuments(userAttemptMatch);
  if (attemptCount === 0) {
    await UserLearningProfile.findOneAndUpdate(
      { userId: objectUserId },
      {
        $set: {
          totals: {
            totalAttempts: 0,
            totalCleared: 0,
            totalQuestionsAttempted: 0,
            totalTasksAttempted: 0,
            totalLevelsCompleted: 0,
          },
          languages: [],
          lastActiveAt: null,
        },
        $setOnInsert: { userId: objectUserId },
      },
      { upsert: true, new: true }
    );
    return;
  }

  const [microAgg] = await UserLearningAttempt.aggregate<{
    _id: null;
    totalMicro: number;
    totalCorrect: number;
    questionMicro: number;
    taskMicro: number;
    lastActiveAt: Date | null;
  }>([
    { $match: userAttemptMatch },
    {
      $group: {
        _id: null,
        totalMicro: { $sum: 1 },
        totalCorrect: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        questionMicro: { $sum: { $cond: [{ $eq: ["$entityType", "question"] }, 1, 0] } },
        taskMicro: { $sum: { $cond: [{ $eq: ["$entityType", "task"] }, 1, 0] } },
        lastActiveAt: { $max: "$attemptedAt" },
      },
    },
  ]);

  if (!microAgg) {
    console.error(
      "[cus-learning] refreshUserProfile: attempts exist but aggregate returned no group — check userId field types in userlearningattempts",
      { userId, attemptCount },
    );
    return;
  }

  const [facetResult] = await UserLearningAttempt.aggregate<{
    levelDayCounts: { _id: Types.ObjectId; practiceDays: number }[];
    levelMicro: {
      _id: Types.ObjectId;
      microAttempts: number;
      correctMicro: number;
      lastAttemptAt: Date;
    }[];
  }>([
    { $match: userAttemptMatch },
    {
      $facet: {
        levelDayCounts: [
          {
            $project: {
              levelId: 1,
              utcDay: {
                $dateToString: { format: "%Y-%m-%d", date: "$attemptedAt", timezone: "UTC" },
              },
            },
          },
          { $group: { _id: { lv: "$levelId", d: "$utcDay" } } },
          { $group: { _id: "$_id.lv", practiceDays: { $sum: 1 } } },
        ],
        levelMicro: [
          {
            $group: {
              _id: "$levelId",
              microAttempts: { $sum: 1 },
              correctMicro: { $sum: { $cond: ["$isCorrect", 1, 0] } },
              lastAttemptAt: { $max: "$attemptedAt" },
            },
          },
        ],
      },
    },
  ]);

  const firstCorrectRows = await UserLearningAttempt.aggregate<{ _id: Types.ObjectId; firstAt: Date }>([
    { $match: { $and: [userAttemptMatch, { isCorrect: true }] } },
    { $sort: { attemptedAt: 1 } },
    { $group: { _id: "$levelId", firstAt: { $first: "$attemptedAt" } } },
  ]);

  const practiceByLevel = new Map<string, number>();
  for (const row of facetResult?.levelDayCounts ?? []) {
    practiceByLevel.set(toId(row._id), Number(row.practiceDays ?? 0));
  }

  const microByLevel = new Map<
    string,
    { microAttempts: number; correctMicro: number; lastAttemptAt: Date }
  >();
  for (const row of facetResult?.levelMicro ?? []) {
    microByLevel.set(toId(row._id), {
      microAttempts: Number(row.microAttempts ?? 0),
      correctMicro: Number(row.correctMicro ?? 0),
      lastAttemptAt: row.lastAttemptAt,
    });
  }

  const firstCorrectByLevel = new Map<string, Date>();
  for (const row of firstCorrectRows) {
    firstCorrectByLevel.set(toId(row._id), row.firstAt);
  }

  let totalLevelPracticeDays = 0;
  for (const v of practiceByLevel.values()) {
    totalLevelPracticeDays += v;
  }

  const levelIds = Array.from(microByLevel.keys()).map((id) => new Types.ObjectId(id));
  /** Any status — attempts already happened on these levels; excluding drafts/archived hid progress entirely. */
  const levelsFromDb = await LearningLevel.find({
    _id: { $in: levelIds },
  }).lean();

  if (levelsFromDb.length === 0 && levelIds.length > 0) {
    console.error(
      "[cus-learning] refreshUserProfile: attempts reference levelIds not found in LearningLevel collection",
      { levelIds: levelIds.map((id) => String(id)) },
    );
  }

  const trackIdStrs = [...new Set(levelsFromDb.map((l) => toId(l.trackId)))];
  const trackOids = trackIdStrs.map((id) => new Types.ObjectId(id));
  const [tracks, levelsForCounts] = await Promise.all([
    LearningTrack.find({ _id: { $in: trackOids } }).lean(),
    LearningLevel.find({ trackId: { $in: trackOids }, status: "published" }).lean(),
  ]);

  const trackById = new Map(tracks.map((t) => [toId(t._id), t]));
  const languageOids = [...new Set(tracks.map((t) => toId(t.languageId)))].map((id) => new Types.ObjectId(id));
  const languages = await LearningLanguage.find({ _id: { $in: languageOids } }).lean();

  const languageSlugMap = new Map(languages.map((l) => [toId(l._id), String(l.slug)]));
  const trackSlugMap = new Map(tracks.map((t) => [toId(t._id), String(t.slug)]));
  const trackLevelCountMap = new Map<string, number>();
  for (const level of levelsForCounts) {
    const tid = toId(level.trackId);
    trackLevelCountMap.set(tid, (trackLevelCountMap.get(tid) ?? 0) + 1);
  }

  type LevelRollup = {
    levelId: string;
    levelNumber: number;
    attempts: number;
    cleared: number;
    completed: boolean;
    firstPassedAt: Date | null;
    lastAttemptAt: Date | null;
  };

  const perLanguage = new Map<
    string,
    {
      languageId: string;
      tracks: Map<
        string,
        {
          trackId: string;
          levels: Map<string, LevelRollup>;
        }
      >;
    }
  >();

  for (const level of levelsFromDb) {
    const lid = toId(level._id);
    const micro = microByLevel.get(lid);
    if (!micro) continue;

    const track = trackById.get(toId(level.trackId));
    if (!track) continue;

    const langId = toId(track.languageId);
    const tid = toId(track._id);
    const practiceDays = practiceByLevel.get(lid) ?? 0;
    const passScore = Math.max(1, Number(level.passScore ?? 1));
    const correctMicro = micro.correctMicro;
    const completed = correctMicro >= passScore;

    const languageState = perLanguage.get(langId) ?? {
      languageId: langId,
      tracks: new Map(),
    };

    const trackState = languageState.tracks.get(tid) ?? {
      trackId: tid,
      levels: new Map(),
    };

    trackState.levels.set(lid, {
      levelId: lid,
      levelNumber: Number(level.levelNumber),
      attempts: practiceDays,
      cleared: correctMicro,
      completed,
      firstPassedAt: completed ? (firstCorrectByLevel.get(lid) ?? null) : null,
      lastAttemptAt: micro.lastAttemptAt ?? null,
    });

    languageState.tracks.set(tid, trackState);
    perLanguage.set(langId, languageState);
  }

  const languageDocs = Array.from(perLanguage.values()).map((ls) => {
    const languageSlug = languageSlugMap.get(ls.languageId) ?? "unknown";
    let langAttempts = 0;
    let langCleared = 0;

    const tracksDoc = Array.from(ls.tracks.values()).map((ts) => {
      const trackSlug = trackSlugMap.get(ts.trackId) ?? "unknown";

      const levelDocs = Array.from(ts.levels.values())
        .sort((a, b) => a.levelNumber - b.levelNumber)
        .map((lev) => ({
          levelId: new Types.ObjectId(lev.levelId),
          levelNumber: lev.levelNumber,
          attempts: lev.attempts,
          cleared: lev.cleared,
          completed: lev.completed,
          firstPassedAt: lev.firstPassedAt,
          lastAttemptAt: lev.lastAttemptAt,
        }));

      const trackAttempts = levelDocs.reduce((acc, l) => acc + l.attempts, 0);
      const trackCleared = levelDocs.reduce((acc, l) => acc + l.cleared, 0);
      langAttempts += trackAttempts;
      langCleared += trackCleared;

      const completedLevels = levelDocs.filter((item) => item.completed).length;

      return {
        trackId: new Types.ObjectId(ts.trackId),
        trackSlug,
        totalLevels: trackLevelCountMap.get(ts.trackId) ?? levelDocs.length,
        completedLevels,
        attempts: trackAttempts,
        cleared: trackCleared,
        levels: levelDocs,
      };
    });

    return {
      languageId: new Types.ObjectId(ls.languageId),
      languageSlug,
      attempts: langAttempts,
      cleared: langCleared,
      tracks: tracksDoc,
    };
  });

  const totalLevelsCompleted = languageDocs.reduce(
    (acc, lang) =>
      acc + lang.tracks.reduce((a, tr) => a + tr.levels.filter((lv) => lv.completed).length, 0),
    0
  );

  const totals = {
    totalAttempts: totalLevelPracticeDays,
    totalCleared: Number(microAgg.totalCorrect ?? 0),
    totalQuestionsAttempted: Number(microAgg.questionMicro ?? 0),
    totalTasksAttempted: Number(microAgg.taskMicro ?? 0),
    totalLevelsCompleted,
  };

  await UserLearningProfile.findOneAndUpdate(
    { userId: objectUserId },
    {
      $set: {
        totals,
        languages: languageDocs,
        lastActiveAt: microAgg.lastActiveAt ?? null,
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

  const levelProgress = await UserLearningAttempt.aggregate<{
    _id: null;
    attempted: number;
    cleared: number;
  }>([
    {
      $match: {
        userId: new Types.ObjectId(params.userId),
        levelId: context.levelId,
      },
    },
    {
      $group: {
        _id: null,
        attempted: { $sum: 1 },
        cleared: { $sum: { $cond: ["$isCorrect", 1, 0] } },
      },
    },
  ]);
  const levelAttempts = Number(levelProgress[0]?.attempted ?? 0);
  const levelCleared = Number(levelProgress[0]?.cleared ?? 0);

  void refreshUserProfile(params.userId).catch((error) => {
    console.error("refresh-user-profile-after-question-attempt", error);
  });
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

  const levelProgress = await UserLearningAttempt.aggregate<{
    _id: null;
    attempted: number;
    cleared: number;
  }>([
    {
      $match: {
        userId: new Types.ObjectId(params.userId),
        levelId: context.levelId,
      },
    },
    {
      $group: {
        _id: null,
        attempted: { $sum: 1 },
        cleared: { $sum: { $cond: ["$isCorrect", 1, 0] } },
      },
    },
  ]);
  const levelAttempts = Number(levelProgress[0]?.attempted ?? 0);
  const levelCleared = Number(levelProgress[0]?.cleared ?? 0);

  void refreshUserProfile(params.userId).catch((error) => {
    console.error("refresh-user-profile-after-task-attempt", error);
  });
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
  const empty: UserLearningProfileType = {
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

  await connectDB();
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) {
    return empty;
  }
  const { UserLearningAttempt, UserLearningProfile } = trackingModels;
  const oid = new Types.ObjectId(userId);
  const userAttemptMatch = matchUserLearningAttempts(userId);

  const attemptCount = await UserLearningAttempt.countDocuments(userAttemptMatch);
  let profile = await UserLearningProfile.findOne({ userId: oid }).lean();

  const languageRows = (profile?.languages ?? []).length;
  const cachedSubmissions =
    Number(profile?.totals?.totalQuestionsAttempted ?? 0) +
    Number(profile?.totals?.totalTasksAttempted ?? 0);

  const needsReconcile =
    attemptCount > 0 &&
    (!profile || languageRows === 0 || (cachedSubmissions === 0 && attemptCount > 0));

  if (needsReconcile) {
    console.warn("[cus-learning:reconcile] rebuilding UserLearningProfile from attempts", {
      userId: `${userId.slice(0, 8)}…`,
      attemptCount,
      hadProfileDoc: Boolean(profile),
      languageRows,
      cachedSubmissions,
    });
    await refreshUserProfile(userId);
    profile = await UserLearningProfile.findOne({ userId: oid }).lean();
  }

  if (!profile) {
    return empty;
  }

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
    recentAttempts: [],
    lastActiveAt: profile.lastActiveAt ? new Date(profile.lastActiveAt).toISOString() : undefined,
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildUserAttemptsFilter(userId: string, q: string): Record<string, unknown> {
  const userMatch = matchUserLearningAttempts(userId);
  const trimmed = q.trim();
  if (!trimmed) return userMatch;
  const escaped = escapeRegex(trimmed);
  const or: Record<string, unknown>[] = [
    { entityType: new RegExp(escaped, "i") },
    { outcome: new RegExp(escaped, "i") },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$levelNumber" },
          regex: escaped,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: {
            $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$attemptedAt", timezone: "UTC" },
          },
          regex: escaped,
          options: "i",
        },
      },
    },
  ];
  const ql = trimmed.toLowerCase();
  if (["yes", "true", "correct"].includes(ql)) or.push({ isCorrect: true });
  if (["no", "false", "wrong", "incorrect"].includes(ql)) or.push({ isCorrect: false });
  return { $and: [userMatch, { $or: or }] };
}

export type UserAttemptsPageResult = {
  items: LearningAttemptTableRowDto[];
  total: number;
  page: number;
  pageSize: number;
};

export async function getUserAttemptsPage(
  userId: string,
  opts: {
    page: number;
    pageSize: number;
    sort: AttemptTableSortField;
    dir: "asc" | "desc";
    q: string;
  }
): Promise<UserAttemptsPageResult | null> {
  await connectDB();
  const trackingModels = await getTrackingModelsSafe();
  if (!trackingModels) return null;
  const { UserLearningAttempt } = trackingModels;
  const filter = buildUserAttemptsFilter(userId, opts.q);
  const sortDir = opts.dir === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [opts.sort]: sortDir };
  const page = Math.max(1, opts.page);
  const pageSize = Math.min(50, Math.max(1, opts.pageSize));
  const skip = (page - 1) * pageSize;

  const [total, rows] = await Promise.all([
    UserLearningAttempt.countDocuments(filter),
    UserLearningAttempt.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select({ attemptedAt: 1, entityType: 1, levelNumber: 1, outcome: 1, isCorrect: 1 })
      .lean(),
  ]);

  const items: LearningAttemptTableRowDto[] = rows.map((item) => ({
    attemptedAt: new Date(item.attemptedAt).toISOString(),
    entityType: item.entityType,
    levelNumber: item.levelNumber,
    outcome: item.outcome,
    isCorrect: item.isCorrect,
  }));

  return { items, total, page, pageSize };
}

export type UserLearningActivityRollup = {
  totalScoreAwarded: number;
  /** UTC calendar day → distinct published levels touched that day (all time). */
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
  const userMatch = matchUserLearningAttempts(userId);

  const [scoreAgg, dayAgg, typeAgg, correctAgg] = await Promise.all([
    UserLearningAttempt.aggregate<{ _id: null; s: number }>([
      { $match: userMatch },
      { $group: { _id: null, s: { $sum: "$scoreAwarded" } } },
    ]),
    UserLearningAttempt.aggregate<{ _id: string; c: number }>([
      { $match: userMatch },
      {
        $project: {
          day: {
            $dateToString: { format: "%Y-%m-%d", date: "$attemptedAt", timezone: "UTC" },
          },
          levelId: 1,
        },
      },
      { $group: { _id: { day: "$day", levelId: "$levelId" } } },
      {
        $group: {
          _id: "$_id.day",
          c: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    UserLearningAttempt.aggregate<{ _id: string; c: number }>([
      { $match: userMatch },
      { $group: { _id: "$entityType", c: { $sum: 1 } } },
    ]),
    UserLearningAttempt.aggregate<{ _id: boolean; c: number }>([
      { $match: userMatch },
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
