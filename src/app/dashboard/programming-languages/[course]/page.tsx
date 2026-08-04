import { notFound } from "next/navigation";

import TopicRoadmapPage from "@/app/problems/components/topic-roadmap-page";
import { getTopicViewBySlug } from "@/lib/learning/server";

type Props = {
  params: Promise<{ course: string }>;
};

export default async function DashboardCourseRoadmapPage({ params }: Props) {
  const { course } = await params;

  const courseData = await getTopicViewBySlug(course);
  if (!courseData || courseData.kind !== "course") notFound();

  return (
    <TopicRoadmapPage
      topic={courseData}
      basePath="/dashboard/programming-languages"
      mode="quiz"
    />
  );
}
