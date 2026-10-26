"use client";

import { Check, ChevronDown, Info, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { mockRecipients } from "@/features/dashboard/data/mock";
import type { CaregiverProfile } from "@/features/dashboard/types/caregiver-profile";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const CARE_TYPE_OPTIONS = [
  "Non-clinical care",
  "Personal & specialized care",
  "Clinical care",
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
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "6:00 PM",
] as const;

type Frequency = (typeof FREQUENCY_OPTIONS)[number];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function rateForFrequency(
  caregiver: CaregiverProfile,
  frequency: Frequency,
): { amount: number; unit: string; summary: string } {
  const liveIn = caregiver.priceAmount || 210_000;
  switch (frequency) {
    case "Live-in":
      return {
        amount: liveIn,
        unit: "/ month",
        summary: "1 month live-in · until 14 Nov",
      };
    case "Full day":
      return {
        amount: 28_000,
        unit: "/ day",
        summary: "Full day (10 hrs) · listed day rate",
      };
    case "Overnight":
      return {
        amount: 20_000,
        unit: "/ night",
        summary: "Overnight · listed night rate",
      };
    case "Part-time":
      return {
        amount: 18_000,
        unit: "/ day",
        summary: "Part-time · listed day rate",
      };
    case "Weekends only":
      return {
        amount: 45_000,
        unit: "/ weekend",
        summary: "Weekends only · listed weekend rate",
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
  const [step, setStep] = useState<"form" | "success">("form");
  const [recipientId, setRecipientId] = useState(mockRecipients[0]?.id ?? "");
  const initialCareType =
    caregiver.services.find((service) =>
      CARE_TYPE_OPTIONS.includes(service as (typeof CARE_TYPE_OPTIONS)[number]),
    ) ??
    CARE_TYPE_OPTIONS.find((option) =>
      caregiver.categoryLabel.startsWith(option),
    ) ??
    CARE_TYPE_OPTIONS[0];
  const [careType, setCareType] = useState(initialCareType);
  const [startDate, setStartDate] = useState("2026-10-15");
  const [startTime, setStartTime] = useState<string>("8:00 AM");
  const [frequency, setFrequency] = useState<Frequency>("Live-in");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setRecipientId(mockRecipients[0]?.id ?? "");
    setCareType(
      caregiver.services.find((service) =>
        CARE_TYPE_OPTIONS.includes(
          service as (typeof CARE_TYPE_OPTIONS)[number],
        ),
      ) ??
        CARE_TYPE_OPTIONS.find((option) =>
          caregiver.categoryLabel.startsWith(option),
        ) ??
        CARE_TYPE_OPTIONS[0],
    );
    setStartDate("2026-10-15");
    setStartTime("8:00 AM");
    setFrequency(
      caregiver.arrangements.includes("Live-in") ? "Live-in" : "Full day",
    );
  }, [open, caregiver]);

  const recipient = mockRecipients.find((item) => item.id === recipientId);
  const pricing = useMemo(
    () => rateForFrequency(caregiver, frequency),
    [caregiver, frequency],
  );

  const startLabel = useMemo(() => {
    const date = new Date(`${startDate}T12:00:00`);
    const formatted = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${formatted} · ${startTime}`;
  }, [startDate, startTime]);

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setSubmitting(false);
    setStep("success");
  }

  function handleClose() {
    onClose();
  }

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-lg">
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
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

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-navy">
                Type of care
              </span>
              <span className="relative block">
                <select
                  value={careType}
                  onChange={(event) => setCareType(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3.5 pr-10 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CARE_TYPE_OPTIONS.map((option) => (
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-navy">
                  Start date
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white px-3.5 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-navy">
                  Start time
                </span>
                <span className="relative block">
                  <select
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3.5 pr-10 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {START_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-navy/40"
                    aria-hidden
                  />
                </span>
              </label>
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
                <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />
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
