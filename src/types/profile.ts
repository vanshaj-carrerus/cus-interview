import type {
  LanguageProgressDto,
  LearningAttemptDto,
} from "./learning/progress";

export type LearningTotals = {
  /** Sum over levels of distinct UTC practice days (not per-question submissions). */
  totalAttempts: number;
  totalCleared: number;
  totalQuestionsAttempted: number;
  totalTasksAttempted: number;
  totalLevelsCompleted: number;
};

export type UserLearningProfile = {
  userId: string;
  displayName: string;
  totals: LearningTotals;
  languages: LanguageProgressDto[];
  recentAttempts: LearningAttemptDto[];
  lastActiveAt?: string;
};
