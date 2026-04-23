import Link from "next/link";
import { getTrackCards } from "@/lib/learning/server";

export const revalidate = 60;

export default async function ProblemsHomePage() {
  const [topics, courses] = await Promise.all([getTrackCards("track"), getTrackCards("course")]);
  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Problem Roadmaps</h1>
          <Link href="/admin-panel" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Open Admin
          </Link>
        </div>
        <p className="text-slate-600 mt-2">
          Pick a topic and follow the step-by-step tutor path.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/problems/${topic.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">Topic</p>
              <h2 className="text-xl font-bold text-slate-800 mt-1">{topic.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{topic.intro}</p>
              <p className="text-sm text-primary font-semibold mt-4">Open Roadmap →</p>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-10">Language Courses</h2>
        <p className="text-slate-600 mt-2">
          Skill-focused language roadmaps with interview-style step tests.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/problems/courses/${course.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">Course</p>
              <h2 className="text-xl font-bold text-slate-800 mt-1">{course.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{course.intro}</p>
              <p className="text-sm text-primary font-semibold mt-4">Open Course Path →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
