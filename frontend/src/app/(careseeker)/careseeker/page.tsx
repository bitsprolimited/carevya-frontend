import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your CareVYA careseeker home — find care, bookings, and messages.",
};

export default function CareseekerDashboardPage() {
  return <DashboardView />;
}
