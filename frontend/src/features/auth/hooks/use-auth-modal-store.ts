import { create } from "zustand";
import type { SignupRole } from "@/features/auth/services/auth-service";

export type AuthView = "login" | "signup" | "forgot-password" | null;

interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
  signupRole: SignupRole;
  openModal: (view: AuthView, options?: { role?: SignupRole }) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: null,
  signupRole: "care_seeker",
  openModal: (view, options) =>
    set({
      isOpen: true,
      view,
      ...(options?.role ? { signupRole: options.role } : { signupRole: "care_seeker" }),
    }),
  closeModal: () =>
    set({ isOpen: false, view: null, signupRole: "care_seeker" }),
  setView: (view) => set({ view }),
}));