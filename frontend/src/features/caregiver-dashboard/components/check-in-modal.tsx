"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CHECK_IN_TIMES } from "@/features/caregiver-dashboard/data/mock-bookings";
import { cn } from "@/lib/utils";

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function CheckInModal({
  open,
  onClose,
  onConfirm,
  defaultDateLabel = "Thu, 15 Oct 2026",
  defaultTime = "8:00 AM",
  helperText = "Live-in care starts 1 month · 15 Oct – 14 Nov",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    dateLabel: string;
    timeLabel: string;
    note: string;
  }) => void;
  defaultDateLabel?: string;
  defaultTime?: string;
  helperText?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 9, 15));
  const [monthCursor, setMonthCursor] = useState(() => new Date(2026, 9, 1));
  const [timeLabel, setTimeLabel] = useState(defaultTime);
  const [note, setNote] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedDate(new Date(2026, 9, 15));
    setMonthCursor(new Date(2026, 9, 1));
    setTimeLabel(defaultTime);
    setNote("");
    setDateOpen(false);
    setTimeOpen(false);
  }, [open, defaultTime]);

  useEffect(() => {
    if (!dateOpen && !timeOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setDateOpen(false);
        setTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [dateOpen, timeOpen]);

  const calendarDays = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const total = daysInMonth(monthCursor);
    const offset = first.getDay();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < offset; i += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) {
      cells.push(
        new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day),
      );
    }
    return cells;
  }, [monthCursor]);

  const dateLabel = formatDateLabel(selectedDate) || defaultDateLabel;
  const monthTitle = monthCursor.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div
        ref={rootRef}
        className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#EAF2FF] text-brand-blue">
              <CalendarDays className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-navy">
                Check In
              </h2>
              <p className="mt-1 text-sm text-navy/55">
                Check in to confirm you&apos;ve arrived and started your shift.
              </p>
            </div>
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

        <div className="relative mt-5">
          <p className="mb-1.5 text-sm font-medium text-navy">Date</p>
          <button
            type="button"
            onClick={() => {
              setDateOpen((value) => !value);
              setTimeOpen(false);
            }}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D7DEE8] bg-white px-3.5 text-left text-sm text-navy"
          >
            <span>{dateLabel}</span>
            <ChevronDown className="size-4 text-navy/40" aria-hidden />
          </button>
          {dateOpen ? (
            <div className="absolute z-30 mt-2 w-full rounded-2xl border border-[#E8EEF5] bg-white p-3 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() =>
                    setMonthCursor(
                      new Date(
                        monthCursor.getFullYear(),
                        monthCursor.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-soft"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <p className="text-sm font-semibold text-navy">{monthTitle}</p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() =>
                    setMonthCursor(
                      new Date(
                        monthCursor.getFullYear(),
                        monthCursor.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-soft"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[0.6875rem] text-navy/40">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) return <span key={`empty-${index}`} />;
                  const selected =
                    day.toDateString() === selectedDate.toDateString();
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day);
                        setDateOpen(false);
                      }}
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded-full text-sm",
                        selected
                          ? "bg-brand-blue font-semibold text-white"
                          : "text-navy hover:bg-surface-soft",
                      )}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-navy/50">{helperText}</p>
            </div>
          ) : null}
        </div>

        <div className="relative mt-4">
          <p className="mb-1.5 text-sm font-medium text-navy">Time</p>
          <button
            type="button"
            onClick={() => {
              setTimeOpen((value) => !value);
              setDateOpen(false);
            }}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D7DEE8] bg-white px-3.5 text-left text-sm text-navy"
          >
            <span>{timeLabel}</span>
            <ChevronDown className="size-4 text-navy/40" aria-hidden />
          </button>
          {timeOpen ? (
            <div className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
              {CHECK_IN_TIMES.map((option) => {
                const selected = option === timeLabel;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setTimeLabel(option);
                      setTimeOpen(false);
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

        <div className="mt-4">
          <label
            htmlFor="check-in-note"
            className="mb-1.5 block text-sm font-medium text-navy"
          >
            Note (optional)
          </label>
          <textarea
            id="check-in-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="Careseeker wedding"
            className="w-full resize-none rounded-xl border border-[#D7DEE8] bg-white px-3.5 py-3 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 rounded-full px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() =>
              onConfirm({
                dateLabel,
                timeLabel,
                note: note.trim(),
              })
            }
            className="h-11 rounded-full px-6"
          >
            Check in
          </Button>
        </div>
      </div>
    </Modal>
  );
}
