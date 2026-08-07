"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardSubscriptionRequired() {
  return (
    <section className="w-full px-6 text-center">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-[2.75rem] sm:leading-tight">
          Subscription Required
        </h1>
        <p className="mx-auto mt-5 max-w-xs text-[15px] leading-relaxed text-slate-500 sm:max-w-md sm:text-base">
          Your plan has expired or you don't have an active subscription. Please subscribe to access your dashboard and track your progress.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            View pricing plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
