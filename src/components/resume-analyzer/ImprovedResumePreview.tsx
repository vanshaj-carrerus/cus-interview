"use client";

import {
  Award,
  BarChart3,
  Calendar,
  Globe,
  Link2,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import {
  RESUME_ANALYZER_PRIMARY,
  RESUME_ANALYZER_PRIMARY_LIGHT,
} from "@/components/resume-analyzer/theme";
import {
  getResumeInitials,
  type ImprovedResume,
} from "@/lib/resume-analyzer/improved-resume-types";
import { getScoreLabel } from "@/components/resume-analyzer/utils";

const ACHIEVEMENT_ICONS = [Rocket, BarChart3, Wrench, Users];

type ImprovedResumePreviewProps = {
  resume: ImprovedResume;
  atsScore?: number;
  scoreLabel?: string;
  forPdfExport?: boolean;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <h5 className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-900">
        {children}
      </h5>
      <div className="mt-2 h-[2.5px] w-full rounded-full bg-slate-900" />
    </div>
  );
}

function ContactItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-700">
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: `${RESUME_ANALYZER_PRIMARY}14` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: RESUME_ANALYZER_PRIMARY }} />
      </span>
      <span className="truncate">{children}</span>
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2.5 space-y-2">
      {items.map((bullet) => (
        <li key={bullet} className="flex gap-2.5 text-[11px] leading-relaxed text-slate-700">
          <span
            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: RESUME_ANALYZER_PRIMARY }}
          />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function DottedDivider() {
  return <div className="my-5 border-t border-dotted border-slate-300/90" />;
}

export default function ImprovedResumePreview({
  resume,
  atsScore,
  scoreLabel,
  forPdfExport = false,
}: ImprovedResumePreviewProps) {
  const initials = getResumeInitials(resume.name);
  const displayScore = typeof atsScore === "number" ? atsScore : undefined;
  const displayLabel =
    scoreLabel || (displayScore ? getScoreLabel(displayScore) : "");
  const showAtsScore = !forPdfExport && Boolean(displayScore);

  return (
    <div
      id={forPdfExport ? undefined : "improved-resume-pdf-root"}
      data-resume-pdf-root={forPdfExport ? "true" : undefined}
      className={forPdfExport ? "w-[794px] bg-white" : "mx-auto w-full max-w-[860px]"}
    >
      <div
        className={
          forPdfExport
            ? "overflow-hidden border border-slate-200 bg-white"
            : "overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(0,188,254,0.35)]"
        }
      >
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${RESUME_ANALYZER_PRIMARY}, ${RESUME_ANALYZER_PRIMARY_LIGHT})`,
          }}
        />

        <div className="px-7 py-8 md:px-10 md:py-9">
          <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-7">
            <div className="min-w-0 flex-1">
              <h2 className="text-[1.65rem] font-extrabold uppercase leading-tight tracking-[0.08em] text-slate-900 md:text-[1.85rem]">
                {resume.name}
              </h2>
              <p
                className="mt-1.5 text-[15px] font-bold tracking-wide"
                style={{ color: RESUME_ANALYZER_PRIMARY }}
              >
                {resume.title}
              </p>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {resume.phone ? (
                  <ContactItem icon={Phone}>{resume.phone}</ContactItem>
                ) : null}
                {resume.email ? (
                  <ContactItem icon={Mail}>{resume.email}</ContactItem>
                ) : null}
                {resume.linkedin ? (
                  <ContactItem icon={Link2}>{resume.linkedin}</ContactItem>
                ) : null}
                {resume.github ? (
                  <ContactItem icon={Globe}>{resume.github}</ContactItem>
                ) : null}
              </div>

              {resume.location ? (
                <p className="mt-3">
                  <ContactItem icon={MapPin}>{resume.location}</ContactItem>
                </p>
              ) : null}
            </div>

            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ backgroundColor: `${RESUME_ANALYZER_PRIMARY}35` }}
              />
              <div
                className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full text-[1.35rem] font-extrabold tracking-wider text-slate-900 shadow-lg md:h-[96px] md:w-[96px] md:text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${RESUME_ANALYZER_PRIMARY}, ${RESUME_ANALYZER_PRIMARY_LIGHT})`,
                }}
              >
                {initials || "CV"}
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.62fr_1fr] lg:gap-10">
            <div className="space-y-7 lg:border-r lg:border-slate-200 lg:pr-8">
              {resume.education.length > 0 ? (
                <section>
                  <SectionTitle>Education</SectionTitle>
                  {resume.education.map((edu) => (
                    <div key={`${edu.degree}-${edu.institution}`} className="space-y-1">
                      <p className="text-[13px] font-bold leading-snug text-slate-900">
                        {edu.degree}
                      </p>
                      {edu.institution ? (
                        <p
                          className="text-[12px] font-bold"
                          style={{ color: RESUME_ANALYZER_PRIMARY }}
                        >
                          {edu.institution}
                        </p>
                      ) : null}
                      {edu.year ? (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                          <Calendar
                            className="h-3.5 w-3.5"
                            style={{ color: RESUME_ANALYZER_PRIMARY }}
                          />
                          {edu.year}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </section>
              ) : null}

              {resume.experience.length > 0 ? (
                <section>
                  <SectionTitle>Experience</SectionTitle>
                  {resume.experience.map((item, index) => (
                    <div key={`${item.role}-${item.company}-${index}`}>
                      <p className="text-[13px] font-bold text-slate-900">{item.role}</p>
                      {item.company ? (
                        <p
                          className="text-[12px] font-bold"
                          style={{ color: RESUME_ANALYZER_PRIMARY }}
                        >
                          {item.company}
                        </p>
                      ) : null}
                      {item.duration ? (
                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          {item.duration}
                        </p>
                      ) : null}
                      <BulletList items={item.bullets} />
                      {index < resume.experience.length - 1 ? <DottedDivider /> : null}
                    </div>
                  ))}
                </section>
              ) : null}

              {resume.projects.length > 0 ? (
                <section>
                  <SectionTitle>Projects</SectionTitle>
                  {resume.projects.map((project, index) => (
                    <div key={project.name}>
                      <p className="text-[13px] font-bold text-slate-900">
                        {project.name}
                      </p>
                      {project.description ? (
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
                          {project.description}
                        </p>
                      ) : null}
                      {project.technologies.length > 0 ? (
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {project.technologies.join(" • ")}
                        </p>
                      ) : null}
                      <BulletList items={project.bullets} />
                      {index < resume.projects.length - 1 ? <DottedDivider /> : null}
                    </div>
                  ))}
                </section>
              ) : null}

              {resume.awards.length > 0 ? (
                <section>
                  <SectionTitle>Awards</SectionTitle>
                  <div className="space-y-2.5">
                    {resume.awards.map((award) => (
                      <p
                        key={award}
                        className="inline-flex items-center gap-2.5 text-[12px] font-bold text-slate-900"
                      >
                        <Trophy
                          className="h-4 w-4"
                          style={{ color: RESUME_ANALYZER_PRIMARY }}
                        />
                        {award}
                      </p>
                    ))}
                  </div>
                </section>
              ) : null}

              {showAtsScore ? (
                <section>
                  <SectionTitle>ATS Score</SectionTitle>
                  <div
                    className="inline-flex items-center gap-3 rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: `${RESUME_ANALYZER_PRIMARY}30`,
                      backgroundColor: `${RESUME_ANALYZER_PRIMARY}08`,
                    }}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[10px] font-extrabold text-slate-900"
                      style={{ backgroundColor: RESUME_ANALYZER_PRIMARY }}
                    >
                      ATS
                    </div>
                    <div>
                      <p className="text-[12px] font-extrabold uppercase tracking-wide text-slate-900">
                        ATS Score: {displayScore}/100
                      </p>
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: RESUME_ANALYZER_PRIMARY }}
                      >
                        {displayLabel}
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}
            </div>

            <div className="space-y-7">
              {resume.summary ? (
                <section>
                  <SectionTitle>Summary</SectionTitle>
                  <p className="text-[11px] leading-[1.75] text-slate-700">
                    {resume.summary}
                  </p>
                </section>
              ) : null}

              {resume.skills.length > 0 ? (
                <section>
                  <SectionTitle>Skills</SectionTitle>
                  <p className="text-[11px] leading-[1.8] text-slate-700">
                    {resume.skills.join(", ")}
                  </p>
                </section>
              ) : null}

              {resume.certifications.length > 0 ? (
                <section>
                  <SectionTitle>Certifications</SectionTitle>
                  <div className="space-y-3.5">
                    {resume.certifications.map((cert) => (
                      <div key={`${cert.title}-${cert.issuer}`}>
                        <p className="text-[12px] font-bold text-slate-900">
                          {cert.title}
                        </p>
                        {cert.issuer ? (
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {cert.issuer}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {resume.achievements.length > 0 ? (
                <section>
                  <SectionTitle>Key Achievements</SectionTitle>
                  <div className="space-y-4">
                    {resume.achievements.map((item, index) => {
                      const Icon = ACHIEVEMENT_ICONS[index % ACHIEVEMENT_ICONS.length];
                      return (
                        <div key={`${item.title}-${index}`} className="flex gap-3">
                          <div
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${RESUME_ANALYZER_PRIMARY}12` }}
                          >
                            <Icon
                              className="h-4 w-4"
                              style={{ color: RESUME_ANALYZER_PRIMARY }}
                            />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-slate-900">
                              {item.title}
                            </p>
                            {item.description ? (
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {!resume.awards.length ? (
                <section>
                  <SectionTitle>Awards</SectionTitle>
                  <p className="inline-flex items-center gap-2.5 text-[12px] font-bold text-slate-900">
                    <Award
                      className="h-4 w-4"
                      style={{ color: RESUME_ANALYZER_PRIMARY }}
                    />
                    Academic and project excellence
                  </p>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
