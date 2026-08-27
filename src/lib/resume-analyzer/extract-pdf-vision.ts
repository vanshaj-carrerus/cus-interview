import { GoogleGenerativeAI } from "@google/generative-ai";
import { withTimeout } from "@/lib/resume-analyzer/with-timeout";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

const OCR_PROMPT = `Extract ALL readable text from this resume document.

Rules:
- Copy text exactly as written (name, email, phone, experience, education, skills).
- Keep section line breaks.
- Do NOT summarize or invent content.
- Return ONLY plain text — no JSON, no markdown fences.`;

function apiKey(): string {
  return (process.env.GEMINI_API_KEY ?? "").trim().replace(/^["']|["']$/g, "");
}

function isQuotaError(message: string): boolean {
  return /429|quota|rate limit|too many requests/i.test(message);
}

async function extractWithGeminiModels(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const key = apiKey();
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(key);
  const errors: string[] = [];
  let quotaHit = false;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await withTimeout(
        model.generateContent([
          {
            inlineData: {
              mimeType,
              data: buffer.toString("base64"),
            },
          },
          { text: OCR_PROMPT },
        ]),
        15_000,
        modelName
      );

      const text = result.response.text().trim();
      if (text.length >= 20) {
        return text;
      }
      errors.push(`${modelName}: empty response`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Gemini error";
      if (isQuotaError(message)) quotaHit = true;
      errors.push(`${modelName}: ${message}`);
      if (quotaHit) break;
    }
  }

  if (quotaHit) {
    throw new Error(
      "AI OCR quota exceeded. Please upload a text-based PDF exported from Word/Google Docs, or try again later."
    );
  }

  throw new Error(errors.join(" | "));
}

export async function extractPdfTextWithGeminiVision(
  buffer: Buffer
): Promise<string> {
  return extractWithGeminiModels(buffer, "application/pdf");
}

export async function extractDocxTextWithGeminiVision(
  buffer: Buffer
): Promise<string> {
  return extractWithGeminiModels(
    buffer,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}
