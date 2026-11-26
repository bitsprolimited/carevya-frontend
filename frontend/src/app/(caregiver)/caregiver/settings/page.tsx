import type { Metadata } from "next";
import { CaregiverSettingsView } from "@/features/caregiver-dashboard/components/caregiver-settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage caregiver notifications, privacy, and account settings.",
};

type PageProps = {
  searchParams: Promise<{ canDelete?: string }>;
};

export default async function CaregiverSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CaregiverSettingsView allowDelete={params.canDelete === "1"} />
  );
}
