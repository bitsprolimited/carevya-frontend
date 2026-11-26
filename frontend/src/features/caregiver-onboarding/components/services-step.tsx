"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ErrorBanner,
  FieldError,
} from "@/features/care-profile/components/care-profile-ui";
import { useCaregiverApplicationOptions } from "@/features/caregiver-onboarding/hooks/use-caregiver-application-options";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import {
  validateCaregiverServices,
  type CaregiverServicesErrors,
} from "@/features/caregiver-onboarding/lib/validation";
import {
  CAREGIVER_ARRANGEMENT_OPTIONS,
  CAREGIVER_CARE_TYPE_OPTIONS,
  type CaregiverArrangement,
} from "@/features/caregiver-onboarding/types";
import { assets } from "@/lib/assets";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function ServicesStep({
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
  const { specializations } = useCaregiverApplicationOptions();
  const [errors, setErrors] = useState<CaregiverServicesErrors>({});

  function handleContinue() {
    const nextErrors = validateCaregiverServices(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      appToast.error("Please complete the highlighted sections.");
      return;
    }
    onContinue();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        What are your caregiving skills?
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Select the services you offer so we can connect you with careseekers who
        need your support.
      </p>

      {Object.keys(errors).length > 0 ? (
        <div className="mt-5">
          <ErrorBanner>
            Choose at least one option in each section below.
          </ErrorBanner>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">
          What type of care do you offer?
        </h2>
        <div className="mt-3 space-y-3" role="radiogroup">
          {CAREGIVER_CARE_TYPE_OPTIONS.map((option) => {
            const selected = draft.careType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => patchDraft({ careType: option.value })}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border bg-white px-4 py-4 text-left transition-colors",
                  selected
                    ? "border-emerald-500 bg-[#F3FBF7] ring-1 ring-emerald-500"
                    : "border-[#D7DEE8] hover:border-brand-blue/40",
                )}
              >
                <span className="relative mt-0.5 size-11 shrink-0 overflow-hidden rounded-full bg-[#F0F6FF]">
                  <Image
                    src={assets.careProfileRecipient}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover object-top"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-navy/60">
                    {option.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
                    selected
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-[#D7DEE8] bg-white",
                  )}
                >
                  {selected ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
        {errors.careTypes ? <FieldError>{errors.careTypes}</FieldError> : null}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">
          What type of care do you specialize in?
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {specializations.map((specialty) => {
            const selected = draft.specialties.includes(specialty.value);
            return (
              <button
                key={specialty.value}
                type="button"
                onClick={() =>
                  patchDraft({
                    specialties: toggleValue(
                      draft.specialties,
                      specialty.value,
                    ),
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
                  selected
                    ? "border-brand-blue bg-[#E8F1FF] font-medium text-brand-blue"
                    : "border-[#D7DEE8] bg-white text-navy/70 hover:border-brand-blue/40",
                )}
              >
                {specialty.label}
                {selected ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.specialties ? (
          <FieldError>{errors.specialties}</FieldError>
        ) : null}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">
          Care arrangements you accept
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {CAREGIVER_ARRANGEMENT_OPTIONS.map((option) => {
            const selected = draft.arrangements.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  patchDraft({
                    arrangements: toggleValue(
                      draft.arrangements,
                      option.value as CaregiverArrangement,
                    ),
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
        {errors.arrangements ? (
          <FieldError>{errors.arrangements}</FieldError>
        ) : null}
      </section>

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
