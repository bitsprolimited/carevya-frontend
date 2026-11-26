"use client";

import { ArrowRight, Check, ChevronDown, Paperclip, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  CAREGIVER_BOOKING_ISSUE_OPTIONS,
  CAREGIVER_REPORT_NO_BOOKING_ID,
  type CaregiverReportBookingOption,
} from "@/features/caregiver-dashboard/data/mock-bookings";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const NO_BOOKING_OPTION: CaregiverReportBookingOption = {
  id: CAREGIVER_REPORT_NO_BOOKING_ID,
  triggerLabel: "Not about a booking",
  name: "Not about a booking",
  careLabel: "",
  dateLabel: "",
  reference: "",
  avatarUrl: "",
};

export function CaregiverReportIssueModal({
  open,
  onClose,
  bookingLabel,
  bookingOptions,
}: {
  open: boolean;
  onClose: () => void;
  /** Locked booking label (e.g. from booking details). */
  bookingLabel?: string;
  /** Selectable related bookings (e.g. from Help & Support). */
  bookingOptions?: CaregiverReportBookingOption[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [issue, setIssue] = useState<string>(CAREGIVER_BOOKING_ISSUE_OPTIONS[0]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [safetyConcern, setSafetyConcern] = useState(false);
  const [issueMenuOpen, setIssueMenuOpen] = useState(false);
  const [bookingMenuOpen, setBookingMenuOpen] = useState(false);

  const lockedOption = useMemo<CaregiverReportBookingOption | null>(() => {
    if (!bookingLabel || bookingOptions?.length) return null;
    return {
      id: "locked",
      triggerLabel: bookingLabel,
      name: bookingLabel.split(" · ")[0] ?? bookingLabel,
      careLabel: "",
      dateLabel: "",
      reference: bookingLabel.includes("#")
        ? (bookingLabel.split("·").pop()?.trim() ?? "")
        : "",
      avatarUrl: "",
    };
  }, [bookingLabel, bookingOptions]);

  const selectableBookings = useMemo(() => {
    if (bookingOptions?.length) {
      return [...bookingOptions, NO_BOOKING_OPTION];
    }
    if (lockedOption) return [lockedOption];
    return [NO_BOOKING_OPTION];
  }, [bookingOptions, lockedOption]);

  const bookingSelectable = Boolean(bookingOptions && bookingOptions.length > 0);
  const selectedBooking =
    selectableBookings.find((item) => item.id === selectedBookingId) ??
    selectableBookings[0];

  useEffect(() => {
    if (!open) return;
    setIssue(CAREGIVER_BOOKING_ISSUE_OPTIONS[0]);
    setSelectedBookingId(
      bookingOptions?.[0]?.id ?? lockedOption?.id ?? NO_BOOKING_OPTION.id,
    );
    setDetails("");
    setFileName(null);
    setSafetyConcern(false);
    setIssueMenuOpen(false);
    setBookingMenuOpen(false);
  }, [open, bookingOptions, lockedOption]);

  useEffect(() => {
    if (!issueMenuOpen && !bookingMenuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIssueMenuOpen(false);
        setBookingMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [issueMenuOpen, bookingMenuOpen]);

  function handleSubmit() {
    if (!details.trim()) {
      appToast.error("Please tell us more about the issue.");
      return;
    }
    appToast.success(
      safetyConcern
        ? "Safety report submitted — our team will prioritise this"
        : "Issue report submitted",
    );
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
            <h2 className="text-xl font-bold tracking-tight text-navy">
              Report an issue
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              Our team reviews every report. Safety concerns are handled first.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/40 hover:bg-surface-soft"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="relative">
            <p className="mb-1.5 text-sm font-semibold text-navy">
              What happened?
            </p>
            <button
              type="button"
              onClick={() => {
                setBookingMenuOpen(false);
                setIssueMenuOpen((value) => !value);
              }}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D7E0EA] bg-white px-3.5 text-left text-sm text-navy"
            >
              <span className="truncate">{issue}</span>
              <ChevronDown className="size-4 text-navy/40" aria-hidden />
            </button>
            {issueMenuOpen ? (
              <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                {CAREGIVER_BOOKING_ISSUE_OPTIONS.map((option) => {
                  const selected = option === issue;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setIssue(option);
                        setIssueMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm",
                        selected
                          ? "bg-[#EAF2FF] font-semibold text-brand-blue"
                          : "text-navy hover:bg-surface-soft",
                      )}
                    >
                      {option}
                      {selected ? (
                        <Check className="size-4" strokeWidth={3} aria-hidden />
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
            {bookingSelectable ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIssueMenuOpen(false);
                    setBookingMenuOpen((value) => !value);
                  }}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D7E0EA] bg-white px-3.5 text-left text-sm text-navy"
                >
                  <span className="truncate">
                    {selectedBooking?.triggerLabel ?? "Select a booking"}
                  </span>
                  <ChevronDown className="size-4 text-navy/40" aria-hidden />
                </button>
                {bookingMenuOpen ? (
                  <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                    {selectableBookings.map((option) => {
                      const selected = option.id === selectedBooking?.id;
                      const isNone = option.id === CAREGIVER_REPORT_NO_BOOKING_ID;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSelectedBookingId(option.id);
                            setBookingMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-3.5 py-2.5 text-left",
                            selected
                              ? "bg-[#EAF2FF]"
                              : "hover:bg-surface-soft",
                            isNone && "border-t border-[#E8EEF5]",
                          )}
                        >
                          {!isNone ? (
                            <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                              {option.avatarUrl ? (
                                <Image
                                  src={option.avatarUrl}
                                  alt=""
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex size-full items-center justify-center text-xs font-bold text-navy/45">
                                  {option.name.slice(0, 1)}
                                </span>
                              )}
                            </span>
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block truncate text-sm",
                                selected
                                  ? "font-semibold text-brand-blue"
                                  : "font-semibold text-navy",
                              )}
                            >
                              {isNone
                                ? option.name
                                : `${option.name} · ${option.careLabel}`}
                            </span>
                            {!isNone ? (
                              <span className="mt-0.5 block truncate text-xs text-navy/50">
                                {option.dateLabel} · Booking {option.reference}
                              </span>
                            ) : null}
                          </span>
                          {selected ? (
                            <Check
                              className="size-4 shrink-0 text-brand-blue"
                              strokeWidth={3}
                              aria-hidden
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex h-11 items-center rounded-xl border border-[#D7E0EA] bg-[#F8FAFC] px-3.5 text-sm text-navy">
                {selectedBooking?.triggerLabel ?? "No related booking"}
              </div>
            )}
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
              className="w-full resize-none rounded-xl border border-[#D7E0EA] bg-white px-3.5 py-3 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </label>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D7E0EA] bg-[#F8FAFC] px-4 py-4 text-sm font-medium text-navy/65 hover:border-brand-blue/40"
          >
            <Paperclip className="size-4" aria-hidden />
            {fileName ? fileName : "Add photos or documents (optional)"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(event) => {
              setFileName(event.target.files?.[0]?.name ?? null);
              event.target.value = "";
            }}
          />

          <label className="flex cursor-pointer items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={safetyConcern}
              onClick={() => setSafetyConcern((value) => !value)}
              className={cn(
                "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border",
                safetyConcern
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-[#C9D3E0] bg-white text-transparent",
              )}
            >
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </button>
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
            onClick={handleSubmit}
            className="h-11 flex-1 rounded-full"
          >
            Submit report
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
