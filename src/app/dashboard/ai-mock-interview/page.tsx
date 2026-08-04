import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AiMockSetupStepForm from "./ai-mock-setup-step-form";

export default function DashboardAiMockInterviewPage() {
  return (
    <div className="flex min-h-full flex-col px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="mx-auto mb-8 flex w-full max-w-6xl shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm text-secondary/45 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            AI Mock Interview
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-secondary/55">
            Practice with AI-powered interviews tailored to your role, stack, and seniority.
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col pb-6">
        <AiMockSetupStepForm interviewBasePath="/dashboard/ai-mock-interview" hideBackLink fullscreen />
      </div>
    </div>
  );
}
