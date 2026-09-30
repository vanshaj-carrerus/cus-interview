import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getAdminCoupons, parseCouponInput } from "@/lib/billing/admin-coupons";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionPublicUser();
  if (!user || user.role !== "SuperAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ coupons: await getAdminCoupons() });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionPublicUser();
    if (!user || user.role !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const parsed = parseCouponInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await connectDB();
    const existing = await Coupon.exists({ code: parsed.input.code });
    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    }

    const coupon = await Coupon.create({ ...parsed.input, createdBy: user.id });
    return NextResponse.json({ id: coupon._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("admin-coupons-create", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
