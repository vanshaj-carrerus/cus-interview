import type { QuestionItem } from "@/app/practice/data/types";

export function resolveQuestionType(
  questionType: QuestionItem["questionType"],
  optionsCount: number,
): "mcq" | "coding" {
  if (optionsCount > 0) return "mcq";
  if (questionType === "mcq" || questionType === "coding") return questionType;
  return "coding";
}

export function isCodingQuestion(question: Pick<QuestionItem, "questionType" | "options">) {
  return resolveQuestionType(question.questionType, question.options.length) === "coding";
}

export function isCodingLevel(level: { questions: Pick<QuestionItem, "questionType" | "options">[] }) {
  return level.questions.length > 0 && level.questions.every(isCodingQuestion);
}
