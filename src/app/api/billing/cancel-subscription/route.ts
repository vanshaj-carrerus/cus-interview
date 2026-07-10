import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { getRazorpay } from "@/lib/razorpay";
import { syncRazorpaySubscriptionToUser } from "@/lib/billing/sync-subscription";
import type { RazorpaySubscriptionEntity } from "@/types/razorpay";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(sessionUser.id);
    if (!user?.razorpaySubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found." },
        { status: 400 }
      );
    }

    await getRazorpay().subscriptions.cancel(user.razorpaySubscriptionId, true);

    const subscription = (await getRazorpay().subscriptions.fetch(
      user.razorpaySubscriptionId
    )) as RazorpaySubscriptionEntity;

    await syncRazorpaySubscriptionToUser(subscription, user._id.toString());

    return NextResponse.json({
      message: "Subscription cancelled. Access remains until the current period ends.",
    });
  } catch (err) {
    console.error("cancel-subscription", err);
    return NextResponse.json(
      { error: "Could not cancel subscription." },
      { status: 500 }
    );
  }
}
