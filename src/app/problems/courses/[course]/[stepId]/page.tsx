import { notFound } from "next/navigation";

import TopicStepPage from "../../../components/topic-step-page";
import { getTopicViewBySlug } from "@/lib/learning/server";

type Props = {
  params: Promise<{ course: string; stepId: string }>;
};

function parseStepNumber(stepId: string) {
  const match = /^step-(\d+)$/.exec(stepId);
  if (!match) return null;
  return Number(match[1]);
}

export default async function CourseStepRoute({ params }: Props) {
  const { course, stepId } = await params;
  const courseData = await getTopicViewBySlug(course);
  if (!courseData) notFound();

  const stepNumber = parseStepNumber(stepId);
  if (!stepNumber) notFound();

  const level = courseData.levels.find((item) => item.level === stepNumber);
  if (!level) notFound();

  return <TopicStepPage topic={courseData} level={level} basePath="/problems/courses" />;
}
