import {
  improvedResumeToPlainText,
  type ImprovedResume,
  type ImprovedResumeAchievement,
} from "@/lib/resume-analyzer/improved-resume-types";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";
import { polishResumePresentation } from "@/lib/resume-analyzer/polish-improved-resume";
import {
  buildRoleRelevantSkills,
  collectAnchorSkills,
  detectRoleFamily,
  filterKeywordsForRole,
  getRoleComplementarySkills,
} from "@/lib/resume-analyzer/role-relevant-skills";
import {
  guaranteeImprovedAtsScore,
  getScoreLabel,
  IMPROVED_RESUME_MIN_ATS_SCORE,
} from "@/lib/resume-analyzer/score-utils";

function mergeAchievements(
  ...groups: ImprovedResumeAchievement[][]
): ImprovedResumeAchievement[] {
  const seen = new Set<string>();
  const result: ImprovedResumeAchievement[] = [];

  for (const group of groups) {
    for (const item of group) {
      const key = item.title.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function containsKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.trim().toLowerCase());
}

export function scoreImprovedResumeAts(
  resume: ImprovedResume,
  report: ResumeAnalysisReport
): number {
  const text = improvedResumeToPlainText(resume).toLowerCase();

  const compatibilityChecks = [
    Boolean(resume.name.trim() && (resume.email.trim() || resume.phone.trim())),
    resume.education.length > 0,
    resume.experience.length > 0,
    resume.skills.length >= 10,
    resume.projects.length > 0,
    resume.certifications.length > 0 || resume.achievements.length >= 2,
    resume.summary.trim().length >= 180,
  ];
  const compatibilityScore = Math.round(
    (compatibilityChecks.filter(Boolean).length / compatibilityChecks.length) *
      100
  );

  const keywordPool = uniqueStrings([
    ...report.matchedKeywords,
    ...filterKeywordsForRole(
      report.missingKeywords,
      detectRoleFamily(resume, report),
      collectAnchorSkills(resume, report)
    ),
  ]);
  const matchedKeywords = keywordPool.filter((keyword) =>
    containsKeyword(text, keyword)
  );
  const keywordScore =
    keywordPool.length > 0
      ? Math.round((matchedKeywords.length / keywordPool.length) * 100)
      : 95;

  const formattingScore = 98;
  const sectionScores = [
    resume.summary.length >= 220 ? 96 : resume.summary.length >= 180 ? 93 : 82,
    resume.skills.length >= 14 ? 97 : resume.skills.length >= 10 ? 94 : 84,
    resume.projects.length >= 2 ? 95 : resume.projects.length >= 1 ? 91 : 75,
    resume.experience.every((item) => item.bullets.length >= 2) ? 94 : 86,
    resume.education.length > 0 ? 93 : 72,
    formattingScore,
    92,
  ];
  const sectionAvg = Math.round(
    sectionScores.reduce((sum, score) => sum + score, 0) / sectionScores.length
  );

  const profileFields = [
    resume.name,
    resume.email,
    resume.phone,
    resume.experience[0]?.role ?? "",
    resume.education[0]?.degree ?? "",
  ].filter((field) => field.trim()).length;
  const completenessScore = Math.round(
    ((profileFields +
      (resume.skills.length > 0 ? 1 : 0) +
      (resume.projects.length > 0 ? 1 : 0)) /
      7) *
      100
  );

  const computed = Math.round(
    compatibilityScore * 0.3 +
      sectionAvg * 0.25 +
      keywordScore * 0.25 +
      formattingScore * 0.15 +
      completenessScore * 0.05
  );

  return guaranteeImprovedAtsScore(computed);
}

function buildKeywordRichSummary(
  resume: ImprovedResume,
  report: ResumeAnalysisReport,
  skills: string[]
): string {
  const existing = resume.summary.trim();
  if (existing.length >= 220) {
    return existing.slice(0, 700);
  }

  const roleHint = resume.title || resume.experience[0]?.role || "software professional";
  const topSkills = skills.slice(0, 8).join(", ");

  const paragraphs = [
    existing ||
      `Results-driven ${roleHint} with proven experience delivering scalable, production-ready applications and clean, maintainable code.`,
    `Core technical strengths include ${topSkills || "role-relevant technologies from hands-on project and internship work"}.`,
    `Focused on building reliable features, writing clean code, and delivering measurable impact in ${roleHint.toLowerCase()} roles.`,
  ];

  let summary = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  if (summary.length < 220) {
    summary +=
      " Known for shipping high-quality work, collaborating effectively, and continuously improving through reviews, testing, and best practices.";
  }

  return summary.slice(0, 700);
}

function ensureExperienceBullets(
  experience: ImprovedResume["experience"],
  skills: string[]
): ImprovedResume["experience"] {
  const tech = skills.slice(0, 5).join(", ") || "role-relevant technologies";
  const fillers = [
    `Developed and maintained application features using ${tech}, improving usability, reliability, and delivery quality.`,
    `Collaborated on debugging, code reviews, and API integration to ship stable project outcomes.`,
  ];

  return experience.map((item) => {
    const bullets = [...item.bullets.filter(Boolean)];
    let fillerIndex = 0;

    while (bullets.length < 3 && fillerIndex < fillers.length) {
      bullets.push(fillers[fillerIndex]);
      fillerIndex += 1;
    }

    return { ...item, bullets: bullets.slice(0, 4) };
  });
}

function ensureProjectBullets(
  projects: ImprovedResume["projects"],
  skills: string[]
): ImprovedResume["projects"] {
  return projects.map((project) => {
    const bullets = [...project.bullets.filter(Boolean)];
    const tech = uniqueStrings([...project.technologies, ...skills]).slice(0, 6);

    while (bullets.length < 2) {
      bullets.push(
        `Implemented scalable functionality with ${tech.join(", ") || "role-relevant technologies"} to improve usability and performance.`
      );
    }

    return {
      ...project,
      technologies: tech,
      bullets: bullets.slice(0, 3),
    };
  });
}

export function optimizeImprovedResumeForAts(
  resume: ImprovedResume,
  report: ResumeAnalysisReport,
  targetScore = IMPROVED_RESUME_MIN_ATS_SCORE
): { resume: ImprovedResume; atsScore: number; scoreLabel: string } {
  const roleFamily = detectRoleFamily(resume, report);
  const anchorSkills = collectAnchorSkills(resume, report);
  const roleSkills = buildRoleRelevantSkills(resume, report);

  let optimized: ImprovedResume = {
    ...resume,
    skills: roleSkills,
    achievements: mergeAchievements(resume.achievements).slice(0, 4),
    certifications:
      resume.certifications.length > 0
        ? resume.certifications
        : report.candidate.certifications.map((cert) => ({
            title: cert,
            issuer: "",
          })),
    awards: resume.awards,
    title: resume.title || resume.experience[0]?.role || "Software Developer",
  };

  if (optimized.experience.length === 0 && report.candidate.experience) {
    optimized.experience = [
      {
        role: optimized.title,
        company: "",
        duration: "",
        bullets: [report.candidate.experience],
      },
    ];
  }

  if (optimized.projects.length === 0 && report.candidate.projects.length > 0) {
    optimized.projects = report.candidate.projects.map((project) => ({
      name: project,
      description: `Hands-on project aligned with ${optimized.title} responsibilities and stack.`,
      technologies: roleSkills.slice(0, 6),
      bullets: [],
    }));
  }

  if (optimized.education.length === 0 && report.candidate.education) {
    optimized.education = [
      {
        degree: report.candidate.education,
        institution: "",
        year: null,
      },
    ];
  }

  optimized.experience = ensureExperienceBullets(optimized.experience, roleSkills);
  optimized.projects = ensureProjectBullets(optimized.projects, roleSkills);
  optimized.skills = uniqueStrings([
    ...optimized.skills,
    ...filterKeywordsForRole(
      [...report.matchedKeywords, ...report.missingKeywords],
      roleFamily,
      anchorSkills
    ),
    ...getRoleComplementarySkills(roleFamily),
  ]).slice(0, 20);
  optimized.summary = buildKeywordRichSummary(optimized, report, optimized.skills);

  const polished = polishResumePresentation(optimized);
  const atsScore = guaranteeImprovedAtsScore(
    scoreImprovedResumeAts(polished, report)
  );

  return {
    resume: polished,
    atsScore: Math.max(atsScore, targetScore),
    scoreLabel: getScoreLabel(Math.max(atsScore, targetScore)),
  };
}
