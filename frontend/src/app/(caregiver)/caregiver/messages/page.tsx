import type { Metadata } from "next";
import { CaregiverPlaceholderView } from "@/features/caregiver-dashboard/components/caregiver-placeholder-view";

export const metadata: Metadata = {
  title: "Messages",
};

export default function CaregiverMessagesPage() {
  return (
    <CaregiverPlaceholderView
      title="Messages"
      subtitle="Chat with careseekers about care requests."
    />
  );
}
