import type { FaqItem } from "@/features/faqs/types";

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "launch",
    question: "When is CareVYA launching in Nigeria?",
    answer:
      "CareVYA is launching first in Nigeria, with initial focus on cities like Lagos, Abuja, and Port Harcourt. Join the waitlist to get early access as we open in your area.",
  },
  {
    id: "evaluation",
    question: "How are caregivers evaluated and vetted?",
    answer:
      "Every caregiver goes through multi-layer vetting: identity checks, background screening, experience and skills review, interviews, and ongoing family feedback.",
  },
  {
    id: "diaspora",
    question:
      "I live in the UK/US/Canada. Can I coordinate care for parents in Nigeria?",
    answer:
      "Yes. CareVYA is built for families at home and abroad. You can find, verify, and stay connected to care for loved ones in Nigeria from wherever you are.",
  },
  {
    id: "verify",
    question: "How does CareVYA verify carers?",
    answer:
      "We verify government ID, run background checks, review experience and references, and collect real family feedback — so every connection starts from trust.",
  },
  {
    id: "payments",
    question: "How payment are made?",
    answer:
      "Payments are handled through CareVYA for clarity and fairness. Families pay through the platform, and caregivers receive trackable compensation. Full payment details will be shared as we open beyond the waitlist.",
  },
] as const;
