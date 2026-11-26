import type { Metadata } from "next";
import { CaregiverBookingDetailsView } from "@/features/caregiver-dashboard/components/caregiver-booking-details-view";

export const metadata: Metadata = {
  title: "Booking details",
};

export default async function CaregiverBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaregiverBookingDetailsView bookingId={id} />;
}
