import type { Metadata } from "next";
import { BookingsView } from "@/features/dashboard/components/bookings-view";

export const metadata: Metadata = {
  title: "Bookings",
  description: "Track your CareVYA care bookings.",
};

export default function CareseekerBookingsPage() {
  return <BookingsView />;
}
