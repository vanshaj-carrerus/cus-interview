"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  FileUp,
  Rocket,
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
  { icon: ScanLine, label: "ATS keyword scan", desc: "Find missing role keywords" },
  { icon: ShieldCheck, label: "Format check", desc: "PDF & DOCX compatibility" },
  { icon: Sparkles, label: "AI suggestions", desc: "Actionable improvements" },
  { icon: Zap, label: "Instant score", desc: "Results in under a minute" },
] as const;

export default function ResumeAnalyzerPage({
  variant = "default",
}: {
  variant?: "default" | "dashboard";
}) {
  const isDashboard = variant === "dashboard";
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

  const handleFile = (file: File, autoAnalyze = !isDashboard) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    setUploadError("");
    setSelectedFile(file);
    if (!autoAnalyze) return;
    checkAccess(() => {
      void startAnalysis(file);
    });
  };

  const handleAnalyzeNow = () => {
    if (selectedFile) {
      checkAccess(() => {
        void startAnalysis(selectedFile);
      });
      return;
    }
    checkAccess(() => fileInputRef.current?.click());
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

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onUploadZoneClick = () => {
    if (isDashboard) {
      openFilePicker();
      return;
    }
    checkAccess(openFilePicker);
  };

  const renderUploadZone = (className = "", compact = false) => {
    const hasFile = Boolean(selectedFile) && phase === "landing";

    return (
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
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border px-6 py-8 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${className} ${
          compact ? "min-h-[220px] flex-1" : "min-h-[240px] sm:min-h-[280px]"
        } ${
          dragActive
            ? "scale-[1.01] border-primary bg-primary/8 ring-4 ring-primary/10"
            : hasFile
              ? "border-primary/30 bg-primary/[0.04]"
              : "border-primary/15 bg-white hover:border-primary/30 hover:bg-primary/[0.02]"
        }`}
        onClick={onUploadZoneClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onUploadZoneClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
      >
        <motion.div
          animate={
            dragActive
              ? { scale: 1.08, y: -2 }
              : hasFile
                ? { scale: 1, y: 0 }
                : { y: [0, -4, 0] }
          }
          transition={{
            duration: dragActive ? 0.2 : hasFile ? 0.2 : 2.8,
            repeat: dragActive || hasFile ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors sm:h-16 sm:w-16 ${
            hasFile ? "bg-primary/15" : "bg-primary/10 group-hover:bg-primary/15"
          }`}
        >
          {hasFile ? (
            <CheckCircle2 className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
          ) : (
            <FileUp className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
          )}
        </motion.div>

        {hasFile && selectedFile ? (
          <>
            <div className="flex max-w-full items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <h2 className="truncate text-base font-semibold text-secondary sm:text-lg">
                {selectedFile.name}
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-secondary/50">
              {formatFileSize(selectedFile.size)} ·{" "}
              <span className="font-medium text-primary">Replace file</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-base font-semibold text-secondary sm:text-lg">
              {dragActive ? "Drop to upload" : "Drag & drop your resume"}
            </h2>
            <p className="mt-1.5 text-sm text-secondary/50">
              or{" "}
              <span className="font-medium text-primary underline-offset-2 group-hover:underline">
                browse from computer
              </span>
            </p>
          </>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-secondary/40">
          <span className="rounded-md border border-primary/10 bg-white px-2.5 py-1">PDF</span>
          <span className="rounded-md border border-primary/10 bg-white px-2.5 py-1">DOCX</span>
          <span className="rounded-md border border-primary/10 bg-white px-2.5 py-1">
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
    );
  };

  const renderFeaturePills = (compact = false) => (
    <div
      className={
        compact
          ? "grid gap-2 sm:grid-cols-2"
          : "mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-3"
      }
    >
      {FEATURES.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          className={
            compact
              ? "flex items-start gap-3 rounded-xl border border-primary/10 bg-white px-3.5 py-3 transition hover:border-primary/20 hover:bg-primary/[0.02]"
              : "inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 px-4 py-2 text-xs font-medium text-secondary/70 shadow-sm backdrop-blur-sm"
          }
        >
          <span
            className={
              compact
                ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                : ""
            }
          >
            <Icon className={`shrink-0 text-primary ${compact ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
          </span>
          {compact ? (
            <div className="min-w-0">
              <p className="text-sm font-medium text-secondary">{label}</p>
              <p className="text-xs text-secondary/45">{desc}</p>
            </div>
          ) : (
            label
          )}
        </div>
      ))}
    </div>
  );

  const renderProcessingError = () =>
    processingError ? (
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">Analysis failed</p>
          <p className="mt-1 text-sm text-slate-600">{processingError}</p>
        </div>
      </div>
    ) : null;

  const renderDashboardLanding = () => (
    <section ref={uploadRef} className="flex min-h-0 flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-0 flex-1 flex-col"
      >
        {renderProcessingError()}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm">
          <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex min-h-[320px] flex-col border-b border-primary/8 p-5 sm:p-6 lg:min-h-0 lg:border-b-0 lg:border-r lg:p-8">
              <p className="mb-4 shrink-0 text-xs font-semibold uppercase tracking-wider text-primary/70">
                Upload resume
              </p>
              <div className="flex min-h-0 flex-1 flex-col">
                {renderUploadZone("border-dashed flex-1", true)}
              </div>
              {uploadError ? (
                <p className="mt-3 shrink-0 text-sm font-medium text-red-500">{uploadError}</p>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-col justify-between p-5 sm:p-6 lg:p-8">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary/40">
                  What you get
                </p>
                {renderFeaturePills(true)}
              </div>

              <button
                type="button"
                onClick={handleAnalyzeNow}
                disabled={!selectedFile}
                className="mt-6 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 lg:mt-8"
              >
                {selectedFile ? (
                  <>
                    Analyze resume
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Select a file to analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );

  const renderDefaultLanding = () => (
    <>
      <section className="py-12 text-center md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
            Get Your ATS Resume Score{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Upload your resume and let AI analyze it like a real Applicant
            Tracking System. Discover missing keywords, formatting issues,
            grammar mistakes, ATS compatibility, and receive personalized
            improvement suggestions instantly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => checkAccess(scrollToUpload)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-[0.98]"
            >
              <Upload className="h-4 w-4" />
              Upload Resume
            </button>
          </div>
        </motion.div>

        {renderFeaturePills()}
      </section>

      {phase === "landing" ? (
        <section ref={uploadRef} className="pb-20">
          {renderProcessingError()}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-3xl rounded-[20px] border border-white/80 bg-white/70 p-8 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-12"
          >
            {renderUploadZone()}
            {uploadError ? (
              <p className="mt-4 text-center text-sm font-medium text-primary">
                {uploadError}
              </p>
            ) : null}
          </motion.div>
        </section>
      ) : null}
    </>
  );

  return (
    <div
      className={`relative overflow-hidden text-secondary ${
        isDashboard ? "flex min-h-0 flex-1 flex-col bg-transparent" : "min-h-screen bg-white"
      }`}
    >
      {!isDashboard ? (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
        </div>
      ) : null}

      <div
        className={`relative flex min-h-0 flex-1 flex-col ${
          isDashboard ? "w-full" : "mx-auto max-w-6xl px-4 pb-8 sm:px-6 pt-4 lg:px-8"
        }`}
      >
        <AnimatePresence mode="wait">
          {phase !== "results" ? (
            <motion.div
              key="hero-upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={isDashboard ? "flex min-h-0 flex-1 flex-col" : undefined}
            >
              {phase === "landing"
                ? isDashboard
                  ? renderDashboardLanding()
                  : renderDefaultLanding()
                : null}

              {phase === "processing" ? (
                <section
                  className={`flex flex-1 flex-col items-center justify-center ${
                    isDashboard ? "min-h-[50vh] py-8" : "pt-4 pb-24"
                  }`}
                >
                  <ProcessingAnimation
                    activeStep={activeStep}
                    fileName={selectedFile?.name}
                  />
                  <p className="mx-auto mt-6 max-w-md text-center text-sm text-secondary/55">
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
              className={isDashboard ? "py-4" : "py-8"}
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
