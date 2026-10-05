import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSessionPublicUser } from "@/lib/get-session-user";
import {
  inviteEmailsToCoupon,
  MAX_INVITES_PER_REQUEST,
  parseAccessDate,
  parseInviteEmails,
} from "@/lib/billing/coupon-invites";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ couponId: string }>;
};

/** Body `{ emails }` — a pasted list separated by commas, spaces or new lines. */
export async function POST(request: Request, { params }: Props) {
  try {
    const admin = await getSessionPublicUser();
    if (!admin || admin.role !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponId } = await params;
    if (!mongoose.isValidObjectId(couponId)) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const { valid, invalid } = parseInviteEmails(body.emails);
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Not a valid email: ${invalid.slice(0, 3).join(", ")}` },
        { status: 400 }
      );
    }
    if (valid.length === 0) {
      return NextResponse.json({ error: "Enter at least one email." }, { status: 400 });
    }
    if (valid.length > MAX_INVITES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Send at most ${MAX_INVITES_PER_REQUEST} invites at a time.` },
        { status: 400 }
      );
    }

    // Optional access dates for this batch. Resend from the list sends none (keeps existing dates).
    let dates: { startsAt: Date | null; endsAt: Date | null } | undefined;
    if ("accessStartsAt" in body || "accessEndsAt" in body) {
      const startsAt = parseAccessDate(body.accessStartsAt);
      const endsAt = parseAccessDate(body.accessEndsAt);
      if (startsAt === "invalid" || endsAt === "invalid") {
        return NextResponse.json({ error: "Invalid date." }, { status: 400 });
      }
      dates = { startsAt, endsAt };
    }

    const result = await inviteEmailsToCoupon(couponId, valid, admin.id, dates);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ results: result.results });
  } catch (error) {
    console.error("admin-coupons-invite", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
