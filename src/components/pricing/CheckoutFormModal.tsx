"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import {
  parseCheckoutDetails,
  splitFullName,
  type CheckoutDetails,
} from "@/lib/billing/checkout-details";
import { HUMAN_SERVICES, type HumanServiceId } from "@/lib/billing/human-services";
import {
  getServiceTotalDisplay,
  getSubscriptionTotalDisplay,
  GST_RATE,
} from "@/lib/billing/order-amount";
import {
  PRICING_PLANS,
  SUBSCRIPTION_AUTH_AMOUNT_INR,
  TRIAL_DAYS,
  type BillingPlanId,
} from "@/lib/billing/plan";

const BRAND_BLUE = "#00a6f4";

export type CheckoutFormTarget =
  | { type: "plan"; id: BillingPlanId }
  | { type: "service"; id: HumanServiceId };

type CheckoutFormModalProps = {
  target: CheckoutFormTarget;
  submitting: boolean;
  checkoutError?: string | null;
  defaultEmail?: string;
  defaultName?: string;
  onClose: () => void;
  onConfirm: (details: CheckoutDetails) => void;
};

function getProductSummary(target: CheckoutFormTarget) {
  if (target.type === "plan") {
    const plan = PRICING_PLANS[target.id];
    return {
      title: `Activate ${plan.name}`,
      subtitle:
        target.id === "monthly"
          ? "Monthly plan"
          : target.id === "quarterly"
            ? "Quarterly plan"
            : "Test plan",
      name: `${plan.name} (${plan.periodLabel})`,
      totalDisplay: getSubscriptionTotalDisplay(target.id),
      note: `₹${SUBSCRIPTION_AUTH_AMOUNT_INR} charged today · full access now · first auto-debit in 24 hours`,
    };
  }

  const service = HUMAN_SERVICES[target.id];
  return {
    title: `Activate ${service.name}`,
    subtitle: "One-time expert service",
    name: service.name,
    totalDisplay: getServiceTotalDisplay(target.id),
    note: "Pay once · our team contacts you after booking",
  };
}

export default function CheckoutFormModal({
  target,
  submitting,
  checkoutError = null,
  defaultEmail = "",
  defaultName = "",
  onClose,
  onConfirm,
}: CheckoutFormModalProps) {
  const split = splitFullName(defaultName);
  const [firstName, setFirstName] = useState(split.firstName);
  const [lastName, setLastName] = useState(split.lastName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const summary = getProductSummary(target);

  useEffect(() => {
    const parsed = splitFullName(defaultName);
    setFirstName(parsed.firstName);
    setLastName(parsed.lastName);
    setEmail(defaultEmail);
    setPhone("");
    setAgreed(false);
    setFormError(null);
  }, [defaultEmail, defaultName, target]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!agreed) {
      setFormError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    const parsed = parseCheckoutDetails({
      firstName,
      lastName,
      email,
      contact: phone,
    });

    if (!parsed.ok) {
      setFormError(parsed.error);
      return;
    }

    setFormError(null);
    onConfirm(parsed.details);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div
        className="relative w-full max-w-lg rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-form-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-5 top-5 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="checkout-form-title"
          className="pr-8 text-xl font-bold tracking-tight text-slate-900 sm:text-[1.35rem]"
        >
          {summary.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your details to proceed with the payment.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="checkout-first-name"
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                First name
              </label>
              <input
                id="checkout-first-name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  setFormError(null);
                }}
                placeholder="Rahul"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00a6f4] focus:ring-2 focus:ring-[#00a6f4]/15"
              />
            </div>
            <div>
              <label
                htmlFor="checkout-last-name"
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                Last name
              </label>
              <input
                id="checkout-last-name"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  setFormError(null);
                }}
                placeholder="Sharma"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00a6f4] focus:ring-2 focus:ring-[#00a6f4]/15"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="checkout-email"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
            >
              Email address
            </label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFormError(null);
              }}
              placeholder="name@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00a6f4] focus:ring-2 focus:ring-[#00a6f4]/15"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-phone"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
            >
              Mobile number
            </label>
            <input
              id="checkout-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                setFormError(null);
              }}
              placeholder="9876543210"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00a6f4] focus:ring-2 focus:ring-[#00a6f4]/15"
            />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {summary.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  +{GST_RATE * 100}% GST
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {summary.note}
                </p>
              </div>
              <p
                className="text-2xl font-bold tracking-tight"
                style={{ color: BRAND_BLUE }}
              >
                {summary.totalDisplay}
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked);
                setFormError(null);
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#00a6f4] focus:ring-[#00a6f4]"
            />
            <span className="text-xs leading-relaxed text-slate-500">
              By proceeding, you agree to our{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#00a6f4] hover:underline"
                target="_blank"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#00a6f4] hover:underline"
                target="_blank"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {formError || checkoutError ? (
            <p className="text-sm text-red-600" role="alert">
              {formError ?? checkoutError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            {submitting ? "Opening PayU…" : "Proceed to Secure Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}
