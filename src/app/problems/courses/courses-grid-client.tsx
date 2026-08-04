"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, Layers, Search, Star } from "lucide-react";
import LanguageIcon from "@/components/language/LanguageIcon";
import { getLanguageIconUrlFromParts } from "@/lib/language-icons";
import { getCourseModuleLabel, getQuizModuleLabel } from "@/lib/learning/problem-prompt";

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  iconImage?: string;
  levels?: number;
  questionCount?: number;
};

const INITIAL_VISIBLE = 12;

const CARD_STYLES = [
  "border border-orange-100/80 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-rose-50/50",
  "border border-emerald-100/80 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-green-50/50",
  "border border-sky-100/80 bg-gradient-to-br from-sky-50/60 via-blue-50/40 to-indigo-50/50",
  "border border-violet-100/80 bg-gradient-to-br from-violet-50/60 via-purple-50/40 to-fuchsia-50/50",
  "border border-amber-100/80 bg-gradient-to-br from-amber-50/60 via-yellow-50/40 to-orange-50/50",
  "border border-pink-100/80 bg-gradient-to-br from-pink-50/60 via-rose-50/40 to-fuchsia-50/50",
] as const;

function CourseCardLink({
  course,
  href,
  surface,
  variant,
}: {
  course: CourseCard;
  href: string;
  surface: string;
  variant: "roadmap" | "quiz";
}) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[176px] flex-col rounded-xl p-5 transition hover:shadow-md ${surface}`}
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

      <div className="mt-6 flex items-center gap-1.5 text-secondary/50">
        <BookOpen className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {variant === "quiz"
            ? getQuizModuleLabel(course.levels)
            : getCourseModuleLabel(course.levels, course.questionCount)}
        </span>
      </div>
    </Link>
  );
}

export default function CoursesGridClient({
  courses,
  basePath = "/problems/courses",
  showAllByDefault = false,
  variant = "roadmap",
  popularSlugs = [],
}: {
  courses: CourseCard[];
  basePath?: string;
  showAllByDefault?: boolean;
  variant?: "roadmap" | "quiz";
  popularSlugs?: readonly string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(showAllByDefault);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.intro.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const { popularCourses, otherCourses } = useMemo(() => {
    if (!popularSlugs.length || isSearching) {
      return { popularCourses: [] as CourseCard[], otherCourses: filteredCourses };
    }

    const bySlug = new Map(filteredCourses.map((course) => [course.slug, course]));
    const popular = popularSlugs
      .map((slug) => bySlug.get(slug))
      .filter((course): course is CourseCard => Boolean(course));
    const popularSet = new Set(popular.map((course) => course.slug));
    const others = filteredCourses.filter((course) => !popularSet.has(course.slug));

    return { popularCourses: popular, otherCourses: others };
  }, [filteredCourses, popularSlugs, isSearching]);

  const listCourses = popularCourses.length > 0 ? otherCourses : filteredCourses;

  const visibleCourses =
    showAll || isSearching ? listCourses : listCourses.slice(0, INITIAL_VISIBLE);

  const hasMore =
    !showAllByDefault && !isSearching && listCourses.length > INITIAL_VISIBLE;

  const countLabel = variant === "quiz" ? "quizzes" : "roadmaps";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
          <input
            type="text"
            placeholder={
              variant === "quiz"
                ? "Search for a language or quiz course..."
                : "Search for a language or course roadmap..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white py-2.5 pl-10 pr-4 text-sm text-secondary transition placeholder:text-secondary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <p className="text-sm text-secondary/50">
          <span className="font-semibold text-secondary">{filteredCourses.length}</span> {countLabel}{" "}
          available
        </p>
      </div>

      {popularCourses.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-secondary">
              Popular Languages
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularCourses.map((course, index) => (
              <CourseCardLink
                key={course.id}
                course={course}
                href={`${basePath}/${course.slug}`}
                surface={CARD_STYLES[index % CARD_STYLES.length]}
                variant={variant}
              />
            ))}
          </div>
        </section>
      ) : null}

      {visibleCourses.length > 0 ? (
        <section>
          {popularCourses.length > 0 && !isSearching ? (
            <>
              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary/60">
                All {variant === "quiz" ? "Quizzes" : "Roadmaps"}
              </h2>
            </>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleCourses.map((course, index) => (
              <CourseCardLink
                key={course.id}
                course={course}
                href={`${basePath}/${course.slug}`}
                surface={CARD_STYLES[(index + popularCourses.length) % CARD_STYLES.length]}
                variant={variant}
              />
            ))}
          </div>
        </section>
      ) : null}

      {filteredCourses.length === 0 ? (
        <p className="py-16 text-center text-sm text-secondary/45">
          No {countLabel} match your search.
        </p>
      ) : null}

      {hasMore && !showAll ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Explore all {listCourses.length} {countLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
