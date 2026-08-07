import { GoogleGenerativeAI } from "@google/generative-ai";

type EngineResult<T> = {
  data: T;
  model: string;
};

function parseJsonSafely<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned) as T;
}

async function tryGemini<T>(prompt: string): Promise<EngineResult<T>> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
  const result = await model.generateContent(prompt);
  return {
    data: parseJsonSafely<T>(result.response.text()),
    model: "gemini-2.0-flash",
  };
}

async function tryGroqChain<T>(prompt: string): Promise<EngineResult<T>> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  const models = [
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
    "llama-3.1-8b-instant",
  ];

  for (const modelId of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = body.choices?.[0]?.message?.content;
      if (!content) continue;
      return {
        data: parseJsonSafely<T>(content),
        model: `groq-${modelId}`,
      };
    } catch {
      // try next provider model
    }
  }
  throw new Error("Groq chain exhausted.");
}

async function tryMistralChain<T>(prompt: string): Promise<EngineResult<T>> {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not configured.");
  }
  const models = [
    "mistral-large-latest",
    "mistral-medium-latest",
    "mistral-small-latest",
  ];

  for (const modelId of models) {
    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = body.choices?.[0]?.message?.content;
      if (!content) continue;
      return {
        data: parseJsonSafely<T>(content),
        model: `mistral-${modelId}`,
      };
    } catch {
      // try next provider model
    }
  }

  throw new Error("Mistral chain exhausted.");
}

async function tryOpenRouter<T>(prompt: string): Promise<EngineResult<T>> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }
  const models = ["google/gemma-4-26b-a4b-it:free", "google/gemma-4-31b-it:free", "nousresearch/hermes-3-llama-3.1-405b:free"];
  for (const modelId of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = body.choices?.[0]?.message?.content;
      if (!content) continue;
      return {
        data: parseJsonSafely<T>(content),
        model: `openrouter-${modelId}`,
      };
    } catch {
      // try next provider model
    }
  }
  throw new Error("OpenRouter chain exhausted.");
}

export async function runMockInterviewPrompt<T>(prompt: string): Promise<EngineResult<T>> {
  try {
    return await tryGemini<T>(prompt);
  } catch (geminiError) {
    console.warn("Gemini failed, fallback to Mistral:", geminiError);
    try {
      return await tryMistralChain<T>(prompt);
    } catch (mistralError) {
      console.warn("Mistral failed, fallback to Groq:", mistralError);
      try {
        return await tryGroqChain<T>(prompt);
      } catch (groqError) {
        console.warn("Groq failed, fallback to OpenRouter:", groqError);
        return tryOpenRouter<T>(prompt);
      }
    }
  }
}
