import { NextResponse } from "next/server";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { checkCouponForCheckout, type CouponTarget } from "@/lib/billing/coupons";
import { isHumanServiceId } from "@/lib/billing/human-services";
import { isPublicBillingPlanId } from "@/lib/billing/plan";

export const dynamic = "force-dynamic";

/** Preview a coupon on the checkout modal. Nothing is reserved here. */
export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    let target: CouponTarget | null = null;
    if (isPublicBillingPlanId(body.plan)) {
      target = { type: "plan", id: body.plan };
    } else if (isHumanServiceId(body.service)) {
      target = { type: "service", id: body.service };
    }

    if (!target) {
      return NextResponse.json({ error: "Invalid checkout item." }, { status: 400 });
    }

    const result = await checkCouponForCheckout(body.code, target, sessionUser.id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ quote: result.quote });
  } catch (err) {
    console.error("coupon-validate-error", err);
    return NextResponse.json({ error: "Could not check coupon." }, { status: 500 });
  }
}
