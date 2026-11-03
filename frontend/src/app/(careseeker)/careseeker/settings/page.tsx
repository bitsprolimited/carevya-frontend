import type { Metadata } from "next";
import { SettingsView } from "@/features/dashboard/components/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage notifications, privacy and your CareVYA account.",
};

export default function CareseekerSettingsPage() {
  return <SettingsView />;
}
