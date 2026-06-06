import Link from "next/link";
import {
  Code2,
  Database,
  Layout,
  Cpu,
  Puzzle as PuzzleIcon,
  Terminal,
  ChevronRight,
  ArrowUpRight,
  Target,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getTrackCards } from "@/lib/learning/server";
import Image from "next/image";

export const revalidate = 60;

type TrackCardData = {
  id: string;
  name: string;
  href: string;
  slug: string;
  title: string;
  intro: string;
  iconImage: string;
  levels: number;
  questionCount: number;
};

const icons = [Code2, Cpu, Layout, Database, PuzzleIcon, Terminal];
const backgrounds = [
  "bg-blue-50",
  "bg-orange-50",
  "bg-purple-50",
  "bg-teal-50",
  "bg-amber-50",
  "bg-indigo-50",
];
const colors = [
  "text-blue-600",
  "text-orange-500",
  "text-purple-600",
  "text-teal-600",
  "text-amber-500",
  "text-primary",
];

export default async function Dashboard() {
  const [trackRows, courseRows] = await Promise.all([
    getTrackCards("track"),
    getTrackCards("course"),
  ]);

  const tracks: TrackCardData[] = trackRows.map((item) => ({
    ...item,
    name: item.title,
    href: `/problems/${item.slug}`,
  }));

  const courses: TrackCardData[] = courseRows.map((item) => ({
    ...item,
    name: item.title,
    href: `/problems/courses/${item.slug}`,
  }));

  const combinedSteps =
    tracks.reduce((sum, item) => sum + item.levels, 0) +
    courses.reduce((sum, item) => sum + item.levels, 0);

  const combinedQuestions =
    tracks.reduce((sum, item) => sum + item.questionCount, 0) +
    courses.reduce((sum, item) => sum + item.questionCount, 0);

  // Logic for CSS-only Toggle: 9 initial items + 1 View All Card = 10 items (exactly 2 rows of 5)
  const visibleCourses = courses.slice(0, 9);
  const hiddenCourses = courses.slice(9);
  const hasMoreCourses = courses.length > 9;

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-12 font-sans text-slate-900 selection:bg-indigo-100 selection:text-primary">
      <div className="max-w-7xl mx-auto">
        {/* --- Hero / Header Section --- */}
        <header className="relative mb-24 flex flex-col items-center text-center">
          <div className="space-y-6 max-w-3xl mb-14">
            <div className="flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-slate-200 hidden sm:block" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary bg-indigo-50/80 border border-indigo-100/50 px-4 py-1.5 rounded-full">
                Your Personalized LMS
              </span>
              <span className="w-12 h-px bg-slate-200 hidden sm:block" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-secondary leading-[1.15] ">
              Practice Hub
            </h1>

            <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed mx-auto">
              Elevate your engineering craft through structured roadmap-based
              learning. Choose a domain below to begin your technical mastery.
            </p>
          </div>

          {/* Quick Stats Grid - Centered Row */}
          <div className="flex flex-wrap items-center  justify-center gap-10 sm:gap-16 lg:gap-24">
            <HeaderStat
              label="Learning Paths"
              value={tracks.length.toString()}
              icon={<Target className="w-4 h-4" />}
            />
            <HeaderStat
              label="Total Content"
              value={`${combinedSteps}+ Steps`}
              icon={<BookOpen className="w-4 h-4" />}
            />
            <HeaderStat
              label="Interview Challenges"
              value={combinedQuestions.toString()}
              icon={<BarChart3 className="w-4 h-4" />}
            />
          </div>

          <div className="mt-20 h-px w-full max-w-5xl bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        {/* --- Main Tracks Section --- */}
        <section className="mb-24">
          <SectionHeading
            title="Curated Learning Tracks"
            subtitle="Deep-dive roadmaps designed for interview success and architectural mastery."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        </section>

        {/* --- Language Specializations --- */}
        <section id="language-syntax" className="pb-20">
          <SectionHeading
            title="Language & Syntax"
            subtitle="Hone your skills in specific programming environments with fast-track modules."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto relative">
            {/* 1. Visible Courses (First 9) */}
            {visibleCourses.map((course, index) => (
              <CourseLink key={course.id} course={course} index={index} />
            ))}

            {/* 2. Hidden Checkbox for CSS Toggle Trick */}
            {hasMoreCourses && (
              <input type="checkbox" id="toggle-languages" className="peer hidden" />
            )}

            {/* 3. View All Button (Hides when checked) */}
            {hasMoreCourses && (
              <label
                htmlFor="toggle-languages"
                className="peer-checked:hidden cursor-pointer group flex flex-col items-center justify-center p-6 bg-slate-50/50 border border-slate-200 border-dashed rounded-4xl transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-1 h-full min-h-45"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-5 shadow-sm border border-slate-100 transition-transform group-hover:-translate-y-1 group-hover:text-primary group-hover:bg-indigo-50">
                  <ChevronDown className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-600 text-sm group-hover:text-primary transition-colors">
                    View All
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    {hiddenCourses.length} More
                  </p>
                </div>
              </label>
            )}

            {/* 4. Extra Hidden Courses (Shows when checked) */}
            {hasMoreCourses &&
              hiddenCourses.map((course, idx) => (
                <div key={course.id} className="hidden peer-checked:block h-full">
                  <CourseLink course={course} index={visibleCourses.length + idx} />
                </div>
              ))}

            {/* 5. Show Less Button (Shows when checked) */}
            {hasMoreCourses && (
              <label
                htmlFor="toggle-languages"
                className="hidden peer-checked:flex cursor-pointer group flex-col items-center justify-center p-6 bg-slate-50/50 border border-slate-200 border-dashed rounded-[2rem] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-1 h-full min-h-[180px]"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-5 shadow-sm border border-slate-100 transition-transform group-hover:-translate-y-1 group-hover:text-primary group-hover:bg-indigo-50">
                  <ChevronUp className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-600 text-sm group-hover:text-primary transition-colors">
                    Show Less
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    Collapse List
                  </p>
                </div>
              </label>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* --- Internal Helper Components --- */

function HeaderStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col items-center text-center gap-1.5">
      <div className="flex items-center justify-center gap-2 text-slate-400 group-hover:text-primary transition-colors">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
        {value}
      </span>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-14 space-y-3 flex flex-col items-center text-center max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl  font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function TrackCard({ track, index }: { track: TrackCardData; index: number }) {
  const Icon = icons[index % icons.length];
  return (
    <div className="h-full">
      <Link href={track.href} className="group block h-full">
        <div className="relative h-full bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-indigo-100 hover:-translate-y-1.5 flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 bg-white ${colors[index % colors.length]} rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-sm border border-slate-50`}
          >
            {track.iconImage ? (
              <Image
                src={track.iconImage}
                alt={`${track.name} icon`}
                className="h-12 w-auto object-cover rounded-lg"
                width={400}
                height={400}
                loading="lazy"
              />
            ) : (
              <Icon className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
            {track.name}
          </h3>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 font-light">
            Master {track.name.toLowerCase()} fundamentals with our verified
            curriculum of {track.levels} roadmap steps.
          </p>
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-center gap-3 w-full">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
              Explore Roadmap
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CourseLink({
  course,
  index,
}: {
  course: TrackCardData;
  index: number;
}) {
  return (
    <div className="h-full">
      <Link href={course.href} className="group block h-full">
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[2rem] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:border-slate-200 group-hover:-translate-y-1 h-full min-h-[180px]">
          <div
            className={`w-14 h-14 ${backgrounds[index % backgrounds.length]} rounded-2xl flex items-center justify-center text-lg font-bold mb-5 shadow-sm border border-white transition-transform group-hover:-translate-y-1`}
          >
            {course.iconImage ? (
              <Image
                src={course.iconImage}
                alt={`${course.title} icon`}
                className="h-10 w-10 object-cover rounded-lg"
                width={200}
                height={200}
                loading="lazy"
              />
            ) : (
              course.title.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
              {course.title}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              {course.levels} Steps
            </p>
          </div>
          <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}