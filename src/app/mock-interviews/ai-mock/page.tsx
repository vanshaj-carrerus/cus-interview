import type { Metadata } from "next";
import { AiMockSetupForm } from "./ai-mock-setup-form";

export const metadata: Metadata = {
  title: "AI mock session setup | CareerUs",
  description:
    "Choose languages, framework, target role, and interview focus so your AI mock session matches how you actually interview.",
};

export default function AiMockSetupPage() {
  return <AiMockSetupForm />;
}
