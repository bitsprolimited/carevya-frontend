"use client";

import { ArrowRight, ChevronDown, Paperclip, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";
import { cn } from "@/lib/utils";

const ISSUE_OPTIONS = [
  "Caregiver arrived late",
  "Caregiver didn't show up",
  "Care quality concern",
  "Payment or pricing issue",
  "Booking or schedule problem",
  "App or technical issue",
  "Other",
] as const;

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bookings = useBookingsStore((state) => state.bookings);

  const [issue, setIssue] = useState<(typeof ISSUE_OPTIONS)[number]>(
    ISSUE_OPTIONS[0],
  );
  const [bookingId, setBookingId] = useState("");
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [safetyConcern, setSafetyConcern] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIssue(ISSUE_OPTIONS[0]);
    setBookingId(bookings[0]?.id ?? "");
    setDetails("");
    setFileName(null);
    setSafetyConcern(false);
    setSubmitting(false);
  }, [open, bookings]);

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
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              What happened?
            </span>
            <span className="relative block">
              <select
                value={issue}
                onChange={(event) =>
                  setIssue(event.target.value as (typeof ISSUE_OPTIONS)[number])
                }
                className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3.5 pr-10 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {ISSUE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-navy/40"
                aria-hidden
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              Related booking
            </span>
            <span className="relative block">
              <select
                value={bookingId}
                onChange={(event) => setBookingId(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3.5 pr-10 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">No related booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.caregiverFirstName} ·{" "}
                    {booking.careStartsLabel.split("·")[0]?.trim() ||
                      booking.dateTimeLabel}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-navy/40"
                aria-hidden
              />
            </span>
          </label>

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
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D7E0EA] bg-[#F8FAFC] px-4 py-4 text-sm font-medium text-navy/65 transition-colors hover:border-brand-blue/40 hover:bg-[#EAF2FF]/40",
              )}
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
