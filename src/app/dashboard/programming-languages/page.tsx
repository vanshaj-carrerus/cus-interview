import { getQuizCourseRoadmaps } from "@/lib/learning/server";
import { POPULAR_QUIZ_SLUGS } from "@/lib/learning/popular-quizzes";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserLearningProfile } from "@/lib/learning/service";
import { sumProgrammingLanguageModuleProgress } from "@/lib/learning/programming-languages-progress";
import CoursesGridClient from "@/app/problems/courses/courses-grid-client";
import CareerTracksGrid from "./components/career-tracks-grid";
import ProgrammingLanguagesProgress from "./components/programming-languages-progress";

export const dynamic = "force-dynamic";

export default async function DashboardProgrammingLanguagesPage() {
  const courses = await getQuizCourseRoadmaps();
  const courseProgressInput = courses.map((course) => ({
    slug: course.slug,
    levels: course.levels,
  }));

  let completedModules = 0;
  let totalModules = courseProgressInput.reduce((sum, course) => sum + (course.levels ?? 0), 0);

  try {
    const user = await getSessionPublicUser();
    if (user) {
      const profile = await getUserLearningProfile(user.id, user.name || user.email);
      const progress = sumProgrammingLanguageModuleProgress(courseProgressInput, profile);
      completedModules = progress.completedModules;
      totalModules = progress.totalModules;
    }
  } catch {
    // Fall back to catalog totals with zero completion.
  }

  return (
    <div className="min-h-0">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
          Programming Languages & Quizzes
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-secondary/55">
          Pick a career track to practice role-specific languages, or browse all quizzes below.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary">
              Career tracks
            </h2>
            <CareerTracksGrid />
          </section>

          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary/60">
              All language quizzes
            </h2>
            <CoursesGridClient
              courses={courses}
              basePath="/dashboard/programming-languages"
              showAllByDefault
              variant="quiz"
              popularSlugs={POPULAR_QUIZ_SLUGS}
            />
          </section>
        </div>

        <ProgrammingLanguagesProgress
          initialCompleted={completedModules}
          total={totalModules}
          courses={courseProgressInput}
        />
      </div>
    </div>
  );
}
