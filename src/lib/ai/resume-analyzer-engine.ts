import { runResumeAnalyzerPrompt } from "@/lib/ai/resume-analyzer-prompt";
import {
  COMPATIBILITY_LABELS,
  FORMATTING_LABELS,
  MIN_RESUME_TEXT_LENGTH,
  SECTION_SCORE_LABELS,
} from "@/lib/resume-analyzer/constants";
import {
  extractDeterministicFields,
  type DeterministicFields,
} from "@/lib/resume-analyzer/extract-deterministic";
import {
  extractResumeText,
  type ResumeFileKind,
} from "@/lib/resume-analyzer/extract-resume-text";
import { normalizeResumeReport } from "@/lib/resume-analyzer/normalize-report";
import { validateReportAgainstSource } from "@/lib/resume-analyzer/validate-report-source";
import type {
  RawAiResumeAnalysis,
  ResumeAnalysisReport,
} from "@/lib/resume-analyzer/types";

export type ExtractedResumeProfile = {
  name: string | null;
  email: string | null;
  phone: string | null;
  experience: string | null;
  education: string | null;
  skills: string[];
  projects: string[];
  certifications: string[];
};

const PROFILE_SCHEMA = `{
  "name": string | null,
  "email": string | null,
  "phone": string | null,
  "experience": string | null,
  "education": string | null,
  "skills": string[],
  "projects": string[],
  "certifications": string[]
}`;

const ANALYSIS_SCHEMA = `{
  "atsScore": number,
  "interviewSuccess": number,
  "compatibility": [{ "label": string, "passed": boolean }],
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "keywordMatchPercent": number,
  "formatting": [{ "label": string, "passed": boolean }],
  "grammar": {
    "grammarMistakes": number,
    "spellingMistakes": number,
    "repeatedWords": number,
    "weakActionVerbs": number,
    "longSentences": number,
    "passiveVoice": number
  },
  "suggestions": string[],
  "sectionScores": [{ "label": string, "score": number }],
  "strengths": string[],
  "improvements": string[],
  "recommendation": string
}`;

function buildProfilePrompt(resumeText: string): string {
  return `Extract resume profile data from the text below.

Return ONLY valid JSON matching:
${PROFILE_SCHEMA}

STRICT RULES:
- Copy exact wording from the resume. Do NOT invent or guess.
- name/email/phone: exact values from resume, or null if absent.
- experience: one brief sentence using ONLY companies/roles written in the resume.
- education: one brief sentence using ONLY schools/degrees written in the resume.
- skills: only skills/technologies explicitly written in the resume text.
- projects: only project names/titles explicitly written in the resume text.
- certifications: only certifications explicitly written in the resume text.
- If a list section is absent, return [].

RESUME TEXT:
"""
${resumeText.slice(0, 30000)}
"""`;
}

function buildAnalysisPrompt(
  resumeText: string,
  profile: ExtractedResumeProfile,
  fileKind: ResumeFileKind
): string {
  return `Analyze this resume for ATS compatibility.

Return ONLY valid JSON matching:
${ANALYSIS_SCHEMA}

STRICT RULES:
- Base every score, count, and suggestion ONLY on the resume text below.
- atsScore, interviewSuccess, keywordMatchPercent, and every sectionScores.score MUST be integers from 0 to 100 (e.g. 72 means 72%, NOT 0.72).
- Do NOT invent employers, skills, projects, metrics, or candidate details.
- matchedKeywords: keywords/skills that literally appear in the resume and fit the target role.
- missingKeywords: relevant role keywords NOT present in the resume (do not list words already in the resume).
- compatibility labels exactly: ${COMPATIBILITY_LABELS.join(", ")}
- formatting labels exactly: ${FORMATTING_LABELS.join(", ")}
- sectionScores labels exactly: ${SECTION_SCORE_LABELS.join(", ")}
- Count grammar/spelling issues from the actual resume text only.
- suggestions/strengths/improvements must reference this specific resume content.
- File type: ${fileKind.toUpperCase()}

EXTRACTED PROFILE (ground truth — do not contradict):
${JSON.stringify(profile, null, 2)}

RESUME TEXT:
"""
${resumeText.slice(0, 30000)}
"""`;
}

async function extractProfileFromText(
  resumeText: string
): Promise<ExtractedResumeProfile> {
  const { data } = await runResumeAnalyzerPrompt<ExtractedResumeProfile>(
    buildProfilePrompt(resumeText)
  );

  return {
    name: data.name?.trim() || null,
    email: data.email?.trim() || null,
    phone: data.phone?.trim() || null,
    experience: data.experience?.trim() || null,
    education: data.education?.trim() || null,
    skills: Array.isArray(data.skills)
      ? data.skills.filter((s): s is string => typeof s === "string")
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.filter((s): s is string => typeof s === "string")
      : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.filter((s): s is string => typeof s === "string")
      : [],
  };
}

function mergeProfileIntoReport(
  analysis: Partial<RawAiResumeAnalysis>,
  profile: ExtractedResumeProfile,
  deterministic: DeterministicFields
): Partial<RawAiResumeAnalysis> {
  return {
    ...analysis,
    candidate: {
      name: profile.name ?? deterministic.guessedName ?? "",
      email: profile.email ?? deterministic.email ?? "",
      phone: profile.phone ?? deterministic.phone ?? "",
      experience: profile.experience ?? "",
      education: profile.education ?? "",
      skills: profile.skills,
      projects: profile.projects,
      certifications: profile.certifications,
    },
  };
}

export async function analyzeResumeFile(
  buffer: Buffer,
  fileKind: ResumeFileKind
): Promise<{
  report: ResumeAnalysisReport;
  model: string;
  usedVision: boolean;
  extractionMethod: string;
}> {
  let resumeText: string;
  let usedVision = false;
  let extractionMethod = "unknown";

  try {
    const extracted = await extractResumeText(buffer, fileKind);
    resumeText = extracted.text;
    usedVision = extracted.usedVision;
    extractionMethod = extracted.method;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to extract text from resume.");
  }

  if (resumeText.trim().length < MIN_RESUME_TEXT_LENGTH) {
    throw new Error(
      "Resume text is too short to analyze. Please upload a complete resume file."
    );
  }

  const deterministic = extractDeterministicFields(resumeText);
  const profile = await extractProfileFromText(resumeText);

  const { data: analysis, model } = await runResumeAnalyzerPrompt<
    Omit<Partial<RawAiResumeAnalysis>, "candidate">
  >(buildAnalysisPrompt(resumeText, profile, fileKind));

  const merged = mergeProfileIntoReport(analysis, profile, deterministic);
  const normalized = normalizeResumeReport(merged);
  const report = validateReportAgainstSource(
    normalized,
    resumeText,
    deterministic
  );

  return {
    report,
    model: usedVision ? `${model}+vision-ocr` : model,
    usedVision,
    extractionMethod,
  };
}
