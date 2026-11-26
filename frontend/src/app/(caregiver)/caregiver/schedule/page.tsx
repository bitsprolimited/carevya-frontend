import type { Metadata } from "next";
import { CaregiverScheduleView } from "@/features/caregiver-dashboard/components/caregiver-schedule-view";

export const metadata: Metadata = {
  title: "Schedule & Availability",
  description:
    "Manage your caregiver schedule, weekly visits, preferences, and time off.",
};

export default function CaregiverSchedulePage() {
  return <CaregiverScheduleView />;
}
