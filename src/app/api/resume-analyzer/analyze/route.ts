import { NextResponse } from "next/server";
import { analyzeResumeFile } from "@/lib/ai/resume-analyzer-engine";
import { consumeFeatureCredit, getFeatureAccessSession } from "@/lib/billing/feature-credits";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/resume-analyzer/constants";
import { detectResumeFileKind } from "@/lib/resume-analyzer/extract-resume-text";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const access = await getFeatureAccessSession("resumeAnalyzer");
    if ("error" in access) {
      return access.error;
    }

    const formData = await request.formData();
    const fileValue = formData.get("resume");

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a resume file." },
        { status: 400 }
      );
    }

    if (fileValue.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File must be under 10MB." },
        { status: 400 }
      );
    }

    const fileKind = detectResumeFileKind(fileValue.type, fileValue.name);
    if (!fileKind) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

    const allowedType = ACCEPTED_FILE_TYPES.includes(
      fileValue.type as (typeof ACCEPTED_FILE_TYPES)[number]
    );
    if (fileValue.type && !allowedType && !fileValue.name.match(/\.(pdf|docx)$/i)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

    // Coupon-credit users spend one credit per analysis, refunded if the analysis fails.
    let refundCredit: (() => Promise<void>) | null = null;
    if (access.via === "credits") {
      const consumed = await consumeFeatureCredit(access.user.id, "resumeAnalyzer");
      if ("error" in consumed) {
        return consumed.error;
      }
      refundCredit = consumed.refund;
    }

    const arrayBuffer = await fileValue.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let analysis: Awaited<ReturnType<typeof analyzeResumeFile>>;
    try {
      analysis = await analyzeResumeFile(buffer, fileKind);
    } catch (error) {
      await refundCredit?.();
      throw error;
    }
    const { report, model, usedVision, extractionMethod } = analysis;

    return NextResponse.json({
      report,
      meta: {
        fileName: fileValue.name,
        fileKind,
        model,
        usedVision,
        extractionMethod,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("resume-analyzer/analyze", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to analyze resume. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
