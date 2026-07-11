import { NextResponse } from "next/server";
import { generateAtsOptimizedResume } from "@/lib/ai/resume-actions-engine";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/resume-analyzer/constants";
import { detectResumeFileKind } from "@/lib/resume-analyzer/extract-resume-text";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const reportValue = formData.get("report");
    const fileValue = formData.get("resume");

    if (typeof reportValue !== "string") {
      return NextResponse.json(
        { error: "Analysis report is required." },
        { status: 400 }
      );
    }

    const report = JSON.parse(reportValue) as ResumeAnalysisReport;
    let buffer: Buffer | undefined;
    let fileKind: ReturnType<typeof detectResumeFileKind> = null;

    if (fileValue instanceof File && fileValue.size > 0) {
      if (fileValue.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File must be under 10MB." },
          { status: 400 }
        );
      }

      fileKind = detectResumeFileKind(fileValue.type, fileValue.name);
      if (!fileKind) {
        return NextResponse.json(
          { error: "Only PDF and DOCX files are supported." },
          { status: 400 }
        );
      }

      const allowedType = ACCEPTED_FILE_TYPES.includes(
        fileValue.type as (typeof ACCEPTED_FILE_TYPES)[number]
      );
      if (
        fileValue.type &&
        !allowedType &&
        !fileValue.name.match(/\.(pdf|docx)$/i)
      ) {
        return NextResponse.json(
          { error: "Only PDF and DOCX files are supported." },
          { status: 400 }
        );
      }

      buffer = Buffer.from(await fileValue.arrayBuffer());
    }

    const { content, model } = await generateAtsOptimizedResume(
      report,
      buffer,
      fileKind ?? undefined
    );

    return NextResponse.json({
      content,
      meta: { model, generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("resume-analyzer/generate-ats", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate ATS resume. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
