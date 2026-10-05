import { NextResponse } from "next/server";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";
import { checkCodeWithAi } from "@/lib/ai/code-check";

export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** AI review for problems that have no exact test case (Run & Check in problem mode). */
export async function POST(request: Request) {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const questionText = asString(body.questionText).trim();
    const code = asString(body.code);
    if (!questionText || !code.trim()) {
      return NextResponse.json({ error: "Missing problem or code." }, { status: 400 });
    }

    const result = await checkCodeWithAi({
      questionText,
      language: asString(body.language) || "unknown",
      code,
      stdin: asString(body.stdin),
      stdout: asString(body.stdout),
      stderr: asString(body.stderr),
      executionSucceeded: body.executionSucceeded === true,
    });

    return NextResponse.json({ verdict: result.verdict, feedback: result.feedback });
  } catch (error) {
    console.error("compiler-ai-check", error);
    return NextResponse.json(
      { error: "AI check is unavailable right now. Try again in a moment." },
      { status: 503 }
    );
  }
}
