"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
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
import { compactPhone } from "@/features/caregiver-onboarding/lib/map-application";
import {
  CAREGIVER_MAX_REFERENCES,
  CAREGIVER_MIN_REFERENCES,
  formatNinInput,
  validateCaregiverVerification,
  type CaregiverVerificationErrors,
} from "@/features/caregiver-onboarding/lib/validation";
import {
  addCaregiverReference,
  deleteCaregiverReference,
  getApplicationErrorMessage,
  listCaregiverReferences,
  type CaregiverReferenceInput,
} from "@/features/caregiver-onboarding/services/caregiver-onboarding-service";
import {
  type CaregiverReference,
  type CaregiverUploadedDoc,
} from "@/features/caregiver-onboarding/types";
import {
  uploadFile,
  type UploadKind,
} from "@/features/uploads/services/upload-service";
import {
  isValidNigerianMobile,
  NIGERIAN_PHONE_ERROR,
} from "@/lib/phone";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type DocKey =
  | "idFrontDoc"
  | "idBackDoc"
  | "selfieWithIdDoc"
  | "proofOfAddressDoc";

const DOC_UPLOAD_KIND: Record<DocKey, UploadKind> = {
  idFrontDoc: "nin_id_front",
  idBackDoc: "nin_id_back",
  selfieWithIdDoc: "id_selfie",
  proofOfAddressDoc: "proof_of_address",
};

type ReferenceFormErrors = Partial<
  Record<"title" | "fullName" | "phone" | "relationship", string>
>;

const emptyForm = (): CaregiverReferenceInput => ({
  title: "",
  fullName: "",
  phone: "",
  relationship: "",
});

export function VerificationStep({
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
  const [errors, setErrors] = useState<CaregiverVerificationErrors>({});
  const [uploadingKey, setUploadingKey] = useState<DocKey | null>(null);
  const [uploadErrors, setUploadErrors] = useState<
    Partial<Record<DocKey, string>>
  >({});
  const [composerOpen, setComposerOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<ReferenceFormErrors>({});
  const [referenceBusy, setReferenceBusy] = useState(false);
  const [referenceError, setReferenceError] = useState<string | null>(null);

  const atReferenceLimit = draft.references.length >= CAREGIVER_MAX_REFERENCES;
  const showComposer = composerOpen && (Boolean(editingId) || !atReferenceLimit);
  const busy = saving || referenceBusy || uploadingKey !== null;

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
      const uploaded = await uploadFile(DOC_UPLOAD_KIND[key], file);
      const doc: CaregiverUploadedDoc = {
        url: uploaded.url,
        fileName: file.name,
      };
      patchDraft({ [key]: doc });
      setErrors((current) => ({ ...current, [key]: undefined }));
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

  function resetComposer() {
    setEditingId(null);
    setForm(emptyForm());
    setFormErrors({});
    setReferenceError(null);
  }

  function openNewReference() {
    resetComposer();
    setComposerOpen(true);
  }

  function startEdit(reference: CaregiverReference) {
    setEditingId(reference.id);
    setForm({
      title: reference.title,
      fullName: reference.fullName,
      phone: reference.phone,
      relationship: reference.relationship,
    });
    setFormErrors({});
    setReferenceError(null);
    setComposerOpen(true);
  }

  async function refreshReferences() {
    const references = await listCaregiverReferences();
    patchDraft({ references });
  }

  async function deleteReference(id: string) {
    setReferenceBusy(true);
    setReferenceError(null);
    try {
      await deleteCaregiverReference(id);
      await refreshReferences();
      if (editingId === id) resetComposer();
      appToast.success("Reference removed");
    } catch (err) {
      setReferenceError(
        getApplicationErrorMessage(err, "Could not remove this reference."),
      );
    } finally {
      setReferenceBusy(false);
    }
  }

  async function saveReference() {
    const nextErrors: ReferenceFormErrors = {};
    const title = form.title.trim();
    const fullName = form.fullName.trim();
    const relationship = form.relationship.trim();
    if (!title) nextErrors.title = "Enter a title.";
    else if (title.length > 20) {
      nextErrors.title = "Title must be 20 characters or fewer.";
    }
    if (!fullName) nextErrors.fullName = "Enter their full name.";
    else if (fullName.length < 2) {
      nextErrors.fullName = "Enter their full name.";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Enter a phone number.";
    } else if (!isValidNigerianMobile(form.phone)) {
      nextErrors.phone = NIGERIAN_PHONE_ERROR;
    }
    if (!relationship) {
      nextErrors.relationship = "Enter your relationship.";
    } else if (relationship.length < 2) {
      nextErrors.relationship = "Enter your relationship.";
    }
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input: CaregiverReferenceInput = {
      title,
      fullName,
      phone: compactPhone(form.phone),
      relationship,
    };

    setReferenceBusy(true);
    setReferenceError(null);
    try {
      if (editingId) {
        // The API has no update endpoint: replace the old reference.
        const previous = draft.references.find(
          (item) => item.id === editingId,
        );
        await deleteCaregiverReference(editingId);
        try {
          await addCaregiverReference(input);
        } catch (err) {
          if (previous) {
            try {
              await addCaregiverReference({
                title: previous.title,
                fullName: previous.fullName,
                phone: compactPhone(previous.phone),
                relationship: previous.relationship,
              });
            } catch {
              // best effort restore; the refresh below shows the real state
            }
          }
          await refreshReferences().catch(() => undefined);
          throw err;
        }
      } else {
        await addCaregiverReference(input);
      }
      await refreshReferences();
      appToast.success(editingId ? "Reference updated" : "Reference saved");
      resetComposer();
      setComposerOpen(true);
    } catch (err) {
      setReferenceError(
        getApplicationErrorMessage(err, "Could not save this reference."),
      );
    } finally {
      setReferenceBusy(false);
    }
  }

  function handleContinue() {
    const nextErrors = validateCaregiverVerification(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      appToast.error("Please complete verification before reviewing.");
      return;
    }
    onContinue();
  }

  const refLabel = editingId
    ? `Ref ${
        draft.references.findIndex((item) => item.id === editingId) + 1 || 1
      }`
    : `Ref ${draft.references.length + 1}`;

  const consentItems = [
    {
      key: "consentBackgroundCheck" as const,
      label:
        "I consent to CareVYA running a background check and contacting my references.",
    },
    {
      key: "consentInfoAccurate" as const,
      label:
        "I confirm the information I’ve provided is accurate and my own.",
    },
    {
      key: "consentTerms" as const,
      label:
        "I agree to CareVYA’s Terms & Conditions, Safety Rules and Caregiver Code of Conduct.",
    },
  ];

  const uploadHint = "Tap to upload / PDF, JPEG or PNG only • Max 5MB";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        Verify your identity
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Verified caregivers get 5x more trust from Careseekers. Your details
        stay secure and private.
      </p>

      {Object.keys(errors).length > 0 ? (
        <div className="mt-5">
          <ErrorBanner>
            Check the highlighted fields below, then continue.
          </ErrorBanner>
        </div>
      ) : null}

      <div className="mt-8">
        <FieldLabel htmlFor="cg-nin">National Identity Number (NIN)</FieldLabel>
        <TextInput
          id="cg-nin"
          type="tel"
          value={draft.nin}
          onChange={(value) => patchDraft({ nin: formatNinInput(value) })}
          placeholder="4031 8894 875"
          invalid={Boolean(errors.nin)}
        />
        {errors.nin ? <FieldError>{errors.nin}</FieldError> : null}
        <p className="mt-1.5 text-xs text-navy/45">
          We only keep the last four digits of your NIN.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <UploadBox
          title="ID card — front (NIN slip or card)"
          hint={uploadHint}
          helperText="Make sure the ID details are clear and readable."
          fileName={draft.idFrontDoc?.fileName ?? ""}
          uploading={uploadingKey === "idFrontDoc"}
          uploadError={uploadErrors.idFrontDoc}
          onUpload={(file) => handleDocUpload("idFrontDoc", file)}
        />
        {errors.idFrontDoc ? (
          <FieldError>{errors.idFrontDoc}</FieldError>
        ) : null}

        <UploadBox
          title="ID card — back"
          hint={uploadHint}
          helperText="Make sure the ID details are clear and readable."
          fileName={draft.idBackDoc?.fileName ?? ""}
          uploading={uploadingKey === "idBackDoc"}
          uploadError={uploadErrors.idBackDoc}
          onUpload={(file) => handleDocUpload("idBackDoc", file)}
        />
        {errors.idBackDoc ? (
          <FieldError>{errors.idBackDoc}</FieldError>
        ) : null}

        <UploadBox
          title="Selfie holding your ID"
          hint={uploadHint}
          helperText="Hold your ID next to your face in good lighting."
          fileName={draft.selfieWithIdDoc?.fileName ?? ""}
          uploading={uploadingKey === "selfieWithIdDoc"}
          uploadError={uploadErrors.selfieWithIdDoc}
          onUpload={(file) => handleDocUpload("selfieWithIdDoc", file)}
        />
        {errors.selfieWithIdDoc ? (
          <FieldError>{errors.selfieWithIdDoc}</FieldError>
        ) : null}

        <UploadBox
          title="Proof of address"
          hint={uploadHint}
          helperText="Utility bill or bank statement from the last 3 months."
          fileName={draft.proofOfAddressDoc?.fileName ?? ""}
          uploading={uploadingKey === "proofOfAddressDoc"}
          uploadError={uploadErrors.proofOfAddressDoc}
          onUpload={(file) => handleDocUpload("proofOfAddressDoc", file)}
        />
        {errors.proofOfAddressDoc ? (
          <FieldError>{errors.proofOfAddressDoc}</FieldError>
        ) : null}
      </div>

      <section className="mt-8">
        <h2 className="text-base font-semibold text-navy">References</h2>
        <p className="mt-1 text-sm text-navy/55">
          Add {String(CAREGIVER_MIN_REFERENCES)} to{" "}
          {String(CAREGIVER_MAX_REFERENCES)} contacts CareVYA can reach out to
          verify your identity.
        </p>

        {referenceError ? (
          <div className="mt-4">
            <ErrorBanner>{referenceError}</ErrorBanner>
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {draft.references.map((reference) => {
            if (editingId === reference.id) return null;
            return (
              <div
                key={reference.id}
                className="rounded-2xl border border-[#D7DEE8] bg-[#F7FAFF] px-4 py-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">
                      {reference.title} {reference.fullName}
                    </p>
                    <p className="mt-1 text-xs text-navy/55">
                      {reference.phone} · {reference.relationship}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={referenceBusy}
                      onClick={() => startEdit(reference)}
                      className="inline-flex size-8 items-center justify-center rounded-full text-brand-blue hover:bg-brand-blue/10 disabled:opacity-50"
                      aria-label="Edit reference"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      disabled={referenceBusy}
                      onClick={() => void deleteReference(reference.id)}
                      className="inline-flex size-8 items-center justify-center rounded-full text-navy/45 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      aria-label="Delete reference"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {showComposer ? (
            <div className="rounded-2xl border border-[#D7DEE8] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-navy">{refLabel}</p>
                <button
                  type="button"
                  disabled={referenceBusy}
                  onClick={() => void saveReference()}
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline disabled:opacity-50"
                >
                  {referenceBusy ? "Saving…" : "Save"}
                  {referenceBusy ? null : (
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  )}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <FieldLabel htmlFor="cg-ref-title">Title</FieldLabel>
                  <TextInput
                    id="cg-ref-title"
                    value={form.title}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, title: value }))
                    }
                    placeholder="e.g Mrs"
                    invalid={Boolean(formErrors.title)}
                  />
                  {formErrors.title ? (
                    <FieldError>{formErrors.title}</FieldError>
                  ) : null}
                </div>
                <div>
                  <FieldLabel htmlFor="cg-ref-name">Full name</FieldLabel>
                  <TextInput
                    id="cg-ref-name"
                    value={form.fullName}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, fullName: value }))
                    }
                    placeholder="e.g Adefunke Adebayo"
                    invalid={Boolean(formErrors.fullName)}
                  />
                  {formErrors.fullName ? (
                    <FieldError>{formErrors.fullName}</FieldError>
                  ) : null}
                </div>
                <div>
                  <FieldLabel htmlFor="cg-ref-phone">Phone number</FieldLabel>
                  <TextInput
                    id="cg-ref-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, phone: value }))
                    }
                    placeholder="e.g +234 999 9999 999"
                    invalid={Boolean(formErrors.phone)}
                  />
                  {formErrors.phone ? (
                    <FieldError>{formErrors.phone}</FieldError>
                  ) : null}
                </div>
                <div>
                  <FieldLabel htmlFor="cg-ref-relationship">
                    Relationship to you
                  </FieldLabel>
                  <TextInput
                    id="cg-ref-relationship"
                    value={form.relationship}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        relationship: value,
                      }))
                    }
                    placeholder="e.g Pastor"
                    invalid={Boolean(formErrors.relationship)}
                  />
                  {formErrors.relationship ? (
                    <FieldError>{formErrors.relationship}</FieldError>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {!atReferenceLimit ? (
          <button
            type="button"
            disabled={referenceBusy}
            onClick={openNewReference}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden />
            Add reference
          </button>
        ) : null}
        {errors.references ? (
          <FieldError>{errors.references}</FieldError>
        ) : null}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold text-navy">Before you submit</h2>
        <div className="mt-4 space-y-3">
          {consentItems.map((item) => {
            const checked = draft[item.key];
            return (
              <label
                key={item.key}
                className="flex cursor-pointer items-start gap-3"
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => patchDraft({ [item.key]: !checked })}
                  className={cn(
                    "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                    checked
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-[#C9D3E0] bg-white text-transparent",
                  )}
                >
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </button>
                <span className="text-sm text-navy/75">{item.label}</span>
              </label>
            );
          })}
        </div>
        {errors.consentBackgroundCheck ||
        errors.consentInfoAccurate ||
        errors.consentTerms ? (
          <FieldError>
            {errors.consentBackgroundCheck ||
              errors.consentInfoAccurate ||
              errors.consentTerms}
          </FieldError>
        ) : null}
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={busy}
          className="h-12 rounded-full px-6"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={busy}
          className="h-12 rounded-full px-8 sm:min-w-[12rem]"
        >
          {saving ? "Saving…" : "Review"}
          {saving ? null : <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );
}
