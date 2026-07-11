"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, BookOpen, Layers } from "lucide-react";

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  iconImage?: string;
  levels?: number;
};

export default function CoursesGridClient({ courses }: { courses: CourseCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => {
        const href = `/problems/courses/${course.slug}`;

        return (
          <Link
            key={course.id}
            href={href}
            className="group flex h-full flex-col rounded-2xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur-xl ring-2 ring-transparent transition-all duration-600 hover:-translate-y-1 hover:border-slate-300/80 hover:bg-white hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:ring-sky-500/20"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm transition-transform duration-300 ease-out group-hover:scale-110">
                {course.iconImage ? (
                  <Image
                    src={course.iconImage}
                    alt={`${course.title} icon`}
                    loading="lazy"
                    className="h-7 w-7 rounded-lg object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <Layers className="h-6 w-6" />
                )}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-slate-50 shadow-sm transition-colors duration-300 group-hover:border-sky-500 group-hover:bg-sky-500">
                <ChevronRight className="h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-white" />
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-sky-500">
                {course.title}
              </h2>
            </div>

            <p className="mb-6 line-clamp-3 flex-grow text-[13px] font-medium leading-relaxed text-slate-500">
              {course.intro}
            </p>

            <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-slate-400 transition-colors duration-300 group-hover:text-sky-500">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                {course.levels || 0} Modules
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
