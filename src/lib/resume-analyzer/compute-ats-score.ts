import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";
import { getScoreLabel } from "@/lib/resume-analyzer/score-utils";

function toNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function looksLikeDecimalScale(scores: number[]): boolean {
  const positive = scores.filter((score) => score > 0);
  if (positive.length === 0) return false;
  return positive.every((score) => score <= 1);
}

/** Normalize AI scores that may be returned as 0–1 fractions instead of 0–100. */
export function normalizePercentScore(
  value: unknown,
  peerScores: number[] = [],
  fallback = 0
): number {
  const n = toNumber(value);
  if (n === null) return fallback;

  if (n > 0 && n <= 1 && (!Number.isInteger(n) || looksLikeDecimalScale(peerScores))) {
    return Math.max(0, Math.min(100, Math.round(n * 100)));
  }

  return Math.max(0, Math.min(100, Math.round(n)));
}

function checklistPercent(items: { passed: boolean }[]): number {
  if (items.length === 0) return 0;
  const passed = items.filter((item) => item.passed).length;
  return Math.round((passed / items.length) * 100);
}

function profileCompleteness(
  candidate: ResumeAnalysisReport["candidate"]
): number {
  const filled = [
    candidate.name,
    candidate.email,
    candidate.phone,
    candidate.experience,
    candidate.education,
  ].filter((field) => field.trim()).length;

  const bonuses =
    (candidate.skills.length > 0 ? 1 : 0) +
    (candidate.projects.length > 0 ? 1 : 0);

  return Math.round(((filled + bonuses) / 7) * 100);
}

/** Derive ATS score from validated resume signals instead of trusting raw AI output alone. */
export function computeAtsScore(
  report: Pick<
    ResumeAnalysisReport,
    | "atsScore"
    | "compatibility"
    | "formatting"
    | "sectionScores"
    | "keywordMatchPercent"
    | "candidate"
  >
): number {
  const compatibilityScore = checklistPercent(report.compatibility);
  const formattingScore = checklistPercent(report.formatting);
  const sectionAvg =
    report.sectionScores.length > 0
      ? Math.round(
          report.sectionScores.reduce((sum, section) => sum + section.score, 0) /
            report.sectionScores.length
        )
      : 0;
  const keywordScore = report.keywordMatchPercent;
  const completenessScore = profileCompleteness(report.candidate);

  const computed = Math.round(
    compatibilityScore * 0.3 +
      sectionAvg * 0.25 +
      keywordScore * 0.2 +
      formattingScore * 0.15 +
      completenessScore * 0.1
  );

  const aiScore = report.atsScore;
  if (aiScore >= 15) {
    return Math.round(computed * 0.5 + aiScore * 0.5);
  }

  if (aiScore > 0 && aiScore < 15) {
    const scaledAi = aiScore <= 1 ? Math.round(aiScore * 100) : aiScore;
    if (scaledAi >= 15) {
      return Math.round(computed * 0.5 + scaledAi * 0.5);
    }
  }

  return Math.max(0, Math.min(100, computed));
}

export function finalizeResumeScores(
  report: ResumeAnalysisReport
): ResumeAnalysisReport {
  const peerScores = [
    report.atsScore,
    report.interviewSuccess,
    report.keywordMatchPercent,
    ...report.sectionScores.map((section) => section.score),
  ]
    .map((value) => toNumber(value))
    .filter((value): value is number => value !== null);

  const sectionScores = report.sectionScores.map((section) => ({
    ...section,
    score: normalizePercentScore(section.score, peerScores),
  }));

  const keywordMatchPercent = normalizePercentScore(
    report.keywordMatchPercent,
    peerScores
  );

  const normalizedAiScore = normalizePercentScore(report.atsScore, peerScores);
  const normalizedInterview = normalizePercentScore(
    report.interviewSuccess,
    peerScores,
    normalizedAiScore
  );

  const interim: ResumeAnalysisReport = {
    ...report,
    sectionScores,
    keywordMatchPercent,
    atsScore: normalizedAiScore,
    interviewSuccess: normalizedInterview,
    scoreLabel: report.scoreLabel,
  };

  const atsScore = computeAtsScore(interim);
  const interviewSuccess =
    normalizedInterview >= 15
      ? Math.round(normalizedInterview * 0.35 + atsScore * 0.65)
      : Math.round(atsScore * 0.92);

  return {
    ...interim,
    atsScore,
    interviewSuccess: Math.max(0, Math.min(100, interviewSuccess)),
    scoreLabel: getScoreLabel(atsScore),
  };
}
