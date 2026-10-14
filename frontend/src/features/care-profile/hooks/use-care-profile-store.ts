"use client";

import { create } from "zustand";
import {
  CARE_PROFILE_STEPS,
  initialCareProfileDraft,
  type CareProfileDraft,
  type CareProfileStepId,
} from "@/features/care-profile/types";

type CareProfileState = {
  stepIndex: number;
  isReviewing: boolean;
  isComplete: boolean;
  draft: CareProfileDraft;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  enterReview: () => void;
  exitReview: () => void;
  completeSetup: () => void;
  patchDraft: (patch: Partial<CareProfileDraft>) => void;
  reset: () => void;
  currentStepId: () => CareProfileStepId;
};

export const useCareProfileStore = create<CareProfileState>((set, get) => ({
  stepIndex: 0,
  isReviewing: false,
  isComplete: false,
  draft: { ...initialCareProfileDraft },
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
      draft: { ...state.draft, ...patch },
    })),
  reset: () =>
    set({
      stepIndex: 0,
      isReviewing: false,
      isComplete: false,
      draft: { ...initialCareProfileDraft },
    }),
  currentStepId: () => CARE_PROFILE_STEPS[get().stepIndex].id,
}));
