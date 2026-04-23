import { notFound } from "next/navigation";

import TopicStepPage from "../../components/topic-step-page";
import { getTopicViewBySlug } from "@/lib/learning/server";

type Props = {
  params: Promise<{ topic: string; stepId: string }>;
};

function parseStepNumber(stepId: string) {
  const match = /^step-(\d+)$/.exec(stepId);
  if (!match) return null;
  return Number(match[1]);
}

export default async function TopicStepRoute({ params }: Props) {
  const { topic, stepId } = await params;
  const topicData = await getTopicViewBySlug(topic);
  if (!topicData) notFound();

  const stepNumber = parseStepNumber(stepId);
  if (!stepNumber) notFound();

  const level = topicData.levels.find((item) => item.level === stepNumber);
  if (!level) notFound();

  return <TopicStepPage topic={topicData} level={level} />;
}
