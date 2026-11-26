"use client";

import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ErrorBanner,
  FieldError,
  FieldLabel,
  TextInput,
} from "@/features/care-profile/components/care-profile-ui";
import { useCaregiverApplicationOptions } from "@/features/caregiver-onboarding/hooks/use-caregiver-application-options";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import {
  validateCaregiverRates,
  type CaregiverRatesErrors,
} from "@/features/caregiver-onboarding/lib/validation";
import {
  CAREGIVER_RATE_FIELDS,
  type CaregiverRateFieldKey,
} from "@/features/caregiver-onboarding/types";
import { appToast } from "@/lib/toast";

function formatRateInput(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-NG");
}

export function PricingStep({
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
  const { serviceFeePercent } = useCaregiverApplicationOptions();
  const [errors, setErrors] = useState<CaregiverRatesErrors>({});

  function updateRate(key: CaregiverRateFieldKey, value: string) {
    patchDraft({ [key]: formatRateInput(value) });
  }

  function handleContinue() {
    const nextErrors = validateCaregiverRates(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      appToast.error("Please enter your rates to continue.");
      return;
    }
    onContinue();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        What are your rates?
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        These are your starting prices. You can agree a different price with
        each careseeker in chat
      </p>

      {Object.keys(errors).length > 0 ? (
        <div className="mt-5">
          <ErrorBanner>
            Check the highlighted fields below, then continue.
          </ErrorBanner>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {CAREGIVER_RATE_FIELDS.map((field) => (
          <div key={field.key}>
            <FieldLabel htmlFor={`cg-rate-${field.key}`}>
              {field.label}
            </FieldLabel>
            <p className="-mt-1 mb-2 text-xs text-navy/45">{field.hint}</p>
            <TextInput
              id={`cg-rate-${field.key}`}
              type="tel"
              value={draft[field.key]}
              onChange={(value) => updateRate(field.key, value)}
              placeholder={field.placeholder}
              icon={
                <span className="text-sm font-medium text-navy/55" aria-hidden>
                  ₦
                </span>
              }
              invalid={Boolean(errors[field.key])}
            />
            {errors[field.key] ? (
              <FieldError>{errors[field.key]}</FieldError>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-navy/45">
        Note: You can negotiate your final rate with careseekers directly
      </p>

      <div className="mt-5 flex gap-3 rounded-2xl border border-[#B7E4D6] bg-[#EAF8F3] px-4 py-3.5 text-sm text-navy/75">
        <Info
          className="mt-0.5 size-4 shrink-0 text-emerald-600"
          aria-hidden
        />
        <p>
          CareVYA charges{" "}
          {serviceFeePercent !== null
            ? `a ${String(serviceFeePercent)}% service fee`
            : "a service fee"}{" "}
          on all payments processed via the app to support payment processing,
          insurance coverage, and customer support.
        </p>
      </div>

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
