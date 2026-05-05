import Link from "next/link";
import type { HomeCourseProgressBySlug, HomeLearningCard } from "@/lib/learning/home-cards";
import Image from "next/image";

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

export default function FastTrackCourses({ courses, progressBySlug = {} }: FastTrackCoursesProps) {
  return (
    <section className="py-24 bg-white relative">
      <div className=" max-w-7xl md:container! mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-5xl text-center md:text-left">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Career Development</h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-none">
              Upskill with our {""}
              <span className="premium-text-gradient">Professional Solutions</span>
            </h3>
          </div>
          <Link
            href="/practice#language-syntax"
            className="text-secondary/40 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors"
          >
            View all courses
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="text-secondary/60 font-medium text-center md:text-left">
            Language roadmaps will appear here once they are published.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, index) => {
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
                        <Image src={course.iconImage} alt={`${course.title} icon`} className="h-8 w-8 rounded-md object-cover" width={200} height={200} />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                        Questions
                      </span>
                      <span className="block font-black text-secondary text-sm">{questionLabel}</span>
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
      </div>
    </section>
  );
}
