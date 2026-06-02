import { notFound } from "next/navigation";

import TopicRoadmapPage from "../../components/topic-roadmap-page";
import { getTopicViewBySlug } from "@/lib/learning/server";

type Props = {
  params: Promise<{ course: string }>;
};

export default async function CourseRoadmapRoute({ params }: Props) {
  const { course } = await params;

  const courseData = await getTopicViewBySlug(course);
  if (!courseData) notFound();

  return <TopicRoadmapPage topic={courseData} basePath="/problems/courses" />;
}
