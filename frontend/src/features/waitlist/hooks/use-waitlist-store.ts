"use client";

import { create } from "zustand";

type WaitlistStore = {
  count: number;
  isModalOpen: boolean;
  setCount: (count: number) => void;
  increment: () => void;
  openModal: () => void;
  closeModal: () => void;
};

export const useWaitlistStore = create<WaitlistStore>((set) => ({
  count: 500,
  isModalOpen: false,
  setCount: (count) => set({ count }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
