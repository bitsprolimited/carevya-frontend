import type { Metadata } from "next";
import { CaregiverDashboardView } from "@/features/caregiver-dashboard/components/caregiver-dashboard-view";

export const metadata: Metadata = {
  title: "Caregiver Dashboard",
  description: "Your CareVYA caregiver overview — bookings, requests, and earnings.",
};

export default function CaregiverDashboardPage() {
  return <CaregiverDashboardView />;
}
