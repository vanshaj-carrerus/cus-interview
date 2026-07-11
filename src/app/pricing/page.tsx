import { Suspense } from "react";
import PricingSection from "@/components/pricing/PricingSection";

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingSection />
    </Suspense>
  );
}
