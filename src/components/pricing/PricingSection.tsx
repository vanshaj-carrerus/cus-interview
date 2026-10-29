"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
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

type InitiateResponse = {
  actionUrl?: string;
  params?: Record<string, string>;
  free?: boolean;
  redirectUrl?: string;
  error?: string;
};

type CheckoutTarget =
  | { type: "plan"; id: PublicBillingPlanId }
  | { type: "service"; id: HumanServiceId };

const CUSTOM_PLAN_FEATURES = [
  "Everything in Full Access plans",
  "Team seats and admin controls",
  "Custom assessment workflows",
  "Dedicated success manager",
  "Priority support & onboarding",
  "Invoice / PO billing options",
];

/* Soft colour themes for the wide plan cards */
type CardTone = "sky" | "mint";

const TONES: Record<CardTone, { card: string; tick: string; pill: string }> = {
  sky: {
    card: "bg-[linear-gradient(135deg,#e0f2fe_0%,#f5f3ff_55%,#fdf4ff_100%)]",
    tick: "text-sky-600",
    pill: "bg-white/80 text-sky-700 ring-sky-200",
  },
  mint: {
    card: "bg-[linear-gradient(135deg,#ecfdf5_0%,#f0fdfa_50%,#fefce8_100%)]",
    tick: "text-emerald-600",
    pill: "bg-white/80 text-emerald-700 ring-emerald-200",
  },
};

/* Accent per service card — title colour, chip and tick */
const SERVICE_TONES = [
  { title: "text-violet-500", chip: "bg-white text-violet-500", tick: "bg-violet-300 text-white", card: "border-violet-100 bg-gradient-to-b from-violet-50 to-white" },
  { title: "text-sky-500", chip: "bg-white text-sky-500", tick: "bg-sky-300 text-white", card: "border-sky-100 bg-gradient-to-b from-sky-50 to-white" },
  { title: "text-emerald-500", chip: "bg-white text-emerald-500", tick: "bg-emerald-300 text-white", card: "border-emerald-100 bg-gradient-to-b from-emerald-50 to-white" },
  { title: "text-rose-500", chip: "bg-white text-rose-500", tick: "bg-rose-300 text-white", card: "border-rose-100 bg-gradient-to-b from-rose-50 to-white" },
];

function FeatureItem({
  feature,
  tone = "sky",
}: {
  feature: PricingFeature | string;
  tone?: CardTone;
}) {
  const label = typeof feature === "string" ? feature : feature.label;
  const isNew = typeof feature !== "string" && feature.isNew;

  return (
    <li className="flex items-start gap-3">
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
        <Check className={`h-3 w-3 ${TONES[tone].tick}`} strokeWidth={3} />
      </span>
      <span className="text-[13px] leading-snug text-slate-700">
        {label}
        {isNew ? (
          <span className="ml-1.5 rounded-full bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-900">
            NEW
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
    details: CheckoutDetails,
    couponCode?: string
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
        couponCode,
      }),
    });
    const data = (await res.json()) as InitiateResponse;

    if (res.ok && data.free && data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return true;
    }

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
    details: CheckoutDetails,
    couponCode?: string
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
        couponCode,
      }),
    });
    const data = (await res.json()) as InitiateResponse;

    if (res.ok && data.free && data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return true;
    }

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

    const upgrading =
      user.subscription.hasPlatformAccess && Boolean(user.subscription.featureCredits?.planLimited);
    if (target.type === "plan" && user.subscription.hasAccess && !upgrading) {
      setError("Your platform plan is already active.");
      return;
    }

    setPendingCheckout(target);
  }

  async function confirmCheckout(details: CheckoutDetails, couponCode?: string) {
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
          ? await handlePlanCheckout(pendingCheckout, details, couponCode)
          : await handleServiceCheckout(pendingCheckout, details, couponCode);

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
  // Free-access coupon plan with capped mock interviews / resume analyses — can buy a paid plan.
  const canUpgrade = Boolean(
    hasPlatformAccess && user?.subscription.featureCredits?.planLimited
  );
  const freeCredits = user?.subscription.featureCredits;
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
            {canUpgrade && freeCredits ? (
              <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-7 py-6 text-center text-amber-900">
                <p className="text-sm font-semibold">
                  You&apos;re on a free plan with limited uses.
                </p>
                <p className="mt-1.5 text-sm">
                  {[
                    freeCredits.mockInterview.total > 0
                      ? `AI mock interviews: ${freeCredits.mockInterview.remaining} / ${freeCredits.mockInterview.total} left`
                      : null,
                    freeCredits.resumeAnalyzer.total > 0
                      ? `Resume analyses: ${freeCredits.resumeAnalyzer.remaining} / ${freeCredits.resumeAnalyzer.total} left`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="mt-3 text-sm font-semibold">
                  Upgrade below for unlimited access to everything.
                </p>
              </div>
            ) : hasPlatformAccess ? (
              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-white px-7 py-6 text-center">
                <p className="text-sm font-semibold text-secondary">
                  Your platform plan is active.
                </p>
                <div className="mt-4 flex justify-center">
                  <ManageBillingButton />
                </div>
              </div>
            ) : null}

            <div className="mx-auto mt-12 max-w-5xl space-y-5">
              {billingCycle === "monthly" ? (
                <PlanCard
                  name="Monthly Plan"
                  price={monthly.priceDisplay}
                  priceSuffix="/mo"
                  billedNote={`${getSubscriptionTotalDisplay("monthly")} with GST · billed monthly`}
                  perfectFor="Perfect for job seekers who want full access, month to month."
                  planActive={Boolean(hasPlatformAccess) && !canUpgrade}
                  upgrade={canUpgrade}
                  submitting={submittingKey === "plan:monthly"}
                  disabled={isBusy}
                  onBuy={() => handleCheckout({ type: "plan", id: "monthly" })}
                />
              ) : (
                <PlanCard
                  name="Quarterly Plan"
                  price={`₹${quarterlyPerMonth}`}
                  priceSuffix="/mo"
                  billedNote={`${quarterly.priceDisplay} billed quarterly · ${getSubscriptionTotalDisplay("quarterly")} with GST`}
                  originalPrice={
                    "originalPriceDisplay" in quarterly
                      ? quarterly.originalPriceDisplay
                      : undefined
                  }
                  perfectFor="Best value — full access for 3 months of focused preparation."
                  planActive={Boolean(hasPlatformAccess) && !canUpgrade}
                  upgrade={canUpgrade}
                  submitting={submittingKey === "plan:quarterly"}
                  disabled={isBusy}
                  onBuy={() => handleCheckout({ type: "plan", id: "quarterly" })}
                  badge="Popular"
                />
              )}

              <article
                className={`grid gap-8 overflow-hidden rounded-[24px] border border-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] sm:p-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:gap-10 ${TONES.mint.card}`}
              >
                <div className="flex flex-col">
                  <span
                    className={`w-fit rounded-full px-3.5 py-1 text-xs font-semibold ring-1 ${TONES.mint.pill}`}
                  >
                    For companies
                  </span>
                  <p className="mt-5 font-serif text-4xl tracking-[-0.02em] text-slate-700">
                    Custom pricing
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    For teams and hiring partners who need scale.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Perfect for hiring teams, bootcamps and colleges running assessments at scale.
                  </p>
                  <Link
                    href="/for-companies"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-slate-900 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-950 hover:text-white sm:w-auto sm:self-start"
                  >
                    Request company demo
                  </Link>
                </div>

                <div className="rounded-2xl bg-white/60 p-5 ring-1 ring-white sm:p-6">
                  <p className="text-sm font-semibold text-slate-900">What&apos;s included:</p>
                  <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {CUSTOM_PLAN_FEATURES.map((feature) => (
                      <FeatureItem key={feature} feature={feature} tone="mint" />
                    ))}
                  </ul>
                </div>
              </article>
            </div>

            {/* Expert human services */}
            <div className="relative mt-20">
              <div className="relative text-center">
                <span className="inline-flex rounded-full bg-white/80 px-3.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                  One-time services
                </span>
                <h2 className="mt-4 font-serif text-3xl tracking-[-0.02em] text-slate-950 sm:text-[2.5rem]">
                  Expert human services
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
                  Work 1-on-1 with real experts — no subscription needed.
                </p>
              </div>

              <div className="relative mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {HUMAN_SERVICE_IDS.map((serviceId, i) => {
                  const service = HUMAN_SERVICES[serviceId];
                  const tone = SERVICE_TONES[i % SERVICE_TONES.length];
                  return (
                    <article
                      key={serviceId}
                      className={`flex h-full flex-col rounded-[22px] border p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:-translate-y-1 ${tone.card}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-lg font-bold leading-tight ${tone.title}`}>{service.name}</p>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${tone.chip}`}>
                          One-time
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{service.tagline}</p>

                      <p className="mt-5 font-serif text-4xl tracking-[-0.02em] text-slate-700">
                        {service.priceDisplay}
                      </p>

                      <ul className="mt-5 flex-1 space-y-2.5 border-t border-slate-900/5 pt-5">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-500">
                            <span className={`mt-px inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${tone.tick}`}>
                              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => handleCheckout({ type: "service", id: serviceId })}
                        disabled={isBusy}
                        className="mt-6 w-fit rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingKey === `service:${serviceId}` ? "Opening PayU…" : "Get started"}
                      </button>
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
  price,
  priceSuffix,
  billedNote,
  originalPrice,
  perfectFor,
  planActive,
  upgrade = false,
  submitting,
  disabled,
  onBuy,
  badge,
}: {
  name: string;
  price: string;
  priceSuffix: string;
  billedNote: string;
  originalPrice?: string;
  perfectFor: string;
  planActive: boolean;
  /** On a limited free plan — the button offers the upgrade to unlimited. */
  upgrade?: boolean;
  submitting: boolean;
  disabled: boolean;
  onBuy: () => void;
  badge?: string;
}) {
  const tone = TONES.sky;

  return (
    <article
      className={`grid gap-8 overflow-hidden rounded-[24px] border border-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] sm:p-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:gap-10 ${tone.card}`}
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3.5 py-1 text-xs font-semibold ring-1 ${tone.pill}`}>{name}</span>
          {badge ? (
            <span className="rounded-full bg-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-900">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
          {originalPrice ? <span className="text-base text-slate-400 line-through">{originalPrice}</span> : null}
          <span className="font-serif text-5xl tracking-[-0.02em] text-slate-950">{price}</span>
          <span className="text-base text-slate-500">{priceSuffix}</span>
        </div>

        <p className="mt-3 text-sm text-slate-500">{billedNote}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{perfectFor}</p>

        {planActive ? (
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-default rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-slate-500 sm:w-auto sm:self-start"
          >
            Plan active
          </button>
        ) : (
          <button
            type="button"
            onClick={onBuy}
            disabled={disabled || submitting}
            className="mt-6 w-full rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(15,23,42,0.6)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
          >
            {submitting ? "Opening PayU…" : upgrade ? "Upgrade to Unlimited" : "Buy now"}
          </button>
        )}
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout via PayU
        </p>
      </div>

      <div className="rounded-2xl bg-white/60 p-5 ring-1 ring-white sm:p-6">
        <p className="text-sm font-semibold text-slate-900">What&apos;s included:</p>
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {PRICING_FEATURES.map((feature) => (
            <FeatureItem key={feature.label} feature={feature} tone="sky" />
          ))}
        </ul>
      </div>
    </article>
  );
}
