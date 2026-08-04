"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAREER_TRACKS } from "@/lib/learning/career-tracks";

type Props = {
  basePath?: string;
};

export default function CareerTracksGrid({
  basePath = "/dashboard/programming-languages/tracks",
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {CAREER_TRACKS.map((track) => {
        const Icon = track.icon;
        return (
          <Link
            key={track.slug}
            href={`${basePath}/${track.slug}`}
            className={`group relative flex min-h-[120px] overflow-hidden rounded-xl p-5 transition hover:shadow-md ${track.surface}`}
          >
            <div className="relative z-10 flex min-w-0 flex-1 flex-col pr-16">
              <h3 className="text-lg font-bold leading-snug text-secondary transition group-hover:text-primary">
                {track.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-secondary/45 transition group-hover:text-primary">
                View languages
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </div>
            <Icon
              className={`pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 opacity-20 transition group-hover:scale-105 group-hover:opacity-30 ${track.iconClass}`}
              strokeWidth={1.25}
            />
          </Link>
        );
      })}
    </div>
  );
}
