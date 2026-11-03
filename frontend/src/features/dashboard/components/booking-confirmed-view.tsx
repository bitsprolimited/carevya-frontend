"use client";

import { CalendarCheck, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { MessageCaregiverModal } from "@/features/dashboard/components/message-caregiver-modal";
import { getCaregiverProfile } from "@/features/dashboard/data/caregiver-profiles";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";

export function BookingConfirmedView({ bookingId }: { bookingId: string }) {
  const booking = useBookingsStore((state) => state.getById(bookingId));
  const [messageOpen, setMessageOpen] = useState(false);
  const profile = booking
    ? getCaregiverProfile(booking.caregiverId)
    : null;

  if (!booking) {
    return (
      <CareseekerShell>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-sm text-navy/60">Booking not found.</p>
          <Link
            href="/careseeker/bookings"
            className="mt-4 text-sm font-semibold text-brand-blue"
          >
            Back to bookings
          </Link>
        </div>
      </CareseekerShell>
    );
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Bookings"
          subtitle={`Track your bookings for ${booking.recipientName.split(" ")[0]}.`}
        />

        <div className="mx-auto mt-10 w-full max-w-lg rounded-3xl border border-[#E8EEF5] bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <div className="relative mx-auto flex size-28 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#EAF2FF]" />
            <span className="relative inline-flex size-16 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-md">
              <CalendarCheck className="size-8" aria-hidden />
            </span>
            <span className="absolute -right-1 -bottom-1 inline-flex size-10 items-center justify-center rounded-full bg-emerald text-white shadow-md">
              <Check className="size-5" strokeWidth={3} aria-hidden />
            </span>
            <span className="absolute top-2 -left-2 size-10 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <Image
                src={booking.avatarUrl}
                alt=""
                fill
                sizes="40px"
                className="object-cover object-top"
              />
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-navy">
            Booking confirmed
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/60">
            {booking.caregiverFirstName} is booked. We&apos;ll remind you both
            the day before care starts. Settle payment directly with{" "}
            {booking.caregiverFirstName}, as you agreed.
          </p>

          <dl className="mt-6 space-y-2.5 rounded-2xl bg-[#F8FAFC] px-4 py-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-navy/55">Caregiver</dt>
              <dd className="font-semibold text-navy">{booking.caregiverName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-navy/55">Care starts</dt>
              <dd className="font-semibold text-navy">{booking.careStartsLabel}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-navy/55">Schedule</dt>
              <dd className="text-right font-semibold text-navy">
                {booking.scheduleLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-navy/55">Agreed price</dt>
              <dd className="font-semibold text-navy">
                {booking.agreedPriceLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="h-11 flex-1 rounded-full"
              onClick={() => setMessageOpen(true)}
            >
              Message {booking.caregiverFirstName}
            </Button>
            <Link
              href="/careseeker/bookings"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue-hover"
            >
              Go to bookings →
            </Link>
          </div>
        </div>
      </div>

      {profile ? (
        <MessageCaregiverModal
          open={messageOpen}
          onClose={() => setMessageOpen(false)}
          caregiver={profile}
        />
      ) : null}
    </CareseekerShell>
  );
}
