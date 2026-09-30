import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { parseCouponInput } from "@/lib/billing/admin-coupons";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ couponId: string }>;
};

async function requireAdmin() {
  const user = await getSessionPublicUser();
  return user && user.role === "SuperAdmin" ? user : null;
}

/** Body `{ isActive }` only toggles; any other body is a full edit. */
export async function PATCH(request: Request, { params }: Props) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponId } = await params;
    if (!mongoose.isValidObjectId(couponId)) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    await connectDB();

    if (Object.keys(body).length === 1 && typeof body.isActive === "boolean") {
      const updated = await Coupon.findByIdAndUpdate(couponId, { isActive: body.isActive });
      if (!updated) {
        return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    const parsed = parseCouponInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const clash = await Coupon.exists({ code: parsed.input.code, _id: { $ne: couponId } });
    if (clash) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    }

    const updated = await Coupon.findByIdAndUpdate(couponId, parsed.input);
    if (!updated) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-coupons-update", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Props) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponId } = await params;
    if (!mongoose.isValidObjectId(couponId)) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }

    await connectDB();
    await Coupon.findByIdAndDelete(couponId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-coupons-delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
