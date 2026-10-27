import type { Metadata } from "next";
import { FindCareView } from "@/features/dashboard/components/find-care-view";

export const metadata: Metadata = {
  title: "Find Care",
  description: "Browse trusted caregivers that fit your family’s needs.",
};

export default function FindCarePage() {
  return <FindCareView />;
}
