export type ImprovedResumeExperience = {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
};

export type ImprovedResumeProject = {
  name: string;
  description: string;
  technologies: string[];
  bullets: string[];
};

export type ImprovedResumeEducation = {
  degree: string;
  institution: string;
  year: string | null;
};

export type ImprovedResumeCertification = {
  title: string;
  issuer: string;
};

export type ImprovedResumeAchievement = {
  title: string;
  description: string;
};

export type ImprovedResume = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  summary: string;
  skills: string[];
  experience: ImprovedResumeExperience[];
  projects: ImprovedResumeProject[];
  education: ImprovedResumeEducation[];
  certifications: ImprovedResumeCertification[];
  achievements: ImprovedResumeAchievement[];
  awards: string[];
};

export function getResumeInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function improvedResumeToPlainText(resume: ImprovedResume): string {
  const contact = [
    resume.email,
    resume.phone,
    resume.location,
    resume.linkedin,
    resume.github,
  ]
    .filter(Boolean)
    .join(" | ");

  const lines: string[] = [
    resume.name,
    resume.title,
    contact,
    "",
    "SUMMARY",
    resume.summary,
  ];

  if (resume.skills.length > 0) {
    lines.push("", "SKILLS", resume.skills.join(", "));
  }

  if (resume.education.length > 0) {
    lines.push("", "EDUCATION");
    for (const edu of resume.education) {
      lines.push(
        `${edu.degree}${edu.institution ? ` — ${edu.institution}` : ""}${
          edu.year ? ` (${edu.year})` : ""
        }`
      );
    }
  }

  if (resume.experience.length > 0) {
    lines.push("", "EXPERIENCE");
    for (const item of resume.experience) {
      lines.push(`${item.role} | ${item.company} | ${item.duration}`);
      for (const bullet of item.bullets) {
        lines.push(`• ${bullet}`);
      }
      lines.push("");
    }
  }

  if (resume.projects.length > 0) {
    lines.push("PROJECTS");
    for (const project of resume.projects) {
      lines.push(project.name);
      if (project.description) lines.push(project.description);
      if (project.technologies.length > 0) {
        lines.push(`Tech: ${project.technologies.join(", ")}`);
      }
      for (const bullet of project.bullets) {
        lines.push(`• ${bullet}`);
      }
      lines.push("");
    }
  }

  if (resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    for (const cert of resume.certifications) {
      lines.push(`${cert.title}${cert.issuer ? ` — ${cert.issuer}` : ""}`);
    }
  }

  if (resume.achievements.length > 0) {
    lines.push("", "KEY ACHIEVEMENTS");
    for (const item of resume.achievements) {
      lines.push(`• ${item.title}${item.description ? `: ${item.description}` : ""}`);
    }
  }

  if (resume.awards.length > 0) {
    lines.push("", "AWARDS");
    for (const award of resume.awards) {
      lines.push(`• ${award}`);
    }
  }

  return lines.join("\n").trim();
}
