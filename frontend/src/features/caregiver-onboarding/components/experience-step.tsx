"use client";

import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ErrorBanner,
  FieldError,
  FieldLabel,
  TextInput,
  UploadBox,
} from "@/features/care-profile/components/care-profile-ui";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import {
  validateCaregiverExperience,
  type CaregiverExperienceErrors,
} from "@/features/caregiver-onboarding/lib/validation";
import {
  CAREGIVER_YEARS_OPTIONS,
  createEmptyWorkHistoryEntry,
  type CaregiverUploadedDoc,
  type CaregiverYearsExperience,
} from "@/features/caregiver-onboarding/types";
import { uploadFile } from "@/features/uploads/services/upload-service";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type DocKey = "professionalLicense" | "cvResume" | "certificateDoc";

export function ExperienceStep({
  onBack,
  onContinue,
  saving = false,
}: {
  onBack: () => void;
  onContinue: () => void;
  saving?: boolean;
}) {
  const draft = useCaregiverOnboardingStore((state) => state.draft);
  const patchDraft = useCaregiverOnboardingStore((state) => state.patchDraft);
  const [errors, setErrors] = useState<CaregiverExperienceErrors>({});
  const [uploadingKey, setUploadingKey] = useState<DocKey | null>(null);
  const [uploadErrors, setUploadErrors] = useState<
    Partial<Record<DocKey, string>>
  >({});

  const licenceRequired = draft.careType === "clinical";

  async function handleDocUpload(key: DocKey, file: File) {
    if (
      !/^image\/(jpeg|png)$/i.test(file.type) &&
      file.type !== "application/pdf"
    ) {
      setUploadErrors((current) => ({
        ...current,
        [key]: "Use a PDF, JPEG, or PNG file.",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((current) => ({
        ...current,
        [key]: "File must be under 5 MB.",
      }));
      return;
    }

    setUploadingKey(key);
    setUploadErrors((current) => ({ ...current, [key]: undefined }));
    try {
      const uploaded = await uploadFile("certificate", file);
      const doc: CaregiverUploadedDoc = {
        url: uploaded.url,
        fileName: file.name,
      };
      patchDraft({ [key]: doc });
      appToast.success("Document uploaded");
    } catch (err) {
      setUploadErrors((current) => ({
        ...current,
        [key]:
          err instanceof Error ? err.message : "Upload failed. Try again.",
      }));
    } finally {
      setUploadingKey(null);
    }
  }

  function updateWorkHistory(
    id: string,
    patch: Partial<(typeof draft.workHistory)[number]>,
  ) {
    patchDraft({
      workHistory: draft.workHistory.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    });
  }

  function handleContinue() {
    const nextErrors = validateCaregiverExperience(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      appToast.error("Please complete the required experience fields.");
      return;
    }
    onContinue();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        Tell us about your care experience
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Share your caregiving experience and relevant training, whether
        professional or caring for a careseeker member.
      </p>

      {Object.keys(errors).length > 0 ? (
        <div className="mt-5">
          <ErrorBanner>
            Check the highlighted fields below, then continue.
          </ErrorBanner>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cg-cert-name">Certificate name</FieldLabel>
          <TextInput
            id="cg-cert-name"
            value={draft.certificateName}
            onChange={(value) => patchDraft({ certificateName: value })}
            placeholder="e.g First Aid & CPR"
          />
        </div>
        <div>
          <FieldLabel htmlFor="cg-license-number">
            Licence/registration number
            {licenceRequired ? "" : " (Optional)"}
          </FieldLabel>
          <TextInput
            id="cg-license-number"
            value={draft.licenseNumber}
            onChange={(value) => patchDraft({ licenseNumber: value })}
            placeholder="e.g NMC/RN/12345"
            invalid={Boolean(errors.licenseNumber)}
          />
          {errors.licenseNumber ? (
            <FieldError>{errors.licenseNumber}</FieldError>
          ) : null}
        </div>
        <div>
          <FieldLabel htmlFor="cg-issued-by">Issued by</FieldLabel>
          <TextInput
            id="cg-issued-by"
            value={draft.issuedBy}
            onChange={(value) => patchDraft({ issuedBy: value })}
            placeholder="e.g St John Ambulance"
          />
        </div>
        <div>
          <FieldLabel htmlFor="cg-year-issued">Year issued</FieldLabel>
          <TextInput
            id="cg-year-issued"
            type="tel"
            value={draft.yearIssued}
            onChange={(value) =>
              patchDraft({ yearIssued: value.replace(/\D/g, "").slice(0, 4) })
            }
            placeholder="e.g 2024"
            invalid={Boolean(errors.yearIssued)}
          />
          {errors.yearIssued ? (
            <FieldError>{errors.yearIssued}</FieldError>
          ) : null}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">
          Certificates &amp; training
        </h2>
        <p className="mt-1 text-xs text-navy/55">
          Have any care-related certificates? Add them here to build trust with
          Careseekers.
        </p>
        <div className="mt-4 space-y-4">
          <UploadBox
            title="Professional License"
            hint="Tap to upload your document. PDF, JPEG or PNG only • Max 5MB"
            helperText="Clear scans or photos work best."
            fileName={draft.professionalLicense?.fileName ?? ""}
            uploading={uploadingKey === "professionalLicense"}
            uploadError={uploadErrors.professionalLicense}
            onUpload={(file) => handleDocUpload("professionalLicense", file)}
          />
          <UploadBox
            title="CV/Resume"
            hint="Tap to upload your document. PDF, JPEG or PNG only • Max 5MB"
            helperText="A recent CV helps families understand your background."
            fileName={draft.cvResume?.fileName ?? ""}
            uploading={uploadingKey === "cvResume"}
            uploadError={uploadErrors.cvResume}
            onUpload={(file) => handleDocUpload("cvResume", file)}
          />
          <UploadBox
            title="Certificate or training"
            hint="Tap to upload your document. PDF, JPEG or PNG only • Max 5MB"
            helperText="Optional, but recommended if you have one."
            fileName={draft.certificateDoc?.fileName ?? ""}
            uploading={uploadingKey === "certificateDoc"}
            uploadError={uploadErrors.certificateDoc}
            onUpload={(file) => handleDocUpload("certificateDoc", file)}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">Years of experience</h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {CAREGIVER_YEARS_OPTIONS.map((option) => {
            const selected = draft.yearsExperience === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  patchDraft({
                    yearsExperience: option.value as CaregiverYearsExperience,
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
                  selected
                    ? "border-brand-blue bg-[#E8F1FF] font-medium text-brand-blue"
                    : "border-[#D7DEE8] bg-white text-navy/70 hover:border-brand-blue/40",
                )}
              >
                {option.label}
                {selected ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.yearsExperience ? (
          <FieldError>{errors.yearsExperience}</FieldError>
        ) : null}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">Work history</h2>
        <p className="mt-1 text-xs text-navy/55">
          Add the places you&apos;ve worked as a caregiver, most recent first. A
          family you cared for privately counts too.
        </p>

        <div className="mt-4 space-y-6">
          {draft.workHistory.map((entry, index) => (
            <div
              key={entry.id}
              className="grid gap-4 sm:grid-cols-2"
            >
              {draft.workHistory.length > 1 ? (
                <p className="sm:col-span-2 text-xs font-semibold text-navy/50">
                  Role {index + 1}
                </p>
              ) : null}
              <div>
                <FieldLabel htmlFor={`cg-role-${entry.id}`}>Role</FieldLabel>
                <TextInput
                  id={`cg-role-${entry.id}`}
                  value={entry.role}
                  onChange={(value) => updateWorkHistory(entry.id, { role: value })}
                  placeholder="e.g Home caregiver"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`cg-employer-${entry.id}`}>
                  Employer or family
                </FieldLabel>
                <TextInput
                  id={`cg-employer-${entry.id}`}
                  value={entry.employer}
                  onChange={(value) =>
                    updateWorkHistory(entry.id, { employer: value })
                  }
                  placeholder="e.g Sunrise Home Care"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`cg-start-${entry.id}`}>
                  Start year
                </FieldLabel>
                <TextInput
                  id={`cg-start-${entry.id}`}
                  value={entry.startYear}
                  onChange={(value) =>
                    updateWorkHistory(entry.id, { startYear: value })
                  }
                  placeholder="e.g 2019"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`cg-end-${entry.id}`}>End year</FieldLabel>
                <TextInput
                  id={`cg-end-${entry.id}`}
                  value={entry.endYear}
                  onChange={(value) =>
                    updateWorkHistory(entry.id, { endYear: value })
                  }
                  placeholder="e.g 2023 or Present"
                />
              </div>
            </div>
          ))}
        </div>

        {errors.workHistory ? (
          <FieldError>{errors.workHistory}</FieldError>
        ) : null}

        {draft.workHistory.length < 10 ? (
          <button
            type="button"
            onClick={() =>
              patchDraft({
                workHistory: [
                  ...draft.workHistory,
                  createEmptyWorkHistoryEntry(),
                ],
              })
            }
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            <Plus className="size-4" aria-hidden />
            Add another role
          </button>
        ) : null}
      </section>

      <label className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] px-4 py-3.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={draft.experienceConfirmed}
          onClick={() =>
            patchDraft({ experienceConfirmed: !draft.experienceConfirmed })
          }
          className={cn(
            "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border",
            draft.experienceConfirmed
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-[#D7DEE8] bg-white",
          )}
        >
          {draft.experienceConfirmed ? (
            <Check className="size-3" strokeWidth={3} aria-hidden />
          ) : null}
        </button>
        <span className="text-sm text-navy">
          I confirm that my experience and qualifications are accurate.
        </span>
      </label>
      {errors.experienceConfirmed ? (
        <FieldError>{errors.experienceConfirmed}</FieldError>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={saving}
          className="h-12 rounded-full px-6"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="h-12 rounded-full px-8 sm:min-w-[12rem]"
        >
          {saving ? "Saving…" : "Next"}
          {saving ? null : <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );
}
