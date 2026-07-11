"use client";

import { useEffect } from "react";
import { Copy, Download, Loader2, X } from "lucide-react";
import { downloadResumeText } from "@/components/resume-analyzer/download-report-pdf";

type ResumeTextModalProps = {
  title: string;
  content: string;
  downloadFileName: string;
  loading?: boolean;
  error?: string;
  onClose: () => void;
};

export default function ResumeTextModal({
  title,
  content,
  downloadFileName,
  loading = false,
  error = "",
  onClose,
}: ResumeTextModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleCopy() {
    if (!content) return;
    await navigator.clipboard.writeText(content);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00bcfe]">
              AI Resume Output
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#00bcfe]" />
              <p className="text-sm font-medium">AI is generating your resume...</p>
            </div>
          ) : error ? (
            <div className="rounded-[20px] border border-[#00bcfe]/20 bg-[#00bcfe]/5 px-4 py-3 text-sm text-[#00bcfe]">
              {error}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap rounded-[20px] border border-slate-100 bg-slate-50/80 p-5 font-mono text-sm leading-relaxed text-slate-700">
              {content}
            </pre>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading || !content}
            onClick={() => void handleCopy()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#00bcfe]/30 hover:text-[#00bcfe] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy Text
          </button>
          <button
            type="button"
            disabled={loading || !content}
            onClick={() => downloadResumeText(content, downloadFileName)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00bcfe] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00bcfe]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
}
