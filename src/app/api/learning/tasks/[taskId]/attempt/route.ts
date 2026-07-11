import { NextResponse } from "next/server";
import { attemptTask } from "@/lib/learning/service";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }
    const sessionUser = access.user;

    const { taskId } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const answer = (body.answer ?? null) as string | number | string[] | null;
    const latencyMs = Number(body.latencyMs ?? 0);
    const result = await attemptTask({
      userId: sessionUser.id,
      taskId,
      answer,
      latencyMs: Number.isFinite(latencyMs) && latencyMs > 0 ? latencyMs : undefined,
    });

    if (!result) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("learning/task/attempt", error);
    return NextResponse.json({ error: "Failed to submit task attempt." }, { status: 500 });
  }
}
