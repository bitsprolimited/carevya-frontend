"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ErrorBanner,
  FieldError,
  inputWrapperClass,
} from "@/features/auth/components/auth-feedback";
import { useAuthModalStore } from "@/features/auth/hooks/use-auth-modal-store";
import {
  signInWithEmail,
  signInWithGoogle,
} from "@/features/auth/services/auth-service";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

const inputClass =
  "min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/35";

const MAX_LOGIN_ATTEMPTS = 5;

type LoginFormProps = {
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
  onClose?: () => void;
};

export function LoginForm({
  onCreateAccount,
  onForgotPassword,
  onClose,
}: LoginFormProps) {
  const router = useRouter();
  const closeModal = useAuthModalStore((state) => state.closeModal);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_LOGIN_ATTEMPTS);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function clearErrors() {
    setBannerError(null);
    setPasswordError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();

    if (!identifier.trim() || !password) {
      setBannerError(
        "Enter your email address or phone number and password.",
      );
      return;
    }

    if (!identifier.includes("@")) {
      setBannerError("Please sign in with your email address for now.");
      return;
    }

    if (attemptsLeft <= 0) {
      setBannerError(
        "Too many failed attempts. Please reset your password or try again later.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await signInWithEmail({
        email: identifier.trim(),
        password,
        rememberMe: remember,
      });

      if (!result.success) {
        const nextAttempts = Math.max(attemptsLeft - 1, 0);
        setAttemptsLeft(nextAttempts);
        setBannerError(
          `We couldn't log you in. The email, phone number or password you entered is incorrect. You have ${nextAttempts} attempt${nextAttempts === 1 ? "" : "s"} left.`,
        );
        setPasswordError(
          "Incorrect password. Try again or reset your password.",
        );
        return;
      }

      closeModal();
      onClose?.();
      router.push("/careseeker/care-profile");
    } catch {
      setBannerError("We couldn't sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    clearErrors();
    setSubmitting(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setBannerError(result.message);
      }
    } catch {
      setBannerError("Google sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative w-full rounded-[1.5rem] bg-white px-6 py-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] sm:px-8 sm:py-9">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-navy/40 transition-colors hover:bg-surface-soft hover:text-navy"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>
      ) : null}

      <header className="mb-7 space-y-2 text-center">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-navy sm:text-[1.875rem]">
          Welcome Back
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-navy/55">
          Sign in to continue finding care you can trust.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {bannerError ? <ErrorBanner>{bannerError}</ErrorBanner> : null}

        <div className="space-y-2">
          <label
            htmlFor="login-identifier"
            className="block text-sm font-medium text-navy"
          >
            Email Address or Phone Number
          </label>
          <div className={inputWrapperClass(false)}>
            <Mail className="size-[1.125rem] shrink-0 text-navy/40" aria-hidden />
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              inputMode="email"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                clearErrors();
              }}
              placeholder="e.g. +234 803 123 4567 or adebayo@family.ng"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-navy"
          >
            Password
          </label>
          <div className={inputWrapperClass(Boolean(passwordError))}>
            <Lock className="size-[1.125rem] shrink-0 text-navy/40" aria-hidden />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors();
              }}
              placeholder="••••••••"
              className={inputClass}
              aria-invalid={Boolean(passwordError)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="rounded-sm text-navy/40 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-[1.125rem]" />
              ) : (
                <Eye className="size-[1.125rem]" />
              )}
            </button>
          </div>
          {passwordError ? <FieldError>{passwordError}</FieldError> : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[0.8125rem]">
          <label className="inline-flex items-center gap-2 text-navy/60">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-[#D7DEE8] accent-brand-blue"
            />
            Remember this device for 30 days
          </label>
          {onForgotPassword ? (
            <button
              type="button"
              onClick={onForgotPassword}
              className="shrink-0 font-medium text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Forgot password?
            </button>
          ) : (
            <Link
              href="/get-started"
              className="shrink-0 font-medium text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Forgot password?
            </Link>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-full text-[0.9375rem] font-semibold"
        >
          {submitting ? "Signing in..." : "Login to Family Portal"}
          {!submitting ? <ArrowRight className="size-4" aria-hidden /> : null}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.08em] text-navy/45 uppercase">
        <span className="h-px flex-1 bg-[#E2E8F0]" aria-hidden />
        Or continue with
        <span className="h-px flex-1 bg-[#E2E8F0]" aria-hidden />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#D7DEE8] bg-white text-sm font-medium text-navy transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <GoogleIcon className="size-5" />
        Sign in with Google
      </button>

      {onCreateAccount ? (
        <p className="mt-7 text-center text-sm text-navy/60">
          New to CareVYA?{" "}
          <button
            type="button"
            onClick={onCreateAccount}
            className="font-semibold text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Create a Careseeker Account
          </button>
        </p>
      ) : null}
    </div>
  );
}
