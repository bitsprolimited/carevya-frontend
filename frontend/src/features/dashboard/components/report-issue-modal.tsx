"use client";

import { ArrowRight, Check, ChevronDown, Paperclip, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";
import { cn } from "@/lib/utils";

const ISSUE_OPTIONS = [
  "Caregiver arrived late",
  "Caregiver didn't show up",
  "Safety or wellbeing concern",
  "Disagreement about the agreed price",
  "Unprofessional behaviour",
  "Something else",
] as const;

type OpenMenu = "issue" | "booking" | null;

export function ReportIssueModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bookings = useBookingsStore((state) => state.bookings);

  const [issue, setIssue] = useState<(typeof ISSUE_OPTIONS)[number]>(
    ISSUE_OPTIONS[0],
  );
  const [bookingId, setBookingId] = useState<string | null>(
    bookings[0]?.id ?? null,
  );
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [safetyConcern, setSafetyConcern] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  useEffect(() => {
    if (!open) return;
    setIssue(ISSUE_OPTIONS[0]);
    setBookingId(bookings[0]?.id ?? null);
    setDetails("");
    setFileName(null);
    setSafetyConcern(false);
    setSubmitting(false);
    setOpenMenu(null);
  }, [open, bookings]);

  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openMenu]);

  const selectedBooking =
    bookingId == null
      ? null
      : (bookings.find((item) => item.id === bookingId) ?? null);

  const bookingLabel = selectedBooking
    ? `${selectedBooking.caregiverFirstName} · ${selectedBooking.careStartsLabel.split("·")[0]?.trim() || selectedBooking.dateTimeLabel}`
    : "Not about a booking";

  async function handleSubmit() {
    if (!details.trim()) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    onSubmitted?.();
    onClose();
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-lg"
    >
      <div
        ref={rootRef}
        className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-xl font-bold tracking-tight text-navy"
            >
              Report an issue
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              Our team reviews every report. Safety concerns are handled first.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-navy/40 hover:bg-surface-soft hover:text-navy"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="relative">
            <p className="mb-1.5 text-sm font-semibold text-navy">
              What happened?
            </p>
            <button
              type="button"
              onClick={() =>
                setOpenMenu((current) =>
                  current === "issue" ? null : "issue",
                )
              }
              className={cn(
                "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm text-navy",
                openMenu === "issue"
                  ? "border-brand-blue ring-2 ring-brand-blue/20"
                  : "border-[#D7E0EA]",
              )}
            >
              <span className="truncate">{issue}</span>
              <ChevronDown className="size-4 shrink-0 text-navy/40" aria-hidden />
            </button>
            {openMenu === "issue" ? (
              <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                {ISSUE_OPTIONS.map((option) => {
                  const selected = issue === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setIssue(option);
                        if (option === "Safety or wellbeing concern") {
                          setSafetyConcern(true);
                        }
                        setOpenMenu(null);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm",
                        selected
                          ? "bg-[#EAF2FF] font-semibold text-brand-blue"
                          : "text-navy hover:bg-surface-soft",
                      )}
                    >
                      {option}
                      {selected ? (
                        <Check className="size-4 shrink-0" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <p className="mb-1.5 text-sm font-semibold text-navy">
              Related booking
            </p>
            <button
              type="button"
              onClick={() =>
                setOpenMenu((current) =>
                  current === "booking" ? null : "booking",
                )
              }
              className={cn(
                "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm text-navy",
                openMenu === "booking"
                  ? "border-brand-blue ring-2 ring-brand-blue/20"
                  : "border-[#D7E0EA]",
              )}
            >
              <span className="truncate">{bookingLabel}</span>
              <ChevronDown className="size-4 shrink-0 text-navy/40" aria-hidden />
            </button>
            {openMenu === "booking" ? (
              <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                {bookings.slice(0, 6).map((booking) => {
                  const selected = bookingId === booking.id;
                  const careLabel =
                    booking.careType.split("·")[0]?.trim() || booking.careType;
                  return (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => {
                        setBookingId(booking.id);
                        setOpenMenu(null);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left",
                        selected ? "bg-[#EAF2FF]" : "hover:bg-surface-soft",
                      )}
                    >
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                        <Image
                          src={booking.avatarUrl}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover object-top"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy">
                          {booking.caregiverName} · {careLabel}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-navy/50">
                          {booking.careStartsLabel} · Booking{" "}
                          {booking.reference}
                        </span>
                      </span>
                      {selected ? (
                        <Check
                          className="size-4 shrink-0 text-brand-blue"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setBookingId(null);
                    setOpenMenu(null);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between border-t border-[#E8EEF5] px-3.5 py-3 text-left text-sm font-semibold",
                    bookingId == null
                      ? "text-brand-blue"
                      : "text-navy hover:bg-surface-soft",
                  )}
                >
                  Not about a booking
                  {bookingId == null ? (
                    <Check className="size-4 shrink-0" aria-hidden />
                  ) : null}
                </button>
              </div>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              Tell us more
            </span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={4}
              placeholder="Include what happened, when, and how we can help."
              className="w-full resize-none rounded-xl border border-[#D7E0EA] bg-white px-3.5 py-3 text-sm text-navy outline-none placeholder:text-navy/35 focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setFileName(file?.name ?? null);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D7E0EA] bg-[#F8FAFC] px-4 py-4 text-sm font-medium text-navy/65 transition-colors hover:border-brand-blue/40 hover:bg-[#EAF2FF]/40"
            >
              <Paperclip className="size-4 shrink-0" aria-hidden />
              {fileName ? fileName : "Add photos or documents (optional)"}
            </button>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={safetyConcern}
              onChange={(event) => setSafetyConcern(event.target.checked)}
              className="mt-0.5 size-4 rounded border-[#D7E0EA] text-brand-blue focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="text-sm text-navy/75">
              This is a safety concern — someone may be at risk
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!details.trim() || submitting}
            className="h-11 flex-1 rounded-full"
          >
            {submitting ? "Submitting..." : "Submit report"}
            {!submitting ? <ArrowRight className="size-4" aria-hidden /> : null}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
