import type { Metadata } from "next";
import { HelpSupportView } from "@/features/dashboard/components/help-support-view";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help from CareVYA — chat, call, email, or report an issue.",
};

export default function CareseekerHelpPage() {
  return <HelpSupportView />;
}
