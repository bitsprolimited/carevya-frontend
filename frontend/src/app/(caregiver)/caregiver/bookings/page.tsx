import type { Metadata } from "next";
import { CaregiverBookingsView } from "@/features/caregiver-dashboard/components/caregiver-bookings-view";

export const metadata: Metadata = {
  title: "Bookings",
  description: "Confirmed care, agreed prices and history in one place.",
};

export default function CaregiverBookingsPage() {
  return <CaregiverBookingsView />;
}
