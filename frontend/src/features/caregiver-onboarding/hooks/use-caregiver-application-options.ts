"use client";

import { useQuery } from "@tanstack/react-query";
import { getCaregiverApplicationOptions } from "@/features/caregiver-onboarding/services/caregiver-onboarding-service";
import { CAREGIVER_SPECIALTY_OPTIONS } from "@/features/caregiver-onboarding/types";

export const caregiverApplicationOptionsKey = [
  "caregiver-onboarding",
  "options",
] as const;

/**
 * `GET /onboarding/caregiver/application/options` — chip sources for the
 * wizard. Static fallbacks keep the UI usable if the request fails.
 */
export function useCaregiverApplicationOptions() {
  const query = useQuery({
    queryKey: caregiverApplicationOptionsKey,
    queryFn: getCaregiverApplicationOptions,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  return {
    isLoading: query.isLoading,
    specializations:
      query.data?.specializations ?? CAREGIVER_SPECIALTY_OPTIONS,
    serviceFeePercent: query.data?.serviceFeePercent ?? null,
  };
}
