"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, Edit3, Eye, Loader2, X } from "lucide-react";
import {
  downloadImprovedResumePdf,
  downloadImprovedResumePdfFromPreview,
} from "@/components/resume-analyzer/download-improved-resume-pdf";
import ImprovedResumeEditor from "@/components/resume-analyzer/ImprovedResumeEditor";
import ImprovedResumePreview from "@/components/resume-analyzer/ImprovedResumePreview";
import { downloadResumeText } from "@/components/resume-analyzer/download-report-pdf";
import {
  improvedResumeToPlainText,
  type ImprovedResume,
} from "@/lib/resume-analyzer/improved-resume-types";
import {
  guaranteeImprovedAtsScore,
  IMPROVED_RESUME_MIN_ATS_SCORE,
} from "@/lib/resume-analyzer/score-utils";
import { getScoreLabel } from "@/components/resume-analyzer/utils";

type ImprovedResumeModalProps = {
  resume: ImprovedResume | null;
  plainText: string;
  downloadBaseName: string;
  atsScore?: number;
  scoreLabel?: string;
  loading?: boolean;
  error?: string;
  onClose: () => void;
};

type ViewMode = "preview" | "edit";

export default function ImprovedResumeModal({
  resume,
  plainText,
  downloadBaseName,
  atsScore,
  scoreLabel,
  loading = false,
  error = "",
  onClose,
}: ImprovedResumeModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [editedResume, setEditedResume] = useState<ImprovedResume | null>(resume);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const pdfRenderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resume) {
      setEditedResume(resume);
      setViewMode("preview");
      void document.fonts.ready;
    }
  }, [resume]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const displayScore =
    typeof atsScore === "number"
      ? guaranteeImprovedAtsScore(atsScore)
      : IMPROVED_RESUME_MIN_ATS_SCORE;
  const displayLabel = scoreLabel || getScoreLabel(displayScore);

  const activePlainText = useMemo(() => {
    if (editedResume) return improvedResumeToPlainText(editedResume);
    return plainText;
  }, [editedResume, plainText]);

  async function handleCopy() {
    if (!activePlainText) return;
    await navigator.clipboard.writeText(activePlainText);
  }

  async function handleDownloadPdf() {
    if (!editedResume) return;

    setDownloadingPdf(true);
    setDownloadError("");

    try {
      const previewTarget = pdfRenderRef.current;
      if (!previewTarget) {
        throw new Error("Resume preview is not ready yet.");
      }

      await downloadImprovedResumePdfFromPreview(
        previewTarget,
        `${downloadBaseName}-improved.pdf`
      );
    } catch (error) {
      console.error("Resume PDF export failed:", error);
      try {
        downloadImprovedResumePdf(editedResume, `${downloadBaseName}-improved.pdf`);
        setDownloadError(
          "Styled PDF failed. Downloaded a simple text version instead."
        );
      } catch {
        setDownloadError(
          error instanceof Error
            ? error.message
            : "Could not download PDF. Please try again."
        );
      }
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00bcfe]">
              AI Enhanced Resume
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Your Improved Resume is Ready
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Preview, edit, add, or delete any section before downloading.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && editedResume ? (
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === "preview"
                      ? "bg-white text-[#00bcfe] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === "edit"
                      ? "bg-white text-[#00bcfe] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto bg-gradient-to-b from-slate-100/80 to-slate-50 px-3 py-6 sm:px-5">
          {loading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#00bcfe]" />
              <p className="text-sm font-medium">
                AI is building your premium resume...
              </p>
              <p className="text-xs text-slate-400">
                Formatting your resume in a professional ATS-ready layout
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[20px] border border-[#00bcfe]/20 bg-[#00bcfe]/5 px-4 py-3 text-sm text-[#00bcfe]">
              {error}
            </div>
          ) : editedResume ? (
            viewMode === "edit" ? (
              <ImprovedResumeEditor
                resume={editedResume}
                onChange={setEditedResume}
              />
            ) : (
              <ImprovedResumePreview
                resume={editedResume}
                atsScore={displayScore}
                scoreLabel={displayLabel}
              />
            )
          ) : null}

          {editedResume ? (
            <div
              ref={pdfRenderRef}
              aria-hidden
              className="pointer-events-none absolute overflow-visible"
              style={{ left: -12000, top: 0, width: 794, opacity: 1 }}
            >
              <ImprovedResumePreview resume={editedResume} forPdfExport />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          {downloadError ? (
            <p className="mr-auto text-xs font-medium text-[#00bcfe] sm:self-center">
              {downloadError}
            </p>
          ) : null}
          <button
            type="button"
            disabled={loading || !activePlainText}
            onClick={() => void handleCopy()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#00bcfe]/30 hover:text-[#00bcfe] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy Text
          </button>
          <button
            type="button"
            disabled={loading || !activePlainText}
            onClick={() =>
              downloadResumeText(
                activePlainText,
                `${downloadBaseName}-improved.txt`
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#00bcfe]/30 hover:text-[#00bcfe] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download .txt
          </button>
          <button
            type="button"
            disabled={loading || !editedResume || downloadingPdf}
            onClick={() => void handleDownloadPdf()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00bcfe] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00bcfe]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloadingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloadingPdf ? "Preparing PDF..." : "Download Resume PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
