import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { parseAccessDate, setRedemptionDates } from "@/lib/billing/coupon-invites";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ couponId: string; redemptionId: string }>;
};

/** Body `{ accessStartsAt, accessEndsAt }` — this user's own access dates (ISO, or null for default). */
export async function PATCH(request: Request, { params }: Props) {
  try {
    const admin = await getSessionPublicUser();
    if (!admin || admin.role !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponId, redemptionId } = await params;
    if (!mongoose.isValidObjectId(couponId) || !mongoose.isValidObjectId(redemptionId)) {
      return NextResponse.json({ error: "User not found for this coupon." }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const startsAt = parseAccessDate(body.accessStartsAt);
    const endsAt = parseAccessDate(body.accessEndsAt);
    if (startsAt === "invalid" || endsAt === "invalid") {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }

    const result = await setRedemptionDates(couponId, redemptionId, startsAt, endsAt);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-coupon-redemption-dates", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
