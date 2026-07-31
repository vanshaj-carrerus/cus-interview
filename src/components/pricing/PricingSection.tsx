"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import ManageBillingButton from "@/components/billing/ManageBillingButton";
import CheckoutFormModal from "@/components/pricing/CheckoutFormModal";
import { submitPayUForm } from "@/lib/billing/payu-checkout-client";
import type { CheckoutDetails } from "@/lib/billing/checkout-details";
import {
  HUMAN_SERVICES,
  HUMAN_SERVICE_IDS,
  type HumanServiceId,
} from "@/lib/billing/human-services";
import {
  getSubscriptionTotalDisplay,
  GST_RATE,
} from "@/lib/billing/order-amount";
import {
  PRICING_FEATURES,
  PRICING_PLANS,
  PUBLIC_BILLING_PLAN_IDS,
  type PublicBillingPlanId,
  type PricingFeature,
} from "@/lib/billing/plan";

const BRAND_BLUE = "#00a6f4";

type CheckoutTarget =
  | { type: "plan"; id: PublicBillingPlanId }
  | { type: "service"; id: HumanServiceId };

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-16 bg-slate-200 sm:w-24" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <span className="h-px w-16 bg-slate-200 sm:w-24" />
    </div>
  );
}

function FeatureItem({ feature }: { feature: PricingFeature | string }) {
  const label = typeof feature === "string" ? feature : feature.label;
  const isNew = typeof feature !== "string" && feature.isNew;

  return (
    <li className="flex items-start gap-2.5">
      <Check
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: BRAND_BLUE }}
        strokeWidth={2.5}
      />
      <span className="text-[13px] leading-snug text-slate-600">
        {label}
        {isNew ? (
          <span className="ml-1 font-semibold text-slate-500">(NEW)</span>
        ) : null}
      </span>
    </li>
  );
}

function SelectPlanButton({
  onClick,
  submitting,
  disabled,
  label = "Select Plan",
}: {
  onClick: () => void;
  submitting: boolean;
  disabled: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || submitting}
      className="mt-6 w-full rounded-full bg-[#eef8fd] py-3.5 text-sm font-semibold text-[#00a6f4] transition hover:bg-[#00a6f4] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submitting ? "Opening PayU…" : label}
    </button>
  );
}

function PricingCard({
  planId,
  onCheckout,
  submitting,
  disabled,
  planActive,
}: {
  planId: PublicBillingPlanId;
  onCheckout: (target: CheckoutTarget) => void;
  submitting: boolean;
  disabled: boolean;
  planActive: boolean;
}) {
  const plan = PRICING_PLANS[planId];
  const isQuarterly = planId === "quarterly";

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-slate-200/90 bg-white px-6 py-7 sm:px-7 sm:py-8">
      <p
        className="text-[15px] font-semibold tracking-tight"
        style={{ color: BRAND_BLUE }}
      >
        {plan.name}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {plan.periodLabel}
      </p>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        {isQuarterly && "originalPriceDisplay" in plan ? (
          <span className="mr-1 text-sm text-slate-400 line-through">
            {plan.originalPriceDisplay}
          </span>
        ) : null}
        <span className="text-[2rem] font-bold leading-none tracking-tight text-slate-900">
          {plan.priceDisplay}
        </span>
        <span className="text-sm font-normal text-slate-400">
          {plan.periodSuffix}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        One-time payment: {plan.priceDisplay} + {GST_RATE * 100}% GST ={" "}
        {getSubscriptionTotalDisplay(planId)}
        {plan.periodSuffix.toLowerCase()}
      </p>

      {planActive ? (
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-default rounded-full bg-slate-100 py-3.5 text-sm font-semibold text-slate-500"
        >
          Plan Active
        </button>
      ) : (
        <SelectPlanButton
          onClick={() => onCheckout({ type: "plan", id: planId })}
          submitting={submitting}
          disabled={disabled}
        />
      )}

      <div className="mt-7 flex flex-1 flex-col border-t border-slate-100 pt-6">
        <ul className="space-y-3.5">
          {PRICING_FEATURES.map((feature) => (
            <FeatureItem key={feature.label} feature={feature} />
          ))}
        </ul>
      </div>
    </article>
  );
}

function HumanServiceCard({
  serviceId,
  onCheckout,
  submitting,
  disabled,
}: {
  serviceId: HumanServiceId;
  onCheckout: (target: CheckoutTarget) => void;
  submitting: boolean;
  disabled: boolean;
}) {
  const service = HUMAN_SERVICES[serviceId];

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-slate-200/90 bg-white px-6 py-7 sm:px-7 sm:py-8">
      <p
        className="text-[15px] font-semibold tracking-tight"
        style={{ color: BRAND_BLUE }}
      >
        {service.name}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {service.tagline}
      </p>

      <div className="mt-5 flex items-baseline gap-x-1.5">
        <span className="text-[2rem] font-bold leading-none tracking-tight text-slate-900">
          {service.priceDisplay}
        </span>
        <span className="text-sm font-normal text-slate-400">one-time</span>
      </div>

      <SelectPlanButton
        onClick={() => onCheckout({ type: "service", id: serviceId })}
        submitting={submitting}
        disabled={disabled}
      />

      <div className="mt-7 flex flex-1 flex-col border-t border-slate-100 pt-6">
        <ul className="space-y-3.5">
          {service.features.map((feature) => (
            <FeatureItem key={feature} feature={feature} />
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function PricingSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionRequired =
    searchParams.get("reason") === "subscription-required";
  const { user, loading, refreshUser } = useAuth();
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState<CheckoutTarget | null>(
    null
  );
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handlePlanCheckout(
    target: Extract<CheckoutTarget, { type: "plan" }>,
    details: CheckoutDetails
  ): Promise<boolean> {
    const res = await fetch("/api/billing/payu/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        plan: target.id,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        contact: details.contact,
      }),
    });
    const data = (await res.json()) as {
      actionUrl?: string;
      params?: Record<string, string>;
      error?: string;
    };

    if (!res.ok || !data.actionUrl || !data.params) {
      const message = data.error ?? "Could not start PayU checkout.";
      setCheckoutError(message);
      setError(message);
      setSubmittingKey(null);
      return false;
    }

    submitPayUForm({
      actionUrl: data.actionUrl,
      params: data.params,
    });

    setCheckoutError(null);
    return true;
  }

  async function handleServiceCheckout(
    target: Extract<CheckoutTarget, { type: "service" }>,
    details: CheckoutDetails
  ): Promise<boolean> {
    const res = await fetch("/api/billing/payu/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        service: target.id,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        contact: details.contact,
      }),
    });
    const data = (await res.json()) as {
      actionUrl?: string;
      params?: Record<string, string>;
      error?: string;
    };

    if (!res.ok || !data.actionUrl || !data.params) {
      const message = data.error ?? "Could not start PayU checkout.";
      setCheckoutError(message);
      setError(message);
      setSubmittingKey(null);
      return false;
    }

    submitPayUForm({
      actionUrl: data.actionUrl,
      params: data.params,
    });

    setCheckoutError(null);
    return true;
  }

  async function handleCheckout(target: CheckoutTarget) {
    setError(null);
    setCheckoutError(null);

    if (!user) {
      setError("Please log in to continue with PayU checkout.");
      router.push("/login?next=/pricing&reason=subscribe");
      return;
    }

    if (target.type === "plan" && user.subscription.hasAccess) {
      setError("Your platform plan is already active.");
      return;
    }

    setPendingCheckout(target);
  }

  async function confirmCheckout(details: CheckoutDetails) {
    if (!pendingCheckout) {
      return;
    }

    setError(null);
    setCheckoutError(null);
    const key = `${pendingCheckout.type}:${pendingCheckout.id}`;
    setSubmittingKey(key);

    try {
      const opened =
        pendingCheckout.type === "plan"
          ? await handlePlanCheckout(pendingCheckout, details)
          : await handleServiceCheckout(pendingCheckout, details);

      if (opened) {
        setPendingCheckout(null);
        setCheckoutError(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start PayU checkout.";
      setCheckoutError(message);
      setError(message);
      setSubmittingKey(null);
    }
  }

  function closeCheckoutModal() {
    if (submittingKey) {
      return;
    }
    setPendingCheckout(null);
  }

  const hasPlatformAccess = user?.subscription.hasPlatformAccess;
  const isBusy = submittingKey !== null || pendingCheckout !== null;
  const pendingSubmittingKey = pendingCheckout
    ? `${pendingCheckout.type}:${pendingCheckout.id}`
    : null;

  return (
    <section className="bg-[#f5f6f8] px-4 py-14 sm:px-6 sm:py-20">
      {pendingCheckout ? (
        <CheckoutFormModal
          target={pendingCheckout}
          submitting={submittingKey === pendingSubmittingKey}
          checkoutError={checkoutError}
          defaultEmail={user?.email}
          defaultName={user?.name}
          onClose={closeCheckoutModal}
          onConfirm={confirmCheckout}
        />
      ) : null}
      <div className="mx-auto max-w-6xl">
        {subscriptionRequired ? (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm text-amber-900">
            Practice Problems, Programming Languages, Mock Interviews, ATS Resume
            Analyzer, and Compiler are available with an active monthly (₹499) or
            quarterly (₹1,299) plan.
          </div>
        ) : null}

        <header className="mx-auto max-w-3xl text-center">
          <SectionLabel label="Pricing Plans" />

          <h1 className="mt-6 text-[2rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.35rem]">
            Choose Your{" "}
            <span style={{ color: BRAND_BLUE }}>Success</span> Plan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
            Pay once for full platform access. Plan price + 18% GST is charged
            upfront via PayU — no auto-debit or recurring mandate.
          </p>
        </header>

        {loading ? (
          <p className="mt-16 text-center text-sm text-slate-400">Loading…</p>
        ) : (
          <>
            {hasPlatformAccess ? (
              <div className="mx-auto mt-8 max-w-md rounded-[28px] border border-slate-200/90 bg-white px-7 py-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  Your platform plan is active.
                </p>
                <div className="mt-4 flex justify-center">
                  <ManageBillingButton />
                </div>
              </div>
            ) : null}

            <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2 sm:gap-6">
              {PUBLIC_BILLING_PLAN_IDS.map((planId) => (
                <PricingCard
                  key={planId}
                  planId={planId}
                  onCheckout={handleCheckout}
                  submitting={submittingKey === `plan:${planId}`}
                  disabled={isBusy}
                  planActive={Boolean(hasPlatformAccess)}
                />
              ))}
            </div>

            <div className="mt-20">
              <SectionLabel label="Expert Human Services" />

              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                Get help from{" "}
                <span style={{ color: BRAND_BLUE }}>real experts</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
                Select Plan to pay via PayU. Our team contacts you after
                booking.
              </p>

              <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {HUMAN_SERVICE_IDS.map((serviceId) => (
                  <HumanServiceCard
                    key={serviceId}
                    serviceId={serviceId}
                    onCheckout={handleCheckout}
                    submitting={submittingKey === `service:${serviceId}`}
                    disabled={isBusy}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {error ? (
          <p className="mt-8 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <footer className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            * Prices exclude 18% GST. You pay the full amount (base + GST) once at
            checkout — e.g. ₹499 + GST = {getSubscriptionTotalDisplay("monthly")}/month.
            Access lasts for the plan period; renew manually when it ends.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Secure payments powered by PayU.
          </p>
        </footer>
      </div>
    </section>
  );
}
