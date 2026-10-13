import type { Metadata } from "next";
import { GetStartedView } from "@/features/auth/components/get-started-view";

export const metadata: Metadata = {
  title: "Get Started | CareVYA",
  description: "Join CareVYA as a careseeker or a caregiver.",
};

export default function GetStartedPage() {
  return <GetStartedView />;
}