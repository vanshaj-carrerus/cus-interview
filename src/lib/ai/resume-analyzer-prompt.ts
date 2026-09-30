import { runMockInterviewPrompt } from "@/lib/ai/mock-interview-engine";

type EngineResult<T> = {
  data: T;
  model: string;
};

function parseJsonSafely<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

async function tryGroq<T>(prompt: string): Promise<EngineResult<T>> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  // openai/gpt-oss-20b is the LTS anchor (undated open-weight id, currently working on
  // this org's key). The rest need enabling at console.groq.com/settings/limits.
  const models = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
    "qwen/qwen3.6-27b",
  ];

  for (const modelId of models) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(process.env.GROQ_API_KEY ?? "").trim().replace(/^["']|["']$/g, "")}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) continue;
    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = body.choices?.[0]?.message?.content;
    if (!content) continue;
    return { data: parseJsonSafely<T>(content), model: `groq-${modelId}` };
  }

  throw new Error("Groq chain exhausted.");
}

async function tryMistral<T>(prompt: string): Promise<EngineResult<T>> {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not configured.");
  }
  const models = [
    "mistral-large-latest",
    "mistral-medium-latest",
    "mistral-small-latest",
  ];

  for (const modelId of models) {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(process.env.MISTRAL_API_KEY ?? "").trim().replace(/^["']|["']$/g, "")}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) continue;
    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = body.choices?.[0]?.message?.content;
    if (!content) continue;
    return { data: parseJsonSafely<T>(content), model: `mistral-${modelId}` };
  }

  throw new Error("Mistral chain exhausted.");
}

/** Resume analyzer prefers Groq/Mistral because Gemini free quota is often exhausted. */
export async function runResumeAnalyzerPrompt<T>(
  prompt: string
): Promise<EngineResult<T>> {
  try {
    return await tryGroq<T>(prompt);
  } catch (groqError) {
    console.warn("Resume analyzer Groq failed:", groqError);
    try {
      return await tryMistral<T>(prompt);
    } catch (mistralError) {
      console.warn("Resume analyzer Mistral failed:", mistralError);
      return runMockInterviewPrompt<T>(prompt);
    }
  }
}

/** Improve flow prefers Mistral large for richer structured resume JSON. */
export async function runResumeImprovePrompt<T>(
  prompt: string
): Promise<EngineResult<T>> {
  try {
    return await tryMistral<T>(prompt);
  } catch (mistralError) {
    console.warn("Resume improve Mistral failed:", mistralError);
    return runResumeAnalyzerPrompt<T>(prompt);
  }
}
