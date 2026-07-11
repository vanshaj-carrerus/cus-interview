import type { ImprovedResume } from "@/lib/resume-analyzer/improved-resume-types";
import { extractDeterministicFields } from "@/lib/resume-analyzer/extract-deterministic";
import {
  buildRoleRelevantSkills,
  inferJobTitle,
} from "@/lib/resume-analyzer/role-relevant-skills";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";

const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w%-./]+/gi;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w%-./]+/gi;

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

function extractLinkedIn(text: string): string | null {
  const match = text.match(LINKEDIN_REGEX)?.[0];
  return match ? match.replace(/^https?:\/\//i, "").trim() : null;
}

function extractGithub(text: string): string | null {
  const match = text.match(GITHUB_REGEX)?.[0];
  return match ? match.replace(/^https?:\/\//i, "").trim() : null;
}

function extractLocation(text: string): string | null {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  for (const line of lines.slice(0, 12)) {
    if (/@|linkedin|github|http/i.test(line)) continue;
    if (/^[A-Za-z][A-Za-z\s.'-]{2,40},\s*[A-Za-z][A-Za-z\s.'-]{2,40}$/.test(line)) {
      return line;
    }
  }
  return null;
}

function inferJobTitleFromReport(
  report: ResumeAnalysisReport,
  resumeText: string,
  resume?: ImprovedResume
): string {
  return inferJobTitle(report, resumeText, resume);
}

function buildStrongProject(
  name: string,
  skills: string[],
  index: number
): ImprovedResume["projects"][number] {
  const tech = skills.slice(index * 2, index * 2 + 6);
  const techLine = tech.length > 0 ? tech.join(", ") : "React, Node.js, MongoDB";

  return {
    name,
    description: `${name} is a production-style application built with ${techLine}, focused on scalable architecture, responsive UI, and real-world user workflows.`,
    technologies: tech.length > 0 ? tech : ["React", "Node.js", "MongoDB", "Express", "REST APIs"],
    bullets: [
      `Architected and developed ${name} using ${techLine}, delivering a responsive and maintainable full-stack solution.`,
      `Implemented secure APIs, optimized database queries, and improved application performance for a smoother user experience.`,
      `Collaborated on feature delivery with clean code practices, version control, and deployment-ready project structure.`,
    ],
  };
}

function buildStrongExperience(
  report: ResumeAnalysisReport,
  skills: string[]
): ImprovedResume["experience"] {
  if (report.candidate.experience.trim()) {
    const tech = skills.slice(0, 5).join(", ") || "modern web technologies";
    return [
      {
        role: inferJobTitleFromReport(report, report.candidate.experience),
        company: "",
        duration: "",
        bullets: [
          report.candidate.experience,
          `Developed and maintained applications using ${tech}, improving feature delivery, code quality, and product reliability.`,
          `Collaborated with cross-functional teams to ship user-focused features, debug issues, and optimize application performance.`,
        ],
      },
    ];
  }
  return [];
}

export function enrichResumeFromSource(
  resume: ImprovedResume,
  resumeText: string,
  report: ResumeAnalysisReport
): ImprovedResume {
  const deterministic = extractDeterministicFields(resumeText);
  const skills = buildRoleRelevantSkills(resume, report, resumeText);

  const projects =
    resume.projects.length > 0
      ? resume.projects.map((project, index) => ({
          ...project,
          description:
            project.description.trim() ||
            `${project.name} is a hands-on project showcasing practical development skills, clean architecture, and user-centric design.`,
          technologies:
            project.technologies.length > 0
              ? project.technologies
              : skills.slice(index * 2, index * 2 + 5),
          bullets:
            project.bullets.length >= 2
              ? project.bullets
              : buildStrongProject(project.name, skills, index).bullets,
        }))
      : report.candidate.projects.map((name, index) =>
          buildStrongProject(name, skills, index)
        );

  const experience =
    resume.experience.length > 0
      ? resume.experience.map((item) => ({
          ...item,
          role: item.role.trim() || inferJobTitleFromReport(report, resumeText, resume),
          bullets:
            item.bullets.length >= 2
              ? item.bullets
              : [
                  ...item.bullets,
                  `Built and enhanced features using ${skills.slice(0, 4).join(", ") || "modern web technologies"}, improving usability and delivery quality.`,
                  `Worked with APIs, debugging, and clean code standards to deliver reliable, interview-ready project outcomes.`,
                ].filter(Boolean),
        }))
      : buildStrongExperience(report, skills);

  const education =
    resume.education.length > 0
      ? resume.education
      : report.candidate.education
        ? [
            {
              degree: report.candidate.education,
              institution: "",
              year: null,
            },
          ]
        : [];

  const achievements =
    resume.achievements.length > 0
      ? resume.achievements
      : report.strengths.slice(0, 4).map((strength) => ({
          title: strength,
          description:
            "Delivered measurable results through strong technical execution, clean implementation, and consistent project quality.",
        }));

  const awards =
    resume.awards.length > 0
      ? resume.awards
      : /hackathon|winner|award|1st|first place/i.test(resumeText)
        ? ["Hackathon Winner"]
        : [];

  return {
    ...resume,
    name: resume.name || deterministic.guessedName || report.candidate.name,
    email: resume.email || deterministic.email || report.candidate.email,
    phone: resume.phone || deterministic.phone || report.candidate.phone,
    location: resume.location || extractLocation(resumeText),
    linkedin: resume.linkedin || extractLinkedIn(resumeText),
    github: resume.github || extractGithub(resumeText),
    title: resume.title || inferJobTitleFromReport(report, resumeText, resume),
    skills,
    projects,
    experience,
    education,
    achievements,
    awards,
  };
}
