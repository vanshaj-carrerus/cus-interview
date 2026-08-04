import { getAllCourseRoadmaps } from "@/lib/learning/server";
import CoursesGridClient from "./courses-grid-client";

export const revalidate = 60;

export default async function CoursesRoadmapHomePage() {
  const courses = await getAllCourseRoadmaps();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-10 md:px-10 md:pt-12">
        <header className="mb-10 flex flex-col items-center text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-secondary md:text-[2.75rem] md:leading-tight">
            Language & Course Roadmaps
          </h1>

          <p className="mb-8 max-w-2xl text-sm font-medium leading-relaxed text-slate-500 md:text-base">
            Master a new language or deep dive into complex architectures with our carefully crafted, step-by-step interview curriculums.
          </p>
        </header>

        <CoursesGridClient courses={courses} />
      </div>
    </div>
  );
}
