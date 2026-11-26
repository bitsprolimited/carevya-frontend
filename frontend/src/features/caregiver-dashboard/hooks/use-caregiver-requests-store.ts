"use client";

import { create } from "zustand";
import {
  caregiverRequestsSeed,
  type CaregiverRequest,
  type CaregiverRequestStatus,
} from "@/features/caregiver-dashboard/data/mock-requests";

type CaregiverRequestsState = {
  items: CaregiverRequest[];
  getById: (id: string) => CaregiverRequest | undefined;
  setStatus: (id: string, status: CaregiverRequestStatus) => void;
};

export const useCaregiverRequestsStore = create<CaregiverRequestsState>(
  (set, get) => ({
    items: caregiverRequestsSeed.map((item) => ({
      ...item,
      patient: { ...item.patient },
    })),
    getById: (id) => get().items.find((item) => item.id === id),
    setStatus: (id, status) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
      })),
  }),
);
