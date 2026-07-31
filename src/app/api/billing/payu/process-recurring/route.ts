import { NextResponse } from "next/server";
import { getBillingSetupError } from "@/lib/billing/config";
import { processDuePayUTrialCharges } from "@/lib/billing/process-payu-trial-charges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) {
    return true;
  }

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

async function handleProcessRecurring(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const setupError = getBillingSetupError();
  if (setupError) {
    return NextResponse.json({ error: setupError }, { status: 503 });
  }

  try {
    const summary = await processDuePayUTrialCharges();
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("payu-process-recurring-error", err);
    const message = err instanceof Error ? err.message : "Failed to process recurring charges.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handleProcessRecurring(request);
}

export async function POST(request: Request) {
  return handleProcessRecurring(request);
}
