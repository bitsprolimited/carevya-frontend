import type { Metadata } from "next";
import { MessagesView } from "@/features/dashboard/components/messages-view";

export const metadata: Metadata = {
  title: "Messages",
  description: "Stay connected with caregivers on CareVYA.",
};

type PageProps = {
  searchParams: Promise<{ empty?: string }>;
};

export default async function CareseekerMessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <MessagesView initialEmpty={params.empty === "1"} />;
}
