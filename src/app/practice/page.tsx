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
} from "lucide-react";
import { getTrackCards } from "@/lib/learning/server";

export const revalidate = 60;

type TrackCardData = {
  id: string;
  name: string;
  href: string;
  slug: string;
  title: string;
  intro: string;
  levels: number;
  questionCount: number;
};

const icons = [Code2, Cpu, Layout, Database, PuzzleIcon, Terminal];
const backgrounds = ["bg-blue-50", "bg-orange-50", "bg-purple-50", "bg-teal-50", "bg-amber-50", "bg-indigo-50"];
const colors = ["text-blue-600", "text-orange-500", "text-purple-600", "text-teal-600", "text-amber-500", "text-primary"];

export default async function Dashboard() {
  const [trackRows, courseRows] = await Promise.all([getTrackCards("track"), getTrackCards("course")]);
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
    tracks.reduce((sum, item) => sum + item.levels, 0) + courses.reduce((sum, item) => sum + item.levels, 0);
  const combinedQuestions =
    tracks.reduce((sum, item) => sum + item.questionCount, 0) +
    courses.reduce((sum, item) => sum + item.questionCount, 0);
  return (
    <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-12 font-sans text-slate-900 selection:bg-indigo-100 selection:text-primary">
      <div className="max-w-7xl mx-auto">
        {/* --- Hero / Header Section --- */}
        <header className="relative mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"> 
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary bg-indigo-50 px-3 py-1 rounded-full">
                  Your Personalized LMS
                </span>
                <span className="w-12 h-px bg-slate-200" />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-secondary leading-[1.1] premium-text-gradient">
                 Practice Hub
              </h1>

              <p className="text-slate-500 text-xl max-w-2xl font-light leading-relaxed">
                Elevate your engineering craft through structured roadmap-based
                learning. Choose a domain below to begin your technical mastery.
              </p>
            </div>

            {/* Quick Stats Floating Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-1">
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
          </div>

          <div className="mt-16 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        {/* --- Main Tracks Section --- */}
        <section className="mb-24">
          <SectionHeading
            title="Curated Learning Tracks"
            subtitle="Deep-dive roadmaps designed for interview success and architectural mastery."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        </section>

        {/* --- Language Specializations --- */}
        <section className="pb-20">
          <SectionHeading
            title="Language & Syntax"
            subtitle="Hone your skills in specific programming environments with fast-track modules."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {courses.map((course, index) => (
              <CourseLink key={course.id} course={course} index={index} />
            ))}
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
    <div className="group flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-primary transition-colors">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold text-slate-800 tracking-tight">
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
    <div className="mb-12 space-y-2">
      <h2 className="text-3xl premium-text-gradient font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-500 text-lg font-light">{subtitle}</p>
    </div>
  );
}

function TrackCard({ track, index }: { track: TrackCardData; index: number }) {
  const Icon = icons[index % icons.length];
  return (
    <div>
      <Link href={track.href} className="group block h-full">
        <div className="relative h-full bg-white border border-slate-100 p-10 rounded-[3rem] transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:border-indigo-100 hover:-translate-y-2 flex flex-col">
          {/* Icon Container */}
          <div
            className={`w-16 h-16 ${backgrounds[index % backgrounds.length]} ${colors[index % colors.length]} group-hover:text-white! group-hover:bg-primary! rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-current/10`}
          >
            <Icon className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
            {track.name}
          </h3>

          <p className="text-slate-500 leading-relaxed mb-8 font-light">
            Master {track.name.toLowerCase()} fundamentals with our verified
            curriculum of {track.levels} roadmap steps.
          </p>

          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
              Explore Roadmap
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CourseLink({ course, index }: { course: TrackCardData; index: number }) {
  return (
    <div>
      <Link href={course.href} className="group block">
        <div className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-4xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:border-slate-200">
          <div
            className={`w-14 h-14 ${backgrounds[index % backgrounds.length]} rounded-2xl flex items-center justify-center text-lg font-bold mb-4 shadow-sm border border-white transition-transform group-hover:-translate-y-1`}
          >
            {course.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">
              {course.title}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {course.levels} Steps
            </p>
          </div>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}
