import type { Metadata } from "next";
import { ProfileView } from "@/features/dashboard/components/profile-view";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your CareVYA account and care recipients.",
};

export default function CareseekerMyProfilePage() {
  return <ProfileView />;
}
