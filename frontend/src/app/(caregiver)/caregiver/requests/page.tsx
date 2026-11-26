import type { Metadata } from "next";
import { CaregiverRequestsView } from "@/features/caregiver-dashboard/components/caregiver-requests-view";

export const metadata: Metadata = {
  title: "Requests",
  description: "View and manage care requests on CareVYA.",
};

export default function CaregiverRequestsPage() {
  return <CaregiverRequestsView />;
}
