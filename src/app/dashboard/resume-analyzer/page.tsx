import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResumeAnalyzerPage from "@/components/resume-analyzer/ResumeAnalyzerPage";

export default function DashboardResumeAnalyzerPage() {
  return (
    <div className="flex min-h-full flex-col px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="mx-auto mb-6 flex w-full max-w-6xl shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm text-secondary/45 transition hover:text-sky-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            Resume Analyzer
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-secondary/55">
            ATS scoring, keyword gaps, and AI-powered tips — upload a PDF or DOCX to start.
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col pb-4">
        <ResumeAnalyzerPage variant="dashboard" />
      </div>
    </div>
  );
}
