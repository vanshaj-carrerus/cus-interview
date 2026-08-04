import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CareerTrackLanguagesGrid from "../../components/career-track-languages-grid";
import {
  getCareerTrackBySlug,
  resolveTrackCourses,
} from "@/lib/learning/career-tracks";
import { getQuizCourseRoadmaps } from "@/lib/learning/server";

type Props = {
  params: Promise<{ trackSlug: string }>;
};

export default async function CareerTrackPage({ params }: Props) {
  const { trackSlug } = await params;
  const track = getCareerTrackBySlug(trackSlug);
  if (!track) notFound();

  const courses = await getQuizCourseRoadmaps();
  const trackCourses = resolveTrackCourses(track, courses);
  const Icon = track.icon;

  return (
    <div className="min-h-0">
      <Link
        href="/dashboard/programming-languages"
        className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary/40 transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Programming Languages
      </Link>

      <header className={`relative mb-8 overflow-hidden rounded-2xl border p-6 sm:p-8 ${track.surface}`}>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50">
            Career track
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            {track.title}
          </h1>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary/45">
            {trackCourses.length} related language quiz
            {trackCourses.length === 1 ? "" : "es"}
          </p>
        </div>
        <Icon
          className={`pointer-events-none absolute -bottom-4 -right-2 h-32 w-32 opacity-15 ${track.iconClass}`}
          strokeWidth={1.1}
        />
      </header>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary/60">
          Related languages & tests
        </h2>
        <CareerTrackLanguagesGrid courses={trackCourses} />
      </section>
    </div>
  );
}
