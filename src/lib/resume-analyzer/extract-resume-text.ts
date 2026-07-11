import mammoth from "mammoth";
import { MIN_RESUME_TEXT_LENGTH } from "@/lib/resume-analyzer/constants";
import { extractPdfTextBestEffort } from "@/lib/resume-analyzer/extract-pdf";
import { extractPdfTextWithMistralOcr } from "@/lib/resume-analyzer/extract-mistral-ocr";
import {
  extractDocxTextWithGeminiVision,
  extractPdfTextWithGeminiVision,
} from "@/lib/resume-analyzer/extract-pdf-vision";

export type ResumeFileKind = "pdf" | "docx";

export function detectResumeFileKind(
  mimeType: string,
  fileName: string
): ResumeFileKind | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (mimeType === "application/pdf" || ext === "pdf") return "pdf";
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  ) {
    return "docx";
  }
  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
  const errors: string[] = [];

  try {
    const raw = await mammoth.extractRawText({ buffer });
    const text = raw.value.trim();
    if (text.length >= MIN_RESUME_TEXT_LENGTH) {
      return text;
    }
    errors.push(`raw text only ${text.length} chars`);
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : "mammoth raw extract failed"
    );
  }

  try {
    const html = await mammoth.convertToHtml({ buffer });
    const text = stripHtml(html.value);
    if (text.length >= MIN_RESUME_TEXT_LENGTH) {
      return text;
    }
    errors.push(`html text only ${text.length} chars`);
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : "mammoth html extract failed"
    );
  }

  throw new Error(errors.join(" | "));
}

type ExtractionAttempt = {
  text: string;
  usedVision: boolean;
  method: string;
};

async function tryExtract(
  label: string,
  usedVision: boolean,
  fn: () => Promise<string>
): Promise<ExtractionAttempt | null> {
  try {
    const text = (await fn()).trim();
    if (text.length >= MIN_RESUME_TEXT_LENGTH) {
      return { text, usedVision, method: label };
    }
    console.warn(`[resume-extract] ${label}: only ${text.length} chars`);
    return null;
  } catch (error) {
    console.warn(
      `[resume-extract] ${label} failed:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function extractResumeText(
  buffer: Buffer,
  kind: ResumeFileKind
): Promise<{ text: string; usedVision: boolean; method: string }> {
  if (kind === "pdf") {
    try {
      const { text, method } = await extractPdfTextBestEffort(buffer);
      if (text.length >= MIN_RESUME_TEXT_LENGTH) {
        return { text, usedVision: false, method };
      }
    } catch (error) {
      console.warn(
        "[resume-extract] pdf best-effort failed:",
        error instanceof Error ? error.message : error
      );
    }

    const mistral = await tryExtract("mistral-ocr", true, () =>
      extractPdfTextWithMistralOcr(buffer)
    );
    if (mistral) return mistral;

    const gemini = await tryExtract("gemini-pdf-ocr", true, () =>
      extractPdfTextWithGeminiVision(buffer)
    );
    if (gemini) return gemini;

    throw new Error(
      "Could not read your PDF. Please try again in a moment or upload DOCX."
    );
  }

  const docx = await tryExtract("mammoth", false, () => extractDocxText(buffer));
  if (docx) return docx;

  const vision = await tryExtract("gemini-docx-ocr", true, () =>
    extractDocxTextWithGeminiVision(buffer)
  );
  if (vision) return vision;

  throw new Error(
    "Could not read your DOCX. Re-save it from Word or Google Docs and try again."
  );
}
