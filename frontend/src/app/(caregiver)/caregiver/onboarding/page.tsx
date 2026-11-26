import type { Metadata } from "next";
import { CaregiverOnboardingWizard } from "@/features/caregiver-onboarding/components/caregiver-onboarding-wizard";

export const metadata: Metadata = {
  title: "Caregiver Onboarding",
  description:
    "Set up your CareVYA caregiver profile so families can find and book you.",
};

export default function CaregiverOnboardingPage() {
  return <CaregiverOnboardingWizard />;
}
