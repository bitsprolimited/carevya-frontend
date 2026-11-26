"use client";

import { create } from "zustand";
import {
  CAREGIVER_ONBOARDING_STEPS,
  initialCaregiverOnboardingDraft,
  type CaregiverOnboardingDraft,
  type CaregiverOnboardingStepId,
} from "@/features/caregiver-onboarding/types";
import type { CaregiverApplicationStatusValue } from "@/features/caregiver-onboarding/services/caregiver-onboarding-service";
import { toDateOnly } from "@/lib/date";

function normalizeDraft(
  draft: CaregiverOnboardingDraft,
): CaregiverOnboardingDraft {
  return {
    ...draft,
    dateOfBirth: toDateOnly(draft.dateOfBirth),
  };
}

export type CaregiverServerState = {
  stepIndex?: number;
  /** Anything but `draft` means the application is locked for editing. */
  status?: CaregiverApplicationStatusValue;
  submittedAt?: string | null;
  rejectionReason?: string | null;
};

type CaregiverOnboardingState = {
  stepIndex: number;
  /** True once the server application has been loaded into the draft. */
  hydrated: boolean;
  isComplete: boolean;
  isReviewing: boolean;
  submittedAt: string | null;
  applicationStatus: CaregiverApplicationStatusValue | null;
  rejectionReason: string | null;
  draft: CaregiverOnboardingDraft;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  showReview: () => void;
  hideReview: () => void;
  editStep: (stepId: CaregiverOnboardingStepId) => void;
  completeSetup: (submittedAt?: string | null) => void;
  patchDraft: (patch: Partial<CaregiverOnboardingDraft>) => void;
  hydrateFromServer: (
    draft: CaregiverOnboardingDraft,
    server?: CaregiverServerState,
  ) => void;
  reset: () => void;
  currentStepId: () => CaregiverOnboardingStepId;
};

const LAST_STEP_INDEX = CAREGIVER_ONBOARDING_STEPS.length - 1;

export const useCaregiverOnboardingStore = create<CaregiverOnboardingState>(
  (set, get) => ({
    stepIndex: 0,
    hydrated: false,
    isComplete: false,
    isReviewing: false,
    submittedAt: null,
    applicationStatus: null,
    rejectionReason: null,
    draft: { ...initialCaregiverOnboardingDraft },
    setStepIndex: (index) =>
      set({
        stepIndex: Math.max(0, Math.min(index, LAST_STEP_INDEX)),
      }),
    nextStep: () =>
      set((state) => ({
        stepIndex: Math.min(state.stepIndex + 1, LAST_STEP_INDEX),
      })),
    prevStep: () =>
      set((state) => ({
        stepIndex: Math.max(state.stepIndex - 1, 0),
      })),
    showReview: () => set({ isReviewing: true }),
    hideReview: () => set({ isReviewing: false }),
    editStep: (stepId) => {
      const index = CAREGIVER_ONBOARDING_STEPS.findIndex(
        (step) => step.id === stepId,
      );
      if (index < 0) return;
      set({ stepIndex: index, isReviewing: false });
    },
    completeSetup: (submittedAt) =>
      set({
        isComplete: true,
        isReviewing: false,
        applicationStatus: "submitted",
        submittedAt: submittedAt ?? new Date().toISOString(),
      }),
    patchDraft: (patch) =>
      set((state) => ({
        draft: normalizeDraft({ ...state.draft, ...patch }),
      })),
    hydrateFromServer: (draft, server = {}) => {
      const locked = Boolean(server.status && server.status !== "draft");
      set({
        hydrated: true,
        draft: normalizeDraft({ ...draft }),
        stepIndex: Math.max(
          0,
          Math.min(server.stepIndex ?? 0, LAST_STEP_INDEX),
        ),
        isComplete: locked,
        isReviewing: false,
        applicationStatus: server.status ?? "draft",
        submittedAt: server.submittedAt ?? null,
        rejectionReason: server.rejectionReason ?? null,
      });
    },
    reset: () =>
      set({
        stepIndex: 0,
        hydrated: false,
        isComplete: false,
        isReviewing: false,
        submittedAt: null,
        applicationStatus: null,
        rejectionReason: null,
        draft: { ...initialCaregiverOnboardingDraft },
      }),
    currentStepId: () => CAREGIVER_ONBOARDING_STEPS[get().stepIndex].id,
  }),
);
