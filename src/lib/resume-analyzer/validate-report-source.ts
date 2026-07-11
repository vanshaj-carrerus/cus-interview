import { finalizeResumeScores } from "@/lib/resume-analyzer/compute-ats-score";
import {
  filterMissingKeywords,
  filterProjectsInSource,
  filterStringsInSource,
  pickFirstNonEmpty,
  type DeterministicFields,
} from "@/lib/resume-analyzer/extract-deterministic";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";

const PLACEHOLDER_VALUES = new Set([
  "not found",
  "n/a",
  "na",
  "none",
  "unknown",
  "-",
  "—",
]);

function cleanField(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER_VALUES.has(trimmed.toLowerCase())) {
    return "";
  }
  return trimmed;
}

export function validateReportAgainstSource(
  report: ResumeAnalysisReport,
  sourceText: string,
  deterministic: DeterministicFields
): ResumeAnalysisReport {
  const skills = filterStringsInSource(report.candidate.skills, sourceText);
  const matchedKeywords = filterStringsInSource(
    report.matchedKeywords,
    sourceText
  );
  const missingKeywords = filterMissingKeywords(
    report.missingKeywords,
    sourceText
  );
  const projects = filterProjectsInSource(
    report.candidate.projects,
    sourceText
  );
  const certifications = filterStringsInSource(
    report.candidate.certifications,
    sourceText
  );

  const keywordMatchPercent =
    matchedKeywords.length + missingKeywords.length > 0
      ? Math.round(
          (matchedKeywords.length /
            (matchedKeywords.length + missingKeywords.length)) *
            100
        )
      : matchedKeywords.length > 0
        ? 100
        : 0;

  return finalizeResumeScores({
    ...report,
    candidate: {
      name: pickFirstNonEmpty(
        cleanField(report.candidate.name),
        deterministic.guessedName
      ),
      email: pickFirstNonEmpty(
        deterministic.email,
        cleanField(report.candidate.email)
      ),
      phone: pickFirstNonEmpty(
        deterministic.phone,
        cleanField(report.candidate.phone)
      ),
      experience: cleanField(report.candidate.experience),
      education: cleanField(report.candidate.education),
      skills,
      projects,
      certifications,
    },
    matchedKeywords,
    missingKeywords,
    keywordMatchPercent,
  });
}
