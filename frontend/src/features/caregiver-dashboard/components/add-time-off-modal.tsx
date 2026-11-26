"use client";

import { CalendarPlus, Check, TriangleAlert } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  formatScheduleDayLabel,
  formatScheduleRangeLabel,
  inclusiveDayCount,
  rangesOverlap,
  scheduleBookingBlocks,
} from "@/features/caregiver-dashboard/data/mock-schedule";
import type { ScheduleBookingBlock } from "@/features/caregiver-dashboard/types/schedule";
import { cn } from "@/lib/utils";

export function AddTimeOffModal({
  open,
  onClose,
  onAdd,
  bookings = scheduleBookingBlocks,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: { reason: string; startDate: string; endDate: string }) => void;
  bookings?: ScheduleBookingBlock[];
}) {
  const titleId = useId();
  const [reason, setReason] = useState("Careseeker wedding");
  const [startDate, setStartDate] = useState("2026-11-20");
  const [endDate, setEndDate] = useState("2026-11-22");

  useEffect(() => {
    if (!open) return;
    setReason("Careseeker wedding");
    setStartDate("2026-11-20");
    setEndDate("2026-11-22");
  }, [open]);

  const clash = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return null;
    return (
      bookings.find((booking) =>
        rangesOverlap(startDate, endDate, booking.startDate, booking.endDate),
      ) ?? null
    );
  }, [bookings, startDate, endDate]);

  const dayCount =
    startDate && endDate && endDate >= startDate
      ? inclusiveDayCount(startDate, endDate)
      : 0;

  const canSubmit = dayCount > 0 && !clash;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-brand-blue">
          <CalendarPlus className="size-6" aria-hidden />
        </div>

        <h2
          id={titleId}
          className="mt-4 text-xl font-bold tracking-tight text-navy"
        >
          Add time off
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-navy/55">
          Careseekers won&apos;t be able to book you on these dates. Bookings
          you&apos;ve already accepted aren&apos;t affected.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="time-off-reason"
              className="text-sm font-semibold text-navy"
            >
              Reason{" "}
              <span className="font-normal text-navy/45">(optional)</span>
            </label>
            <input
              id="time-off-reason"
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#D7E0EA] bg-white px-3.5 text-sm text-navy outline-none placeholder:text-navy/40 focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Family event"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="time-off-start"
                className="text-sm font-semibold text-navy"
              >
                Start date
              </label>
              <input
                id="time-off-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={cn(
                  "mt-1.5 h-11 w-full rounded-xl border bg-white px-3 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  clash ? "border-danger" : "border-[#D7E0EA]",
                )}
              />
              {startDate ? (
                <p className="mt-1 text-xs text-navy/45">
                  {formatScheduleDayLabel(startDate)}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="time-off-end"
                className="text-sm font-semibold text-navy"
              >
                End date
              </label>
              <input
                id="time-off-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={cn(
                  "mt-1.5 h-11 w-full rounded-xl border bg-white px-3 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  clash ? "border-danger" : "border-[#D7E0EA]",
                )}
              />
              {endDate ? (
                <p className="mt-1 text-xs text-navy/45">
                  {formatScheduleDayLabel(endDate)}
                </p>
              ) : null}
            </div>
          </div>

          {clash ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-[#FEF2F2] px-3.5 py-3 text-sm leading-relaxed text-[#B42318]">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>
                These dates clash with your live-in booking {clash.reference} (
                {formatScheduleRangeLabel(clash.startDate, clash.endDate)}).
                Pick other dates, or contact support if you need to change the
                booking.
              </p>
            </div>
          ) : dayCount > 0 ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald/20 bg-[#ECFDF3] px-3.5 py-3 text-sm leading-relaxed text-emerald-dark">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald text-white">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              <p>
                {dayCount} day{dayCount === 1 ? "" : "s"} off — you have no
                bookings on these dates
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-[#F5F7FB] px-3.5 py-3 text-sm text-navy/55">
              Choose a valid start and end date.
            </div>
          )}
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
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              onAdd({
                reason: reason.trim() || "Time off",
                startDate,
                endDate,
              });
            }}
            className="h-11 flex-1 rounded-full"
          >
            Add time off
          </Button>
        </div>
      </div>
    </Modal>
  );
}
