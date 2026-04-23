import { notFound } from "next/navigation";

import TopicRoadmapPage from "../components/topic-roadmap-page";
import { getTopicViewBySlug } from "@/lib/learning/server";

type Props = {
  params: Promise<{ topic: string }>;
};

export default async function TopicRoadmapRoute({ params }: Props) {
  const { topic } = await params;
  const topicData = await getTopicViewBySlug(topic);
  if (!topicData) notFound();

  return <TopicRoadmapPage topic={topicData} />;
}
