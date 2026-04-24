import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { AiMockInterview } from "@/models/AiMockInterview";
import { AiMockLiveClient } from "./ai-mock-live-client";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ interviewId: string }>;
};

export default async function AiMockInterviewLivePage({ params }: PageProps) {
  const sessionUser = await getSessionPublicUser();
  if (!sessionUser) {
    redirect("/signup?intent=ai-mock");
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

  const chips = [
    ...(interview.languages ?? []).map((x) => ({
      label: x,
      kind: "language" as const,
    })),
    ...(interview.framework
      ? [{ label: interview.framework, kind: "framework" as const }]
      : []),
    ...(interview.role
      ? [{ label: interview.role, kind: "role" as const }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-3">
          <div className="flex justify-between items-center w-full">
            <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">
              AI Mock Interview
            </p>{" "}
            <Link
              href="/mock-interviews/ai-mock"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to setup
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-tight">
            Live interview ready
          </h1>
          <p className="text-slate-500 font-medium">
            Your interview was created successfully. Use this session ID to
            continue the live flow.
          </p>
          <p className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black tracking-widest text-slate-600">
            Session ID: {interview._id.toString()}
          </p>
        </header>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] space-y-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Seniority
            </p>
            <p className="text-sm font-bold text-secondary">
              {interview.seniority}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Focus
            </p>
            <div className="flex flex-wrap gap-2">
              {(interview.focusAreas ?? []).map((focus) => (
                <span
                  key={focus}
                  className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-primary"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {chips.length > 0 && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Role / Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={`${chip.kind}-${chip.label}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-600"
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interview.notes && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Notes
              </p>
              <p className="text-sm font-medium text-slate-600">
                {interview.notes}
              </p>
            </div>
          )}
        </section>

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

        <div className="flex flex-wrap gap-3">
          <Link
            href="/mock-interviews/ai-mock"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-secondary"
          >
            Back to setup
          </Link>
          <Link
            href="/mock-interviews"
            className="inline-flex items-center justify-center rounded-2xl bg-secondary px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white"
          >
            Mock interview hub
          </Link>
        </div>
      </div>
    </div>
  );
}
