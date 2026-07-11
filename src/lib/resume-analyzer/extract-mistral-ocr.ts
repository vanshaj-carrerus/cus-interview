import { MIN_RESUME_TEXT_LENGTH } from "@/lib/resume-analyzer/constants";

type MistralOcrPage = {
  markdown?: string;
  text?: string;
};

type MistralOcrResponse = {
  pages?: MistralOcrPage[];
};

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function extractPdfTextWithMistralOcr(
  buffer: Buffer
): Promise<string> {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not configured.");
  }

  const base64 = buffer.toString("base64");
  const response = await fetch("https://api.mistral.ai/v1/ocr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        document_url: `data:application/pdf;base64,${base64}`,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Mistral OCR failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`
    );
  }

  const data = (await response.json()) as MistralOcrResponse;
  const markdown = (data.pages ?? [])
    .map((page) => page.markdown ?? page.text ?? "")
    .filter(Boolean)
    .join("\n\n")
    .trim();

  const text = markdownToPlainText(markdown) || markdown;
  if (text.length < MIN_RESUME_TEXT_LENGTH) {
    throw new Error("Mistral OCR returned empty text for this PDF.");
  }

  return text;
}
