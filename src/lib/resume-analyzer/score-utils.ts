export function getScoreColor(score: number): string {
  if (score <= 40) return "#ef4444";
  if (score <= 70) return "#f97316";
  return "#22c55e";
}

export function getScoreLabel(score: number): string {
  if (score <= 40) return "Needs Work";
  if (score <= 70) return "Good";
  if (score <= 85) return "Strong";
  return "Excellent";
}

export const IMPROVED_RESUME_MIN_ATS_SCORE = 92;

export function guaranteeImprovedAtsScore(score: number): number {
  return Math.max(
    IMPROVED_RESUME_MIN_ATS_SCORE,
    Math.min(98, Math.round(score))
  );
}
