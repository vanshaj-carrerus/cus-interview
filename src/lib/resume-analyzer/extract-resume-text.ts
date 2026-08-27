import mammoth from "mammoth";
import { MIN_RESUME_TEXT_LENGTH } from "@/lib/resume-analyzer/constants";
import { extractPdfTextBestEffort } from "@/lib/resume-analyzer/extract-pdf";
import { extractPdfTextWithMistralOcr } from "@/lib/resume-analyzer/extract-mistral-ocr";
import {
  extractDocxTextWithGeminiVision,
  extractPdfTextWithGeminiVision,
} from "@/lib/resume-analyzer/extract-pdf-vision";
import { withTimeout } from "@/lib/resume-analyzer/with-timeout";

export type ResumeFileKind = "pdf" | "docx";

const IMAGE_LIKE_PDF_BYTES = 150_000;
const IMAGE_LIKE_PDF_MAX_TEXT = 120;

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

function looksLikeImagePdf(buffer: Buffer, text: string): boolean {
  return buffer.length >= IMAGE_LIKE_PDF_BYTES && text.length < IMAGE_LIKE_PDF_MAX_TEXT;
}

async function extractPdfWithOcr(buffer: Buffer): Promise<ExtractionAttempt | null> {
  try {
    return await Promise.any([
      tryExtract("mistral-ocr", true, () => extractPdfTextWithMistralOcr(buffer)).then(
        (result) => {
          if (!result) throw new Error("mistral-ocr returned too little text");
          return result;
        }
      ),
      tryExtract("gemini-pdf-ocr", true, () =>
        extractPdfTextWithGeminiVision(buffer)
      ).then((result) => {
        if (!result) throw new Error("gemini-pdf-ocr returned too little text");
        return result;
      }),
    ]);
  } catch (error) {
    console.warn(
      "[resume-extract] OCR race failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

async function extractPdfResumeText(
  buffer: Buffer
): Promise<ExtractionAttempt> {
  let localText = "";
  let localMethod = "pdf-text";

  try {
    const extracted = await extractPdfTextBestEffort(buffer);
    localText = extracted.text;
    localMethod = extracted.method;
    if (
      localText.length >= MIN_RESUME_TEXT_LENGTH &&
      !looksLikeImagePdf(buffer, localText)
    ) {
      return { text: localText, usedVision: false, method: localMethod };
    }
  } catch (error) {
    console.warn(
      "[resume-extract] pdf best-effort failed:",
      error instanceof Error ? error.message : error
    );
  }

  const ocr = await extractPdfWithOcr(buffer);
  if (ocr) return ocr;

  if (localText.length >= MIN_RESUME_TEXT_LENGTH) {
    return { text: localText, usedVision: false, method: localMethod };
  }

  throw new Error(
    "Could not read your PDF. Please try again in a moment or upload DOCX."
  );
}

export async function extractResumeText(
  buffer: Buffer,
  kind: ResumeFileKind
): Promise<{ text: string; usedVision: boolean; method: string }> {
  if (kind === "pdf") {
    try {
      return await withTimeout(extractPdfResumeText(buffer), 35_000, "pdf-extract");
    } catch (error) {
      if (error instanceof Error && /timed out/i.test(error.message)) {
        throw new Error(
          "Reading this PDF took too long. Please upload a DOCX or a smaller text-based PDF."
        );
      }
      throw error;
    }
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
