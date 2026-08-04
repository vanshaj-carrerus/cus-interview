export type QuestionItem = {
  id: string;
  question: string;
  options: string[];
  answerIndex?: number;
  explanation: string;
  questionType?: "mcq" | "coding";
  externalId?: string;
  difficulty?: "easy" | "medium" | "hard";
};

export type LevelItem = {
  id?: string;
  level: number;
  title: string;
  description: string;
  passScore: number;
  questions: QuestionItem[];
};

export type TopicData = {
  id?: string;
  slug: string;
  title: string;
  intro: string;
  kind?: "track" | "course";
  levels: LevelItem[];
};
