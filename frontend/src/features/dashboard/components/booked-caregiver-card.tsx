"use client";

import { BadgeCheck, CalendarDays, Clock3, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/features/dashboard/types/bookings";
import { cn } from "@/lib/utils";

function scheduleLabel(booking: Booking) {
  const careKind = booking.careType.split("·")[0]?.trim() || booking.careType;
  if (careKind.toLowerCase().includes("live-in")) {
    return `Live-in · ${booking.datesShortLabel.replace(/–/g, "-")}`;
  }
  return careKind;
}

function startsLabel(booking: Booking) {
  const careKind = booking.careType.split("·")[0]?.trim() || booking.careType;
  const time = booking.careStartsLabel.replace(" · ", ", ");
  if (careKind.toLowerCase().includes("live-in")) {
    return `Starts ${time}`;
  }
  return time;
}

function statusLabel(status: Booking["status"]) {
  switch (status) {
    case "accepted":
    case "confirmed":
      return "Accepted";
    case "pending":
      return "Pending";
    case "declined":
      return "Declined";
  }
}

export function BookedCaregiverCard({
  booking,
  onMessage,
}: {
  booking: Booking;
  onMessage: () => void;
}) {
  const status = statusLabel(booking.status);
  const bookingHref =
    booking.status === "accepted"
      ? `/careseeker/bookings/${booking.id}/confirm`
      : booking.status === "confirmed"
        ? `/careseeker/bookings/${booking.id}/confirmed`
        : "/careseeker/bookings";

  return (
    <article className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-3.5">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-soft sm:size-16">
            <Image
              src={booking.avatarUrl}
              alt=""
              fill
              sizes="64px"
              className="object-cover object-top"
            />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-navy">
                {booking.caregiverName}
              </h3>
              {booking.verified ? (
                <BadgeCheck
                  className="size-4 shrink-0 fill-emerald text-white"
                  aria-label="Verified"
                />
              ) : null}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold",
                  status === "Accepted"
                    ? "bg-[#E9F9F1] text-emerald-dark"
                    : status === "Pending"
                      ? "bg-[#FFF6E5] text-amber-700"
                      : "bg-[#FEECEC] text-danger",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "Accepted"
                      ? "bg-emerald"
                      : status === "Pending"
                        ? "bg-amber-500"
                        : "bg-danger",
                  )}
                  aria-hidden
                />
                {status}
              </span>
            </div>

            <p className="mt-0.5 text-sm text-navy/55">
              {booking.careCategoryLabel} · {booking.locationLabel}
            </p>

            <div className="mt-3 flex flex-col gap-1.5 text-sm text-navy/70 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  className="size-3.5 shrink-0 text-navy/40"
                  aria-hidden
                />
                {scheduleLabel(booking)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3
                  className="size-3.5 shrink-0 text-navy/40"
                  aria-hidden
                />
                {startsLabel(booking)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet
                  className="size-3.5 shrink-0 text-navy/40"
                  aria-hidden
                />
                {booking.agreedPriceLabel} · agreed in chat
              </span>
            </div>

            <p className="mt-2 text-xs text-navy/45">
              {booking.paymentNote ??
                `Pay ${booking.caregiverFirstName} directly, as agreed`}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onMessage}
            className="h-10 rounded-full px-5"
          >
            Message
          </Button>
          <Link
            href={bookingHref}
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-hover"
          >
            View booking
          </Link>
        </div>
      </div>
    </article>
  );
}
