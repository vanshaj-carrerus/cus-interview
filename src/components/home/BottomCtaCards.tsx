"use client";

import Link from "next/link";

const STAR_LAYERS = [
  "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.9) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 28% 42%, rgba(255,255,255,0.55) 0%, transparent 100%)",
  "radial-gradient(1.5px 1.5px at 44% 22%, rgba(255,255,255,0.85) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 58% 68%, rgba(255,255,255,0.45) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 72% 30%, rgba(255,255,255,0.7) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 86% 58%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(1.5px 1.5px at 18% 78%, rgba(255,255,255,0.8) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 36% 88%, rgba(255,255,255,0.4) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 64% 12%, rgba(255,255,255,0.65) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 92% 82%, rgba(255,255,255,0.55) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 8% 52%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(1.5px 1.5px at 78% 74%, rgba(255,255,255,0.75) 0%, transparent 100%)",
].join(",");

function CtaPanel({
  title,
  description,
  href,
  cta,
  primary,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  primary?: boolean;
}) {
  const buttonClasses = primary
    ? "mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-[15px] font-semibold text-white transition-all duration-500 hover:bg-primary/90 group-hover:bg-white group-hover:text-secondary"
    : "mt-8 inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-[15px] font-semibold text-secondary transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/10 group-hover:text-white";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-colors duration-500 hover:border-transparent hover:bg-[#0b1e33] md:p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(75,163,227,0.18),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-80"
          style={{ backgroundImage: STAR_LAYERS }}
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-secondary transition-colors duration-500 group-hover:text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-500 transition-colors duration-500 group-hover:text-slate-300">
          {description}
        </p>
        <Link href={href} className={buttonClasses}>
          {cta}
        </Link>
      </div>
    </div>
  );
}

export default function BottomCtaCards() {
  return (
    <section className="bg-slate-50 py-20 md:py-24">
      <div className="grid w-full grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-8 md:px-8 lg:px-10">
        <CtaPanel
          title="For Developers"
          description="Join thousands of developers practicing problems, taking mock interviews, and landing their dream roles."
          href="/signup"
          cta="Join the Community"
        />
        <CtaPanel
          title="For Companies"
          description="Assess candidates fairly with structured take-home challenges and integrity-focused evaluation tools."
          href="/for-companies"
          cta="Start a Free Trial"
          primary
        />
      </div>
    </section>
  );
}


