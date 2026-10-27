import type { Metadata } from "next";
import { CareProfileWizard } from "@/features/care-profile/components/care-profile-wizard";

export const metadata: Metadata = {
  title: "Set Up Care Profile",
  description:
    "Tell us who needs care so we can match you with the right caregivers.",
};

export default function familyProfilePage() {
  return <CareProfileWizard />;
}
