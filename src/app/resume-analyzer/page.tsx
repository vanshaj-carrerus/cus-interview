import type { Metadata } from "next";
import ResumeAnalyzerPage from "@/components/resume-analyzer/ResumeAnalyzerPage";

export const metadata: Metadata = {
  title: "ATS Resume Analyzer | CUS Interview",
  description:
    "Upload your resume and get an instant ATS score with keyword analysis, formatting checks, grammar insights, and AI-powered improvement suggestions.",
};

export default function Page() {
  return <ResumeAnalyzerPage />;
}
