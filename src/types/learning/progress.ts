export type AttemptEntityType = "question" | "task";

export type AttemptOutcome = "passed" | "failed";

export type AttemptSubmitPayload = {
  answer: string | number | string[] | null;
  latencyMs?: number;
};

export type AttemptResultDto = {
  attemptId: string;
  entityType: AttemptEntityType;
  entityId: string;
  isCorrect: boolean;
  scoreAwarded: number;
  requiredPassScore: number;
  explanation?: string;
  levelCompleted: boolean;
  levelProgress: {
    attempted: number;
    cleared: number;
    completionPercent: number;
  };
};

export type LearningAttemptDto = {
  id: string;
  userId: string;
  entityType: AttemptEntityType;
  entityId: string;
  languageId: string;
  trackId: string;
  levelId: string;
  levelNumber: number;
  isCorrect: boolean;
  scoreAwarded: number;
  outcome: AttemptOutcome;
  attemptedAt: string;
};

/** Slim row for profile / history tables (pagination API). */
export type LearningAttemptTableRowDto = {
  attemptedAt: string;
  entityType: AttemptEntityType;
  levelNumber: number;
  outcome: AttemptOutcome;
  isCorrect: boolean;
};

export type AttemptTableSortField = "attemptedAt" | "levelNumber" | "entityType" | "outcome" | "isCorrect";

/** Per-level progress derived from stored attempts. */
export type LevelProgressDto = {
  levelId: string;
  levelNumber: number;
  /** Distinct UTC calendar days with any submission on this level. */
  attempts: number;
  /** Count of correct question/task submissions toward passScore. */
  cleared: number;
  /** True when cleared meets or exceeds the level passScore. */
  completed: boolean;
  firstPassedAt?: string;
  lastAttemptAt?: string;
};

export type TrackProgressDto = {
  trackId: string;
  trackSlug: string;
  totalLevels: number;
  completedLevels: number;
  attempts: number;
  cleared: number;
  levels: LevelProgressDto[];
};

export type LanguageProgressDto = {
  languageId: string;
  languageSlug: string;
  attempts: number;
  cleared: number;
  tracks: TrackProgressDto[];
};
