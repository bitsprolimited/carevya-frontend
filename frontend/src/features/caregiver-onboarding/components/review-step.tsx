"use client";

import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/features/care-profile/components/care-profile-ui";
import { useCaregiverApplicationOptions } from "@/features/caregiver-onboarding/hooks/use-caregiver-application-options";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import { describeMissingField } from "@/features/caregiver-onboarding/lib/map-application";
import {
  CAREGIVER_ARRANGEMENT_OPTIONS,
  CAREGIVER_AVAILABILITY_OPTIONS,
  CAREGIVER_CARE_TYPE_OPTIONS,
  CAREGIVER_FLEX_DAYS,
  CAREGIVER_GENDER_OPTIONS,
  CAREGIVER_HOUR_SLOT_OPTIONS,
  CAREGIVER_START_OPTIONS,
  CAREGIVER_TIME_OF_DAY_OPTIONS,
  CAREGIVER_TRAVEL_OPTIONS,
  CAREGIVER_YEARS_OPTIONS,
  type CaregiverOnboardingStepId,
  type CaregiverUploadedDoc,
} from "@/features/caregiver-onboarding/types";

function displayOrDash(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function formatDob(value: string): string {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatRate(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "—";
  return `₦${Number(digits).toLocaleString("en-NG")}`;
}

function joinLabels(values: string[]): string {
  return values.length > 0 ? values.join(" • ") : "—";
}

function formatClock(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const hours = Number(match[1]);
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12)}:${match[2]}${suffix}`;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(7.5rem,38%)_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[11rem_1fr]">
      <dt className="text-navy/45">{label}</dt>
      <dd className="text-right font-medium text-navy sm:text-left">{value}</dd>
    </div>
  );
}

function FileCard({
  doc,
  fallbackName,
}: {
  doc: CaregiverUploadedDoc | null;
  fallbackName: string;
}) {
  if (!doc) {
    return (
      <p className="py-2 text-sm text-navy/45">No file uploaded</p>
    );
  }

  return (
    <div className="mt-1 flex items-center gap-3 rounded-xl border border-[#D7DEE8] bg-white px-3 py-2.5">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <FileText className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-navy">
          {doc.fileName || fallbackName}
        </p>
        <p className="text-xs text-emerald-600">Successfully uploaded</p>
      </div>
      <span className="inline-flex size-7 items-center justify-center text-navy/30">
        <X className="size-4" aria-hidden />
      </span>
    </div>
  );
}

function ReviewSection({
  title,
  stepId,
  onEdit,
  children,
}: {
  title: string;
  stepId: CaregiverOnboardingStepId;
  onEdit: (stepId: CaregiverOnboardingStepId) => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-navy">{title}</h2>
        <button
          type="button"
          onClick={() => onEdit(stepId)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
        >
          Edit
          <ExternalLink className="size-3.5" aria-hidden />
        </button>
      </div>
      <dl className="divide-y divide-[#EEF2F7]">{children}</dl>
    </section>
  );
}

export function ReviewStep({
  onBack,
  onSubmit,
  submitting = false,
  error = null,
  missingFields = [],
}: {
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  error?: string | null;
  /** Paths returned by the review/submit endpoints, e.g. `about.firstName`. */
  missingFields?: string[];
}) {
  const draft = useCaregiverOnboardingStore((state) => state.draft);
  const editStep = useCaregiverOnboardingStore((state) => state.editStep);
  const { specializations } = useCaregiverApplicationOptions();

  const genderLabel =
    CAREGIVER_GENDER_OPTIONS.find((option) => option.value === draft.gender)
      ?.label ?? draft.gender;

  const careTypeLabel =
    CAREGIVER_CARE_TYPE_OPTIONS.find(
      (option) => option.value === draft.careType,
    )?.title ?? draft.careType;

  const specialtyLabels = draft.specialties.map(
    (value) =>
      specializations.find((option) => option.value === value)?.label ?? value,
  );

  const arrangementLabels = draft.arrangements.map(
    (value) =>
      CAREGIVER_ARRANGEMENT_OPTIONS.find((option) => option.value === value)
        ?.label ?? value,
  );

  const yearsLabel =
    CAREGIVER_YEARS_OPTIONS.find(
      (option) => option.value === draft.yearsExperience,
    )?.label ?? draft.yearsExperience;

  const availabilityLabel =
    CAREGIVER_AVAILABILITY_OPTIONS.find(
      (option) => option.value === draft.availabilityMode,
    )?.label ?? draft.availabilityMode;

  const travelLabel =
    CAREGIVER_TRAVEL_OPTIONS.find(
      (option) => option.value === draft.travelDistance,
    )?.label ?? draft.travelDistance;

  const startLabel =
    CAREGIVER_START_OPTIONS.find(
      (option) => option.value === draft.availableToStart,
    )?.label ?? draft.availableToStart;

  const workHistoryText = draft.workHistory
    .filter((entry) => entry.role.trim() || entry.employer.trim())
    .map((entry) =>
      [
        entry.role,
        entry.employer,
        [entry.startYear, entry.endYear.trim() || "Present"]
          .filter(Boolean)
          .join(" – "),
      ]
        .filter(Boolean)
        .join(" - "),
    )
    .join("; ");

  const certificateDetails = [
    draft.certificateName,
    draft.issuedBy,
    draft.yearIssued,
  ]
    .filter((part) => part.trim())
    .join(" - ");

  const referencesText =
    draft.references.length > 0
      ? draft.references
          .map(
            (ref) =>
              `${ref.title} ${ref.fullName} - ${ref.phone} - ${ref.relationship}`,
          )
          .join("\n")
      : "—";

  const scheduleLines =
    draft.availabilityMode === "part_time"
      ? [
          draft.preferredDays.length > 0
            ? `Days: ${draft.preferredDays.join(", ")}`
            : "",
          draft.preferredTimesOfDay.length > 0
            ? `Times: ${draft.preferredTimesOfDay
                .map(
                  (value) =>
                    CAREGIVER_TIME_OF_DAY_OPTIONS.find(
                      (option) => option.value === value,
                    )?.label ?? value,
                )
                .join(", ")}`
            : "",
          draft.preferredHourSlots.length > 0
            ? `Hours: ${draft.preferredHourSlots
                .map(
                  (value) =>
                    CAREGIVER_HOUR_SLOT_OPTIONS.find(
                      (option) => option.value === value,
                    )?.label ?? value,
                )
                .join(", ")}`
            : "",
        ].filter(Boolean)
      : draft.availabilityMode === "flexible"
        ? CAREGIVER_FLEX_DAYS.map((meta) => {
            const day = draft.flexibleSchedule.find(
              (item) => item.dayId === meta.id,
            );
            const slot = day?.enabled ? day.slots[0] : undefined;
            if (!slot) return "";
            const name =
              meta.weekday.charAt(0).toUpperCase() + meta.weekday.slice(1, 3);
            return `${name} ${formatClock(slot.start)} – ${formatClock(slot.end)}`;
          }).filter(Boolean)
        : [];

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Review your profile
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-navy/60">
          Please confirm your details are accurate, once you submit our team
          will review your profile within 24 hours
        </p>
      </div>

      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      {missingFields.length > 0 ? (
        <ErrorBanner>
          Some required information is missing:{" "}
          {missingFields.map(describeMissingField).join("; ")}. Use the Edit
          links below to fix it.
        </ErrorBanner>
      ) : null}

      <div className="space-y-4">
        <ReviewSection title="Basic details" stepId="about" onEdit={editStep}>
          <ReviewRow
            label="Name"
            value={displayOrDash(
              `${draft.firstName} ${draft.lastName}`.trim(),
            )}
          />
          <ReviewRow
            label="Middle name"
            value={displayOrDash(draft.middleName)}
          />
          <ReviewRow label="Email Address" value={displayOrDash(draft.email)} />
          <ReviewRow
            label="Phone number"
            value={displayOrDash(draft.phone)}
          />
          <ReviewRow
            label="Date Of Birth"
            value={formatDob(draft.dateOfBirth)}
          />
          <ReviewRow label="Gender" value={displayOrDash(genderLabel)} />
          <ReviewRow
            label="State of Origin"
            value={displayOrDash(draft.stateOfOrigin)}
          />
          <ReviewRow label="LGA" value={displayOrDash(draft.lga)} />
          <ReviewRow
            label="Street Address"
            value={displayOrDash(draft.streetAddress)}
          />
          <ReviewRow label="Bio" value={displayOrDash(draft.bio)} />
          <ReviewRow
            label="Languages"
            value={
              draft.languages.length > 0 ? draft.languages.join(", ") : "—"
            }
          />
        </ReviewSection>

        <ReviewSection title="Services" stepId="services" onEdit={editStep}>
          <ReviewRow label="Care type" value={displayOrDash(careTypeLabel)} />
          <ReviewRow
            label="Specialization"
            value={joinLabels(specialtyLabels)}
          />
          <ReviewRow
            label="Care arrangement"
            value={joinLabels(arrangementLabels)}
          />
        </ReviewSection>

        <ReviewSection
          title="Experience"
          stepId="experience"
          onEdit={editStep}
        >
          <ReviewRow label="Experience" value={displayOrDash(yearsLabel)} />
          <ReviewRow
            label="License"
            value={displayOrDash(draft.licenseNumber)}
          />
          <ReviewRow
            label="Issuing Body"
            value={displayOrDash(draft.issuedBy)}
          />
          <ReviewRow
            label="Work history"
            value={displayOrDash(workHistoryText)}
          />
          <ReviewRow
            label="Certificate details"
            value={displayOrDash(certificateDetails)}
          />
          <div className="py-2.5">
            <p className="mb-2 text-sm text-navy/45">Professional license</p>
            <FileCard
              doc={draft.professionalLicense}
              fallbackName="Professional license"
            />
          </div>
          <div className="py-2.5">
            <p className="mb-2 text-sm text-navy/45">CV/Resume</p>
            <FileCard doc={draft.cvResume} fallbackName="CV/Resume" />
          </div>
          <div className="py-2.5">
            <p className="mb-2 text-sm text-navy/45">Certificate or training</p>
            <FileCard doc={draft.certificateDoc} fallbackName="Certificate" />
          </div>
        </ReviewSection>

        <ReviewSection
          title="Availability"
          stepId="availability"
          onEdit={editStep}
        >
          <ReviewRow
            label="Availability"
            value={displayOrDash(availabilityLabel)}
          />
          {scheduleLines.length > 0 ? (
            <div className="grid grid-cols-[minmax(7.5rem,38%)_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[11rem_1fr]">
              <dt className="text-navy/45">Schedule</dt>
              <dd className="text-right font-medium whitespace-pre-line text-navy sm:text-left">
                {scheduleLines.join("\n")}
              </dd>
            </div>
          ) : null}
          <ReviewRow
            label="Areas"
            value={
              draft.workAreas.length > 0 ? draft.workAreas.join(", ") : "—"
            }
          />
          <ReviewRow
            label="Travel distance"
            value={displayOrDash(travelLabel)}
          />
          <ReviewRow
            label="Available to start"
            value={displayOrDash(startLabel)}
          />
        </ReviewSection>

        <ReviewSection title="Pricing" stepId="rates" onEdit={editStep}>
          <ReviewRow
            label="Daily-Day Shift"
            value={formatRate(draft.dayShiftRate)}
          />
          <ReviewRow
            label="Daily-Night Shift"
            value={formatRate(draft.nightShiftRate)}
          />
          <ReviewRow label="Weekly rate" value={formatRate(draft.weeklyRate)} />
          <ReviewRow
            label="Monthly Live-in"
            value={formatRate(draft.monthlyLiveInRate)}
          />
        </ReviewSection>

        <ReviewSection
          title="Verification"
          stepId="verification"
          onEdit={editStep}
        >
          <ReviewRow label="NIN" value={displayOrDash(draft.nin)} />
          <div className="grid grid-cols-[minmax(7.5rem,38%)_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[11rem_1fr]">
            <dt className="text-navy/45">References</dt>
            <dd className="whitespace-pre-line text-right font-medium text-navy sm:text-left">
              {referencesText}
            </dd>
          </div>
          <div className="py-2.5">
            <p className="mb-2 text-sm text-navy/45">ID &amp; Selfie</p>
            <div className="space-y-2">
              <FileCard doc={draft.idFrontDoc} fallbackName="ID — front" />
              <FileCard doc={draft.idBackDoc} fallbackName="ID — back" />
              <FileCard
                doc={draft.selfieWithIdDoc}
                fallbackName="Selfie with ID"
              />
            </div>
          </div>
          <div className="py-2.5">
            <p className="mb-2 text-sm text-navy/45">Proof of residence</p>
            <FileCard
              doc={draft.proofOfAddressDoc}
              fallbackName="Proof of address"
            />
          </div>
        </ReviewSection>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={submitting}
          className="h-12 rounded-full px-6"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="h-12 rounded-full px-8 sm:min-w-[14rem]"
        >
          {submitting ? "Submitting…" : "Submit for Review"}
          {submitting ? null : <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );
}
