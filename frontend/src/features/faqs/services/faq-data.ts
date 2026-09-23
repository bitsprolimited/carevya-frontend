import type { FaqItem } from "@/features/faqs/types";

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "launch",
    question: "Where is CareVYA launching first?",
    answer:
      "We are starting in Nigeria, with focus cities including Lagos, Abuja, and Port Harcourt, and expanding from there.",
  },
  {
    id: "evaluation",
    question: "How are caregivers evaluated?",
    answer:
      "Every caregiver goes through identity checks, background screening, skills review, interviews, and ongoing family feedback.",
  },
  {
    id: "difference",
    question: "How is CareVYA different from traditional agencies?",
    answer:
      "We are a verification-first marketplace. We connect families with vetted individuals and agencies, with tools for transparency throughout the care journey.",
  },
  {
    id: "payments",
    question: "How are payments handled?",
    answer:
      "Providers receive fair, trackable compensation through the platform. Families get clarity on what they pay for — details will be shared as we open beyond the waitlist.",
  },
] as const;
