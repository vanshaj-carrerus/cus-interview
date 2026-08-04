"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, Layers } from "lucide-react";
import LanguageIcon from "@/components/language/LanguageIcon";
import { getLanguageIconUrlFromParts } from "@/lib/language-icons";
import { getQuizModuleLabel } from "@/lib/learning/problem-prompt";
import type { CourseCardLike } from "@/lib/learning/career-tracks";

const CARD_STYLES = [
  "border border-orange-100/80 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-rose-50/50",
  "border border-emerald-100/80 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-green-50/50",
  "border border-sky-100/80 bg-gradient-to-br from-sky-50/60 via-blue-50/40 to-indigo-50/50",
  "border border-violet-100/80 bg-gradient-to-br from-violet-50/60 via-purple-50/40 to-fuchsia-50/50",
  "border border-amber-100/80 bg-gradient-to-br from-amber-50/60 via-yellow-50/40 to-orange-50/50",
  "border border-pink-100/80 bg-gradient-to-br from-pink-50/60 via-rose-50/40 to-fuchsia-50/50",
] as const;

type Props = {
  courses: CourseCardLike[];
  basePath?: string;
};

export default function CareerTrackLanguagesGrid({
  courses,
  basePath = "/dashboard/programming-languages",
}: Props) {
  if (courses.length === 0) {
    return (
      <p className="rounded-xl border border-primary/10 bg-white px-4 py-10 text-center text-sm text-secondary/50">
        Language quizzes for this track are coming soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <Link
          key={course.slug}
          href={`${basePath}/${course.slug}`}
          className={`group relative flex min-h-[176px] flex-col rounded-xl p-5 transition hover:shadow-md ${
            CARD_STYLES[index % CARD_STYLES.length]
          }`}
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/60 bg-white/70 shadow-sm">
              {course.iconImage ? (
                <Image
                  src={course.iconImage}
                  alt={`${course.title} icon`}
                  loading="lazy"
                  className="h-5 w-5 rounded object-cover"
                  width={20}
                  height={20}
                />
              ) : getLanguageIconUrlFromParts(course.slug, course.title) ? (
                <LanguageIcon
                  slug={course.slug}
                  title={course.title}
                  language={course.slug}
                  className="h-5 w-5"
                />
              ) : (
                <Layers className="h-4 w-4 text-primary" />
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-secondary/30 transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <h2 className="mb-auto pr-2 text-base font-bold leading-snug text-secondary transition group-hover:text-primary">
            {course.title}
          </h2>

          {course.intro ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-secondary/50">
              {course.intro}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-1.5 text-secondary/50">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {getQuizModuleLabel(course.levels)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
