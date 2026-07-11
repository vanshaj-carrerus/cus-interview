"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Code2,
  Cpu,
  Layout,
  Database,
  Puzzle as PuzzleIcon,
  Terminal,
} from "lucide-react";

type TrackCardData = {
  id: string;
  name: string;
  href: string;
  iconImage: string;
  levels: number;
};

const icons = [Code2, Cpu, Layout, Database, PuzzleIcon, Terminal];
const colors = [
  "text-blue-600",
  "text-orange-500",
  "text-purple-600",
  "text-teal-600",
  "text-amber-500",
  "text-primary",
];

export default function GatedTrackCards({ tracks }: { tracks: TrackCardData[] }) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track, index) => {
        const Icon = icons[index % icons.length];
        return (
          <Link
            key={track.id}
            href={track.href}
            className="group block h-full"
          >
            <div className="relative flex h-full flex-col items-center rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] md:p-10">
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-50 bg-white ${colors[index % colors.length]} shadow-sm transition-all duration-500 group-hover:scale-110`}
              >
                {track.iconImage ? (
                  <Image
                    src={track.iconImage}
                    alt={`${track.name} icon`}
                    className="h-12 w-auto rounded-lg object-cover"
                    width={400}
                    height={400}
                    loading="lazy"
                  />
                ) : (
                  <Icon className="h-7 w-7" />
                )}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-800 transition-colors group-hover:text-primary md:text-2xl">
                {track.name}
              </h3>
              <p className="mb-8 text-sm font-light leading-relaxed text-slate-500 md:text-base">
                Master {track.name.toLowerCase()} fundamentals with our verified
                curriculum of {track.levels} roadmap steps.
              </p>
              <div className="mt-auto flex w-full items-center justify-center gap-3 border-t border-slate-50 pt-6">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors group-hover:text-primary">
                  Explore Roadmap
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
