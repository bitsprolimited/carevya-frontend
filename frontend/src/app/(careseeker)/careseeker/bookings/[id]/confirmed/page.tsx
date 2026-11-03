import type { Metadata } from "next";
import { BookingConfirmedView } from "@/features/dashboard/components/booking-confirmed-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Booking confirmed",
  description: "Your CareVYA booking has been confirmed.",
};

export default async function BookingConfirmedPage({ params }: PageProps) {
  const { id } = await params;
  return <BookingConfirmedView bookingId={id} />;
}
