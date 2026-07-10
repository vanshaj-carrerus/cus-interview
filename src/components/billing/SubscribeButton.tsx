"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { openRazorpaySubscriptionCheckout } from "@/lib/billing/razorpay-checkout-client";

type SubscribeButtonProps = {
  label?: string;
  className?: string;
};

export default function SubscribeButton({
  label = "Select Plan",
  className = "",
}: SubscribeButtonProps) {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);

    if (!user) {
      router.push("/login?next=/pricing&reason=subscribe");
      return;
    }

    if (user.subscription.hasAccess) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ plan: "monthly" }),
      });
      const data = (await res.json()) as {
        subscriptionId?: string;
        keyId?: string;
        name?: string;
        description?: string;
        prefill?: { name?: string; email?: string };
        error?: string;
      };

      if (!res.ok || !data.subscriptionId || !data.keyId) {
        setError(data.error ?? "Could not start checkout.");
        setSubmitting(false);
        return;
      }

      const checkout = await openRazorpaySubscriptionCheckout({
        keyId: data.keyId,
        subscriptionId: data.subscriptionId,
        name: data.name,
        description: data.description,
        prefill: data.prefill,
        onSuccess: async () => {
          const verifyRes = await fetch("/api/billing/verify-subscription", {
            method: "POST",
            credentials: "same-origin",
          });
          if (!verifyRes.ok) {
            setError("Subscription verification failed.");
            setSubmitting(false);
            return;
          }
          await refreshUser();
          window.location.href = "/pricing/success?type=plan&product=monthly";
        },
        onFailure: (message) => {
          setError(message);
          setSubmitting(false);
        },
        onDismiss: () => {
          setSubmitting(false);
        },
      });

      if (!checkout.ok) {
        setError(checkout.error);
        setSubmitting(false);
      }
    } catch {
      setError("Could not start checkout.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className={`rounded-xl bg-primary/60 px-6 py-3 text-sm font-semibold text-white ${className}`}
      >
        Loading...
      </button>
    );
  }

  if (user?.subscription.hasAccess) {
    return (
      <p className="text-sm font-medium text-primary">Your plan is active.</p>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className={`rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      >
        {submitting ? "Opening checkout..." : label}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
