import path from "node:path";
import { createRequire } from "node:module";
import { definePDFJSModule, extractText, getDocumentProxy } from "unpdf";

let pdfJsReady: Promise<void> | null = null;

function cloneBuffer(buffer: Buffer): Buffer {
  return Buffer.from(buffer);
}

function bufferToUint8Array(buffer: Buffer): Uint8Array {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return copy;
}

async function ensurePdfJsModule(): Promise<void> {
  if (!pdfJsReady) {
    pdfJsReady = definePDFJSModule(() =>
      import("pdfjs-dist/legacy/build/pdf.mjs")
    );
  }
  await pdfJsReady;
}

export function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

export async function extractPdfTextWithUnpdf(buffer: Buffer): Promise<string> {
  await ensurePdfJsModule();
  const bytes = bufferToUint8Array(cloneBuffer(buffer));
  const errors: string[] = [];

  const attempts = [
    async () => {
      const { text } = await extractText(bytes, { mergePages: true });
      return (text ?? "").trim();
    },
    async () => {
      const pdf = await getDocumentProxy(bytes);
      const { text } = await extractText(pdf, { mergePages: true });
      return (text ?? "").trim();
    },
  ];

  for (const attempt of attempts) {
    try {
      const text = await attempt();
      if (text.length > 0) return text;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "unpdf attempt failed");
    }
  }

  throw new Error(errors.join(" | ") || "unpdf returned empty text");
}

export async function extractPdfTextWithPdfParse(
  buffer: Buffer
): Promise<string> {
  const require = createRequire(path.join(process.cwd(), "package.json"));
  const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (
    buf: Buffer
  ) => Promise<{ text?: string }>;

  const data = await pdfParse(cloneBuffer(buffer));
  return (data.text ?? "").trim();
}

export async function extractPdfTextWithPdfJs(
  buffer: Buffer
): Promise<string> {
  await ensurePdfJsModule();
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({
    data: bufferToUint8Array(cloneBuffer(buffer)),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  const parts: string[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
      .join(" ");
    parts.push(pageText);
    page.cleanup();
  }

  return parts.join("\n").trim();
}

/** Run every local PDF extractor and return the longest non-empty result. */
export async function extractPdfTextBestEffort(buffer: Buffer): Promise<{
  text: string;
  method: string;
}> {
  if (!isPdfBuffer(buffer)) {
    throw new Error("The uploaded file is not a valid PDF.");
  }

  const extractors: Array<{ label: string; fn: (buf: Buffer) => Promise<string> }> =
    [
      { label: "pdf-parse", fn: extractPdfTextWithPdfParse },
      { label: "unpdf", fn: extractPdfTextWithUnpdf },
      { label: "pdfjs", fn: extractPdfTextWithPdfJs },
    ];

  let bestText = "";
  let bestMethod = "";
  const errors: string[] = [];

  for (const { label, fn } of extractors) {
    try {
      const text = (await fn(buffer)).trim();
      if (text.length > bestText.length) {
        bestText = text;
        bestMethod = label;
      }
    } catch (error) {
      errors.push(
        `${label}: ${error instanceof Error ? error.message : "failed"}`
      );
    }
  }

  if (bestText.length > 0) {
    return { text: bestText, method: bestMethod };
  }

  throw new Error(errors.join(" | ") || "All PDF extractors returned empty text");
}
