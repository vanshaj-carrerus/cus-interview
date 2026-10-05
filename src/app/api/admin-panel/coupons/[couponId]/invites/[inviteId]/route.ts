import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { deleteInvite, setInvitePaused } from "@/lib/billing/coupon-invites";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ couponId: string; inviteId: string }>;
};

async function resolveIds(params: Props["params"]) {
  const admin = await getSessionPublicUser();
  if (!admin || admin.role !== "SuperAdmin") {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const { couponId, inviteId } = await params;
  if (!mongoose.isValidObjectId(couponId) || !mongoose.isValidObjectId(inviteId)) {
    return { response: NextResponse.json({ error: "Invite not found." }, { status: 404 }) };
  }
  return { couponId, inviteId };
}

/** Body `{ paused }` — pause or resume this person's access. */
export async function PATCH(request: Request, { params }: Props) {
  try {
    const ids = await resolveIds(params);
    if ("response" in ids) return ids.response;

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    if (typeof body.paused !== "boolean") {
      return NextResponse.json({ error: "Send { paused: true | false }." }, { status: 400 });
    }

    const result = await setInvitePaused(ids.couponId, ids.inviteId, body.paused);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-coupon-invite-pause", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/** Removes the invite and the access it gave. */
export async function DELETE(_: Request, { params }: Props) {
  try {
    const ids = await resolveIds(params);
    if ("response" in ids) return ids.response;

    const result = await deleteInvite(ids.couponId, ids.inviteId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin-coupon-invite-delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
