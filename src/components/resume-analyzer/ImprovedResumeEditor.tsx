"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  ImprovedResume,
  ImprovedResumeAchievement,
  ImprovedResumeCertification,
  ImprovedResumeEducation,
  ImprovedResumeExperience,
  ImprovedResumeProject,
} from "@/lib/resume-analyzer/improved-resume-types";

type ImprovedResumeEditorProps = {
  resume: ImprovedResume;
  onChange: (resume: ImprovedResume) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00bcfe] focus:ring-2 focus:ring-[#00bcfe]/20"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-[#00bcfe] focus:ring-2 focus:ring-[#00bcfe]/20"
    />
  );
}

function SectionCard({
  title,
  onAdd,
  addLabel,
  children,
}: {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#00bcfe]/30 bg-[#00bcfe]/10 px-3 py-1.5 text-xs font-semibold text-[#00bcfe] transition hover:bg-[#00bcfe]/15"
          >
            <Plus className="h-3.5 w-3.5" />
            {addLabel ?? "Add"}
          </button>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ItemCard({
  title,
  onDelete,
  children,
}: {
  title: string;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
      {children}
    </div>
  );
}

function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>Bullet Points</FieldLabel>
      {bullets.map((bullet, index) => (
        <div key={`bullet-${index}`} className="flex gap-2">
          <TextInput
            value={bullet}
            onChange={(value) => {
              const next = [...bullets];
              next[index] = value;
              onChange(next);
            }}
            placeholder="Achievement or responsibility"
          />
          <button
            type="button"
            onClick={() => onChange(bullets.filter((_, i) => i !== index))}
            className="shrink-0 rounded-xl border border-slate-200 px-3 text-slate-400 transition hover:border-red-200 hover:text-red-500"
            aria-label="Delete bullet"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...bullets, ""])}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00bcfe] transition hover:underline"
      >
        <Plus className="h-3.5 w-3.5" />
        Add bullet
      </button>
    </div>
  );
}

function AddTagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Add skill"
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00bcfe] focus:ring-2 focus:ring-[#00bcfe]/20"
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        if (!value) return;
        if (!tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
          onChange([...tags, value]);
        }
        e.currentTarget.value = "";
      }}
    />
  );
}

export default function ImprovedResumeEditor({
  resume,
  onChange,
}: ImprovedResumeEditorProps) {
  function update<K extends keyof ImprovedResume>(key: K, value: ImprovedResume[K]) {
    onChange({ ...resume, [key]: value });
  }

  function updateExperience(index: number, item: ImprovedResumeExperience) {
    const next = [...resume.experience];
    next[index] = item;
    update("experience", next);
  }

  function updateProject(index: number, item: ImprovedResumeProject) {
    const next = [...resume.projects];
    next[index] = item;
    update("projects", next);
  }

  function updateEducation(index: number, item: ImprovedResumeEducation) {
    const next = [...resume.education];
    next[index] = item;
    update("education", next);
  }

  function updateCertification(index: number, item: ImprovedResumeCertification) {
    const next = [...resume.certifications];
    next[index] = item;
    update("certifications", next);
  }

  function updateAchievement(index: number, item: ImprovedResumeAchievement) {
    const next = [...resume.achievements];
    next[index] = item;
    update("achievements", next);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-4">
      <SectionCard title="Contact & Header">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <TextInput
              value={resume.name}
              onChange={(name) => update("name", name)}
              placeholder="Your name"
            />
          </div>
          <div>
            <FieldLabel>Job Title</FieldLabel>
            <TextInput
              value={resume.title}
              onChange={(title) => update("title", title)}
              placeholder="Full Stack Developer"
            />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput
              value={resume.email}
              onChange={(email) => update("email", email)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <TextInput
              value={resume.phone}
              onChange={(phone) => update("phone", phone)}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <TextInput
              value={resume.location ?? ""}
              onChange={(location) => update("location", location || null)}
              placeholder="City, Country"
            />
          </div>
          <div>
            <FieldLabel>LinkedIn</FieldLabel>
            <TextInput
              value={resume.linkedin ?? ""}
              onChange={(linkedin) => update("linkedin", linkedin || null)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>GitHub</FieldLabel>
            <TextInput
              value={resume.github ?? ""}
              onChange={(github) => update("github", github || null)}
              placeholder="github.com/username"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Professional Summary">
        <TextArea
          value={resume.summary}
          onChange={(summary) => update("summary", summary)}
          placeholder="Write a compelling professional summary..."
          rows={5}
        />
      </SectionCard>

      <SectionCard
        title="Skills"
        onAdd={() => update("skills", [...resume.skills, ""])}
        addLabel="Add skill"
      >
        <div className="space-y-2">
          {resume.skills.map((skill, index) => (
            <div key={`skill-${index}`} className="flex gap-2">
              <TextInput
                value={skill}
                onChange={(value) => {
                  const next = [...resume.skills];
                  next[index] = value;
                  update("skills", next);
                }}
                placeholder="React, Node.js, MongoDB..."
              />
              <button
                type="button"
                onClick={() =>
                  update(
                    "skills",
                    resume.skills.filter((_, i) => i !== index)
                  )
                }
                className="shrink-0 rounded-xl border border-slate-200 px-3 text-slate-400 transition hover:border-red-200 hover:text-red-500"
                aria-label="Delete skill"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <AddTagInput
          tags={resume.skills}
          onChange={(skills) => update("skills", skills)}
        />
      </SectionCard>

      <SectionCard
        title="Experience"
        onAdd={() =>
          update("experience", [
            ...resume.experience,
            { role: "", company: "", duration: "", bullets: [""] },
          ])
        }
        addLabel="Add experience"
      >
        {resume.experience.length === 0 ? (
          <p className="text-sm text-slate-400">No experience added yet.</p>
        ) : null}
        {resume.experience.map((item, index) => (
          <ItemCard
            key={`exp-${index}`}
            title={`Experience ${index + 1}`}
            onDelete={() =>
              update(
                "experience",
                resume.experience.filter((_, i) => i !== index)
              )
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Role</FieldLabel>
                <TextInput
                  value={item.role}
                  onChange={(role) => updateExperience(index, { ...item, role })}
                  placeholder="Software Developer"
                />
              </div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <TextInput
                  value={item.company}
                  onChange={(company) =>
                    updateExperience(index, { ...item, company })
                  }
                  placeholder="Company name"
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Duration</FieldLabel>
                <TextInput
                  value={item.duration}
                  onChange={(duration) =>
                    updateExperience(index, { ...item, duration })
                  }
                  placeholder="Jan 2023 – Present"
                />
              </div>
            </div>
            <div className="mt-3">
              <BulletEditor
                bullets={item.bullets}
                onChange={(bullets) =>
                  updateExperience(index, { ...item, bullets })
                }
              />
            </div>
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Projects"
        onAdd={() =>
          update("projects", [
            ...resume.projects,
            {
              name: "",
              description: "",
              technologies: [],
              bullets: [""],
            },
          ])
        }
        addLabel="Add project"
      >
        {resume.projects.length === 0 ? (
          <p className="text-sm text-slate-400">No projects added yet.</p>
        ) : null}
        {resume.projects.map((project, index) => (
          <ItemCard
            key={`project-${index}`}
            title={`Project ${index + 1}`}
            onDelete={() =>
              update(
                "projects",
                resume.projects.filter((_, i) => i !== index)
              )
            }
          >
            <div className="space-y-3">
              <div>
                <FieldLabel>Project Name</FieldLabel>
                <TextInput
                  value={project.name}
                  onChange={(name) => updateProject(index, { ...project, name })}
                  placeholder="E-commerce App"
                />
              </div>
              <div>
                <FieldLabel>Description</FieldLabel>
                <TextArea
                  value={project.description}
                  onChange={(description) =>
                    updateProject(index, { ...project, description })
                  }
                  placeholder="Short project overview"
                  rows={3}
                />
              </div>
              <div>
                <FieldLabel>Technologies (comma separated)</FieldLabel>
                <TextInput
                  value={project.technologies.join(", ")}
                  onChange={(value) =>
                    updateProject(index, {
                      ...project,
                      technologies: value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <BulletEditor
                bullets={project.bullets}
                onChange={(bullets) =>
                  updateProject(index, { ...project, bullets })
                }
              />
            </div>
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Education"
        onAdd={() =>
          update("education", [
            ...resume.education,
            { degree: "", institution: "", year: null },
          ])
        }
        addLabel="Add education"
      >
        {resume.education.map((edu, index) => (
          <ItemCard
            key={`edu-${index}`}
            title={`Education ${index + 1}`}
            onDelete={() =>
              update(
                "education",
                resume.education.filter((_, i) => i !== index)
              )
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Degree</FieldLabel>
                <TextInput
                  value={edu.degree}
                  onChange={(degree) => updateEducation(index, { ...edu, degree })}
                  placeholder="B.Tech Computer Science"
                />
              </div>
              <div>
                <FieldLabel>Institution</FieldLabel>
                <TextInput
                  value={edu.institution}
                  onChange={(institution) =>
                    updateEducation(index, { ...edu, institution })
                  }
                  placeholder="University name"
                />
              </div>
              <div>
                <FieldLabel>Year</FieldLabel>
                <TextInput
                  value={edu.year ?? ""}
                  onChange={(year) =>
                    updateEducation(index, { ...edu, year: year || null })
                  }
                  placeholder="2024"
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Certifications"
        onAdd={() =>
          update("certifications", [
            ...resume.certifications,
            { title: "", issuer: "" },
          ])
        }
        addLabel="Add certification"
      >
        {resume.certifications.map((cert, index) => (
          <ItemCard
            key={`cert-${index}`}
            title={`Certification ${index + 1}`}
            onDelete={() =>
              update(
                "certifications",
                resume.certifications.filter((_, i) => i !== index)
              )
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput
                  value={cert.title}
                  onChange={(title) =>
                    updateCertification(index, { ...cert, title })
                  }
                  placeholder="AWS Certified Developer"
                />
              </div>
              <div>
                <FieldLabel>Issuer</FieldLabel>
                <TextInput
                  value={cert.issuer}
                  onChange={(issuer) =>
                    updateCertification(index, { ...cert, issuer })
                  }
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Key Achievements"
        onAdd={() =>
          update("achievements", [
            ...resume.achievements,
            { title: "", description: "" },
          ])
        }
        addLabel="Add achievement"
      >
        {resume.achievements.map((item, index) => (
          <ItemCard
            key={`ach-${index}`}
            title={`Achievement ${index + 1}`}
            onDelete={() =>
              update(
                "achievements",
                resume.achievements.filter((_, i) => i !== index)
              )
            }
          >
            <div className="space-y-3">
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput
                  value={item.title}
                  onChange={(title) =>
                    updateAchievement(index, { ...item, title })
                  }
                  placeholder="Led team project delivery"
                />
              </div>
              <div>
                <FieldLabel>Description</FieldLabel>
                <TextArea
                  value={item.description}
                  onChange={(description) =>
                    updateAchievement(index, { ...item, description })
                  }
                  placeholder="Impact and outcome"
                  rows={2}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Awards"
        onAdd={() => update("awards", [...resume.awards, ""])}
        addLabel="Add award"
      >
        {resume.awards.map((award, index) => (
          <div key={`award-${index}`} className="flex gap-2">
            <TextInput
              value={award}
              onChange={(value) => {
                const next = [...resume.awards];
                next[index] = value;
                update("awards", next);
              }}
              placeholder="Hackathon Winner"
            />
            <button
              type="button"
              onClick={() =>
                update(
                  "awards",
                  resume.awards.filter((_, i) => i !== index)
                )
              }
              className="shrink-0 rounded-xl border border-slate-200 px-3 text-slate-400 transition hover:border-red-200 hover:text-red-500"
              aria-label="Delete award"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
