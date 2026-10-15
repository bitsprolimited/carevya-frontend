"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  PasswordStrengthMeter,
  inputWrapperClass,
  otpInputClass,
} from "@/features/auth/components/auth-feedback";
import { requestPasswordResetEmail } from "@/features/auth/services/auth-service";
import {
  PLACEHOLDER_OTP,
  resetPasswordPlaceholder,
  sendRecoveryCodePlaceholder,
  verifyRecoveryCodePlaceholder,
} from "@/features/auth/services/auth-placeholder";

type ResetStep = "request" | "code" | "password" | "success";

const CODE_EXPIRY_SECONDS = 10 * 60;
const MAX_OTP_ATTEMPTS = 3;

const inputClass =
  "min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/35";

function formatExpiry(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  let local = digits;

  if (local.startsWith("234") && local.length >= 13) local = local.slice(3);
  if (local.startsWith("0") && local.length >= 11) local = local.slice(1);

  if (local.length >= 10) {
    return `+234 ${local.slice(0, 3)} *** ${local.slice(-4)}`;
  }

  return value.trim();
}

function displayIdentifier(value: string): string {
  const trimmed = value.trim();
  if (trimmed.includes("@")) return trimmed;
  return maskPhone(trimmed) || trimmed;
}

function IconBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
      {children}
    </div>
  );
}

function SuccessBurstIcon() {
  const rays = [
    "left-1/2 top-0 -translate-x-1/2",
    "right-1 top-2 rotate-[55deg]",
    "right-0 top-1/2 -translate-y-1/2 rotate-90",
    "right-1 bottom-2 -rotate-[55deg]",
    "left-1 bottom-2 rotate-[55deg]",
    "left-0 top-1/2 -translate-y-1/2 -rotate-90",
    "left-1 top-2 -rotate-[55deg]",
  ] as const;

  return (
    <div className="relative mx-auto mb-6 size-[4.75rem]" aria-hidden>
      {rays.map((position) => (
        <span
          key={position}
          className={`absolute h-2.5 w-1 rounded-full bg-brand-blue ${position}`}
        />
      ))}
      <div className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-brand-blue shadow-sm">
        <Check className="size-6 text-white" strokeWidth={3} />
      </div>
    </div>
  );
}

function SupportFooter() {
  return (
    <p className="mt-6 text-center text-xs text-navy/55">
      Having trouble accessing your account?{" "}
      <Link
        href="/contact"
        className="font-medium text-brand-blue hover:text-brand-blue-hover"
      >
        Contact Family Support
      </Link>
    </p>
  );
}

type ForgotPasswordFlowProps = {
  onClose?: () => void;
  onBackToLogin?: () => void;
};

export function ForgotPasswordFlow({
  onClose,
  onBackToLogin,
}: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<ResetStep>("request");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [expiresIn, setExpiresIn] = useState(CODE_EXPIRY_SECONDS);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(MAX_OTP_ATTEMPTS);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPassword, setSubmittedPassword] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordScore = passwordChecks.filter((check) => check.valid).length;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const otpHasError = Boolean(otpError);

  useEffect(() => {
    if (step !== "code") return;

    const timer = window.setInterval(() => {
      setExpiresIn((current) => (current <= 0 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step]);

  function updateOtp(index: number, value: string) {
    setOtpError("");
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setOtp((current) =>
        current.map((item, i) => (i === index ? "" : item)),
      );
      return;
    }

    const digit = digits.slice(-1);
    setOtp((current) =>
      current.map((item, i) => (i === index ? digit : item)),
    );

    if (index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIdentifierError("");

    if (!identifier.trim()) {
      setIdentifierError(
        "Enter the email or phone number linked to your account.",
      );
      return;
    }

    if (!identifier.includes("@")) {
      setIdentifierError(
        "Please use the email linked to your account for password reset.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestPasswordResetEmail({
        email: identifier.trim(),
      });

      if (!result.success) {
        const message = result.message.toLowerCase();
        if (
          message.includes("not found") ||
          message.includes("no user") ||
          message.includes("doesn't exist") ||
          message.includes("does not exist")
        ) {
          setIdentifierError(
            "We couldn't find an account with that email or phone number. Check for typos and try again.",
          );
        } else {
          // Better Auth often returns a generic success; still show designed copy for unknown failures.
          setIdentifierError(
            "We couldn't find an account with that email or phone number. Check for typos and try again.",
          );
        }
        return;
      }

      // Better Auth sends a recovery link (logged in the server console for now).
      // Keep the designed OTP steps available for UI demo with the placeholder code.
      await sendRecoveryCodePlaceholder({ identifier: identifier.trim() });
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpAttemptsLeft(MAX_OTP_ATTEMPTS);
      setExpiresIn(CODE_EXPIRY_SECONDS);
      setStep("code");
    } catch {
      setIdentifierError("We couldn't send a recovery code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOtpError("");

    if (expiresIn <= 0) {
      setOtpError(
        "The code entered has expired. Tap 'Resend code' to get a new one.",
      );
      return;
    }

    if (otp.some((digit) => !digit)) {
      setOtpError("Enter all six digits of your recovery code.");
      return;
    }

    if (otpAttemptsLeft <= 0) {
      setOtpError(
        "Too many incorrect attempts. Tap 'Resend code' to get a new one.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyRecoveryCodePlaceholder({
        identifier: identifier.trim(),
        code: otp.join(""),
      });

      if (!result.success) {
        const nextAttempts = Math.max(otpAttemptsLeft - 1, 0);
        setOtpAttemptsLeft(nextAttempts);
        setOtpError(
          `This code is incorrect. You have ${nextAttempts} attempt${nextAttempts === 1 ? "" : "s"} left.`,
        );
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setConfirmError("");
      setSubmittedPassword(false);
      setStep("password");
    } catch {
      setOtpError("We couldn't verify that code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendCode() {
    setOtpError("");
    setSubmitting(true);
    try {
      await sendRecoveryCodePlaceholder({ identifier: identifier.trim() });
      setOtp(["", "", "", "", "", ""]);
      setOtpAttemptsLeft(MAX_OTP_ATTEMPTS);
      setExpiresIn(CODE_EXPIRY_SECONDS);
      otpRefs.current[0]?.focus();
    } catch {
      setOtpError("We couldn't resend the code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedPassword(true);
    setPasswordError("");
    setConfirmError("");

    let hasError = false;

    if (passwordScore !== passwordChecks.length) {
      setPasswordError(
        "Your password doesn't meet all the requirements below.",
      );
      hasError = true;
    }

    if (!passwordsMatch) {
      setConfirmError("Passwords don't match. Re-enter your new password.");
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);
    try {
      await resetPasswordPlaceholder({
        identifier: identifier.trim(),
        code: otp.join(""),
        password,
      });
      setStep("success");
    } catch {
      setPasswordError("We couldn't update your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-md rounded-[1.5rem] bg-white px-6 py-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] sm:px-8 sm:py-9">
      {onClose && step !== "success" ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-navy/40 transition-colors hover:bg-surface-soft hover:text-navy"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>
      ) : null}

      {step === "request" ? (
        <>
          <div className="mb-6 text-center">
            <IconBadge>
              <LockKeyhole className="size-6" aria-hidden />
            </IconBadge>
            <h1 className="text-xl font-bold tracking-tight text-navy sm:text-[1.375rem]">
              Forgot your password?
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/60">
              Enter the phone number or email linked to your CareVYA account and
              we&apos;ll send you a recovery code.
            </p>
          </div>

          <form onSubmit={handleRequest} noValidate className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="recovery-identifier"
                className="block text-sm font-medium text-navy"
              >
                Registered Email or Phone Number
              </label>
              <div className={inputWrapperClass(Boolean(identifierError))}>
                <Mail
                  className="size-[1.125rem] shrink-0 text-navy/40"
                  aria-hidden
                />
                <input
                  id="recovery-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    setIdentifierError("");
                  }}
                  placeholder="e.g. +234 803 123 4567 or adebayo@family.ng"
                  className={inputClass}
                  aria-invalid={Boolean(identifierError)}
                />
              </div>
              {identifierError ? (
                <FieldError>{identifierError}</FieldError>
              ) : null}
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3 text-left text-xs leading-relaxed text-navy/65">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                aria-hidden
              />
              <p>
                Your account is protected. Recovery codes expire in 10 minutes
                and are never shared with caregivers or anyone else.
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full text-[0.9375rem]"
            >
              {submitting ? "Sending..." : "Send Recovery Code"}
              {!submitting ? (
                <ArrowRight className="size-4" aria-hidden />
              ) : null}
            </Button>

            {onBackToLogin ? (
              <button
                type="button"
                onClick={onBackToLogin}
                className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-blue-hover"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                Back to Login
              </button>
            ) : null}
          </form>

          <SupportFooter />
        </>
      ) : null}

      {step === "code" ? (
        <>
          <div className="mb-6 text-center">
            <IconBadge>
              <MessageSquare className="size-6" aria-hidden />
            </IconBadge>
            <h1 className="text-xl font-bold tracking-tight text-navy sm:text-[1.375rem]">
              Enter recovery code
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/60">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-navy break-all">
                {displayIdentifier(identifier)}
              </span>
              . Enter it below to confirm it&apos;s you.
            </p>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/70">
                Recovery Code
              </label>
              <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    aria-label={`Recovery digit ${index + 1}`}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    className={otpInputClass(otpHasError)}
                    aria-invalid={otpHasError}
                  />
                ))}
              </div>

              {otpError ? <FieldError>{otpError}</FieldError> : null}

              <div className="flex items-center justify-between gap-3 pt-1 text-xs text-navy/60">
                <span>
                  Code expires in{" "}
                  <span
                    className={
                      expiresIn <= 0
                        ? "font-semibold text-red-600"
                        : "font-semibold text-navy"
                    }
                  >
                    {formatExpiry(expiresIn)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={submitting}
                  className="shrink-0 font-semibold text-brand-blue hover:text-brand-blue-hover disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3 text-left text-xs leading-relaxed text-navy/65">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                aria-hidden
              />
              <p>
                Keep this code private. CareVYA will never ask for your recovery
                code by phone, SMS or WhatsApp.{" "}
                <span className="font-medium text-navy">
                  Dev placeholder code: {PLACEHOLDER_OTP}
                </span>
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full text-[0.9375rem]"
            >
              {submitting ? "Verifying..." : "Verify Code"}
              {!submitting ? (
                <ArrowRight className="size-4" aria-hidden />
              ) : null}
            </Button>

            <button
              type="button"
              onClick={() => {
                setOtpError("");
                setStep("request");
              }}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-blue-hover"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Use a different email or phone
            </button>
          </form>

          <SupportFooter />
        </>
      ) : null}

      {step === "password" ? (
        <>
          <div className="mb-6 text-center">
            <IconBadge>
              <KeyRound className="size-6" aria-hidden />
            </IconBadge>
            <h1 className="text-xl font-bold tracking-tight text-navy sm:text-[1.375rem]">
              Set a new password
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/60">
              You&apos;re verified. Create a strong password you haven&apos;t
              used before on CareVYA.
            </p>
          </div>

          <form onSubmit={handleResetPassword} noValidate className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-navy"
              >
                New Password
              </label>
              <div
                className={inputWrapperClass(
                  Boolean(passwordError) ||
                    (submittedPassword && passwordScore < passwordChecks.length),
                )}
              >
                <LockKeyhole
                  className="size-[1.125rem] shrink-0 text-navy/40"
                  aria-hidden
                />
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError("");
                  }}
                  placeholder="••••••••"
                  className={inputClass}
                  aria-invalid={Boolean(passwordError)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-navy/40 hover:text-navy"
                >
                  {showPassword ? (
                    <EyeOff className="size-[1.125rem]" />
                  ) : (
                    <Eye className="size-[1.125rem]" />
                  )}
                </button>
              </div>

              {passwordError ? <FieldError>{passwordError}</FieldError> : null}

              {password ? (
                <PasswordStrengthMeter
                  score={passwordScore}
                  total={passwordChecks.length}
                  showWeakHint
                />
              ) : null}

              <ul className="grid grid-cols-2 gap-1 text-[11px] text-navy/60">
                {passwordChecks.map((check) => (
                  <li key={check.label} className="flex items-center gap-1.5">
                    <Check
                      className={`size-3 ${
                        check.valid ? "text-emerald-600" : "text-navy/30"
                      }`}
                      aria-hidden
                    />
                    {check.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-navy"
              >
                Confirm New Password
              </label>
              <div className={inputWrapperClass(Boolean(confirmError))}>
                <LockKeyhole
                  className="size-[1.125rem] shrink-0 text-navy/40"
                  aria-hidden
                />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setConfirmError("");
                  }}
                  placeholder="••••••••"
                  className={inputClass}
                  aria-invalid={Boolean(confirmError)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="text-navy/40 hover:text-navy"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-[1.125rem]" />
                  ) : (
                    <Eye className="size-[1.125rem]" />
                  )}
                </button>
              </div>
              {confirmError ? (
                <FieldError>{confirmError}</FieldError>
              ) : confirmPassword && passwordsMatch ? (
                <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <Check className="size-3.5" aria-hidden />
                  Passwords match
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full text-[0.9375rem]"
            >
              {submitting ? "Updating..." : "Reset Password"}
              {!submitting ? (
                <ArrowRight className="size-4" aria-hidden />
              ) : null}
            </Button>
          </form>
        </>
      ) : null}

      {step === "success" ? (
        <div className="pt-2 text-center">
          <SuccessBurstIcon />

          <h1 className="text-xl font-bold tracking-tight text-navy sm:text-[1.375rem]">
            Password reset successful
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy/60">
            Your CareVYA password has been updated. You can now log in with your
            new password.
          </p>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3 text-left text-xs leading-relaxed text-navy/65">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
              aria-hidden
            />
            <p>
              You&apos;ve been signed out of other devices. We also sent a
              confirmation email to{" "}
              <span className="font-medium text-navy break-all">
                {displayIdentifier(identifier)}
              </span>{" "}
              for your records.
            </p>
          </div>

          {onBackToLogin ? (
            <Button
              type="button"
              onClick={onBackToLogin}
              className="mt-6 h-12 w-full rounded-full text-[0.9375rem]"
            >
              Back to Log in
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : null}

          <p className="mt-5 text-xs text-navy/55">
            Didn&apos;t make this change?{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-blue hover:text-brand-blue-hover"
            >
              Contact Family Support
            </Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}
