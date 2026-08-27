import path from "node:path";
import { createRequire } from "node:module";
import { extractText } from "unpdf";
import { withTimeout } from "@/lib/resume-analyzer/with-timeout";

const ENOUGH_TEXT_CHARS = 80;

function cloneBuffer(buffer: Buffer): Buffer {
  return Buffer.from(buffer);
}

function bufferToUint8Array(buffer: Buffer): Uint8Array {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return copy;
}

function asPlainText(text: string | string[] | null | undefined): string {
  if (!text) return "";
  return (Array.isArray(text) ? text.join("\n") : text).trim();
}

export function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

export async function extractPdfTextWithUnpdf(buffer: Buffer): Promise<string> {
  const bytes = bufferToUint8Array(cloneBuffer(buffer));
  const { text } = await extractText(bytes, { mergePages: true });
  const result = asPlainText(text);
  if (!result) throw new Error("unpdf returned empty text");
  return result;
}

export async function extractPdfTextWithPdfParse(
  buffer: Buffer
): Promise<string> {
  const require = createRequire(path.join(process.cwd(), "package.json"));
  const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (
    buf: Buffer
  ) => Promise<{ text?: string }>;

  const data = await pdfParse(cloneBuffer(buffer));
  const text = (data.text ?? "").trim();
  if (!text) throw new Error("pdf-parse returned empty text");
  return text;
}

/** Try local text-layer extractors and stop as soon as we have enough text. */
export async function extractPdfTextBestEffort(buffer: Buffer): Promise<{
  text: string;
  method: string;
}> {
  if (!isPdfBuffer(buffer)) {
    throw new Error("The uploaded file is not a valid PDF.");
  }

  const extractors: Array<{
    label: string;
    fn: (buf: Buffer) => Promise<string>;
    timeoutMs: number;
  }> = [
    { label: "unpdf", fn: extractPdfTextWithUnpdf, timeoutMs: 8000 },
    { label: "pdf-parse", fn: extractPdfTextWithPdfParse, timeoutMs: 6000 },
  ];

  let bestText = "";
  let bestMethod = "";

  for (const { label, fn, timeoutMs } of extractors) {
    try {
      const text = (await withTimeout(fn(buffer), timeoutMs, label)).trim();
      if (text.length > bestText.length) {
        bestText = text;
        bestMethod = label;
      }
      if (bestText.length >= ENOUGH_TEXT_CHARS) {
        return { text: bestText, method: bestMethod };
      }
    } catch (error) {
      console.warn(
        `[resume-extract] ${label} failed:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  if (bestText.length > 0) {
    return { text: bestText, method: bestMethod };
  }

  throw new Error("All PDF extractors returned empty text");
}
