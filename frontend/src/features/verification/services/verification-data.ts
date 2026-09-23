import type { VerificationItem } from "@/features/verification/types";

export const VERIFICATION_ITEMS: readonly VerificationItem[] = [
  {
    id: "identity",
    title: "Identity Check",
    description: "Government ID and biometric confirmation for every provider.",
  },
  {
    id: "background",
    title: "Background Check",
    description: "Multi-layer screening before caregivers reach families.",
  },
  {
    id: "experience",
    title: "Experience & Skills",
    description: "Verified training, specialties, and care competencies.",
  },
  {
    id: "family_feedback",
    title: "Family Feedback",
    description: "Ongoing ratings from families who have used their care.",
  },
  {
    id: "periodic_review",
    title: "Periodic Reviews",
    description: "Continuous monitoring to keep standards high over time.",
  },
] as const;
