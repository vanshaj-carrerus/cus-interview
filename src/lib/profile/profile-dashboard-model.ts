import type { PublicUser } from "@/types/auth";
import type { UserLearningActivityRollup } from "@/lib/learning/service";
import type { LanguageProgressDto, TrackProgressDto } from "@/types/learning/progress";
import type { UserLearningProfile } from "@/types/profile";

export type HeatmapDay = { dateKey: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type DailyAttemptDay = {
  dateKey: string;
  weekdayLabel: string;
  attempts: number;
};

export type ProfileLevelRow = {
  levelNumber: number;
  practiceDays: number;
  correctAnswers: number;
  completed: boolean;
};

export type ProfileTrackRow = {
  trackSlug: string;
  titleLabel: string;
  completedLevels: number;
  totalLevels: number;
  attempts: number;
  cleared: number;
  levels: ProfileLevelRow[];
};

export type ProfileLanguageRow = {
  languageSlug: string;
  attempts: number;
  cleared: number;
  tracks: ProfileTrackRow[];
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
  dailyAttemptDays: DailyAttemptDay[];
  heatmap: {
    year: number;
    /** Sum of daily “distinct levels practiced” counts in the calendar year (UTC). */
    levelPracticeDaysYear: number;
    activeDaysYear: number;
    maxStreakDays: number;
    weeks: HeatmapDay[][];
  };
  donutQuestionShare: { arcPct: number; centerValue: string; caption: string };
  donutCorrect: { arcPct: number; centerValue: string; caption: string };
  languages: ProfileLanguageRow[];
  trackBars: { label: string; cleared: number; maxCleared: number }[];
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
      col.push({ dateKey: key, count: n, level: levelFromCount(n) });
    }
    grid.push(col);
  }
  return grid;
}

function lastNDailyAttemptDays(byDay: Map<string, number>, n: number): DailyAttemptDay[] {
  const days: DailyAttemptDay[] = [];
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setUTCDate(x.getUTCDate() - i);
    const key = x.toISOString().slice(0, 10);
    days.push({
      dateKey: key,
      weekdayLabel: x.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      attempts: byDay.get(key) ?? 0,
    });
  }
  return days;
}

function formatTrackLabel(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mapTrack(t: TrackProgressDto): ProfileTrackRow {
  const levels = (t.levels ?? [])
    .filter((lv) => lv.attempts > 0 || lv.cleared > 0 || lv.completed)
    .sort((a, b) => a.levelNumber - b.levelNumber)
    .map((lv) => ({
      levelNumber: lv.levelNumber,
      practiceDays: lv.attempts,
      correctAnswers: lv.cleared,
      completed: lv.completed,
    }));
  return {
    trackSlug: t.trackSlug,
    titleLabel: formatTrackLabel(t.trackSlug),
    completedLevels: t.completedLevels,
    totalLevels: t.totalLevels,
    attempts: t.attempts,
    cleared: t.cleared,
    levels,
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
  let levelPracticeDaysYear = 0;
  let activeDaysYear = 0;
  for (const [key, count] of byDay) {
    if (!key.startsWith(yearPrefix)) continue;
    levelPracticeDaysYear += count;
    if (count > 0) activeDaysYear += 1;
  }

  const heatmapColumns = 24;
  const weeks = buildCompactHeatmap(byDay, heatmapColumns);

  const dailyAttemptDays = lastNDailyAttemptDays(byDay, 7);

  const microSubmissions = totals.totalQuestionsAttempted + totals.totalTasksAttempted;
  const correctPct =
    microSubmissions > 0 ? Math.min(100, Math.round((totals.totalCleared / microSubmissions) * 100)) : 0;
  const questionSharePct =
    microSubmissions > 0
      ? Math.min(100, Math.round((totals.totalQuestionsAttempted / microSubmissions) * 100))
      : 0;

  const statTiles: { label: string; value: string }[] = [
    { label: "Level practice days", value: String(totals.totalAttempts) },
    { label: "Correct answers", value: String(totals.totalCleared) },
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
    dailyAttemptDays,
    heatmap: {
      year,
      levelPracticeDaysYear,
      activeDaysYear,
      maxStreakDays,
      weeks,
    },
    donutQuestionShare: {
      arcPct: questionSharePct,
      centerValue: String(totals.totalQuestionsAttempted),
      caption: "% of submissions on questions (vs tasks)",
    },
    donutCorrect: {
      arcPct: correctPct,
      centerValue: `${correctPct}%`,
      caption: "% of submissions marked correct",
    },
    languages,
    trackBars,
  };
}
