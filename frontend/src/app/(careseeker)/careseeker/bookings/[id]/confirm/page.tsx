import type { Metadata } from "next";
import { ConfirmBookingView } from "@/features/dashboard/components/confirm-booking-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Confirm booking",
  description: "Confirm your CareVYA booking details and payment agreement.",
};

export default async function ConfirmBookingPage({ params }: PageProps) {
  const { id } = await params;
  return <ConfirmBookingView bookingId={id} />;
}
