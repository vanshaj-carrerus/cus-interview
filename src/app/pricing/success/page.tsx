import { Suspense } from "react";
import PricingSuccessContent from "./PricingSuccessContent";

export default function PricingSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[60vh] items-center justify-center bg-[#f8f9fb] px-6 py-20">
          <p className="text-sm text-slate-500">Loading…</p>
        </section>
      }
    >
      <PricingSuccessContent />
    </Suspense>
  );
}
