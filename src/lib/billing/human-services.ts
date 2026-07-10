export type HumanServiceId =
  | "mock-interview"
  | "resume-writing"
  | "linkedin-optimization"
  | "career-coaching";

export type HumanService = {
  id: HumanServiceId;
  name: string;
  priceDisplay: string;
  amountInr: number;
  tagline: string;
  features: string[];
};

export const HUMAN_SERVICES: Record<HumanServiceId, HumanService> = {
  "mock-interview": {
    id: "mock-interview",
    name: "1-on-1 Mock Interview",
    priceDisplay: "₹399",
    amountInr: 399,
    tagline: "Live session with an interview expert.",
    features: [
      "45-minute personalized mock interview",
      "Real-time feedback from an expert",
      "Role-specific question practice",
      "Action plan for improvement",
    ],
  },
  "resume-writing": {
    id: "resume-writing",
    name: "Resume Writing",
    priceDisplay: "₹899",
    amountInr: 899,
    tagline: "Professional resume crafted for your target role.",
    features: [
      "ATS-friendly resume rewrite",
      "Role and industry keyword optimization",
      "Achievement-focused bullet points",
      "One round of revisions included",
    ],
  },
  "linkedin-optimization": {
    id: "linkedin-optimization",
    name: "LinkedIn Optimization",
    priceDisplay: "₹1,299",
    amountInr: 1299,
    tagline: "Stand out to recruiters on LinkedIn.",
    features: [
      "Headline and About section rewrite",
      "Experience section optimization",
      "Recruiter keyword strategy",
      "Profile review with expert notes",
    ],
  },
  "career-coaching": {
    id: "career-coaching",
    name: "Career Coaching",
    priceDisplay: "₹3,999",
    amountInr: 3999,
    tagline: "End-to-end career guidance from a human coach.",
    features: [
      "60-minute 1-on-1 strategy session",
      "Job search roadmap and milestones",
      "Interview and offer negotiation tips",
      "Follow-up action checklist",
    ],
  },
};

export const HUMAN_SERVICE_IDS = Object.keys(HUMAN_SERVICES) as HumanServiceId[];

export function getHumanService(serviceId: HumanServiceId) {
  return HUMAN_SERVICES[serviceId];
}

export function isHumanServiceId(value: unknown): value is HumanServiceId {
  return (
    value === "mock-interview" ||
    value === "resume-writing" ||
    value === "linkedin-optimization" ||
    value === "career-coaching"
  );
}
