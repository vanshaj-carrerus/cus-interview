import {
  COMPATIBILITY_LABELS,
  FORMATTING_LABELS,
  SECTION_SCORE_LABELS,
} from "@/lib/resume-analyzer/constants";
import { finalizeResumeScores } from "@/lib/resume-analyzer/compute-ats-score";
import type {
  RawAiResumeAnalysis,
  ResumeAnalysisReport,
} from "@/lib/resume-analyzer/types";

function clampScore(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function clampCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const lower = trimmed.toLowerCase();
  if (
    lower === "not found" ||
    lower === "n/a" ||
    lower === "none" ||
    lower === "unknown"
  ) {
    return fallback;
  }
  return trimmed;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mergeChecklist(
  labels: readonly string[],
  items: { label: string; passed: boolean }[] | undefined
): { label: string; passed: boolean }[] {
  const map = new Map<string, boolean>();
  for (const item of items ?? []) {
    if (typeof item?.label === "string") {
      map.set(item.label.trim().toLowerCase(), Boolean(item.passed));
    }
  }
  return labels.map((label) => ({
    label,
    passed: map.get(label.toLowerCase()) ?? false,
  }));
}

function mergeSectionScores(
  items: { label: string; score: number }[] | undefined
): { label: string; score: number }[] {
  const map = new Map<string, number>();
  for (const item of items ?? []) {
    if (typeof item?.label === "string") {
      map.set(item.label.trim().toLowerCase(), clampScore(item.score));
    }
  }
  return SECTION_SCORE_LABELS.map((label) => ({
    label,
    score: map.get(label.toLowerCase()) ?? 0,
  }));
}

export function normalizeResumeReport(
  raw: Partial<RawAiResumeAnalysis>
): ResumeAnalysisReport {
  const atsScore = clampScore(raw.atsScore);
  const candidate = (raw.candidate ?? {}) as Partial<
    ResumeAnalysisReport["candidate"]
  >;

  const report: ResumeAnalysisReport = {
    atsScore,
    scoreLabel: "",
    interviewSuccess: clampScore(raw.interviewSuccess, atsScore),
    candidate: {
      name: asString(candidate.name),
      email: asString(candidate.email),
      phone: asString(candidate.phone),
      experience: asString(candidate.experience),
      education: asString(candidate.education),
      skills: asStringArray(candidate.skills),
      projects: asStringArray(candidate.projects),
      certifications: asStringArray(candidate.certifications),
    },
    compatibility: mergeChecklist(COMPATIBILITY_LABELS, raw.compatibility),
    matchedKeywords: asStringArray(raw.matchedKeywords),
    missingKeywords: asStringArray(raw.missingKeywords),
    keywordMatchPercent: clampScore(raw.keywordMatchPercent),
    formatting: mergeChecklist(FORMATTING_LABELS, raw.formatting),
    grammar: {
      grammarMistakes: clampCount(raw.grammar?.grammarMistakes),
      spellingMistakes: clampCount(raw.grammar?.spellingMistakes),
      repeatedWords: clampCount(raw.grammar?.repeatedWords),
      weakActionVerbs: clampCount(raw.grammar?.weakActionVerbs),
      longSentences: clampCount(raw.grammar?.longSentences),
      passiveVoice: clampCount(raw.grammar?.passiveVoice),
    },
    suggestions: asStringArray(raw.suggestions),
    sectionScores: mergeSectionScores(raw.sectionScores),
    strengths: asStringArray(raw.strengths),
    improvements: asStringArray(raw.improvements),
    recommendation: asString(
      raw.recommendation,
      "Upload a clearer resume or add missing sections to improve ATS compatibility."
    ),
  };

  return finalizeResumeScores(report);
}
