"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { mockRecipients } from "@/features/dashboard/data/mock";
import type { CaregiverProfile } from "@/features/dashboard/types/caregiver-profile";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const CARE_TYPE_META = [
  {
    id: "Non-clinical care",
    description: "Companionship, meals, mobility, errands, light housekeeping.",
  },
  {
    id: "Personal & specialized care",
    description:
      "Bathing, dressing, toileting, dementia and memory support.",
  },
  {
    id: "Clinical care",
    description:
      "Only offered by verified health professionals — this caregiver doesn’t offer this.",
    clinical: true,
  },
] as const;

const FREQUENCY_OPTIONS = [
  "Live-in",
  "Full day",
  "Part-time",
  "Overnight",
  "Weekends only",
] as const;

const START_TIMES = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "6:00 PM",
] as const;

type Frequency = (typeof FREQUENCY_OPTIONS)[number];
type OpenMenu = "careType" | "date" | "time" | null;

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function rateForFrequency(
  caregiver: CaregiverProfile,
  frequency: Frequency,
): { amount: number; unit: string; summary: string; endLabel: string } {
  const liveIn = caregiver.priceAmount || 210_000;
  switch (frequency) {
    case "Live-in":
      return {
        amount: liveIn,
        unit: "/ month",
        summary: "1 month live-in · until 14 Nov",
        endLabel: "Live-in care runs 1 month · 15 Oct – 14 Nov",
      };
    case "Full day":
      return {
        amount: 28_000,
        unit: "/ day",
        summary: "Full day (10 hrs) · listed day rate",
        endLabel: "Full day care · selected start date",
      };
    case "Overnight":
      return {
        amount: 20_000,
        unit: "/ night",
        summary: "Overnight · listed night rate",
        endLabel: "Overnight care · selected start date",
      };
    case "Part-time":
      return {
        amount: 18_000,
        unit: "/ day",
        summary: "Part-time · listed day rate",
        endLabel: "Part-time care · selected start date",
      };
    case "Weekends only":
      return {
        amount: 45_000,
        unit: "/ weekend",
        summary: "Weekends only · listed weekend rate",
        endLabel: "Weekend care · selected start date",
      };
  }
}

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
        selected
          ? "border-brand-blue bg-[#E8F0FE] text-brand-blue"
          : "border-[#D7E0EA] bg-white text-navy/70 hover:border-navy/30",
      )}
    >
      {selected ? <Check className="size-3.5" aria-hidden /> : null}
      {label}
    </button>
  );
}

function offersCareType(caregiver: CaregiverProfile, careType: string) {
  if (caregiver.services.includes(careType)) return true;
  if (caregiver.categoryLabel === careType) return true;
  if (caregiver.categoryLabel.startsWith(careType)) return true;
  return false;
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Monday-first weekday index (0 = Monday). */
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function BookCaregiverModal({
  open,
  onClose,
  caregiver,
  onMessage,
}: {
  open: boolean;
  onClose: () => void;
  caregiver: CaregiverProfile;
  onMessage?: () => void;
}) {
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"form" | "success">("form");
  const [recipientId, setRecipientId] = useState(mockRecipients[0]?.id ?? "");
  const initialCareType =
    caregiver.services.find((service) =>
      CARE_TYPE_META.some((option) => option.id === service),
    ) ??
    CARE_TYPE_META.find((option) =>
      caregiver.categoryLabel.startsWith(option.id),
    )?.id ??
    CARE_TYPE_META[0].id;
  const [careType, setCareType] = useState(initialCareType);
  const [startDate, setStartDate] = useState("2026-10-15");
  const [startTime, setStartTime] = useState<string>("8:00 AM");
  const [frequency, setFrequency] = useState<Frequency>("Live-in");
  const [submitting, setSubmitting] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [calendarMonth, setCalendarMonth] = useState({ year: 2026, month: 9 });

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setRecipientId(mockRecipients[0]?.id ?? "");
    setCareType(
      caregiver.services.find((service) =>
        CARE_TYPE_META.some((option) => option.id === service),
      ) ??
        CARE_TYPE_META.find((option) =>
          caregiver.categoryLabel.startsWith(option.id),
        )?.id ??
        CARE_TYPE_META[0].id,
    );
    setStartDate("2026-10-15");
    setStartTime("8:00 AM");
    setFrequency(
      caregiver.arrangements.includes("Live-in") ? "Live-in" : "Full day",
    );
    setOpenMenu(null);
    setCalendarMonth({ year: 2026, month: 9 });
  }, [open, caregiver]);

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

  const recipient = mockRecipients.find((item) => item.id === recipientId);
  const pricing = useMemo(
    () => rateForFrequency(caregiver, frequency),
    [caregiver, frequency],
  );

  const startDateLabel = useMemo(() => {
    const date = new Date(`${startDate}T12:00:00`);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [startDate]);

  const startLabel = `${startDateLabel} · ${startTime}`;

  const calendarCells = useMemo(() => {
    const { year, month } = calendarMonth;
    const first = new Date(year, month, 1);
    const total = daysInMonth(year, month);
    const pad = mondayIndex(first);
    const cells: Array<{ day: number; iso: string; inMonth: boolean } | null> =
      [];
    for (let i = 0; i < pad; i += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, iso, inMonth: true });
    }
    return cells;
  }, [calendarMonth]);

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setSubmitting(false);
    setStep("success");
  }

  function handleClose() {
    onClose();
  }

  const monthTitle = new Date(
    calendarMonth.year,
    calendarMonth.month,
    1,
  ).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-lg">
      <div
        ref={rootRef}
        className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6"
      >
        {step === "form" ? (
          <>
            <h2
              id={titleId}
              className="pr-8 text-xl font-bold tracking-tight text-navy"
            >
              Book {caregiver.name}
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              {caregiver.firstName} will accept, decline or suggest another
              time.
            </p>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-navy">
                Who needs care?
              </p>
              <div className="flex flex-wrap gap-2">
                {mockRecipients.map((item) => (
                  <Pill
                    key={item.id}
                    label={item.fullName}
                    selected={recipientId === item.id}
                    onClick={() => setRecipientId(item.id)}
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-4">
              <p className="mb-2 text-sm font-semibold text-navy">
                Type of care
              </p>
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((current) =>
                    current === "careType" ? null : "careType",
                  )
                }
                className={cn(
                  "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm text-navy",
                  openMenu === "careType"
                    ? "border-brand-blue ring-2 ring-brand-blue/20"
                    : "border-[#D7E0EA]",
                )}
              >
                {careType}
                <ChevronDown className="size-4 text-navy/40" aria-hidden />
              </button>
              {openMenu === "careType" ? (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                  {CARE_TYPE_META.map((option) => {
                    const available = offersCareType(caregiver, option.id);
                    const selected = careType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          if (!available) return;
                          setCareType(option.id);
                          setOpenMenu(null);
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 px-3.5 py-3 text-left",
                          available
                            ? selected
                              ? "bg-[#EAF2FF]"
                              : "hover:bg-surface-soft"
                            : "cursor-not-allowed opacity-55",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                            {option.id}
                            {"clinical" in option && option.clinical && !available ? (
                              <Lock className="size-3.5 text-navy/40" aria-hidden />
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-navy/55">
                            {available
                              ? option.description
                              : `Only offered by verified health professionals — ${caregiver.firstName} doesn’t offer this.`}
                          </span>
                        </span>
                        {selected && available ? (
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-brand-blue"
                            aria-hidden
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <p className="mb-2 text-sm font-semibold text-navy">
                  Start date
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === "date" ? null : "date",
                    )
                  }
                  className={cn(
                    "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm text-navy",
                    openMenu === "date"
                      ? "border-brand-blue ring-2 ring-brand-blue/20"
                      : "border-[#D7E0EA]",
                  )}
                >
                  <span className="truncate">{startDateLabel}</span>
                  <ChevronDown className="size-4 shrink-0 text-navy/40" aria-hidden />
                </button>
                {openMenu === "date" ? (
                  <div className="absolute z-30 mt-2 w-[min(100vw-3rem,18rem)] rounded-2xl border border-[#E8EEF5] bg-white p-3 shadow-xl sm:w-[18rem]">
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() =>
                          setCalendarMonth((current) => {
                            const month = current.month - 1;
                            if (month < 0) {
                              return { year: current.year - 1, month: 11 };
                            }
                            return { ...current, month };
                          })
                        }
                        className="inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-soft"
                      >
                        <ChevronLeft className="size-4" aria-hidden />
                      </button>
                      <p className="text-sm font-semibold text-navy">
                        {monthTitle}
                      </p>
                      <button
                        type="button"
                        aria-label="Next month"
                        onClick={() =>
                          setCalendarMonth((current) => {
                            const month = current.month + 1;
                            if (month > 11) {
                              return { year: current.year + 1, month: 0 };
                            }
                            return { ...current, month };
                          })
                        }
                        className="inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-soft"
                      >
                        <ChevronRight className="size-4" aria-hidden />
                      </button>
                    </div>
                    <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[0.6875rem] font-semibold text-navy/40">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((cell, index) =>
                        cell ? (
                          <button
                            key={cell.iso}
                            type="button"
                            onClick={() => {
                              setStartDate(cell.iso);
                              setOpenMenu(null);
                            }}
                            className={cn(
                              "inline-flex size-8 items-center justify-center rounded-full text-sm",
                              cell.iso === startDate
                                ? "bg-brand-blue font-semibold text-white"
                                : "text-navy hover:bg-surface-soft",
                            )}
                          >
                            {cell.day}
                          </button>
                        ) : (
                          <span key={`empty-${index}`} className="size-8" />
                        ),
                      )}
                    </div>
                    {frequency === "Live-in" ? (
                      <p className="mt-3 text-xs leading-relaxed text-navy/50">
                        {pricing.endLabel}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <p className="mb-2 text-sm font-semibold text-navy">
                  Start time
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === "time" ? null : "time",
                    )
                  }
                  className={cn(
                    "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm text-navy",
                    openMenu === "time"
                      ? "border-brand-blue ring-2 ring-brand-blue/20"
                      : "border-[#D7E0EA]",
                  )}
                >
                  {startTime}
                  <ChevronDown className="size-4 text-navy/40" aria-hidden />
                </button>
                {openMenu === "time" ? (
                  <div className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white py-1 shadow-xl">
                    {START_TIMES.map((time) => {
                      const selected = startTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setStartTime(time);
                            setOpenMenu(null);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm",
                            selected
                              ? "bg-[#EAF2FF] font-semibold text-brand-blue"
                              : "text-navy hover:bg-surface-soft",
                          )}
                        >
                          {time}
                          {selected ? (
                            <Check className="size-4 shrink-0" aria-hidden />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-navy">
                How often is care needed?
              </p>
              <div className="flex flex-wrap gap-2">
                {FREQUENCY_OPTIONS.map((option) => (
                  <Pill
                    key={option}
                    label={option}
                    selected={frequency === option}
                    onClick={() => setFrequency(option)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl bg-[#F3F6FB] px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">
                  {pricing.summary}
                </p>
                <p className="mt-0.5 text-xs text-navy/55">
                  Sending a request is free. You&apos;ll agree the price in
                  chat.
                </p>
              </div>
              <p className="shrink-0 text-base font-bold text-navy">
                {formatNaira(pricing.amount)}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="h-11 flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting || !recipientId}
                className="h-11 flex-1 rounded-full"
              >
                {submitting ? "Sending..." : "Send request →"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="relative flex size-24 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#EAF2FF]" />
                <span className="relative size-16 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <Image
                    src={assets.careProfileRecipient}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </span>
                <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-8 items-center justify-center rounded-full bg-brand-blue text-white shadow-md">
                  <Send className="size-3.5" aria-hidden />
                </span>
              </div>

              <h2
                id={titleId}
                className="mt-5 text-xl font-bold tracking-tight text-navy"
              >
                Request sent to {caregiver.firstName}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/60">
                We&apos;ll notify you when {caregiver.firstName} responds.{" "}
                {caregiver.gender === "female" ? "She" : "He"} usually replies
                within 2 hours.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF6E5] px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span
                  className="size-1.5 rounded-full bg-amber-500"
                  aria-hidden
                />
                Pending
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F8FAFC] px-4 py-3.5">
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Caring for</dt>
                  <dd className="font-semibold text-navy">
                    {recipient?.fullName ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Care</dt>
                  <dd className="text-right font-semibold text-navy">
                    {frequency} · {careType}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Starts</dt>
                  <dd className="text-right font-semibold text-navy">
                    {startLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy/55">Listed rate</dt>
                  <dd className="font-semibold text-navy">
                    {formatNaira(pricing.amount)}
                    {pricing.unit}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-navy/55">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Sending a request is free. You&apos;ll agree the price with{" "}
                {caregiver.firstName} in chat.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                className="h-11 flex-1 rounded-full"
                onClick={() => {
                  handleClose();
                  onMessage?.();
                }}
              >
                Message {caregiver.firstName}
              </Button>
              <Link
                href="/careseeker/bookings"
                onClick={handleClose}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                View booking →
              </Link>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
