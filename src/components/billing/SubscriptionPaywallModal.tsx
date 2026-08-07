"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

type SubscriptionPaywallModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SubscriptionPaywallModal({
  open,
  onClose,
}: SubscriptionPaywallModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-paywall-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Premium access
              </p>
              <h2
                id="subscription-paywall-title"
                className="mt-2 text-xl font-semibold tracking-tight text-secondary sm:text-[1.35rem]"
              >
                Subscribe to continue
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-slate-500">
            Practice problems, programming languages, compiler, ATS Resume Analyzer,
            and mock interviews are included with our monthly (₹499), quarterly
            (₹1,299), or yearly (₹4,800) plan. Start with a 14-day free trial — 1 mock interview per
            day during trial, unlimited after.
          </p>

          <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
            {[
              "Monthly plan — ₹499 / month",
              "Quarterly plan — ₹1,299 / quarter",
              "Yearly plan — ₹4,800 / year",
              "ATS Resume Analyzer + AI improve",
              "₹2 today · 14-day free trial · then auto-billed",
              "1 mock interview/day during trial",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[13px] text-slate-600"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/pricing"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-[0.97] active:scale-[0.99]"
            >
              View pricing plans
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
