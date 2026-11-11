"use client";

import { create } from "zustand";
import {
  CARE_PROFILE_STEPS,
  initialCareProfileDraft,
  type CareProfileDraft,
  type CareProfileStepId,
} from "@/features/care-profile/types";
import { toDateOnly } from "@/lib/date";

function normalizeDraftDates(draft: CareProfileDraft): CareProfileDraft {
  return {
    ...draft,
    dateOfBirth: toDateOnly(draft.dateOfBirth),
    startDate: toDateOnly(draft.startDate),
  };
}

type CareProfileState = {
  stepIndex: number;
  isReviewing: boolean;
  isComplete: boolean;
  draft: CareProfileDraft;
  hydrated: boolean;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  enterReview: () => void;
  exitReview: () => void;
  completeSetup: () => void;
  patchDraft: (patch: Partial<CareProfileDraft>) => void;
  hydrateDraft: (draft: CareProfileDraft, options?: { complete?: boolean }) => void;
  reset: () => void;
  currentStepId: () => CareProfileStepId;
};

export const useCareProfileStore = create<CareProfileState>((set, get) => ({
  stepIndex: 0,
  isReviewing: false,
  isComplete: false,
  draft: { ...initialCareProfileDraft },
  hydrated: false,
  setStepIndex: (index) =>
    set({
      stepIndex: Math.max(0, Math.min(index, CARE_PROFILE_STEPS.length - 1)),
    }),
  nextStep: () =>
    set((state) => ({
      stepIndex: Math.min(state.stepIndex + 1, CARE_PROFILE_STEPS.length - 1),
    })),
  prevStep: () =>
    set((state) => ({
      stepIndex: Math.max(state.stepIndex - 1, 0),
    })),
  enterReview: () =>
    set({
      isReviewing: true,
      stepIndex: CARE_PROFILE_STEPS.length - 1,
    }),
  exitReview: () =>
    set({ isReviewing: false, stepIndex: CARE_PROFILE_STEPS.length - 1 }),
  completeSetup: () => set({ isComplete: true, isReviewing: false }),
  patchDraft: (patch) =>
    set((state) => ({
      draft: normalizeDraftDates({ ...state.draft, ...patch }),
    })),
  hydrateDraft: (draft, options) =>
    set({
      draft: normalizeDraftDates({ ...draft }),
      hydrated: true,
      ...(options?.complete ? { isComplete: true, isReviewing: false } : {}),
    }),
  reset: () =>
    set({
      stepIndex: 0,
      isReviewing: false,
      isComplete: false,
      hydrated: false,
      draft: { ...initialCareProfileDraft },
    }),
  currentStepId: () => CARE_PROFILE_STEPS[get().stepIndex].id,
}));
