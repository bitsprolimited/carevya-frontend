import { create } from "zustand";

export type AuthView = "login" | "signup" | "forgot-password" | null;

interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
  openModal: (view: AuthView) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: null,
  openModal: (view) => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false, view: null }),
  setView: (view) => set({ view }),
}));