"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Flame,
  GraduationCap,
} from "lucide-react";
import DashboardProfileAvatar from "./dashboard-profile-avatar";
import DashboardLiveStatsSync, {
  type LiveDashboardStats,
} from "./dashboard-live-stats-sync";
import type { DashboardModel } from "@/lib/dashboard/dashboard-model";

const statIcons = {
  learn: GraduationCap,
  practice: Code2,
  jobs: Briefcase,
};

const statColors = {
  learn: "border-sky-100 bg-sky-50 text-sky-600",
  practice: "border-blue-100 bg-blue-50 text-blue-600",
  jobs: "border-cyan-100 bg-cyan-50 text-cyan-600",
};

type Props = {
  model: DashboardModel;
};

export default function DashboardHome({ model }: Props) {
  const firstName = model.displayName.split(" ")[0];
  const [liveStats, setLiveStats] = useState<LiveDashboardStats | null>(null);

  const handleLiveStats = useCallback((stats: LiveDashboardStats) => {
    setLiveStats(stats);
  }, []);

  const statTiles = model.statTiles.map((tile) => {
    if (!liveStats) return tile;
    if (tile.label === "Learn") return { ...tile, value: liveStats.learnLabel };
    if (tile.label === "Coding Practices") {
      return { ...tile, value: liveStats.codingPracticesLabel };
    }
    return tile;
  });

  const profileStats = model.profileStats.map((stat) => {
    if (!liveStats) return stat;
    if (stat.label === "Points") return { ...stat, value: String(liveStats.points) };
    if (stat.label === "Problems Solved") {
      return { ...stat, value: String(liveStats.problemsSolved) };
    }
    if (stat.label === "Solutions Submitted") {
      return { ...stat, value: String(liveStats.solutionsSubmitted) };
    }
    if (stat.label === "Levels Completed") {
      return { ...stat, value: String(liveStats.levelsCompleted) };
    }
    return stat;
  });

  const progressCards = model.progressCards.map((card) => {
    if (!liveStats || card.title !== "Practice Problems") return card;
    return { ...card, subtitle: liveStats.practiceSubtitle };
  });

  const problemsSolvedCount = liveStats?.problemsSolved ?? model.userSolvedQuestions;
  const currentStreak = liveStats?.currentStreak ?? model.currentStreak;
  const bestStreak = liveStats?.bestStreak ?? model.bestStreak;

  return (
    <>
      <DashboardLiveStatsSync onUpdate={handleLiveStats} />
      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
      {/* Main column */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Welcome banner */}
        <div className="relative min-h-[140px] overflow-hidden rounded-2xl bg-gradient-to-r from-sky-100 via-blue-50 to-primary/10 px-6 py-12 sm:min-h-[160px] sm:px-8 sm:py-14">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl font-bold text-secondary sm:text-3xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 text-sm text-secondary/70 sm:text-base">{model.welcomeSubtitle}</p>
          </div>
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primary/10 sm:h-40 sm:w-40" />
          <div className="pointer-events-none absolute -bottom-8 right-16 h-24 w-24 rounded-full bg-primary/5" />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statTiles
            .filter(
              (tile): tile is typeof tile & { icon: keyof typeof statIcons } =>
                tile.icon in statIcons,
            )
            .map((tile) => {
            const Icon = statIcons[tile.icon];
            return (
              <div
                key={tile.label}
                className={`rounded-xl border bg-white p-4 ${statColors[tile.icon]}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                    {tile.label}
                  </span>
                </div>
                <p className="text-xl font-bold text-secondary">{tile.value}</p>
              </div>
            );
          })}
        </div>

        {/* Track progress */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-secondary">Track your Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {progressCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`group relative overflow-hidden rounded-xl p-5 transition hover:shadow-md ${card.surfaceClass}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest ${card.labelClass}`}>
                  {card.label}
                </span>
                <h3 className="mt-1 text-lg font-bold text-secondary">{card.title}</h3>
                <p className="mt-2 text-sm text-secondary/65">{card.subtitle}</p>
                <ArrowRight className="absolute bottom-4 right-4 h-5 w-5 text-secondary/35 transition group-hover:translate-x-1 group-hover:text-secondary/60" />
              </Link>
            ))}
          </div>
        </section>

        {/* Quick explore */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-secondary">Explore More</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {model.exploreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-primary/15 bg-white p-4 transition hover:border-primary/30 hover:shadow-sm"
              >
                <h3 className="font-semibold text-secondary group-hover:text-primary">{item.title}</h3>
                <p className="mt-1 text-xs text-secondary/60">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Right profile column */}
      <aside className="w-full shrink-0 space-y-4 lg:w-72">
        {/* Profile card */}
        <div className="overflow-hidden rounded-xl border border-primary/15 bg-white">
          <div className="bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 px-5 pb-5 pt-5">
            <DashboardProfileAvatar
              name={model.displayName}
              email={model.email}
              initialAvatarUrls={model.avatarUrls}
            />
            <div className="mt-4 text-center">
              <h3 className="font-bold text-secondary">{model.displayName}</h3>
              <p className="mt-0.5 text-xs text-secondary/60">{model.email}</p>
            </div>
          </div>
          <div className="space-y-2 px-5 py-4">
            {profileStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-sm">
                <span className="text-secondary/60">{stat.label}</span>
                <span className="font-semibold text-secondary">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak cards */}
        <div className="rounded-xl border border-primary/15 bg-white p-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-secondary">Daily Streak</h4>
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary">
            {currentStreak === 0 ? "0-day streak" : `${currentStreak}-day streak`}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-secondary/50">
            {currentStreak === 0
              ? "You missed a day — visit daily to rebuild your streak."
              : currentStreak >= 7
                ? "Great job! Keep it up!"
                : `${Math.max(0, 7 - currentStreak)} days to weekly goal`}
          </p>
        </div>

        <div className="rounded-xl border border-primary/15 bg-white p-5">
          <h4 className="font-semibold text-secondary">Best Streak</h4>
          <p className="mt-1 text-xl font-bold text-primary">{bestStreak} days</p>
        </div>

        <div className="rounded-xl border border-primary/15 bg-white p-5">
          <h4 className="font-semibold text-secondary">Problems Solved</h4>
          <p className="mt-1 text-sm text-secondary/60">
            {problemsSolvedCount > 0
              ? `${problemsSolvedCount} problems solved`
              : "Start practicing to build your progress"}
          </p>
        </div>
      </aside>
    </div>
    </>
  );
}
