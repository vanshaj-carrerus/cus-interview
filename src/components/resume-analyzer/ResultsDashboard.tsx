"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Lightbulb,
  Loader2,
  Mail,
  Phone,
  Target,
  TrendingUp,
  User,
  Wand2,
  XCircle,
} from "lucide-react";
import { downloadResumeReportPdf } from "@/components/resume-analyzer/download-report-pdf";
import ImprovedResumeModal from "@/components/resume-analyzer/ImprovedResumeModal";
import ScoreGauge from "@/components/resume-analyzer/ScoreGauge";
import type { ImprovedResume } from "@/lib/resume-analyzer/improved-resume-types";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";
import {
  guaranteeImprovedAtsScore,
  IMPROVED_RESUME_MIN_ATS_SCORE,
} from "@/lib/resume-analyzer/score-utils";
import { getScoreColor } from "@/components/resume-analyzer/utils";

type ResultsDashboardProps = {
  report: ResumeAnalysisReport;
  fileName?: string;
  resumeFile?: File | null;
  onReset: () => void;
  checkAccess?: (onAllowed: () => void) => void;
  onRequireSubscription?: () => void;
};

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={`rounded-[20px] border border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-shadow hover:shadow-[0_28px_70px_-28px_rgba(0,188,254,0.14)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function ResultsDashboard({
  report,
  fileName,
  resumeFile,
  onReset,
  checkAccess,
  onRequireSubscription,
}: ResultsDashboardProps) {
  const successColor = getScoreColor(report.interviewSuccess);
  const [improveModalOpen, setImproveModalOpen] = useState(false);
  const [improvedResume, setImprovedResume] = useState<ImprovedResume | null>(null);
  const [improvedPlainText, setImprovedPlainText] = useState("");
  const [improvedAtsScore, setImprovedAtsScore] = useState<number | null>(null);
  const [improvedScoreLabel, setImprovedScoreLabel] = useState("");
  const [improveLoading, setImproveLoading] = useState(false);
  const [improveError, setImproveError] = useState("");
  const [improving, setImproving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionError, setActionError] = useState("");

  const baseFileName = fileName?.replace(/\.[^.]+$/, "") ?? "resume";

  async function runImproveResume() {
    setImproving(true);
    setActionError("");
    setImproveError("");
    setImprovedResume(null);
    setImprovedPlainText("");
    setImprovedAtsScore(null);
    setImprovedScoreLabel("");
    setImproveModalOpen(true);
    setImproveLoading(true);

    try {
      const formData = new FormData();
      formData.append("report", JSON.stringify(report));
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await fetch("/api/resume-analyzer/improve", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        content?: string;
        resume?: ImprovedResume;
        atsScore?: number;
        scoreLabel?: string;
      };

      if (response.status === 403) {
        setImproveModalOpen(false);
        onRequireSubscription?.();
        return;
      }

      if (!response.ok || !data.content || !data.resume) {
        throw new Error(data.error || "Failed to improve resume. Please try again.");
      }

      setImprovedResume(data.resume);
      setImprovedPlainText(data.content);
      setImprovedAtsScore(
        guaranteeImprovedAtsScore(data.atsScore ?? IMPROVED_RESUME_MIN_ATS_SCORE)
      );
      setImprovedScoreLabel(
        data.scoreLabel ||
          (data.atsScore && data.atsScore >= 85 ? "Excellent" : "Strong")
      );
    } catch (error) {
      setImproveError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setImproveLoading(false);
      setImproving(false);
    }
  }

  function handleImproveResume() {
    if (checkAccess) {
      checkAccess(() => {
        void runImproveResume();
      });
      return;
    }
    void runImproveResume();
  }

  function handleDownloadReport() {
    setDownloading(true);
    setActionError("");
    try {
      downloadResumeReportPdf(report, fileName);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not generate PDF. Please try again."
      );
    } finally {
      window.setTimeout(() => setDownloading(false), 400);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[20px] border border-white/70 bg-white/80 p-8 shadow-[0_32px_80px_-32px_rgba(0,188,254,0.2)] backdrop-blur-xl md:p-12"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00bcfe]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-slate-100 blur-3xl" />

        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00bcfe]">
              ATS Analysis Complete
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Your Original Resume Score
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              This score is from your uploaded file
              {fileName ? ` (${fileName})` : ""}. Use &quot;Improve My Resume
              with AI&quot; below to get a 90+ ATS optimized version.
            </p>
          </div>
          <ScoreGauge score={report.atsScore} label={report.scoreLabel} />
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-[#00bcfe]" />
            <h3 className="text-lg font-semibold text-slate-900">
              Resume Summary
            </h3>
          </div>
          <div className="space-y-4">
            <InfoRow icon={User} label="Name" value={report.candidate.name} />
            <InfoRow icon={Mail} label="Email" value={report.candidate.email} />
            <InfoRow icon={Phone} label="Phone" value={report.candidate.phone} />
            <InfoRow
              icon={Briefcase}
              label="Experience"
              value={report.candidate.experience}
            />
            <InfoRow
              icon={GraduationCap}
              label="Education"
              value={report.candidate.education}
            />
            <TagGroup label="Skills" tags={report.candidate.skills} />
            <TagGroup label="Projects" tags={report.candidate.projects} />
            <TagGroup
              label="Certifications"
              tags={report.candidate.certifications}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#00bcfe]" />
            <h3 className="text-lg font-semibold text-slate-900">
              ATS Compatibility
            </h3>
          </div>
          <ul className="space-y-2.5">
            {report.compatibility.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                {item.passed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-[#00bcfe]" />
                )}
                <span
                  className={`text-sm font-medium ${
                    item.passed ? "text-slate-700" : "text-slate-900"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#00bcfe]" />
              <h3 className="text-lg font-semibold text-slate-900">
                Keyword Analysis
              </h3>
            </div>
            <span className="rounded-full bg-[#00bcfe]/10 px-3 py-1 text-xs font-semibold text-[#00bcfe]">
              {report.keywordMatchPercent}% match
            </span>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Matched Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {report.matchedKeywords.length > 0 ? (
                report.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-[#00bcfe]/20 bg-[#00bcfe]/10 px-3 py-1.5 text-xs font-semibold text-[#00bcfe]"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  No role keywords detected in your resume text.
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Missing Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {report.missingKeywords.length > 0 ? (
                report.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-[#00bcfe]/20 bg-[#00bcfe]/5 px-3 py-1.5 text-xs font-semibold text-[#00bcfe]"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  No missing keywords identified for your target role.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
              <span>Keyword match</span>
              <span>{report.keywordMatchPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${report.keywordMatchPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#00bcfe] to-[#33d4ff]"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#00bcfe]" />
              <h3 className="text-lg font-semibold text-slate-900">
                Formatting & Spacing
              </h3>
            </div>
            <span
              className="text-sm font-bold"
              style={{
                color: getScoreColor(
                  Math.round(
                    (report.formatting.filter((item) => item.passed).length /
                      Math.max(report.formatting.length, 1)) *
                      100
                  )
                ),
              }}
            >
              {Math.round(
                (report.formatting.filter((item) => item.passed).length /
                  Math.max(report.formatting.length, 1)) *
                  100
              )}
              %
            </span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            Score includes layout checks from your uploaded file — text density,
            line spacing, white space, sections, bullets, and ATS-safe structure —
            plus content quality.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {report.formatting.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
              >
                <span className="text-xs font-medium text-slate-600">
                  {item.label}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    item.passed ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-5 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#00bcfe]" />
          <h3 className="text-lg font-semibold text-slate-900">
            AI Suggestions
          </h3>
        </div>
        <ul className="space-y-2.5">
          {report.suggestions.map((suggestion, i) => (
            <li
              key={suggestion}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00bcfe]/10 text-[10px] font-bold text-[#00bcfe]">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {suggestion}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard>
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#00bcfe]" />
          <h3 className="text-lg font-semibold text-slate-900">
            Section-Wise Score
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {report.sectionScores.map((section) => (
            <div
              key={section.label}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-700">
                  {section.label}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: getScoreColor(section.score) }}
                >
                  {section.score}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${section.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: getScoreColor(section.score),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {report.strengths.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#00bcfe]" />
            <h3 className="text-lg font-semibold text-slate-900">
              Needs Improvement
            </h3>
          </div>
          <ul className="space-y-2">
            {report.improvements.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <XCircle className="h-4 w-4 shrink-0 text-[#00bcfe]" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#00bcfe]/5 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00bcfe]">
            Final Recommendation
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            {report.recommendation}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Estimated Interview Success
              </p>
              <p
                className="mt-1 text-4xl font-bold tracking-tight"
                style={{ color: successColor }}
              >
                {report.interviewSuccess}%
              </p>
            </div>
            <div className="h-3 flex-1 max-w-xs overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${report.interviewSuccess}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#00bcfe] to-[#33d4ff]"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[20px] border border-[#00bcfe]/10 bg-gradient-to-br from-white to-[#00bcfe]/5 p-8 text-center shadow-[0_24px_60px_-24px_rgba(0,188,254,0.2)] backdrop-blur-xl"
      >
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Ready to land more interviews?
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">
          Let AI rewrite weak sections, optimize keywords, and generate an
          ATS-ready resume in minutes.
        </p>
        {improvedAtsScore ? (
          <div className="mx-auto mt-6 flex max-w-md flex-col items-center rounded-[20px] border border-[#00bcfe]/20 bg-[#00bcfe]/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#00bcfe]">
              Your improved resume ATS score
            </p>
            <p className="mt-2 text-3xl font-bold text-[#00bcfe]">
              {improvedAtsScore}/100
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {improvedScoreLabel || "Excellent"}
            </p>
          </div>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void handleImproveResume()}
            disabled={improving}
            className="inline-flex items-center gap-2 rounded-full bg-[#00bcfe] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00bcfe]/25 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {improving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {improving ? "Improving..." : "Improve My Resume with AI"}
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#00bcfe]/30 hover:text-[#00bcfe] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Preparing..." : "Download Report PDF"}
          </button>
        </div>
        {actionError ? (
          <p className="mt-4 text-sm font-medium text-[#00bcfe]">{actionError}</p>
        ) : null}
        <button
          type="button"
          onClick={onReset}
          className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:text-[#00bcfe]"
        >
          Analyze another resume
        </button>
      </motion.div>

      {improveModalOpen ? (
        <ImprovedResumeModal
          resume={improvedResume}
          plainText={improvedPlainText}
          downloadBaseName={baseFileName}
          atsScore={improvedAtsScore ?? undefined}
          scoreLabel={improvedScoreLabel}
          loading={improveLoading}
          error={improveError}
          onClose={() => setImproveModalOpen(false)}
        />
      ) : null}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  if (!value.trim()) {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function TagGroup({
  label,
  tags,
}: {
  label: string;
  tags: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">Not found in your resume.</p>
      )}
    </div>
  );
}
