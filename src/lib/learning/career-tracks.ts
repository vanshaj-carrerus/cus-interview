import type { LucideIcon } from "lucide-react";
import {
  Brackets,
  Cloud,
  Code2,
  Database,
  Layers,
  Smartphone,
} from "lucide-react";

export type CareerTrackDefinition = {
  slug: string;
  title: string;
  subtitle: string;
  courseSlugs: readonly string[];
  surface: string;
  iconClass: string;
  icon: LucideIcon;
};

export const CAREER_TRACKS: CareerTrackDefinition[] = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    subtitle: "HTML, CSS, JavaScript, TypeScript & React quizzes",
    courseSlugs: [
      "html-mastery",
      "css-mastery",
      "javascript-mastery",
      "typescript-mastery",
      "react-mastery",
    ],
    surface:
      "border border-orange-200/70 bg-gradient-to-r from-orange-100 via-amber-50 to-rose-100",
    iconClass: "text-orange-500",
    icon: Brackets,
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    subtitle: "Python, Java, C#, SQL & server-side fundamentals",
    courseSlugs: [
      "python-mastery",
      "java-mastery",
      "csharp-mastery",
      "sql-mastery",
      "cpp-mastery",
    ],
    surface:
      "border border-emerald-200/70 bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100",
    iconClass: "text-emerald-600",
    icon: Database,
  },
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    subtitle: "Frontend + backend languages for end-to-end roles",
    courseSlugs: [
      "javascript-mastery",
      "typescript-mastery",
      "react-mastery",
      "python-mastery",
      "sql-mastery",
      "html-mastery",
    ],
    surface:
      "border border-sky-200/70 bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100",
    iconClass: "text-primary",
    icon: Layers,
  },
  {
    slug: "mobile-developer",
    title: "Mobile Developer",
    subtitle: "JavaScript, Java, Swift-ready mobile stack quizzes",
    courseSlugs: [
      "javascript-mastery",
      "typescript-mastery",
      "java-mastery",
      "react-mastery",
    ],
    surface:
      "border border-violet-200/70 bg-gradient-to-r from-violet-100 via-purple-50 to-fuchsia-100",
    iconClass: "text-violet-600",
    icon: Smartphone,
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    subtitle: "Python, SQL & data-focused interview prep",
    courseSlugs: ["python-mastery", "sql-mastery", "java-mastery"],
    surface:
      "border border-amber-200/70 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100",
    iconClass: "text-amber-600",
    icon: Code2,
  },
  {
    slug: "devops-cloud",
    title: "DevOps & Cloud",
    subtitle: "Scripting, systems & cloud-ready language basics",
    courseSlugs: [
      "python-mastery",
      "sql-mastery",
      "javascript-mastery",
      "java-mastery",
    ],
    surface:
      "border border-fuchsia-200/70 bg-gradient-to-r from-fuchsia-100 via-pink-50 to-purple-100",
    iconClass: "text-fuchsia-600",
    icon: Cloud,
  },
];

export function getCareerTrackBySlug(slug: string) {
  return CAREER_TRACKS.find((track) => track.slug === slug);
}

export type CourseCardLike = {
  slug: string;
  title: string;
  intro: string;
  iconImage?: string;
  levels?: number;
  questionCount?: number;
};

export function resolveTrackCourses(
  track: CareerTrackDefinition,
  courses: CourseCardLike[],
) {
  const bySlug = new Map(courses.map((course) => [course.slug, course]));
  return track.courseSlugs
    .map((slug) => bySlug.get(slug))
    .filter((course): course is CourseCardLike => Boolean(course));
}
