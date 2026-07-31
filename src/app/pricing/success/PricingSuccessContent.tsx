"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {
  HUMAN_SERVICES,
  isHumanServiceId,
} from "@/lib/billing/human-services";
import {
  PRICING_PLANS,
  isBillingPlanId,
} from "@/lib/billing/plan";
import { getSubscriptionTotalDisplay } from "@/lib/billing/order-amount";

const BRAND_BLUE = "#00a6f4";

export default function PricingSuccessContent() {
  const { refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const purchaseType = searchParams.get("type");
  const productId = searchParams.get("product");
  const isService =
    purchaseType === "service" &&
    productId &&
    isHumanServiceId(productId);
  const isPlan =
    purchaseType === "plan" && productId && isBillingPlanId(productId);
  const serviceName = isService ? HUMAN_SERVICES[productId].name : null;
  const planLabel = isPlan ? PRICING_PLANS[productId].priceDisplay : null;
  const planTotalWithGst =
    isPlan && productId ? getSubscriptionTotalDisplay(productId) : null;

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#f8f9fb] px-6 py-20">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: BRAND_BLUE }}
        >
          Payment successful
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          You&apos;re all set
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {isService ? (
            <>
              Your <span className="font-medium text-slate-700">{serviceName}</span>{" "}
              booking is confirmed. Our team will contact you within 24 hours to
              schedule your session.
            </>
          ) : isPlan ? (
            <>
              Payment received. Your plan is active with full platform access until
              the end of your billing period. You paid{" "}
              <span className="font-medium text-slate-700">
                {planLabel} + 18% GST ({planTotalWithGst})
              </span>{" "}
              in one transaction.
            </>
          ) : (
            <>
              Your payment was verified. Full platform access is now active for
              your plan period.
            </>
          )}
        </p>
        <Link
          href={isService ? "/contact" : "/practice"}
          className="mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          {isService ? "Contact us" : "Start practicing"}
        </Link>
      </div>
    </section>
  );
}
