"use client";

import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CareProfileShell } from "@/features/care-profile/components/care-profile-shell";
import { useCareProfileStore } from "@/features/care-profile/hooks/use-care-profile-store";
import { getCarePronouns } from "@/features/care-profile/lib/pronouns";
import {
  CARE_START_OPTIONS,
  CARE_TYPE_OPTIONS,
  type CareFrequency,
  type CareProfileDraft,
  type CareType,
} from "@/features/care-profile/types";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const CARE_TYPE_LABELS: Record<CareType, string> = Object.fromEntries(
  CARE_TYPE_OPTIONS.map((option) => [option.value, option.title]),
) as Record<CareType, string>;

const FREQUENCY_LABELS: Record<CareFrequency, string> = {
  live_in: "Live-in",
  full_day: "Full day",
  part_time: "Part-time",
  overnight: "Overnight",
  weekends_only: "Weekends only",
};

function parseDobParts(
  value: string,
): { day: number; month: number; year: number } | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (!day || !month || !year) return null;
  return { day, month, year };
}

function getAge(dateOfBirth: string): number | null {
  const parts = parseDobParts(dateOfBirth);
  if (!parts) return null;
  const today = new Date();
  let age = today.getFullYear() - parts.year;
  const monthDiff = today.getMonth() + 1 - parts.month;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parts.day)) {
    age -= 1;
  }
  return age >= 0 && age < 130 ? age : null;
}

function firstNameFrom(fullName: string | undefined | null): string {
  const part = fullName?.trim().split(/\s+/)[0];
  return part || "there";
}

function caringForLabel(draft: CareProfileDraft): string {
  const name = draft.fullName.trim() || "Care recipient";
  if (draft.recipient === "myself") return `${name} (Yourself)`;
  if (draft.relationship) return `${name} (${draft.relationship})`;
  return name;
}

function careNeededLabel(draft: CareProfileDraft): string {
  if (draft.careTypes.length === 0) return "Not specified";
  return draft.careTypes.map((type) => CARE_TYPE_LABELS[type]).join(" · ");
}

function arrangementLabel(draft: CareProfileDraft): string {
  const frequency = draft.frequency
    ? FREQUENCY_LABELS[draft.frequency]
    : "Not specified";
  const start =
    draft.startTiming === "specific_date" && draft.startDate.trim()
      ? `Starting ${draft.startDate}`
      : CARE_START_OPTIONS.find((option) => option.value === draft.startTiming)
          ?.label ?? "Starting as soon as possible";
  return `${frequency} · ${start}`;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-navy/55">{label}</span>
      <span className="text-right font-medium text-navy">{value}</span>
    </div>
  );
}

const actionLinkClass =
  "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function CareProfileComplete() {
  const draft = useCareProfileStore((state) => state.draft);
  const { data: session } = useSession();
  const pronouns = getCarePronouns(draft);
  const userFirstName = firstNameFrom(session?.user?.name);
  const age = getAge(draft.dateOfBirth);
  const location = [draft.lga, draft.state].filter(Boolean).join(", ");
  const ageLocation = [age != null ? String(age) : null, location || null]
    .filter(Boolean)
    .join(" · ");

  const matchSubject =
    draft.recipient === "myself"
      ? "your needs"
      : pronouns.label === "them"
        ? "their needs"
        : `your ${pronouns.label}'s needs`;

  const areaLabel = draft.lga || draft.state || "your area";

  return (
    <CareProfileShell hideProgress>
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="size-8" strokeWidth={2.5} aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          You&apos;re all set, {userFirstName}!
        </h1>
        <p className="mt-2 max-w-md text-sm text-navy/60">
          We&apos;ve found 12 verified caregivers near {areaLabel} who match{" "}
          {matchSubject}.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
        <p className="mb-4 text-left text-sm font-semibold text-navy">
          Care profile
        </p>
        <div className="space-y-3">
          <SummaryRow label="Caring for" value={caringForLabel(draft)} />
          <SummaryRow
            label="Age & location"
            value={ageLocation || "Not specified"}
          />
          <SummaryRow label="Care needed" value={careNeededLabel(draft)} />
          <SummaryRow label="Arrangement" value={arrangementLabel(draft)} />
          <SummaryRow
            label="Emergency contact"
            value={
              [draft.emergencyName.trim(), draft.emergencyPhone.trim()]
                .filter(Boolean)
                .join(" · ") || "Not specified"
            }
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#D6E6FF] bg-[#F0F6FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-left text-sm text-navy/75">
          <ShieldCheck
            className="mt-0.5 size-4 shrink-0 text-emerald-600"
            aria-hidden
          />
          <span>
            One step before booking: verify your identity with your NIN. It
            takes about 2 minutes.
          </span>
        </p>
        <Link
          href="/careseeker/verify"
          className="shrink-0 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
        >
          Verify now
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/careseeker"
          className={cn(
            actionLinkClass,
            "border border-border bg-white text-navy hover:bg-surface-soft",
          )}
        >
          Go to dashboard
        </Link>
        <Link
          href="/careseeker/caregivers"
          className={cn(
            actionLinkClass,
            "bg-brand-blue text-white shadow-sm hover:bg-brand-blue-hover",
          )}
        >
          See available caregivers
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </CareProfileShell>
  );
}
