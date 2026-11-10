"use client";

import { ArrowRight, Check, ChevronDown, Paperclip, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  createIssueReport,
  getIssueBookingOptions,
  type IssueBookingOption,
  type IssueReportCategory,
} from "@/features/issue-reports/services/issue-reports-service";
import { uploadFile } from "@/features/uploads/services/upload-service";
import { ApiError } from "@/lib/api";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const ISSUE_OPTIONS: {
  label: string;
  category: IssueReportCategory;
}[] = [
  { label: "Caregiver arrived late", category: "caregiver_late" },
  { label: "Caregiver didn't show up", category: "caregiver_no_show" },
  { label: "Safety or wellbeing concern", category: "safety_concern" },
  {
    label: "Disagreement about the agreed price",
    category: "price_disagreement",
  },
  { label: "Unprofessional behaviour", category: "unprofessional_behaviour" },
  { label: "Something else", category: "other" },
];

type OpenMenu = "issue" | "booking" | null;

function formatBookingWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

  const [issueIndex, setIssueIndex] = useState(0);
  const [bookingOptions, setBookingOptions] = useState<IssueBookingOption[]>(
    [],
  );
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [safetyConcern, setSafetyConcern] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  useEffect(() => {
    if (!open) return;
    setIssueIndex(0);
    setBookingId(null);
    setDetails("");
    setAttachmentFile(null);
    setFileName(null);
    setSafetyConcern(false);
    setSubmitting(false);
    setOpenMenu(null);
    setError(null);

    let cancelled = false;
    setLoadingOptions(true);
    void (async () => {
      try {
        const options = await getIssueBookingOptions();
        if (cancelled) return;
        setBookingOptions(Array.isArray(options) ? options : []);
      } catch {
        if (cancelled) return;
        // Spec: empty until bookings ship — keep "Not about a booking".
        setBookingOptions([]);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

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

  const selectedIssue = ISSUE_OPTIONS[issueIndex] ?? ISSUE_OPTIONS[0];
  const selectedBooking =
    bookingId == null
      ? null
      : (bookingOptions.find((item) => item.id === bookingId) ?? null);

  const bookingLabel = selectedBooking
    ? `${selectedBooking.caregiverName} · ${formatBookingWhen(selectedBooking.scheduledFor)}`
    : "Not about a booking";

  async function handleSubmit() {
    if (!details.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const attachmentUrls: string[] = [];
      if (attachmentFile) {
        const uploaded = await uploadFile("issue_attachment", attachmentFile);
        if (uploaded.url) attachmentUrls.push(uploaded.url);
      }

      await createIssueReport({
        category: selectedIssue.category,
        bookingId,
        details: details.trim(),
        isSafetyConcern: safetyConcern,
        ...(attachmentUrls.length ? { attachmentUrls } : {}),
      });

      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn't submit your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
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
              <span className="truncate">{selectedIssue.label}</span>
              <ChevronDown className="size-4 shrink-0 text-navy/40" aria-hidden />
            </button>
            {openMenu === "issue" ? (
              <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                {ISSUE_OPTIONS.map((option, index) => {
                  const selected = issueIndex === index;
                  return (
                    <button
                      key={option.category}
                      type="button"
                      onClick={() => {
                        setIssueIndex(index);
                        if (option.category === "safety_concern") {
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
                      {option.label}
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
              <span className="truncate">
                {loadingOptions ? "Loading bookings…" : bookingLabel}
              </span>
              <ChevronDown className="size-4 shrink-0 text-navy/40" aria-hidden />
            </button>
            {openMenu === "booking" ? (
              <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                {bookingOptions.map((booking) => {
                  const selected = bookingId === booking.id;
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
                          src={
                            booking.caregiverPhotoUrl ||
                            assets.aboutMemberDevG
                          }
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover object-top"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy">
                          {booking.caregiverName} · {booking.serviceLabel}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-navy/50">
                          {formatBookingWhen(booking.scheduledFor)} · Booking{" "}
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
              maxLength={2000}
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
                const file = event.target.files?.[0] ?? null;
                setAttachmentFile(file);
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

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

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
