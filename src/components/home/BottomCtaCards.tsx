"use client";

import Link from "next/link";

export default function BottomCtaCards() {
  return (
    <section className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h3 className="text-2xl font-bold text-secondary">For Developers</h3>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-500">
            Join thousands of developers practicing problems, taking mock
            interviews, and landing their dream roles.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-[15px] font-semibold text-secondary transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            Join the Community
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h3 className="text-2xl font-bold text-secondary">For Companies</h3>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-500">
            Assess candidates fairly with structured take-home challenges and
            integrity-focused evaluation tools.
          </p>
          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Start a Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}
