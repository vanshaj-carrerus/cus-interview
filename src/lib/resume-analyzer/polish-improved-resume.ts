import type { ImprovedResume } from "@/lib/resume-analyzer/improved-resume-types";

/** Light presentation cleanup — do not weaken or replace real content. */
export function polishResumePresentation(resume: ImprovedResume): ImprovedResume {
  return {
    ...resume,
    name: resume.name.trim(),
    title: resume.title.trim() || "Software Developer",
    summary: resume.summary.trim(),
    skills: resume.skills.filter(Boolean).slice(0, 22),
    experience: resume.experience.map((item) => ({
      ...item,
      role: item.role.trim(),
      company: item.company.trim(),
      duration: item.duration.trim(),
      bullets: item.bullets.map((b) => b.trim()).filter(Boolean).slice(0, 4),
    })),
    projects: resume.projects.map((project) => ({
      ...project,
      name: project.name.trim(),
      description: project.description.trim(),
      technologies: project.technologies.filter(Boolean).slice(0, 8),
      bullets: project.bullets.map((b) => b.trim()).filter(Boolean).slice(0, 3),
    })),
    achievements: resume.achievements
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.title),
    awards: resume.awards.map((a) => a.trim()).filter(Boolean).slice(0, 3),
  };
}
