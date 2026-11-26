import type { Metadata } from "next";
import { CaregiverProfileView } from "@/features/caregiver-dashboard/components/caregiver-profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "View and update the caregiver profile careseekers see on CareVYA.",
};

export default function CaregiverProfilePage() {
  return <CaregiverProfileView />;
}
