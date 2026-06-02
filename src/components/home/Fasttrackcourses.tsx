import Link from "next/link";
import type { HomeCourseProgressBySlug, HomeLearningCard } from "@/lib/learning/home-cards";
import { mergeProfileProgressByTrackSlug } from "@/lib/learning/home-cards";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getUserLearningProfile } from "@/lib/learning/service";
import { getTrackCards } from "@/lib/learning/server";
import Image from "next/image";

const SKELETON_CARD_COUNT = 8;

/** Progress bar accents — cycle by card index (primary/secondary palette). */
const ACCENT_BARS = [
  "bg-primary",
  "bg-secondary",
  "bg-accent-teal",
  "bg-accent-blue",
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
    <section className="py-24 bg-white relative" aria-busy="true" aria-label="Loading courses">
      <div className="max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-5xl w-full text-center md:text-left space-y-4">
            <div className="mx-auto md:mx-0 h-4 w-44 rounded-full bg-primary/15 animate-pulse" />
            <div className="h-12 w-full max-w-2xl mx-auto md:mx-0 rounded-2xl bg-secondary/10 animate-pulse" />
          </div>
          <div className="h-4 w-32 rounded bg-secondary/10 animate-pulse shrink-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div key={index} className="pro-card p-8 animate-pulse" aria-hidden>
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-lg bg-secondary/15" />
                <div className="space-y-2 text-right">
                  <div className="h-2 w-14 rounded bg-secondary/10 ml-auto" />
                  <div className="h-4 w-16 rounded bg-secondary/15 ml-auto" />
                </div>
              </div>
              <div className="h-6 w-3/4 rounded bg-secondary/15 mb-2" />
              <div className="h-3 w-1/2 rounded bg-secondary/10 mb-6" />
              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <div className="h-2 w-20 rounded bg-secondary/10" />
                  <div className="h-2 w-8 rounded bg-secondary/10" />
                </div>
                <div className="h-2 w-full rounded bg-secondary/10" />
                <div className="h-2 w-full rounded-full bg-slate-100" />
              </div>
              <div className="mt-8 h-11 w-full rounded-xl bg-slate-100" />
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
    <section className="py-24 bg-white relative">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-5xl text-center md:text-left">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">
              Career Development
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
              Upskill with our{" "}
              <span className="premium-text-gradient">Professional Solutions</span>
            </h3>
          </div>
         
        </div>

        {courses.length === 0 ? (
          <p className="text-secondary/60 font-medium text-center md:text-left">
            Language roadmaps will appear here once they are published.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.slice(0, 8).map((course, index) => {
              const barColor = ACCENT_BARS[index % ACCENT_BARS.length];
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
                  className="pro-card p-8 group cursor-pointer block"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black text-secondary shadow-sm border border-slate-100 bg-slate-50 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                      {course.iconImage ? (
                        <Image
                          src={course.iconImage}
                          alt={`${course.title} icon`}
                          loading="lazy"
                          className="h-8 w-8 rounded-md object-cover"
                          width={200}
                          height={200}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                        Questions
                      </span>
                      <span className="block font-black text-secondary text-sm">
                        {questionLabel}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-secondary mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h4>

                  <p className="text-secondary/50 text-[10px] font-bold uppercase tracking-widest mb-6">
                    {stepsLabel}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/40">
                      <span>Your progress</span>
                      <span className="text-secondary shrink-0">{progressPct}%</span>
                    </div>

                    <p className="text-[10px] font-bold text-secondary/45 normal-case tracking-normal">
                      {completedLevels} of {totalLevels} roadmap steps completed
                    </p>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <span className="mt-8 w-full py-3 rounded-xl bg-slate-50 text-secondary text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all inline-block text-center">
                    Continue Learning
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-secondary text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    View More Courses
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
      </div>
    </section>
  );
}