"use client";

import { create } from "zustand";

type WaitlistStore = {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
};

export const useWaitlistStore = create<WaitlistStore>((set) => ({
  count: 500,
  setCount: (count) => set({ count }),
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
