import type { PublicUser } from "@/types/auth";
import type { UserLearningActivityRollup } from "@/lib/learning/service";
import type {
  LanguageProgressDto,
  LearningAttemptDto,
  TrackProgressDto,
} from "@/types/learning/progress";
import type { UserLearningProfile } from "@/types/profile";

export type HeatmapDay = { dateKey: string; level: 0 | 1 | 2 | 3 | 4 };

export type ProfileTrackRow = {
  trackSlug: string;
  titleLabel: string;
  completedLevels: number;
  totalLevels: number;
  attempts: number;
  cleared: number;
};

export type ProfileLanguageRow = {
  languageSlug: string;
  attempts: number;
  cleared: number;
  tracks: ProfileTrackRow[];
};

export type ProfileRecentAttemptRow = {
  attemptedAtIso: string;
  attemptedAtLabel: string;
  entityType: string;
  outcome: string;
  levelNumber: number;
  isCorrect: boolean;
};

export type ProfileDashboardModel = {
  user: {
    displayName: string;
    email: string;
    role: "User" | "SuperAdmin";
    accountCreatedLabel: string;
    accountUpdatedLabel: string | null;
  };
  lastActiveAtLabel: string | null;
  statTiles: { label: string; value: string }[];
  weekLabels: string[];
  dailyAttempts: number[];
  heatmap: {
    year: number;
    submissionsYear: number;
    activeDaysYear: number;
    maxStreakDays: number;
    weeks: HeatmapDay[][];
  };
  donutQuestionShare: { arcPct: number; centerValue: string; caption: string };
  donutCorrect: { arcPct: number; centerValue: string; caption: string };
  languages: ProfileLanguageRow[];
  trackBars: { label: string; cleared: number; maxCleared: number }[];
  recentAttempts: ProfileRecentAttemptRow[];
};

function formatDateLabel(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function dayMapFromRollup(rollup: UserLearningActivityRollup): Map<string, number> {
  const m = new Map<string, number>();
  for (const row of rollup.dayCounts) {
    m.set(row.dateKey, row.count);
  }
  return m;
}

function maxConsecutiveStreak(dayKeys: string[]): number {
  if (dayKeys.length === 0) return 0;
  const sorted = [...new Set(dayKeys)].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T12:00:00Z").getTime();
    const cur = new Date(sorted[i] + "T12:00:00Z").getTime();
    const dayMs = 86400000;
    if (cur - prev === dayMs) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  return best;
}

function streakConsecutive(dayKeys: Set<string>): number {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  if (!dayKeys.has(d.toISOString().slice(0, 10))) {
    d.setUTCDate(d.getUTCDate() - 1);
  }
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const key = d.toISOString().slice(0, 10);
    if (!dayKeys.has(key)) break;
    n += 1;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}

function levelFromCount(n: number): 0 | 1 | 2 | 3 | 4 {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  return 4;
}

function buildCompactHeatmap(byDay: Map<string, number>, columns: number): HeatmapDay[][] {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const grid: HeatmapDay[][] = [];
  for (let c = 0; c < columns; c++) {
    const col: HeatmapDay[] = [];
    for (let r = 0; r < 7; r++) {
      const daysBackFromEnd = (columns - 1 - c) * 7 + (6 - r);
      const d = new Date(end);
      d.setUTCDate(d.getUTCDate() - daysBackFromEnd);
      const key = d.toISOString().slice(0, 10);
      const n = byDay.get(key) ?? 0;
      col.push({ dateKey: key, level: levelFromCount(n) });
    }
    grid.push(col);
  }
  return grid;
}

function lastNDaysCounts(byDay: Map<string, number>, n: number): { labels: string[]; counts: number[] } {
  const labels: string[] = [];
  const counts: number[] = [];
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setUTCDate(x.getUTCDate() - i);
    const key = x.toISOString().slice(0, 10);
    counts.push(byDay.get(key) ?? 0);
    labels.push(
      x.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })
    );
  }
  return { labels, counts };
}

function formatTrackLabel(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mapTrack(t: TrackProgressDto): ProfileTrackRow {
  return {
    trackSlug: t.trackSlug,
    titleLabel: formatTrackLabel(t.trackSlug),
    completedLevels: t.completedLevels,
    totalLevels: t.totalLevels,
    attempts: t.attempts,
    cleared: t.cleared,
  };
}

function mapLanguage(lang: LanguageProgressDto): ProfileLanguageRow {
  return {
    languageSlug: lang.languageSlug,
    attempts: lang.attempts,
    cleared: lang.cleared,
    tracks: lang.tracks.map(mapTrack),
  };
}

function mapRecent(a: LearningAttemptDto): ProfileRecentAttemptRow {
  const d = new Date(a.attemptedAt);
  const attemptedAtLabel = Number.isNaN(d.getTime())
    ? a.attemptedAt
    : `${d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" })} UTC`;
  return {
    attemptedAtIso: a.attemptedAt,
    attemptedAtLabel,
    entityType: a.entityType,
    outcome: a.outcome,
    levelNumber: a.levelNumber,
    isCorrect: a.isCorrect,
  };
}

export function buildProfileDashboardModel(
  user: PublicUser,
  profile: UserLearningProfile,
  rollup: UserLearningActivityRollup,
  accountUpdatedAtIso: string | null
): ProfileDashboardModel {
  const displayName = user.name?.trim() || user.email.split("@")[0] || "Member";
  const totals = profile.totals;
  const byDay = dayMapFromRollup(rollup);
  const dayKeys = rollup.dayCounts.filter((d) => d.count > 0).map((d) => d.dateKey);
  const daySet = new Set(dayKeys);
  const maxStreakDays = maxConsecutiveStreak(dayKeys);
  const currentStreakDays = streakConsecutive(daySet);

  const year = new Date().getUTCFullYear();
  const yearPrefix = `${year}-`;
  let submissionsYear = 0;
  let activeDaysYear = 0;
  for (const [key, count] of byDay) {
    if (!key.startsWith(yearPrefix)) continue;
    submissionsYear += count;
    if (count > 0) activeDaysYear += 1;
  }

  const heatmapColumns = 24;
  const weeks = buildCompactHeatmap(byDay, heatmapColumns);

  const { labels: weekLabels, counts: dailyAttempts } = lastNDaysCounts(byDay, 7);

  const totalAttempts = totals.totalAttempts;
  const correctPct =
    totalAttempts > 0 ? Math.min(100, Math.round((totals.totalCleared / totalAttempts) * 100)) : 0;
  const questionSharePct =
    totalAttempts > 0
      ? Math.min(100, Math.round((totals.totalQuestionsAttempted / totalAttempts) * 100))
      : 0;

  const statTiles: { label: string; value: string }[] = [
    { label: "Total attempts", value: String(totals.totalAttempts) },
    { label: "Correct attempts", value: String(totals.totalCleared) },
    { label: "Question attempts", value: String(totals.totalQuestionsAttempted) },
    { label: "Task attempts", value: String(totals.totalTasksAttempted) },
    { label: "Levels completed", value: String(totals.totalLevelsCompleted) },
    { label: "Score awarded (sum)", value: String(rollup.totalScoreAwarded) },
    { label: "Current streak (days)", value: String(currentStreakDays) },
    { label: "Best streak (days)", value: String(maxStreakDays) },
  ];

  const languages = (profile.languages ?? []).map(mapLanguage);

  const trackScores: { label: string; cleared: number }[] = [];
  for (const lang of profile.languages ?? []) {
    for (const t of lang.tracks) {
      trackScores.push({ label: `${formatTrackLabel(lang.languageSlug)} · ${formatTrackLabel(t.trackSlug)}`, cleared: t.cleared });
    }
  }
  trackScores.sort((a, b) => b.cleared - a.cleared);
  const maxCleared = Math.max(1, ...trackScores.map((t) => t.cleared));
  const trackBars = trackScores.map((t) => ({
    label: t.label,
    cleared: t.cleared,
    maxCleared,
  }));

  return {
    user: {
      displayName,
      email: user.email,
      role: user.role,
      accountCreatedLabel: formatShortDate(user.createdAt),
      accountUpdatedLabel: accountUpdatedAtIso ? formatShortDate(accountUpdatedAtIso) : null,
    },
    lastActiveAtLabel: formatDateLabel(profile.lastActiveAt),
    statTiles,
    weekLabels,
    dailyAttempts,
    heatmap: {
      year,
      submissionsYear,
      activeDaysYear,
      maxStreakDays,
      weeks,
    },
    donutQuestionShare: {
      arcPct: questionSharePct,
      centerValue: String(totals.totalQuestionsAttempted),
      caption: "% of attempts on questions (vs tasks)",
    },
    donutCorrect: {
      arcPct: correctPct,
      centerValue: `${correctPct}%`,
      caption: "% of attempts marked correct",
    },
    languages,
    trackBars,
    recentAttempts: (profile.recentAttempts ?? []).map(mapRecent),
  };
}
