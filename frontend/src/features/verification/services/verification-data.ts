import type { VerificationItem } from "@/features/verification/types";

export const VERIFICATION_ITEMS: readonly VerificationItem[] = [
  {
    id: "identity",
    title: "Identity Check",
    description: "Government ID verified",
  },
  {
    id: "background",
    title: "Background Check",
    description: "Criminal record check",
  },
  {
    id: "experience",
    title: "Experience Review",
    description: "References verified",
  },
  {
    id: "family_feedback",
    title: "Family Feedback",
    description: "Real family reviews",
  },
  {
    id: "carevya_verified",
    title: "CareVYA Verified",
    description: "Trusted. Checked. Ready.",
  },
] as const;
