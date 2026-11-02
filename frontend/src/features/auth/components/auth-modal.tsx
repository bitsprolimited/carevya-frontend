"use client";

import { useState } from "react";
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

  // Set when a login is rejected because the email isn't verified yet:
  // we show the OTP verification step for that email instead of the login form.
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  function handleClose() {
    setVerifyEmail(null);
    closeModal();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showCloseButton={false}>
      {verifyEmail ? (
        <SignupFlow
          key={`auth-verify-${verifyEmail}`}
          verifyEmail={verifyEmail}
          onClose={handleClose}
          onLogin={() => setVerifyEmail(null)}
        />
      ) : null}
      {!verifyEmail && view === "login" ? (
        <LoginForm
          key="auth-login-modal"
          onClose={handleClose}
          onCreateAccount={() => setView("signup")}
          onForgotPassword={() => setView("forgot-password")}
          onVerifyEmail={setVerifyEmail}
        />
      ) : null}
      {!verifyEmail && view === "signup" ? (
        <SignupFlow
          key="auth-signup-modal"
          onClose={handleClose}
          onLogin={() => setView("login")}
        />
      ) : null}
      {!verifyEmail && view === "forgot-password" ? (
        <ForgotPasswordFlow
          key="auth-forgot-password-modal"
          onClose={handleClose}
          onBackToLogin={() => setView("login")}
        />
      ) : null}
    </Modal>
  );
}