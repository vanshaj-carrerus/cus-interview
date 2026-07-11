import {
  runResumeAnalyzerPrompt,
  runResumeImprovePrompt,
} from "@/lib/ai/resume-analyzer-prompt";
import { enrichResumeFromSource } from "@/lib/resume-analyzer/enrich-resume-from-source";
import {
  improvedResumeToPlainText,
  type ImprovedResume,
} from "@/lib/resume-analyzer/improved-resume-types";
import { mergeAiWithFallbackResume } from "@/lib/resume-analyzer/merge-improved-resume";
import { normalizeImprovedResume } from "@/lib/resume-analyzer/normalize-improved-resume";
import {
  optimizeImprovedResumeForAts,
  scoreImprovedResumeAts,
} from "@/lib/resume-analyzer/optimize-improved-resume";
import { polishResumePresentation } from "@/lib/resume-analyzer/polish-improved-resume";
import {
  guaranteeImprovedAtsScore,
  getScoreLabel,
} from "@/lib/resume-analyzer/score-utils";
import {
  extractResumeText,
  type ResumeFileKind,
} from "@/lib/resume-analyzer/extract-resume-text";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";

type ResumeActionResult = {
  content: string;
  model: string;
};

export type ImproveResumeResult = {
  resume: ImprovedResume;
  content: string;
  atsScore: number;
  scoreLabel: string;
  model: string;
};

const IMPROVED_RESUME_SCHEMA = `{
  "name": string,
  "title": string,
  "email": string,
  "phone": string,
  "location": string | null,
  "linkedin": string | null,
  "github": string | null,
  "summary": string,
  "skills": string[],
  "experience": [{
    "role": string,
    "company": string,
    "duration": string,
    "bullets": string[]
  }],
  "projects": [{
    "name": string,
    "description": string,
    "technologies": string[],
    "bullets": string[]
  }],
  "education": [{
    "degree": string,
    "institution": string,
    "year": string | null
  }],
  "certifications": [{ "title": string, "issuer": string }],
  "achievements": [{ "title": string, "description": string }],
  "awards": string[]
}`;

function buildImprovePrompt(
  resumeText: string,
  report: ResumeAnalysisReport
): string {
  return `You are an elite resume writer who creates premium, recruiter-ready resumes for top tech companies. Build a polished resume that looks like it was designed by a professional career coach and targets ATS 90+.

Return ONLY valid JSON matching:
${IMPROVED_RESUME_SCHEMA}

PREMIUM WRITING STYLE (CRITICAL):
- Write like a top-tier professional resume — confident, crisp, and impact-focused.
- Every bullet must start with a strong action verb and include outcome/impact where possible.
- Project descriptions must be one polished sentence explaining what the project does and why it matters.
- Summary must read like a compelling elevator pitch in 3–4 sentences (not a keyword dump).
- achievements need a short bold-style title + one clear impact sentence each.
- title must be a professional role label (e.g. "Full Stack Developer", "MERN Stack Developer").
- skills should be a clean list of 12–18 skills that are ONLY related to the candidate's target role and proven stack.
- awards: only real honors from the resume (hackathons, competitions, dean's list, etc.).

SKILLS RULES (CRITICAL):
- ONLY add skills directly related to the candidate's role, projects, internships, and education stack.
- For MERN / Full Stack roles: React, Node.js, MongoDB, Express, JavaScript, Git, REST APIs, JWT, Tailwind, etc.
- Do NOT add unrelated technologies that are not in the resume or role (e.g. no Java, Python, AWS, Flutter, DevOps tools for a MERN developer unless they appear in the source resume).
- Do NOT add random ATS keywords that do not match the candidate's actual profile.
- Every skill must be defensible from their role, projects, or experience.

CORE RULES:
- Keep every real fact from the original resume: name, contact, companies, roles, schools, degrees, dates, and project names.
- Do NOT invent fake employers, degrees, years of experience, or projects that are not supported by the source resume.
- You MAY enrich content professionally: stronger bullets, metrics-style impact lines, better summary, and role-relevant skills only.

ATS 90+ TARGET RULES (CRITICAL):
- Include matched and role-relevant missing ATS keywords naturally across summary, skills, experience bullets, and project bullets.
- Skills section must list at least 10 role-relevant technical skills — never unrelated skills.
- Professional summary must be 3–5 lines and keyword-rich for the target role.
- Every experience entry needs 2–4 strong action-verb bullets with impact metrics where reasonable.
- Every project needs 2–3 bullets plus a technologies array with 4+ items.
- Include education, skills, experience, projects, and a professional summary — all required for high ATS score.
- Add 2–4 achievements highlighting measurable outcomes from real work.
- Use ATS-safe formatting: plain section structure, standard headers, bullet points, no icons or tables.
- Prioritize keyword density without keyword stuffing — integrate terms naturally in sentences.

ENHANCEMENT RULES:
- Rewrite experience and project bullets with strong action verbs (Built, Led, Optimized, Deployed, etc.).
- Add only complementary skills that naturally pair with the candidate's proven stack (e.g. Git, REST APIs for web developers).
- Do NOT invent new projects, employers, certifications, or unrelated skills.
- certifications: use title + issuer objects. achievements: use title + one-line description objects.
- awards: include hackathons, competitions, or honors only if supported by the resume.
- If a section has no real data, return an empty array — do not write placeholder employers or degrees.

ATS ANALYSIS:
${JSON.stringify(
  {
    atsScore: report.atsScore,
    suggestions: report.suggestions,
    strengths: report.strengths,
    improvements: report.improvements,
    missingKeywords: report.missingKeywords,
    matchedKeywords: report.matchedKeywords,
    recommendation: report.recommendation,
    candidate: report.candidate,
    sectionScores: report.sectionScores,
  },
  null,
  2
)}

ORIGINAL RESUME:
"""
${resumeText.slice(0, 30000)}
"""`;
}

function buildAtsPrompt(
  resumeText: string,
  report: ResumeAnalysisReport
): string {
  return `Generate a clean ATS-optimized resume from the source resume and analysis below.

Return ONLY valid JSON:
{
  "content": string
}

RULES:
- Single-column, ATS-friendly plain text (no tables, icons, or columns).
- Standard headers: CONTACT, PROFESSIONAL SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION, CERTIFICATIONS.
- Include skills and keywords from the analysis that truthfully appear in the resume.
- Do NOT fabricate experience, employers, metrics, or credentials.
- Use concise bullet points with strong action verbs.
- Prioritize keyword density for the candidate's target role based on resume content.
- Omit empty sections instead of writing "Not found".

ATS ANALYSIS:
${JSON.stringify(
  {
    matchedKeywords: report.matchedKeywords,
    missingKeywords: report.missingKeywords,
    compatibility: report.compatibility,
    formatting: report.formatting,
    candidate: report.candidate,
    sectionScores: report.sectionScores,
  },
  null,
  2
)}

SOURCE RESUME:
"""
${resumeText.slice(0, 30000)}
"""`;
}

async function extractTextFromBuffer(
  buffer: Buffer,
  fileKind: ResumeFileKind
): Promise<string> {
  const extracted = await extractResumeText(buffer, fileKind);
  return extracted.text.trim();
}

function reportToImprovedResumeFallback(
  report: ResumeAnalysisReport
): ImprovedResume {
  const { candidate } = report;
  return normalizeImprovedResume({
    name: candidate.name,
    title: candidate.experience?.split(" ")?.slice(0, 3)?.join(" ") || "Software Developer",
    email: candidate.email,
    phone: candidate.phone,
    location: null,
    linkedin: null,
    github: null,
    summary: report.recommendation,
    skills: [...candidate.skills, ...report.matchedKeywords].filter(
      (skill, index, arr) =>
        arr.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) ===
        index
    ),
    experience: candidate.experience
      ? [
          {
            role: "Professional Experience",
            company: "",
            duration: "",
            bullets: [candidate.experience],
          },
        ]
      : [],
    projects: candidate.projects.map((project) => ({
      name: project,
      description: "",
      technologies: candidate.skills.slice(0, 4),
      bullets: [`Delivered ${project} using modern development practices.`],
    })),
    education: candidate.education
      ? [{ degree: candidate.education, institution: "", year: null }]
      : [],
    certifications: candidate.certifications.map((cert) => ({
      title: cert,
      issuer: "",
    })),
    achievements: report.strengths.slice(0, 4).map((strength) => ({
      title: strength,
      description:
        "Delivered strong results with measurable impact and high-quality engineering practices.",
    })),
    awards: [],
  });
}

function reportToResumeFallback(report: ResumeAnalysisReport): string {
  return improvedResumeToPlainText(reportToImprovedResumeFallback(report));
}

async function runResumeAction(
  prompt: string,
  fallback: string
): Promise<ResumeActionResult> {
  const { data, model } = await runResumeAnalyzerPrompt<{ content?: string }>(
    prompt
  );
  const content = data.content?.trim();

  if (!content) {
    return { content: fallback, model };
  }

  return { content, model };
}

export async function improveResumeWithAi(
  report: ResumeAnalysisReport,
  buffer?: Buffer,
  fileKind?: ResumeFileKind
): Promise<ImproveResumeResult> {
  const fallbackResume = reportToImprovedResumeFallback(report);
  const fallback = improvedResumeToPlainText(fallbackResume);
  let resumeText = fallback;

  if (buffer && fileKind) {
    try {
      resumeText = await extractTextFromBuffer(buffer, fileKind);
    } catch {
      resumeText = fallback;
    }
  }

  const { data, model } = await runResumeImprovePrompt<Partial<ImprovedResume>>(
    buildImprovePrompt(resumeText, report)
  );

  const merged = mergeAiWithFallbackResume(fallbackResume, data);
  const enriched = enrichResumeFromSource(merged, resumeText, report);
  const optimized = optimizeImprovedResumeForAts(enriched, report);
  const polished = polishResumePresentation(optimized.resume);
  const atsScore = guaranteeImprovedAtsScore(
    scoreImprovedResumeAts(polished, report)
  );

  return {
    resume: polished,
    content: improvedResumeToPlainText(polished),
    atsScore,
    scoreLabel: getScoreLabel(atsScore),
    model,
  };
}

export async function generateAtsOptimizedResume(
  report: ResumeAnalysisReport,
  buffer?: Buffer,
  fileKind?: ResumeFileKind
): Promise<ResumeActionResult> {
  const fallback = reportToResumeFallback(report);
  let resumeText = fallback;

  if (buffer && fileKind) {
    try {
      resumeText = await extractTextFromBuffer(buffer, fileKind);
    } catch {
      resumeText = fallback;
    }
  }

  return runResumeAction(buildAtsPrompt(resumeText, report), fallback);
}
