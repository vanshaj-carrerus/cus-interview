import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

/** Calendar day boundary for streaks (India). */
export const LOGIN_STREAK_TIMEZONE = "Asia/Kolkata";

export type LoginStreakSnapshot = {
  currentStreak: number;
  bestStreak: number;
  lastLoginDateKey: string | null;
};

export function loginDateKey(date = new Date(), timeZone = LOGIN_STREAK_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dayDiff(fromKey: string, toKey: string): number {
  const from = new Date(`${fromKey}T12:00:00Z`).getTime();
  const to = new Date(`${toKey}T12:00:00Z`).getTime();
  return Math.round((to - from) / 86_400_000);
}

function resolveCurrentStreak(
  lastKey: string | null,
  todayKey: string,
  previousStreak: number
): number {
  if (!lastKey) {
    return 1;
  }

  if (lastKey === todayKey) {
    return Math.max(0, previousStreak);
  }

  const gap = dayDiff(lastKey, todayKey);
  if (gap === 1) {
    return Math.max(0, previousStreak) + 1;
  }

  // Missed one or more calendar days — streak breaks to 0.
  return 0;
}

/**
 * Records a dashboard visit for today and updates login streak.
 * - First visit ever → streak 1
 * - Next consecutive day → streak + 1 (1 → 2 → 3 …)
 * - Missed a day → streak 0
 * - Same calendar day → unchanged
 */
export async function recordUserLoginStreak(userId: string): Promise<LoginStreakSnapshot> {
  await connectDB();

  const user = await User.findById(userId)
    .select({ loginStreak: 1, bestLoginStreak: 1, lastLoginDateKey: 1 })
    .lean();

  if (!user) {
    return { currentStreak: 0, bestStreak: 0, lastLoginDateKey: null };
  }

  const todayKey = loginDateKey();
  const lastKey = user.lastLoginDateKey?.trim() || null;
  const previousStreak = Math.max(0, Number(user.loginStreak ?? 0));
  const previousBest = Math.max(0, Number(user.bestLoginStreak ?? 0));

  const currentStreak = resolveCurrentStreak(lastKey, todayKey, previousStreak);
  const bestStreak = Math.max(previousBest, currentStreak);

  if (lastKey !== todayKey || currentStreak !== previousStreak || bestStreak !== previousBest) {
    await User.findByIdAndUpdate(userId, {
      $set: {
        loginStreak: currentStreak,
        bestLoginStreak: bestStreak,
        lastLoginDateKey: todayKey,
      },
    });
  }

  return {
    currentStreak,
    bestStreak,
    lastLoginDateKey: todayKey,
  };
}

export async function getUserLoginStreak(userId: string): Promise<LoginStreakSnapshot> {
  await connectDB();
  const user = await User.findById(userId)
    .select({ loginStreak: 1, bestLoginStreak: 1, lastLoginDateKey: 1 })
    .lean();

  if (!user) {
    return { currentStreak: 0, bestStreak: 0, lastLoginDateKey: null };
  }

  const todayKey = loginDateKey();
  const lastKey = user.lastLoginDateKey?.trim() || null;
  const storedStreak = Math.max(0, Number(user.loginStreak ?? 0));
  const bestStreak = Math.max(0, Number(user.bestLoginStreak ?? 0));

  if (!lastKey) {
    return { currentStreak: 0, bestStreak, lastLoginDateKey: null };
  }

  if (lastKey === todayKey) {
    return { currentStreak: storedStreak, bestStreak, lastLoginDateKey: lastKey };
  }

  const gap = dayDiff(lastKey, todayKey);
  if (gap > 1) {
    return { currentStreak: 0, bestStreak, lastLoginDateKey: lastKey };
  }

  // Last visit was yesterday — streak is still active until today is missed.
  return { currentStreak: storedStreak, bestStreak, lastLoginDateKey: lastKey };
}
