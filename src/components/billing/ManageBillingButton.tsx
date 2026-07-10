"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export default function ManageBillingButton() {
  const { user, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!user?.subscription.hasAccess && user?.subscription.status === "none") {
    return null;
  }

  async function handleCancel() {
    const confirmed = window.confirm(
      "Cancel your subscription? You will keep access until the current billing period ends."
    );
    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not cancel subscription.");
        setSubmitting(false);
        return;
      }

      setMessage(data.message ?? "Subscription cancelled.");
      await refreshUser();
    } catch {
      setError("Could not cancel subscription.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleCancel()}
        disabled={submitting || user?.subscription.status === "canceled"}
        className="rounded-xl border border-primary/30 px-5 py-2.5 text-sm font-medium text-secondary transition hover:border-primary hover:bg-primary/5 disabled:opacity-70"
      >
        {submitting
          ? "Cancelling..."
          : user?.subscription.status === "canceled"
            ? "Subscription cancelled"
            : "Cancel subscription"}
      </button>
      {message ? <p className="text-sm text-primary">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
