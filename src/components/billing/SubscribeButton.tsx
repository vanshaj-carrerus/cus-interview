"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { submitPayUForm } from "@/lib/billing/payu-checkout-client";
import {
  isValidIndianPhone,
  normalizeIndianPhone,
} from "@/lib/billing/phone";

type SubscribeButtonProps = {
  label?: string;
  className?: string;
};

export default function SubscribeButton({
  label = "Select Plan",
  className = "",
}: SubscribeButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  async function startCheckout(contact: string) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/billing/payu/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ plan: "monthly", contact }),
      });

      const data = (await res.json()) as {
        actionUrl?: string;
        params?: Record<string, string>;
        error?: string;
      };

      if (!res.ok || !data.actionUrl || !data.params) {
        setError(data.error ?? "Could not start checkout.");
        setSubmitting(false);
        return;
      }

      submitPayUForm({
        actionUrl: data.actionUrl,
        params: data.params,
      });
    } catch {
      setError("Could not start checkout.");
      setSubmitting(false);
    }
  }

  function handlePhoneSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidIndianPhone(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    void startCheckout(normalizeIndianPhone(phone)!);
  }

  function handleClick() {
    setError(null);

    if (!user) {
      router.push("/login?next=/pricing&reason=subscribe");
      return;
    }

    if (user.subscription.hasAccess) {
      return;
    }

    setShowPhoneForm(true);
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

  if (showPhoneForm) {
    return (
      <form className="space-y-3" onSubmit={handlePhoneSubmit}>
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
          <span className="flex items-center bg-slate-50 px-3 text-sm text-slate-500">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Mobile for payment"
            className="w-full px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPhoneForm(false)}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70 ${className}`}
          >
            {submitting ? "Opening PayU..." : label}
          </button>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
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
        {submitting ? "Opening PayU..." : label}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
