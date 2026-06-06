import Link from "next/link";
import type { HomeCourseProgressBySlug, HomeLearningCard } from "@/lib/learning/home-cards";
import { mergeProfileProgressByTrackSlug } from "@/lib/learning/home-cards";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserLearningProfile } from "@/lib/learning/service";
import { getTrackCards } from "@/lib/learning/server";
import Image from "next/image";

const SKELETON_CARD_COUNT = 8;

/** * Fully mapped theme colors for each card to ensure Tailwind compiles them correctly.
 * This adds a subtle, professional splash of color to the icons and hover states.
 */
const CARD_THEMES = [
  { bar: "bg-primary", iconBg: "bg-primary/10", iconText: "text-primary", hoverBorder: "hover:border-primary/40", hoverText: "group-hover:text-primary" },
  { bar: "bg-accent-teal", iconBg: "bg-accent-teal/10", iconText: "text-accent-teal", hoverBorder: "hover:border-accent-teal/40", hoverText: "group-hover:text-accent-teal" },
  { bar: "bg-accent-purple", iconBg: "bg-accent-purple/10", iconText: "text-accent-purple", hoverBorder: "hover:border-accent-purple/40", hoverText: "group-hover:text-accent-purple" },
  { bar: "bg-accent-blue", iconBg: "bg-accent-blue/10", iconText: "text-accent-blue", hoverBorder: "hover:border-accent-blue/40", hoverText: "group-hover:text-accent-blue" },
] as const;

type FastTrackCoursesProps = {
  courses: HomeLearningCard[];
  /** Logged-in user's roadmap completion per course track slug (from learning profile). */
  progressBySlug?: HomeCourseProgressBySlug;
};

function completionForCourse(slug: string, catalogLevels: number, progressBySlug: HomeCourseProgressBySlug) {
  const fromProfile = progressBySlug[slug];
  const totalLevels = Math.max(catalogLevels, fromProfile?.totalLevels ?? 0);
  const completedLevels = fromProfile?.completedLevels ?? 0;
  const progressPct =
    totalLevels > 0 ? Math.min(100, Math.round((completedLevels / totalLevels) * 100)) : 0;
  return { completedLevels, totalLevels, progressPct };
}

export function FastTrackCoursesSkeleton() {
  return (
    <section className="py-24 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden" aria-busy="true" aria-label="Loading courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center gap-8 mb-14">
          <div className="max-w-3xl w-full text-center space-y-4">
            <div className="mx-auto h-3 w-40 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-10 w-full max-w-xl mx-auto rounded-xl bg-slate-200 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div key={index} className="flex flex-col bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm animate-pulse" aria-hidden>
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-slate-100" />
                <div className="space-y-2 text-right flex flex-col items-end">
                  <div className="h-2 w-16 rounded bg-slate-200" />
                  <div className="h-3 w-12 rounded bg-slate-200" />
                </div>
              </div>
              <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
              <div className="h-3 w-1/2 rounded bg-slate-100 mb-6" />
              
              <div className="mt-auto bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between items-end mb-3">
                  <div className="space-y-2">
                    <div className="h-2 w-16 rounded bg-slate-200" />
                    <div className="h-2 w-20 rounded bg-slate-100" />
                  </div>
                  <div className="h-3 w-6 rounded bg-slate-200" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200" />
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                 <div className="h-3 w-24 rounded bg-slate-100" />
                 <div className="h-3 w-3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function FastTrackCoursesSection() {
  const [courses, sessionUser] = await Promise.all([
    getTrackCards("course"),
    getSessionPublicUser(),
  ]);
  const profile = sessionUser
    ? await getUserLearningProfile(sessionUser.id, sessionUser.name || sessionUser.email)
    : null;
  const courseProgressBySlug = mergeProfileProgressByTrackSlug(profile);
  return <FastTrackCourses courses={courses} progressBySlug={courseProgressBySlug} />;
}

export default function FastTrackCourses({ courses, progressBySlug = {} }: FastTrackCoursesProps) {
  return (
    <section className="py-24 bg-gray-50  relative overflow-hidden">
      {/* Premium Ambient Background Color Blobs */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-150 h-150 bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center mb-14">
          <div className="max-w-3xl text-center mx-auto">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Career Development
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Upskill with our{" "}
              <span className="premium-text-gradient">Professional Solutions</span>
            </h3>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="text-slate-500 font-medium text-center">
            Language roadmaps will appear here once they are published.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              const initials = course.title.slice(0, 2).toUpperCase();
              const questionLabel =
                course.questionCount === 1 ? "1 Problem" : `${course.questionCount} Problems`;
              const { completedLevels, totalLevels, progressPct } = completionForCourse(
                course.slug,
                course.levels,
                progressBySlug
              );
              const stepsLabel =
                totalLevels === 1 ? "1 roadmap step" : `${totalLevels} roadmap steps`;

              return (
                <Link
                  key={course.id}
                  href={`/problems/courses/${course.slug}`}
                  className={`group flex flex-col bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${theme.hoverBorder} transition-all duration-300 ease-out`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Tinted Icon Box */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm border border-white/50 ${theme.iconBg} ${theme.iconText} transition-colors duration-300`}>
                      {course.iconImage ? (
                        <Image
                          src={course.iconImage}
                          alt={`${course.title} icon`}
                          loading="lazy"
                          className="h-7 w-7 rounded-md object-contain"
                          width={200}
                          height={200}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                        Questions
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {questionLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Steps */}
                  <h4 className={`text-[17px] font-bold text-slate-900 mb-1 leading-tight ${theme.hoverText} transition-colors line-clamp-1`}>
                    {course.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mb-6">
                    {stepsLabel}
                  </p>

                  {/* Highlighted Progress Dashboard Area */}
                  <div className="mt-auto bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                    <div className="flex justify-between items-end mb-2.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">
                          Progress
                        </span>
                        <span className="text-[11px] font-medium text-slate-600">
                          {completedLevels} / {totalLevels} steps
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{progressPct}%</span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${theme.bar} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Sleek Footer Action */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between w-full">
                    <span className={`text-xs font-semibold text-slate-600 ${theme.hoverText} transition-colors`}>
                      Continue Learning
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-400 ${theme.hoverText} group-hover:translate-x-1 transition-all duration-300`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View More Button */}
        <div className="mt-14 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-200 group"
          >
            View More Courses
            <svg
              className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}