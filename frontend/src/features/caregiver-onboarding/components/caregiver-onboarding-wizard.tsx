"use client";

import { ArrowRight, Camera, Check, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  DateField,
  ErrorBanner,
  FieldError,
  FieldLabel,
  SelectField,
  TextArea,
  TextInput,
} from "@/features/care-profile/components/care-profile-ui";
import { AvailabilityStep } from "@/features/caregiver-onboarding/components/availability-step";
import { CaregiverOnboardingShell } from "@/features/caregiver-onboarding/components/caregiver-onboarding-shell";
import { ExperienceStep } from "@/features/caregiver-onboarding/components/experience-step";
import { PricingStep } from "@/features/caregiver-onboarding/components/pricing-step";
import { ReviewStep } from "@/features/caregiver-onboarding/components/review-step";
import { ServicesStep } from "@/features/caregiver-onboarding/components/services-step";
import { SuccessStep } from "@/features/caregiver-onboarding/components/success-step";
import { VerificationStep } from "@/features/caregiver-onboarding/components/verification-step";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import {
  applicationToDraft,
  draftToStepPayload,
  draftToSubmitPayload,
} from "@/features/caregiver-onboarding/lib/map-application";
import {
  validateCaregiverAbout,
  type CaregiverAboutErrors,
} from "@/features/caregiver-onboarding/lib/validation";
import {
  extractMissingFields,
  getApplicationErrorMessage,
  getCaregiverApplication,
  getCaregiverApplicationStatus,
  listCaregiverReferences,
  reviewCaregiverApplication,
  saveCaregiverApplicationStep,
  submitCaregiverApplication,
  type CaregiverApplicationStep,
} from "@/features/caregiver-onboarding/services/caregiver-onboarding-service";
import {
  CAREGIVER_GENDER_OPTIONS,
  CAREGIVER_LANGUAGE_OPTIONS,
  CAREGIVER_ONBOARDING_STEPS,
  type CaregiverLanguage,
} from "@/features/caregiver-onboarding/types";
import { useNigeriaLocations } from "@/features/waitlist/hooks/use-nigeria-locations";
import { uploadFile } from "@/features/uploads/services/upload-service";
import { ApiError } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { assets } from "@/lib/assets";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function AboutYouStep({
  onContinue,
  saving = false,
}: {
  onContinue: () => void;
  saving?: boolean;
}) {
  const draft = useCaregiverOnboardingStore((state) => state.draft);
  const patchDraft = useCaregiverOnboardingStore((state) => state.patchDraft);
  const { data: session } = useSession();
  const locations = useNigeriaLocations();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<CaregiverAboutErrors>({});
  const [photoUploading, setPhotoUploading] = useState(false);

  const stateOptions = locations.data?.states ?? [];
  const lgaOptions = draft.stateOfOrigin
    ? (locations.data?.lgasByState[draft.stateOfOrigin] ?? [])
    : [];

  useEffect(() => {
    if (!session?.user) return;
    const current = useCaregiverOnboardingStore.getState().draft;
    const name = session.user.name?.trim() ?? "";
    const [first = "", ...rest] = name.split(/\s+/);
    const last = rest.join(" ");
    patchDraft({
      ...(current.firstName ? {} : { firstName: first }),
      ...(current.lastName ? {} : { lastName: last }),
      ...(current.email ? {} : { email: session.user.email ?? "" }),
      ...(current.photoUrl ? {} : { photoUrl: session.user.image ?? "" }),
    });
  }, [session?.user, patchDraft]);

  async function handlePhotoSelected(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      appToast.error("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      appToast.error("Image must be under 5 MB.");
      return;
    }

    setPhotoUploading(true);
    try {
      const uploaded = await uploadFile("photo", file);
      patchDraft({ photoUrl: uploaded.url });
      appToast.success("Photo uploaded");
    } catch (err) {
      appToast.error(
        err instanceof Error ? err.message : "Photo upload failed.",
      );
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  function toggleLanguage(language: CaregiverLanguage) {
    const selected = draft.languages.includes(language);
    patchDraft({
      languages: selected
        ? draft.languages.filter((item) => item !== language)
        : [...draft.languages, language],
    });
  }

  function handleContinue() {
    const nextErrors = validateCaregiverAbout(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      appToast.error("Please fix the highlighted fields.");
      return;
    }
    onContinue();
  }

  const photoSrc = draft.photoUrl || assets.defaultAvatar;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        Personal details
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Tell us a little about yourself.
      </p>

      {Object.keys(errors).length > 0 ? (
        <div className="mt-5">
          <ErrorBanner>
            Check the highlighted fields below, then continue.
          </ErrorBanner>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center text-center">
        <button
          type="button"
          disabled={photoUploading}
          onClick={() => photoInputRef.current?.click()}
          className="relative inline-flex size-28 items-center justify-center rounded-full bg-[#EEF2F7] disabled:opacity-60"
          aria-label="Upload profile photo"
        >
          {draft.photoUrl ? (
            <span className="relative size-28 overflow-hidden rounded-full">
              <Image
                src={photoSrc}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </span>
          ) : (
            <Camera className="size-10 text-navy/35" aria-hidden />
          )}
          <span className="absolute right-1 bottom-1 inline-flex size-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm">
            <Plus className="size-4" strokeWidth={3} aria-hidden />
          </span>
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            void handlePhotoSelected(event.target.files?.[0]);
          }}
        />
        <p className="mt-3 text-sm font-semibold text-navy">Profile Photo</p>
        <p className="mt-0.5 text-xs text-navy/50">
          {photoUploading
            ? "Uploading…"
            : "Tap to upload a professional photo."}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cg-first-name">First name</FieldLabel>
          <TextInput
            id="cg-first-name"
            value={draft.firstName}
            onChange={(value) => patchDraft({ firstName: value })}
            placeholder="Emeka"
            invalid={Boolean(errors.firstName)}
          />
          {errors.firstName ? <FieldError>{errors.firstName}</FieldError> : null}
        </div>
        <div>
          <FieldLabel htmlFor="cg-last-name">Last name</FieldLabel>
          <TextInput
            id="cg-last-name"
            value={draft.lastName}
            onChange={(value) => patchDraft({ lastName: value })}
            placeholder="Okonkwo"
            invalid={Boolean(errors.lastName)}
          />
          {errors.lastName ? <FieldError>{errors.lastName}</FieldError> : null}
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="cg-middle-name">Middle name (Optional)</FieldLabel>
        <TextInput
          id="cg-middle-name"
          value={draft.middleName}
          onChange={(value) => patchDraft({ middleName: value })}
          placeholder="e.g Chinedu"
          invalid={Boolean(errors.middleName)}
        />
        {errors.middleName ? (
          <FieldError>{errors.middleName}</FieldError>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cg-email">Email address</FieldLabel>
          <TextInput
            id="cg-email"
            type="email"
            value={draft.email}
            onChange={(value) => patchDraft({ email: value })}
            placeholder="e.g you@gmail.com"
            invalid={Boolean(errors.email)}
          />
          {errors.email ? <FieldError>{errors.email}</FieldError> : null}
        </div>
        <div>
          <FieldLabel htmlFor="cg-phone">Phone number</FieldLabel>
          <TextInput
            id="cg-phone"
            type="tel"
            value={draft.phone}
            onChange={(value) => patchDraft({ phone: value })}
            placeholder="+234 999 4443 0489"
            invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <FieldError>{errors.phone}</FieldError> : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cg-dob">Date of Birth</FieldLabel>
          <DateField
            id="cg-dob"
            value={draft.dateOfBirth}
            onChange={(value) => patchDraft({ dateOfBirth: value })}
            max={new Date().toISOString().slice(0, 10)}
            invalid={Boolean(errors.dateOfBirth)}
          />
          {errors.dateOfBirth ? (
            <FieldError>{errors.dateOfBirth}</FieldError>
          ) : null}
        </div>
        <div>
          <FieldLabel htmlFor="cg-gender">Gender</FieldLabel>
          <SelectField
            id="cg-gender"
            value={draft.gender}
            onChange={(value) => patchDraft({ gender: value })}
            placeholder="Select gender"
            options={CAREGIVER_GENDER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            invalid={Boolean(errors.gender)}
          />
          {errors.gender ? <FieldError>{errors.gender}</FieldError> : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cg-state">State of Origin</FieldLabel>
          <SearchableSelect
            variant="light"
            aria-label="State of Origin"
            options={stateOptions}
            value={draft.stateOfOrigin}
            onChange={(value) =>
              patchDraft({ stateOfOrigin: value, lga: "" })
            }
            placeholder={
              locations.isLoading ? "Loading states..." : "e.g Lagos state"
            }
            disabled={locations.isLoading || stateOptions.length === 0}
            invalid={Boolean(errors.stateOfOrigin)}
          />
          {errors.stateOfOrigin ? (
            <FieldError>{errors.stateOfOrigin}</FieldError>
          ) : null}
        </div>
        <div>
          <FieldLabel htmlFor="cg-lga">Local Government Area (LGA)</FieldLabel>
          <SearchableSelect
            variant="light"
            aria-label="Local Government Area"
            options={lgaOptions}
            value={draft.lga}
            onChange={(value) => patchDraft({ lga: value })}
            placeholder={
              draft.stateOfOrigin ? "e.g Ejigbo LGA" : "Select state first"
            }
            disabled={!draft.stateOfOrigin || lgaOptions.length === 0}
            invalid={Boolean(errors.lga)}
          />
          {errors.lga ? <FieldError>{errors.lga}</FieldError> : null}
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="cg-street">Street address</FieldLabel>
        <TextInput
          id="cg-street"
          value={draft.streetAddress}
          onChange={(value) => patchDraft({ streetAddress: value })}
          placeholder="e.g 15 Ajekunle street"
          invalid={Boolean(errors.streetAddress)}
        />
        {errors.streetAddress ? (
          <FieldError>{errors.streetAddress}</FieldError>
        ) : null}
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="cg-bio">Bio</FieldLabel>
        <TextArea
          id="cg-bio"
          value={draft.bio}
          onChange={(value) => patchDraft({ bio: value })}
          placeholder="Describe yourself in a few words"
        />
        {errors.bio ? <FieldError>{errors.bio}</FieldError> : null}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-navy">
          Languages you speak
        </p>
        <div className="flex flex-wrap gap-2.5">
          {CAREGIVER_LANGUAGE_OPTIONS.map((language) => {
            const selected = draft.languages.includes(language);
            return (
              <button
                key={language}
                type="button"
                onClick={() => toggleLanguage(language)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
                  selected
                    ? "border-brand-blue bg-[#E8F1FF] font-medium text-brand-blue"
                    : "border-[#D7DEE8] bg-white text-navy/70 hover:border-brand-blue/40",
                )}
              >
                {language}
                {selected ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.languages ? (
          <FieldError>{errors.languages}</FieldError>
        ) : null}
      </div>

      <Button
        type="button"
        onClick={handleContinue}
        disabled={saving || photoUploading}
        className="mt-8 h-12 w-full rounded-full text-[0.9375rem]"
      >
        {saving ? "Saving…" : "Continue"}
        {saving ? null : <ArrowRight className="size-4" aria-hidden />}
      </Button>
    </div>
  );
}

function WizardLoading() {
  return (
    <div className="animate-pulse space-y-5" aria-busy aria-live="polite">
      <div className="h-7 w-48 rounded-full bg-[#EEF2F7]" />
      <div className="h-4 w-64 rounded-full bg-[#EEF2F7]" />
      <div className="mx-auto size-28 rounded-full bg-[#EEF2F7]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-12 rounded-full bg-[#EEF2F7]" />
        <div className="h-12 rounded-full bg-[#EEF2F7]" />
      </div>
      <div className="h-12 rounded-full bg-[#EEF2F7]" />
      <div className="h-12 rounded-full bg-[#EEF2F7]" />
    </div>
  );
}

export function CaregiverOnboardingWizard() {
  const router = useRouter();
  const stepIndex = useCaregiverOnboardingStore((state) => state.stepIndex);
  const hydrated = useCaregiverOnboardingStore((state) => state.hydrated);
  const isComplete = useCaregiverOnboardingStore((state) => state.isComplete);
  const isReviewing = useCaregiverOnboardingStore((state) => state.isReviewing);
  const nextStep = useCaregiverOnboardingStore((state) => state.nextStep);
  const prevStep = useCaregiverOnboardingStore((state) => state.prevStep);
  const showReview = useCaregiverOnboardingStore((state) => state.showReview);
  const hideReview = useCaregiverOnboardingStore((state) => state.hideReview);
  const completeSetup = useCaregiverOnboardingStore(
    (state) => state.completeSetup,
  );
  const hydrateFromServer = useCaregiverOnboardingStore(
    (state) => state.hydrateFromServer,
  );
  const resetStore = useCaregiverOnboardingStore((state) => state.reset);
  const stepId = CAREGIVER_ONBOARDING_STEPS[stepIndex]?.id ?? "about";

  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Load the saved application (draft, progress, status, references).
  useEffect(() => {
    if (hydrated) return;
    let cancelled = false;

    void (async () => {
      try {
        const [result, status, references] = await Promise.all([
          getCaregiverApplication(),
          getCaregiverApplicationStatus().catch(() => null),
          listCaregiverReferences().catch(() => []),
        ]);
        if (cancelled) return;

        const draft = applicationToDraft(result.application, references);
        const currentStep = result.progress?.currentStep;
        hydrateFromServer(draft, {
          stepIndex:
            typeof currentStep === "number" && currentStep > 0
              ? currentStep - 1
              : 0,
          status: status?.status,
          submittedAt: status?.submittedAt ?? null,
          rejectionReason: status?.rejectionReason ?? null,
        });
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          getApplicationErrorMessage(
            err,
            "Could not load your application. Please try again.",
          ),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, hydrateFromServer, loadAttempt]);

  /** The server locks the application once it has been submitted/reviewed. */
  async function syncLockedState() {
    const status = await getCaregiverApplicationStatus().catch(() => null);
    if (!status || status.status === "draft") return;
    const state = useCaregiverOnboardingStore.getState();
    hydrateFromServer(state.draft, {
      stepIndex: state.stepIndex,
      status: status.status,
      submittedAt: status.submittedAt ?? null,
      rejectionReason: status.rejectionReason ?? null,
    });
  }

  async function persistStep(uiStepIndex: number): Promise<boolean> {
    const step = (uiStepIndex + 1) as CaregiverApplicationStep;
    setSaving(true);
    setSaveError(null);
    try {
      const draft = useCaregiverOnboardingStore.getState().draft;
      await saveCaregiverApplicationStep(step, draftToStepPayload(step, draft));
      return true;
    } catch (err) {
      setSaveError(
        getApplicationErrorMessage(err, "Could not save this step."),
      );
      if (err instanceof ApiError && err.status === 403) {
        await syncLockedState();
      }
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleContinue() {
    const ok = await persistStep(stepIndex);
    if (ok) nextStep();
  }

  function goBack() {
    setSaveError(null);
    prevStep();
  }

  async function handleEnterReview() {
    const ok = await persistStep(stepIndex);
    if (!ok) return;

    setSaving(true);
    try {
      const result = await reviewCaregiverApplication();
      setMissingFields(result.ok ? [] : result.missingFields);
      setSubmitError(null);
      showReview();
    } catch (err) {
      setSaveError(
        getApplicationErrorMessage(err, "Could not open your review."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    setMissingFields([]);
    try {
      const draft = useCaregiverOnboardingStore.getState().draft;
      const result = await submitCaregiverApplication(
        draftToSubmitPayload(draft),
      );
      const submittedAt =
        typeof result?.submittedAt === "string" ? result.submittedAt : null;
      completeSetup(submittedAt);
      appToast.success("Profile submitted for review");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setMissingFields(extractMissingFields(err.body));
      }
      setSubmitError(
        getApplicationErrorMessage(err, "Could not submit your profile."),
      );
      if (err instanceof ApiError && err.status === 409) {
        await syncLockedState();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveAndLogout() {
    appToast.message("Progress saved. Pick up where you left off any time.");
    await signOut();
    resetStore();
    router.push("/get-started");
  }

  const onSaveAndLogout = () => {
    void handleSaveAndLogout();
  };

  // Not hydrated and no error yet → the load request is in flight.
  if (!hydrated && !loadError) {
    return (
      <CaregiverOnboardingShell
        stepIndex={stepIndex}
        onSaveAndLogout={onSaveAndLogout}
      >
        <WizardLoading />
      </CaregiverOnboardingShell>
    );
  }

  if (!hydrated) {
    return (
      <CaregiverOnboardingShell
        stepIndex={stepIndex}
        onSaveAndLogout={onSaveAndLogout}
      >
        <ErrorBanner>{loadError}</ErrorBanner>
        <Button
          type="button"
          onClick={() => {
            setLoadError(null);
            setLoadAttempt((attempt) => attempt + 1);
          }}
          className="h-12 w-full rounded-full"
        >
          Try again
        </Button>
      </CaregiverOnboardingShell>
    );
  }

  if (isComplete) {
    return (
      <CaregiverOnboardingShell stepIndex={stepIndex} hideStepper bare>
        <SuccessStep
          onGoToDashboard={() => {
            router.push("/caregiver");
          }}
        />
      </CaregiverOnboardingShell>
    );
  }

  if (isReviewing) {
    return (
      <CaregiverOnboardingShell
        stepIndex={stepIndex}
        hideStepper
        bare
        onSaveAndLogout={onSaveAndLogout}
      >
        <ReviewStep
          onBack={hideReview}
          onSubmit={() => {
            void handleSubmit();
          }}
          submitting={submitting}
          error={submitError}
          missingFields={missingFields}
        />
      </CaregiverOnboardingShell>
    );
  }

  return (
    <CaregiverOnboardingShell
      stepIndex={stepIndex}
      onSaveAndLogout={onSaveAndLogout}
    >
      {saveError ? <ErrorBanner>{saveError}</ErrorBanner> : null}

      {stepId === "about" ? (
        <AboutYouStep
          onContinue={() => void handleContinue()}
          saving={saving}
        />
      ) : null}

      {stepId === "services" ? (
        <ServicesStep
          onBack={goBack}
          onContinue={() => void handleContinue()}
          saving={saving}
        />
      ) : null}

      {stepId === "experience" ? (
        <ExperienceStep
          onBack={goBack}
          onContinue={() => void handleContinue()}
          saving={saving}
        />
      ) : null}

      {stepId === "availability" ? (
        <AvailabilityStep
          onBack={goBack}
          onContinue={() => void handleContinue()}
          saving={saving}
        />
      ) : null}

      {stepId === "rates" ? (
        <PricingStep
          onBack={goBack}
          onContinue={() => void handleContinue()}
          saving={saving}
        />
      ) : null}

      {stepId === "verification" ? (
        <VerificationStep
          onBack={goBack}
          onContinue={() => void handleEnterReview()}
          saving={saving}
        />
      ) : null}
    </CaregiverOnboardingShell>
  );
}
