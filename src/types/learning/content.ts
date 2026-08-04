export type LearningContentKind = "track" | "course";

export type LearningEntityStatus = "draft" | "published" | "archived";

export type LearningLanguageDto = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: LearningEntityStatus;
  order: number;
  icon?: string;
};

export type LearningTrackDto = {
  id: string;
  languageId: string;
  slug: string;
  title: string;
  intro: string;
  iconImage: string;
  kind: LearningContentKind;
  status: LearningEntityStatus;
  order: number;
  totalLevels: number;
  totalQuestions: number;
  totalTasks: number;
};

export type LearningLevelDto = {
  id: string;
  trackId: string;
  levelNumber: number;
  title: string;
  description: string;
  passScore: number;
  order: number;
  questionCount: number;
  taskCount: number;
};

export type LearningQuestionOption = {
  id: string;
  text: string;
};

export type LearningQuestionDto = {
  id: string;
  levelId: string;
  externalId: string;
  prompt: string;
  options: LearningQuestionOption[];
  explanation: string;
  order: number;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  questionType: "mcq" | "coding";
  sampleInput: string;
  expectedOutput: string;
};

export type LearningTaskDto = {
  id: string;
  levelId: string;
  externalId: string;
  prompt: string;
  instructions: string;
  order: number;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
};

export type LearningLevelWithContentDto = {
  level: LearningLevelDto;
  questions: LearningQuestionDto[];
  tasks: LearningTaskDto[];
};
