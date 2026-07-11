"use client";

import { X } from "lucide-react";
import { buildTrialMockLimitReachedMessage } from "@/lib/billing/trial-limits";

type TrialMockLimitModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function TrialMockLimitModal({
  open,
  onClose,
}: TrialMockLimitModalProps) {
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
        aria-labelledby="trial-mock-limit-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Free trial limit
              </p>
              <h2
                id="trial-mock-limit-title"
                className="mt-2 text-xl font-semibold tracking-tight text-secondary sm:text-[1.35rem]"
              >
                Daily mock interview used
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
            {buildTrialMockLimitReachedMessage()}
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-[0.97] active:scale-[0.99]"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
