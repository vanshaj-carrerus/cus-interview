"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  FileUp,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import ProcessingAnimation from "@/components/resume-analyzer/ProcessingAnimation";
import ResultsDashboard from "@/components/resume-analyzer/ResultsDashboard";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  PROCESSING_STEPS,
} from "@/lib/resume-analyzer/constants";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";
import { formatFileSize } from "@/components/resume-analyzer/utils";

type PagePhase = "landing" | "processing" | "results";

const FEATURES = [
  { icon: ScanLine, label: "ATS keyword scan" },
  { icon: ShieldCheck, label: "Format compatibility" },
  { icon: Sparkles, label: "AI suggestions" },
  { icon: Zap, label: "Instant scoring" },
];

export default function ResumeAnalyzerPage() {
  const { checkAccess, paywallOpen, closePaywall, openPaywall } =
    useSubscriptionGate();
  const [phase, setPhase] = useState<PagePhase>("landing");
  const [activeStep, setActiveStep] = useState(0);
  const [report, setReport] = useState<ResumeAnalysisReport | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [processingError, setProcessingError] = useState("");
  const [analyzedFileName, setAnalyzedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (phase !== "processing") return;

    const timers = PROCESSING_STEPS.map((_, index) =>
      window.setTimeout(
        () => setActiveStep((current) => Math.max(current, index)),
        index * 900
      )
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "processing" || phase === "results") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [phase]);

  const validateFile = (file: File): string | null => {
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExt = ext === "pdf" || ext === "docx";
    const validType =
      ACCEPTED_FILE_TYPES.includes(
        file.type as (typeof ACCEPTED_FILE_TYPES)[number]
      ) || validExt;

    if (!validType) {
      return "Please upload a PDF or DOCX file.";
    }
    if (file.size > maxBytes) {
      return `File must be under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const startAnalysis = useCallback(async (file: File) => {
    setUploadError("");
    setProcessingError("");
    setSelectedFile(file);
    setPhase("processing");
    setActiveStep(0);
    setReport(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/resume-analyzer/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
        cache: "no-store",
      });

      const data = (await response.json()) as {
        error?: string;
        report?: ResumeAnalysisReport;
        meta?: { fileName?: string };
      };

      if (!response.ok || !data.report) {
        if (response.status === 403) {
          setPhase("landing");
          openPaywall();
          return;
        }
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setActiveStep(PROCESSING_STEPS.length - 1);
      await new Promise((resolve) => window.setTimeout(resolve, 400));
      setAnalyzedFileName(data.meta?.fileName ?? file.name);
      setReport(data.report);
      setPhase("results");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setProcessingError(
        error instanceof Error
          ? error.message
          : "Unable to analyze resume right now."
      );
      setPhase("landing");
    }
  }, [openPaywall]);

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    checkAccess(() => {
      void startAnalysis(file);
    });
  };

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setPhase("landing");
    setReport(null);
    setSelectedFile(null);
    setActiveStep(0);
    setUploadError("");
    setProcessingError("");
    setAnalyzedFileName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#00bcfe]/[0.04] blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[#00bcfe]/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {phase !== "results" ? (
            <motion.div
              key="hero-upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="py-12 text-center md:py-20">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto max-w-3xl"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#00bcfe]/15 bg-[#00bcfe]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00bcfe]">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI-Powered ATS Analyzer
                  </span>

                  <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
                    Get Your ATS Resume Score{" "}
                    <span className="bg-gradient-to-r from-[#00bcfe] to-[#33d4ff] bg-clip-text text-transparent">
                      in Seconds
                    </span>
                  </h1>

                  <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
                    Upload your resume and let AI analyze it like a real
                    Applicant Tracking System. Discover missing keywords,
                    formatting issues, grammar mistakes, ATS compatibility, and
                    receive personalized improvement suggestions instantly.
                  </p>

                  <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={scrollToUpload}
                      className="inline-flex items-center gap-2 rounded-full bg-[#00bcfe] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00bcfe]/25 transition hover:brightness-110 active:scale-[0.98]"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Resume
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-3"
                >
                  {FEATURES.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#00bcfe]" />
                      {label}
                    </span>
                  ))}
                </motion.div>
              </section>

              {phase === "landing" ? (
                <section ref={uploadRef} className="pb-20">
                  {processingError ? (
                    <div className="mx-auto mb-6 flex max-w-3xl items-start gap-3 rounded-[20px] border border-[#00bcfe]/20 bg-[#00bcfe]/5 px-5 py-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#00bcfe]" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Analysis failed
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {processingError}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative mx-auto max-w-3xl rounded-[20px] border border-white/80 bg-white/70 p-8 shadow-[0_32px_80px_-32px_rgba(0,188,254,0.15)] backdrop-blur-xl md:p-12"
                  >
                    <div
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFile(file);
                      }}
                      className={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed px-6 py-12 transition-all ${
                        dragActive
                          ? "border-[#00bcfe] bg-[#00bcfe]/5 scale-[1.01]"
                          : "border-slate-200 bg-slate-50/50 hover:border-[#00bcfe]/40 hover:bg-[#00bcfe]/[0.02]"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload resume"
                    >
                      <motion.div
                        animate={{ y: dragActive ? -4 : [0, -6, 0] }}
                        transition={{
                          duration: dragActive ? 0.2 : 2.5,
                          repeat: dragActive ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#00bcfe]/10"
                      >
                        <FileUp className="h-10 w-10 text-[#00bcfe]" />
                      </motion.div>

                      <h2 className="text-xl font-semibold text-slate-900">
                        Drag & Drop your Resume
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        or{" "}
                        <span className="font-semibold text-[#00bcfe]">
                          Browse File
                        </span>
                      </p>

                      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                          PDF
                        </span>
                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                          DOCX
                        </span>
                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                          Max {MAX_FILE_SIZE_MB}MB
                        </span>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFile(file);
                          e.target.value = "";
                        }}
                      />
                    </div>

                    {uploadError ? (
                      <p className="mt-4 text-center text-sm font-medium text-[#00bcfe]">
                        {uploadError}
                      </p>
                    ) : null}
                  </motion.div>
                </section>
              ) : null}

              {phase === "processing" ? (
                <section className="pb-24 pt-4">
                  <ProcessingAnimation
                    activeStep={activeStep}
                    fileName={selectedFile?.name}
                  />
                  <p className="mx-auto mt-6 max-w-md text-center text-sm text-slate-500">
                    AI is reading your resume and generating a real ATS score.
                    Scanned PDFs are supported via AI OCR. This may take 20–45
                    seconds.
                  </p>
                </section>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              {report ? (
                <ResultsDashboard
                  report={report}
                  fileName={analyzedFileName}
                  resumeFile={selectedFile}
                  onReset={handleReset}
                  checkAccess={checkAccess}
                  onRequireSubscription={openPaywall}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
    </div>
  );
}
