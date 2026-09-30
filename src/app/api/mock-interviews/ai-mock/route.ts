import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { assertCanCreateMockInterview } from "@/lib/billing/mock-interview-quota";
import { consumeFeatureCredit, getFeatureAccessSession } from "@/lib/billing/feature-credits";
import { AiMockInterview } from "@/models/AiMockInterview";

type CreateAiMockInterviewBody = {
  languages?: unknown;
  framework?: unknown;
  role?: unknown;
  seniority?: unknown;
  focusAreas?: unknown;
  notes?: unknown;
};

const NOTE_MAX_LENGTH = 100;

export async function POST(request: Request) {
  try {
    const access = await getFeatureAccessSession("mockInterview");
    if ("error" in access) {
      return access.error;
    }
    const sessionUser = access.user;

    const body = (await request.json()) as CreateAiMockInterviewBody;
    const languages = Array.isArray(body.languages) ? body.languages.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
    const framework = typeof body.framework === "string" ? body.framework.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const seniority = typeof body.seniority === "string" ? body.seniority.trim() : "";
    const focusAreas = Array.isArray(body.focusAreas) ? body.focusAreas.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
    const notes =
      typeof body.notes === "string"
        ? body.notes.trim().slice(0, NOTE_MAX_LENGTH)
        : "";

    if (!seniority) {
      return NextResponse.json({ error: "Seniority is required." }, { status: 400 });
    }
    if (focusAreas.length === 0) {
      return NextResponse.json({ error: "Pick at least one interview focus area." }, { status: 400 });
    }
    if (languages.length === 0 && !framework && !role) {
      return NextResponse.json(
        { error: "Add at least one of role, language, or framework." },
        { status: 400 }
      );
    }

    // Coupon-credit users spend one credit per interview; plan users keep the trial/daily rules.
    let refundCredit: (() => Promise<void>) | null = null;
    if (access.via === "credits") {
      const consumed = await consumeFeatureCredit(sessionUser.id, "mockInterview");
      if ("error" in consumed) {
        return consumed.error;
      }
      refundCredit = consumed.refund;
    } else {
      const createLimit = await assertCanCreateMockInterview(
        sessionUser.subscription,
        sessionUser.id,
        sessionUser.role === "SuperAdmin"
      );
      if (!createLimit.allowed) {
        return NextResponse.json(
          { error: createLimit.message, code: createLimit.code },
          { status: 429 }
        );
      }
    }

    await connectDB();
    let interview;
    try {
      interview = await AiMockInterview.create({
        userId: sessionUser.id,
        showToUser: true,
        languages,
        framework,
        role,
        seniority,
        focusAreas,
        notes,
        status: "created",
      });
    } catch (error) {
      await refundCredit?.();
      throw error;
    }

    return NextResponse.json({
      interview: { id: interview._id.toString() },
    });
  } catch (error) {
    console.error("mock-interviews/ai-mock/create", error);
    return NextResponse.json({ error: "Failed to create AI mock interview." }, { status: 500 });
  }
}
