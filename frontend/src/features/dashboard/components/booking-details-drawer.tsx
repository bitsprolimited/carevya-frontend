"use client";

import {
  BadgeCheck,
  Check,
  Flag,
  Info,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/features/dashboard/components/booking-status-badge";
import type { Booking } from "@/features/dashboard/types/bookings";
import { cn } from "@/lib/utils";

export function BookingDetailsDrawer({
  booking,
  open,
  onClose,
  onMessage,
  onConfirm,
  onAcceptProposal,
  onCancel,
  onReport,
  onReview,
  onViewAgreement,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onMessage: () => void;
  onConfirm: () => void;
  onAcceptProposal: () => void;
  onCancel: () => void;
  onReport: () => void;
  onReview?: () => void;
  onViewAgreement?: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !booking) return null;

  const hasProposal = Boolean(booking.timeProposal);
  const canConfirm = booking.status === "accepted";
  const canAcceptProposal = booking.status === "pending" && hasProposal;
  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close booking details"
        className="absolute inset-0 bg-scrim/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#E8EEF5] px-5 py-4">
          <div>
            <h2
              id="booking-details-title"
              className="text-lg font-bold tracking-tight text-navy"
            >
              Booking details
            </h2>
            <p className="mt-0.5 text-xs text-navy/50">
              {booking.reference} · {booking.requestedOn}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/55 hover:bg-surface-soft hover:text-navy"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-soft">
              <Image
                src={booking.avatarUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-bold text-navy">
                  {booking.caregiverName}
                </p>
                {booking.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F9F1] px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-dark">
                    <BadgeCheck
                      className="size-3.5 fill-emerald text-white"
                      aria-hidden
                    />
                    ID verified
                  </span>
                ) : null}
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="mt-1 text-sm text-navy/55">{booking.careType}</p>
            </div>
          </div>

          <ol className="mt-6 space-y-0">
            {booking.timeline.map((step, index) => {
              const isLast = index === booking.timeline.length - 1;
              return (
                <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
                  {!isLast ? (
                    <span
                      className="absolute top-7 left-[0.6875rem] h-[calc(100%-1.25rem)] w-px bg-[#E2E8F0]"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                      step.state === "done" && "bg-emerald text-white",
                      step.state === "current" && "bg-brand-blue text-white",
                      step.state === "upcoming" &&
                        "border-2 border-[#D7E0EA] bg-white",
                    )}
                  >
                    {step.state === "done" || step.state === "current" ? (
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    ) : null}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-navy">{step.title}</p>
                    <p className="mt-0.5 text-xs text-navy/55">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {booking.timeProposal ? (
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
                  <p className="text-[0.625rem] font-bold tracking-wide text-navy/45 uppercase">
                    {booking.timeProposal.askedLabel}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold leading-snug text-navy">
                    {booking.timeProposal.askedRange}
                  </p>
                </div>
                <div className="rounded-xl border border-brand-blue bg-[#EAF2FF] p-3">
                  <p className="text-[0.625rem] font-bold tracking-wide text-brand-blue uppercase">
                    {booking.timeProposal.suggestedBy}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold leading-snug text-navy">
                    {booking.timeProposal.suggestedRange}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[#E8EEF5] bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="relative size-8 overflow-hidden rounded-full bg-surface-soft">
                    <Image
                      src={booking.timeProposal.messageAvatarUrl}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                  <p className="text-xs font-semibold text-navy">
                    {booking.timeProposal.messageAuthor}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">
                  {booking.timeProposal.message}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-3 border-t border-[#E8EEF5] pt-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-navy/45 uppercase">
                Caring for
              </p>
              <p className="mt-1 text-sm font-semibold text-navy">
                {booking.recipientName} ({booking.recipientRelationship})
              </p>
            </div>

            <p className="flex items-start gap-2 rounded-xl bg-[#E9F9F1] px-3 py-2.5 text-xs leading-relaxed text-navy/75">
              <Info className="mt-0.5 size-3.5 shrink-0 text-emerald" aria-hidden />
              {booking.privacyNote}
            </p>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-navy/55">Schedule</dt>
                <dd className="text-right font-medium text-navy">
                  {booking.scheduleLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy/55">Dates</dt>
                <dd className="text-right font-medium text-navy">
                  {booking.datesLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy/55">Duration</dt>
                <dd className="text-right font-medium text-navy">
                  {booking.durationLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy/55">Location</dt>
                <dd className="text-right font-medium text-navy">
                  {booking.locationLabel}
                </dd>
              </div>
            </dl>

            <div className="rounded-2xl bg-[#F3F6FB] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-navy/60">Agreed price</span>
                <span className="text-base font-bold text-navy">
                  {booking.agreedPriceLabel}
                </span>
              </div>
              {booking.paymentNote ? (
                <p className="mt-1.5 text-xs text-navy/55">{booking.paymentNote}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8EEF5] px-5 py-4">
          {booking.status === "declined" ? (
            <Link
              href="/careseeker/caregivers"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white hover:bg-brand-blue-hover"
            >
              Find similar caregivers →
            </Link>
          ) : isConfirmed ? (
            <>
              <Button
                type="button"
                onClick={onMessage}
                className="h-11 w-full rounded-full"
              >
                Message {booking.caregiverFirstName} →
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onViewAgreement?.() ?? onMessage()}
                className="mt-2.5 h-11 w-full rounded-full"
              >
                View agreement in chat
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onReview?.()}
                className="mt-2.5 h-11 w-full rounded-full"
              >
                Confirm completion &amp; review
              </Button>
            </>
          ) : (
            <>
              {canConfirm ? (
                <Button
                  type="button"
                  onClick={onConfirm}
                  className="h-11 w-full rounded-full"
                >
                  Confirm booking →
                </Button>
              ) : null}
              {canAcceptProposal ? (
                <Button
                  type="button"
                  onClick={onAcceptProposal}
                  className="h-11 w-full rounded-full"
                >
                  Accept new time →
                </Button>
              ) : null}
              {booking.status === "pending" && !hasProposal ? (
                <p className="mb-3 text-center text-xs text-navy/50">
                  Waiting for {booking.caregiverFirstName} to respond.
                </p>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                onClick={onMessage}
                className={cn(
                  "h-11 w-full rounded-full",
                  canConfirm || canAcceptProposal ? "mt-2.5" : "",
                )}
              >
                Message {booking.caregiverFirstName}
              </Button>
            </>
          )}

          {booking.status !== "declined" ? (
            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger hover:underline"
              >
                <Trash2 className="size-3.5" aria-hidden />
                {isConfirmed ? "Cancel booking" : "Cancel request"}
              </button>
              <button
                type="button"
                onClick={onReport}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger hover:underline"
              >
                <Flag className="size-3.5" aria-hidden />
                Report an issue
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
