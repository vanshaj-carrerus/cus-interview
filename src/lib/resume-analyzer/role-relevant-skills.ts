import type { ImprovedResume } from "@/lib/resume-analyzer/improved-resume-types";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";

export type RoleFamily =
  | "mern-fullstack"
  | "frontend"
  | "backend"
  | "data-science"
  | "devops"
  | "mobile"
  | "general";

const SOFT_SKILLS = [
  "communication",
  "problem solving",
  "team collaboration",
  "agile",
  "time management",
  "debugging",
  "code review",
  "version control",
  "software development life cycle",
];

const ROLE_ANCHORS: Record<RoleFamily, string[]> = {
  "mern-fullstack": [
    "javascript",
    "typescript",
    "react",
    "node",
    "nodejs",
    "node.js",
    "mongodb",
    "express",
    "mern",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "rest",
    "api",
    "jwt",
    "mongoose",
    "git",
    "github",
    "postman",
    "axios",
    "fetch",
    "crud",
    "responsive",
    "full stack",
    "full-stack",
  ],
  frontend: [
    "javascript",
    "typescript",
    "react",
    "next",
    "vue",
    "angular",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "responsive",
    "ui",
    "ux",
    "redux",
    "git",
    "github",
  ],
  backend: [
    "node",
    "nodejs",
    "node.js",
    "express",
    "java",
    "spring",
    "python",
    "django",
    "api",
    "rest",
    "sql",
    "mongodb",
    "postgresql",
    "mysql",
    "git",
    "github",
  ],
  "data-science": [
    "python",
    "pandas",
    "numpy",
    "machine learning",
    "tensorflow",
    "pytorch",
    "sql",
    "data analysis",
    "statistics",
    "scikit",
  ],
  devops: [
    "aws",
    "azure",
    "docker",
    "kubernetes",
    "ci/cd",
    "linux",
    "terraform",
    "jenkins",
    "cloud",
    "devops",
  ],
  mobile: [
    "react native",
    "flutter",
    "android",
    "ios",
    "swift",
    "kotlin",
    "mobile",
  ],
  general: ["javascript", "git", "api", "sql", "problem solving"],
};

const ROLE_COMPLEMENTARY: Record<RoleFamily, string[]> = {
  "mern-fullstack": [
    "Git",
    "GitHub",
    "REST APIs",
    "JWT Authentication",
    "Responsive Web Design",
    "API Integration",
    "Problem Solving",
    "Team Collaboration",
  ],
  frontend: [
    "Git",
    "GitHub",
    "Responsive Web Design",
    "REST APIs",
    "Problem Solving",
    "Team Collaboration",
  ],
  backend: [
    "Git",
    "GitHub",
    "REST APIs",
    "Database Design",
    "Problem Solving",
    "Team Collaboration",
  ],
  "data-science": [
    "Python",
    "SQL",
    "Data Analysis",
    "Problem Solving",
    "Team Collaboration",
  ],
  devops: [
    "Docker",
    "CI/CD",
    "Linux",
    "Cloud",
    "Problem Solving",
    "Team Collaboration",
  ],
  mobile: [
    "Git",
    "GitHub",
    "REST APIs",
    "Mobile UI",
    "Problem Solving",
    "Team Collaboration",
  ],
  general: [
    "Git",
    "GitHub",
    "REST APIs",
    "Problem Solving",
    "Team Collaboration",
  ],
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = normalize(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

export function detectRoleFamily(
  resume: ImprovedResume,
  report: ResumeAnalysisReport,
  resumeText = ""
): RoleFamily {
  const corpus = [
    resume.title,
    resume.experience.map((item) => `${item.role} ${item.company}`).join(" "),
    resume.projects
      .map((p) => `${p.name} ${p.technologies.join(" ")} ${p.description}`)
      .join(" "),
    resume.skills.join(" "),
    report.candidate.skills.join(" "),
    report.candidate.experience,
    resumeText,
  ]
    .join(" ")
    .toLowerCase();

  if (/mern|full[\s-]?stack|react.*node|node.*react|mongodb.*express/.test(corpus)) {
    return "mern-fullstack";
  }
  if (/react native|flutter|android|ios|mobile developer/.test(corpus)) {
    return "mobile";
  }
  if (/devops|kubernetes|docker|aws|azure|cloud engineer/.test(corpus)) {
    return "devops";
  }
  if (/data scientist|machine learning|ml engineer|pandas|tensorflow/.test(corpus)) {
    return "data-science";
  }
  if (/frontend|front-end|react|next\.?js|vue|angular/.test(corpus) && !/backend|node\.?js|express/.test(corpus)) {
    return "frontend";
  }
  if (/backend|back-end|node\.?js|express|django|java|spring/.test(corpus)) {
    return "backend";
  }
  return "general";
}

export function collectAnchorSkills(
  resume: ImprovedResume,
  report: ResumeAnalysisReport
): string[] {
  return uniqueStrings([
    ...resume.skills,
    ...report.candidate.skills,
    ...report.matchedKeywords,
    ...resume.projects.flatMap((project) => project.technologies),
    ...resume.experience.map((item) => item.role),
  ]);
}

function matchesAnchor(skill: string, anchors: string[]): boolean {
  const normalized = normalize(skill);
  return anchors.some((anchor) => {
    const anchorNorm = normalize(anchor);
    return (
      normalized === anchorNorm ||
      normalized.includes(anchorNorm) ||
      anchorNorm.includes(normalized)
    );
  });
}

function matchesRoleAnchor(skill: string, family: RoleFamily): boolean {
  const normalized = normalize(skill);
  return ROLE_ANCHORS[family].some(
    (anchor) => normalized.includes(anchor) || anchor.includes(normalized)
  );
}

function isSoftSkill(skill: string): boolean {
  const normalized = normalize(skill);
  return SOFT_SKILLS.some(
    (soft) => normalized.includes(soft) || soft.includes(normalized)
  );
}

export function isSkillRelevantToRole(
  skill: string,
  family: RoleFamily,
  anchorSkills: string[]
): boolean {
  const trimmed = skill.trim();
  if (!trimmed) return false;

  if (matchesAnchor(trimmed, anchorSkills)) return true;
  if (matchesRoleAnchor(trimmed, family)) return true;
  if (isSoftSkill(trimmed)) return true;

  return false;
}

export function filterSkillsForRole(
  skills: string[],
  family: RoleFamily,
  anchorSkills: string[]
): string[] {
  return uniqueStrings(skills).filter((skill) =>
    isSkillRelevantToRole(skill, family, anchorSkills)
  );
}

export function buildRoleRelevantSkills(
  resume: ImprovedResume,
  report: ResumeAnalysisReport,
  resumeText = ""
): string[] {
  const family = detectRoleFamily(resume, report, resumeText);
  const anchors = collectAnchorSkills(resume, report);
  const candidates = uniqueStrings([
    ...resume.skills,
    ...report.candidate.skills,
    ...report.matchedKeywords,
    ...getRoleComplementarySkills(family),
    ...resume.projects.flatMap((project) => project.technologies),
  ]);

  const relevantMissing = report.missingKeywords.filter((keyword) =>
    isSkillRelevantToRole(keyword, family, anchors)
  );

  return filterSkillsForRole(
    [...candidates, ...relevantMissing],
    family,
    anchors
  ).slice(0, 20);
}

export function getRoleComplementarySkills(family: RoleFamily): string[] {
  return ROLE_COMPLEMENTARY[family];
}

export function filterKeywordsForRole(
  keywords: string[],
  family: RoleFamily,
  anchorSkills: string[]
): string[] {
  return uniqueStrings(keywords).filter((keyword) =>
    isSkillRelevantToRole(keyword, family, anchorSkills)
  );
}

export function inferJobTitle(
  report: ResumeAnalysisReport,
  resumeText: string,
  resume?: ImprovedResume
): string {
  const family = resume
    ? detectRoleFamily(resume, report, resumeText)
    : detectRoleFamily(
        {
          name: "",
          title: "",
          email: "",
          phone: "",
          location: null,
          linkedin: null,
          github: null,
          summary: "",
          skills: report.candidate.skills,
          experience: [],
          projects: [],
          education: [],
          certifications: [],
          achievements: [],
          awards: [],
        },
        report,
        resumeText
      );

  switch (family) {
    case "mern-fullstack":
      return "MERN Stack Developer";
    case "frontend":
      return "Frontend Developer";
    case "backend":
      return "Backend Developer";
    case "data-science":
      return "Data Scientist";
    case "devops":
      return "DevOps Engineer";
    case "mobile":
      return "Mobile Developer";
    default:
      return "Software Developer";
  }
}
