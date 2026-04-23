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

export type LevelProgressDto = {
  levelId: string;
  levelNumber: number;
  attempts: number;
  cleared: number;
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
