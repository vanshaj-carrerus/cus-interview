import type {
  LanguageProgressDto,
  LearningAttemptDto,
} from "./learning/progress";

export type LearningTotals = {
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
