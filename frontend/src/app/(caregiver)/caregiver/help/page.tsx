import type { Metadata } from "next";
import { CaregiverHelpSupportView } from "@/features/caregiver-dashboard/components/caregiver-help-support-view";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get answers or talk to the CareVYA team.",
};

export default function CaregiverHelpPage() {
  return <CaregiverHelpSupportView />;
}
