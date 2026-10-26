"use client";

import {
  ArrowLeft,
  BadgeCheck,
  Check,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/features/dashboard/components/booking-status-badge";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function ConfirmBookingView({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const booking = useBookingsStore((state) => state.getById(bookingId));
  const confirmBooking = useBookingsStore((state) => state.confirmBooking);
  const [understood, setUnderstood] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleConfirm() {
    if (!understood) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    confirmBooking(bookingId);
    setSubmitting(false);
    router.push(`/careseeker/bookings/${bookingId}/confirmed`);
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Bookings"
          subtitle={`Track your bookings for ${booking.recipientName.split(" ")[0]}.`}
        />

        <div className="mt-6">
          <Link
            href="/careseeker/bookings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to bookings
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-navy">
            Confirm booking
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-navy/60">
            You and {booking.caregiverFirstName} agreed {booking.agreedPriceLabel}{" "}
            in chat. Check the details, then confirm the booking.
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-navy">
                  What you agreed with {booking.caregiverFirstName}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F9F1] px-2.5 py-1 text-xs font-semibold text-emerald-dark">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  Agreed in chat
                </span>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Agreed price</dt>
                  <dd className="text-right font-semibold text-navy">
                    {booking.agreedPriceLabel} for {booking.durationLabel}
                    {booking.listedPriceLabel ? (
                      <span className="ml-1.5 font-normal text-navy/40 line-through">
                        was {booking.listedPriceLabel}
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Care</dt>
                  <dd className="text-right font-semibold text-navy">
                    {booking.careType}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Dates</dt>
                  <dd className="text-right font-semibold text-navy">
                    {booking.datesLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Agreed on</dt>
                  <dd className="text-right font-semibold text-navy">
                    {booking.agreedOnLabel}
                  </dd>
                </div>
              </dl>

              <Link
                href="/careseeker/messages"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
              >
                <MessageSquare className="size-4" aria-hidden />
                View the conversation
              </Link>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-2xl bg-[#EAF2FF] sm:block">
                  <Image
                    src={assets.communityCaregiver}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-navy">
                    You pay {booking.caregiverFirstName} directly
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/60">
                    CareVYA does not handle payments or take fees. You settle
                    with {booking.caregiverFirstName} the way you agreed.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-navy/70">
                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-emerald"
                        aria-hidden
                      />
                      Pay in cash or by bank transfer.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-emerald"
                        aria-hidden
                      />
                      Agree on payment timing in chat.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-emerald"
                        aria-hidden
                      />
                      CareVYA will never ask for card or bank details.
                    </li>
                  </ul>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#F3F6FB] px-4 py-3">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(event) => setUnderstood(event.target.checked)}
                  className="mt-0.5 size-4 rounded border-[#D7E0EA] text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm leading-relaxed text-navy">
                  I understand that payment is settled directly between me and{" "}
                  {booking.caregiverFirstName}, as we agreed.
                </span>
              </label>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={booking.avatarUrl}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-navy">{booking.caregiverName}</p>
                    {booking.verified ? (
                      <BadgeCheck
                        className="size-4 fill-emerald text-white"
                        aria-label="Verified"
                      />
                    ) : null}
                  </div>
                  <div className="mt-1">
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </div>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Care</dt>
                  <dd className="text-right font-medium text-navy">
                    {booking.careCategoryLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Schedule</dt>
                  <dd className="text-right font-medium text-navy">
                    {booking.scheduleLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Dates</dt>
                  <dd className="text-right font-medium text-navy">
                    {booking.datesShortLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Duration</dt>
                  <dd className="text-right font-medium text-navy">
                    {booking.durationLabel}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-[#E8EEF5] pt-4">
                <p className="text-sm text-navy/55">Agreed price</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-navy">
                  {booking.agreedPriceLabel}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={!understood || submitting}
                className="mt-5 h-11 w-full rounded-full"
              >
                {submitting ? "Confirming..." : "Confirm booking →"}
              </Button>

              <p
                className={cn(
                  "mt-3 flex items-start gap-2 rounded-xl bg-[#E9F9F1] px-3 py-2.5 text-xs leading-relaxed text-navy/75",
                )}
              >
                <ShieldCheck
                  className="mt-0.5 size-3.5 shrink-0 text-emerald"
                  aria-hidden
                />
                CareVYA doesn&apos;t take payments. Pay{" "}
                {booking.caregiverFirstName} directly, the way you agreed in
                chat.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </CareseekerShell>
  );
}
