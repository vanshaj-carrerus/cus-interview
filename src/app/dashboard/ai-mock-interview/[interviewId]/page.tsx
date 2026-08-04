import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { AiMockInterview } from "@/models/AiMockInterview";
import { AiMockLiveClient } from "@/app/mock-interviews/ai-mock/[interviewId]/ai-mock-live-client";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ interviewId: string }>;
};

export default async function DashboardAiMockInterviewLivePage({ params }: PageProps) {
  const sessionUser = await getSessionPublicUser();
  if (!sessionUser) {
    redirect("/signup?intent=ai-mock&next=/dashboard/ai-mock-interview");
  }

  const { interviewId } = await params;
  await connectDB();

  const interview = await AiMockInterview.findOne({
    _id: interviewId,
    userId: sessionUser.id,
    showToUser: { $ne: false },
  }).lean();

  if (!interview) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="mx-auto mb-6 flex w-full max-w-7xl shrink-0 items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live session</p>
          <h1 className="mt-1 text-2xl font-bold text-secondary sm:text-3xl">AI Mock Interview</h1>
        </div>
        <Link
          href="/dashboard/ai-mock-interview"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm font-medium text-secondary transition hover:bg-primary/5 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col pb-6">
        <AiMockLiveClient
          interview={{
            id: interview._id.toString(),
            status: interview.status,
            startedAt: interview.startedAt
              ? new Date(interview.startedAt).toISOString()
              : null,
            createdAt: interview.createdAt
              ? new Date(interview.createdAt).toISOString()
              : null,
            seniority: interview.seniority,
            focusAreas: interview.focusAreas ?? [],
            notes: interview.notes ?? "",
            languages: interview.languages ?? [],
            framework: interview.framework ?? "",
            role: interview.role ?? "",
            questions: (interview.questions ?? []).map((q) => ({
              id: q.id,
              text: q.text,
              focusArea: q.focusArea,
              difficulty: q.difficulty,
            })),
            responses: (interview.responses ?? []).map((r) => ({
              questionId: r.questionId,
              answer: r.answer,
              scoreOutOf10: r.scoreOutOf10,
              verdict: r.verdict,
              strengths: r.strengths ?? [],
              gaps: r.gaps ?? [],
              provider: r.provider ?? "",
            })),
          }}
        />
      </div>
    </div>
  );
}
