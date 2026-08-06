"use client";

import { useState } from "react";
import Link from "next/link";
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
  type PublicBillingPlanId,
  type PricingFeature,
} from "@/lib/billing/plan";

type BillingCycle = "monthly" | "quarterly";

type CheckoutTarget =
  | { type: "plan"; id: PublicBillingPlanId }
  | { type: "service"; id: HumanServiceId };

const STAR_LAYERS = [
  "radial-gradient(1px 1px at 14% 22%, rgba(255,255,255,0.85) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 32% 58%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(1.5px 1.5px at 48% 18%, rgba(255,255,255,0.8) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 66% 72%, rgba(255,255,255,0.45) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 82% 34%, rgba(255,255,255,0.7) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.4) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 8% 70%, rgba(255,255,255,0.55) 0%, transparent 100%)",
  "radial-gradient(1.5px 1.5px at 55% 42%, rgba(255,255,255,0.75) 0%, transparent 100%)",
].join(",");

const CUSTOM_PLAN_FEATURES = [
  "Everything in Full Access plans",
  "Team seats and admin controls",
  "Custom assessment workflows",
  "Dedicated success manager",
  "Priority support & onboarding",
  "Invoice / PO billing options",
];

function FeatureItem({
  feature,
  dark,
}: {
  feature: PricingFeature | string;
  dark?: boolean;
}) {
  const label = typeof feature === "string" ? feature : feature.label;
  const isNew = typeof feature !== "string" && feature.isNew;

  return (
    <li className="flex items-start gap-2.5">
      <Check
        className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-primary" : "text-emerald-500"}`}
        strokeWidth={2.5}
      />
      <span
        className={`text-[13px] leading-snug ${dark ? "text-white/85" : "text-slate-700"}`}
      >
        {label}
        {isNew ? (
          <span className={`ml-1 font-semibold ${dark ? "text-primary" : "text-slate-500"}`}>
            (NEW)
          </span>
        ) : null}
      </span>
    </li>
  );
}

export default function PricingSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionRequired =
    searchParams.get("reason") === "subscription-required";
  const { user, loading } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
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

  const monthly = PRICING_PLANS.monthly;
  const quarterly = PRICING_PLANS.quarterly;
  const quarterlyPerMonth = Math.round(1299 / 3);

  return (
    <section className="relative overflow-hidden bg-[#f7f8fa] px-4 py-14 sm:px-6 sm:py-20">
      {/* Soft aurora mesh — mint left, lavender right */}
      <div
        className="pointer-events-none absolute -left-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#86efac]/40 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-28 -top-16 h-[32rem] w-[32rem] rounded-full bg-[#c4b5fd]/45 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[28%] top-4 h-56 w-[34rem] rounded-full bg-white/70 blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-24 left-[-3rem] h-64 w-64 rounded-full bg-[#bbf7d0]/30 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 bottom-16 h-72 w-72 rounded-full bg-[#ddd6fe]/35 blur-[100px]"
        aria-hidden
      />

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

      <div className="relative mx-auto w-full max-w-6xl">
        {subscriptionRequired ? (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm text-amber-900">
            Practice Problems, Programming Languages, Mock Interviews, ATS Resume
            Analyzer, and Compiler are available with an active monthly (₹499) or
            quarterly (₹1,299) plan.
          </div>
        ) : null}

        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-secondary sm:text-[2.5rem]">
            Choose a plan that works for you
          </h1>


          <div className="relative mx-auto mt-8 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-secondary text-white"
                  : "text-slate-600 hover:text-secondary"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("quarterly")}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition ${
                billingCycle === "quarterly"
                  ? "bg-secondary text-white"
                  : "text-slate-600 hover:text-secondary"
              }`}
            >
              Quarterly
              <span className="absolute -top-3 right-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Save ₹198
              </span>
            </button>
          </div>

          {billingCycle === "quarterly" ? (
            <div className="mx-auto mt-5 max-w-xl rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-sky-900">
              Quarterly plans save you money — get 3 months for ₹1,299 instead of
              ₹1,497.
            </div>
          ) : (
            <div className="mx-auto mt-5 max-w-xl rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-sky-900">
              Flexible month-to-month access. Switch to quarterly anytime to save.
            </div>
          )}
        </header>

        {loading ? (
          <p className="mt-16 text-center text-sm text-slate-400">Loading…</p>
        ) : (
          <>
            {hasPlatformAccess ? (
              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-white px-7 py-6 text-center">
                <p className="text-sm font-semibold text-secondary">
                  Your platform plan is active.
                </p>
                <div className="mt-4 flex justify-center">
                  <ManageBillingButton />
                </div>
              </div>
            ) : null}

            <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 sm:grid-cols-2 sm:gap-6">
              {billingCycle === "monthly" ? (
                <PlanCard
                  name="Monthly"
                  accent="text-primary"
                  price={monthly.priceDisplay}
                  priceSuffix="/mo"
                  billedNote={`${getSubscriptionTotalDisplay("monthly")} with GST · billed monthly`}
                  featuresHeading="Everything you need to prepare:"
                  featured
                  planActive={Boolean(hasPlatformAccess)}
                  submitting={submittingKey === "plan:monthly"}
                  disabled={isBusy}
                  onBuy={() => handleCheckout({ type: "plan", id: "monthly" })}
                />
              ) : (
                <PlanCard
                  name="Quarterly"
                  accent="text-primary"
                  price={`₹${quarterlyPerMonth}`}
                  priceSuffix="/mo"
                  billedNote={`${quarterly.priceDisplay} billed quarterly · ${getSubscriptionTotalDisplay("quarterly")} with GST`}
                  originalPrice={
                    "originalPriceDisplay" in quarterly
                      ? quarterly.originalPriceDisplay
                      : undefined
                  }
                  featuresHeading="Best value — full access for 3 months:"
                  featured
                  planActive={Boolean(hasPlatformAccess)}
                  submitting={submittingKey === "plan:quarterly"}
                  disabled={isBusy}
                  onBuy={() => handleCheckout({ type: "plan", id: "quarterly" })}
                  badge="Popular"
                />
              )}

              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                <p className="text-lg font-bold text-teal-700">Custom</p>
                <p className="mt-4 text-3xl font-bold tracking-tight text-secondary">
                  Custom Pricing
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  For teams and hiring partners who need scale.
                </p>
                <p className="mt-7 text-sm font-semibold text-secondary">
                  Built for companies:
                </p>
                <ul className="mt-4 flex-1 space-y-3">
                  {CUSTOM_PLAN_FEATURES.map((feature) => (
                    <FeatureItem key={feature} feature={feature} />
                  ))}
                </ul>
                <Link
                  href="/for-companies"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-lg border border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-white"
                >
                  Request Company Demo
                </Link>
              </article>
            </div>

            <div className="mt-20">
              <h2 className="text-center text-2xl font-bold tracking-tight text-secondary sm:text-[1.75rem]">
                Expert human services
              </h2>


              <div className="mx-auto mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {HUMAN_SERVICE_IDS.map((serviceId) => {
                  const service = HUMAN_SERVICES[serviceId];
                  return (
                    <article
                      key={serviceId}
                      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <p className="text-[15px] font-semibold text-primary">
                        {service.name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {service.tagline}
                      </p>
                      <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-secondary">
                          {service.priceDisplay}
                        </span>
                        <span className="text-sm text-slate-400">/one-time</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckout({ type: "service", id: serviceId })
                        }
                        disabled={isBusy}
                        className="mt-5 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingKey === `service:${serviceId}`
                          ? "Opening PayU…"
                          : "Buy Now"}
                      </button>
                      <ul className="mt-5 flex-1 space-y-2.5 border-t border-slate-100 pt-5">
                        {service.features.map((feature) => (
                          <FeatureItem key={feature} feature={feature} />
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {error ? (
          <p className="mt-8 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function PlanCard({
  name,
  accent,
  price,
  priceSuffix,
  billedNote,
  originalPrice,
  featuresHeading,
  featured,
  planActive,
  submitting,
  disabled,
  onBuy,
  badge,
}: {
  name: string;
  accent: string;
  price: string;
  priceSuffix: string;
  billedNote: string;
  originalPrice?: string;
  featuresHeading: string;
  featured: boolean;
  planActive: boolean;
  submitting: boolean;
  disabled: boolean;
  onBuy: () => void;
  badge?: string;
}) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-7 sm:p-8 ${
        featured
          ? "bg-[linear-gradient(180deg,#0c4a6e_0%,#0a2744_45%,#071e36_100%)] text-white shadow-xl shadow-sky-900/30"
          : "border border-slate-200 bg-white shadow-sm"
      }`}
    >
      {featured ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.28),transparent_55%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ backgroundImage: STAR_LAYERS }}
            aria-hidden
          />
        </>
      ) : null}

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-2">
          <p className={`text-lg font-bold ${featured ? accent : accent}`}>
            {name}
          </p>
          {badge && featured ? (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
          {originalPrice && featured ? (
            <span className="text-sm text-white/40 line-through">
              {originalPrice}
            </span>
          ) : originalPrice ? (
            <span className="text-sm text-slate-400 line-through">
              {originalPrice}
            </span>
          ) : null}
          <span
            className={`text-4xl font-bold tracking-tight ${featured ? "text-white" : "text-secondary"}`}
          >
            {price}
          </span>
          <span
            className={`text-sm ${featured ? "text-white/60" : "text-slate-400"}`}
          >
            {priceSuffix}
          </span>
        </div>

        <p
          className={`mt-2 text-sm ${featured ? "text-white/55" : "text-slate-500"}`}
        >
          {billedNote}
        </p>

        <p
          className={`mt-7 text-sm font-semibold ${featured ? "text-white" : "text-secondary"}`}
        >
          {featuresHeading}
        </p>

        <ul className="mt-4 flex-1 space-y-3">
          {PRICING_FEATURES.map((feature) => (
            <FeatureItem key={feature.label} feature={feature} dark={featured} />
          ))}
        </ul>

        {planActive ? (
          <button
            type="button"
            disabled
            className={`mt-8 w-full cursor-default rounded-lg py-3 text-sm font-semibold ${
              featured
                ? "bg-white/10 text-white/60"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            Plan Active
          </button>
        ) : (
          <button
            type="button"
            onClick={onBuy}
            disabled={disabled || submitting}
            className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              featured
                ? "bg-primary text-white hover:bg-primary/90"
                : "border border-secondary text-secondary hover:bg-secondary hover:text-white"
            }`}
          >
            {submitting ? "Opening PayU…" : "Buy Now"}
          </button>
        )}
      </div>
    </article>
  );
}
