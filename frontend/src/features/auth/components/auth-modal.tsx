"use client";

import { Modal } from "@/components/ui/modal";
import { ForgotPasswordFlow } from "@/features/auth/components/forgot-password-flow";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupFlow } from "@/features/auth/components/signup-flow";
import { useAuthModalStore } from "@/features/auth/hooks/use-auth-modal-store";

export function AuthModal() {
  const isOpen = useAuthModalStore((state) => state.isOpen);
  const view = useAuthModalStore((state) => state.view);
  const closeModal = useAuthModalStore((state) => state.closeModal);
  const setView = useAuthModalStore((state) => state.setView);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} showCloseButton={false}>
      {view === "login" ? (
        <LoginForm
          key="auth-login-modal"
          onClose={closeModal}
          onCreateAccount={() => setView("signup")}
          onForgotPassword={() => setView("forgot-password")}
        />
      ) : null}
      {view === "signup" ? (
        <SignupFlow
          key="auth-signup-modal"
          onClose={closeModal}
          onLogin={() => setView("login")}
        />
      ) : null}
      {view === "forgot-password" ? (
        <ForgotPasswordFlow
          key="auth-forgot-password-modal"
          onClose={closeModal}
          onBackToLogin={() => setView("login")}
        />
      ) : null}
    </Modal>
  );
}
