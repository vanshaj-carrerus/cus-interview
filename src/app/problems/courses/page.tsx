import Link from "next/link";
import { getTrackCards } from "@/lib/learning/server";
import Image from "next/image";

export const revalidate = 60;

export default async function CoursesRoadmapHomePage() {
  const courses = await getTrackCards("course");
  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Language and Course Roadmaps</h1>
        <p className="text-slate-600 mt-2">
          Pick a language course and follow step-by-step interview practice.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/problems/courses/${course.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {course.iconImage ? (
                <Image src={course.iconImage} alt={`${course.title} icon`} className="mb-3 h-10 w-10 rounded-lg object-cover" width={200} height={200} />
              ) : null}
              <p className="text-xs uppercase tracking-wide text-slate-400">Course</p>
              <h2 className="text-xl font-bold text-slate-800 mt-1">{course.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{course.intro}</p>
              <p className="text-sm text-primary font-semibold mt-4">Open Course Roadmap →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
