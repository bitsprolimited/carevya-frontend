"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
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
import { signUpfamily } from "@/features/auth/services/auth-service";
import {
  PLACEHOLDER_OTP,
  resendOtpPlaceholder,
  verifyOtpPlaceholder,
} from "@/features/auth/services/auth-placeholder";

type SignupStep = "signup" | "verify" | "success";

const CODE_EXPIRY_SECONDS = 10 * 60;
const MAX_OTP_ATTEMPTS = 3;

const inputClass =
  "min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/40";

const signupInputBase =
  "flex h-11 items-center gap-3 rounded-full border bg-white px-4 transition focus-within:ring-2";

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  let local = digits;

  if (local.startsWith("234") && local.length >= 13) {
    local = local.slice(3);
  }
  if (local.startsWith("0") && local.length >= 11) {
    local = local.slice(1);
  }

  if (local.length >= 10) {
    return `+234 ${local.slice(0, 3)} *** ${local.slice(-4)}`;
  }

  return value.trim() || "your phone number";
}

function formatExpiry(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first || "there";
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
    <div
      className="relative mx-auto mb-6 size-[4.75rem]"
      aria-hidden
    >
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

type SignupFlowProps = {
  onLogin?: () => void;
  onClose?: () => void;
};

export function SignupFlow({ onLogin, onClose }: SignupFlowProps) {
  const [step, setStep] = useState<SignupStep>("signup");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [expiresIn, setExpiresIn] = useState(CODE_EXPIRY_SECONDS);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(MAX_OTP_ATTEMPTS);
  const [otpError, setOtpError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
  ];

  const passwordScore = passwordChecks.filter(
    (check) => check.valid,
  ).length;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const otpHasError = Boolean(otpError);

  function clearSignupErrors() {
    setFieldErrors({});
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof fieldErrors = {};

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      nextErrors.form = "Please complete all fields.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (password && passwordScore !== passwordChecks.length) {
      nextErrors.password =
        "Your password doesn't meet all the requirements below.";
    }

    if (!confirmPassword || password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await signUpfamily({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (!result.success) {
        const message = result.message.toLowerCase();
        if (
          message.includes("already") ||
          message.includes("exist") ||
          message.includes("registered")
        ) {
          setFieldErrors({
            email:
              "An account with this email already exists. Try logging in instead.",
          });
        } else {
          setFieldErrors({ form: result.message });
        }
        return;
      }

      // Better Auth email verification uses links; keep OTP UI as a temporary gate.
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpAttemptsLeft(MAX_OTP_ATTEMPTS);
      setExpiresIn(CODE_EXPIRY_SECONDS);
      setStep("verify");
    } catch {
      setFieldErrors({
        form: "We couldn't create your account. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (step !== "verify") return;

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

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOtpError("");

    if (expiresIn <= 0) {
      setOtpError(
        "The code entered has expired. Tap 'Resend code' to get a new one.",
      );
      return;
    }

    if (otp.some((digit) => !digit)) {
      setOtpError("Enter all six digits of your verification code.");
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
      // Placeholder until verification API exists.
      const result = await verifyOtpPlaceholder({
        email: email.trim(),
        phone: phone.trim(),
        code: otp.join(""),
      });

      if (!result.success) {
        const nextAttempts = Math.max(otpAttemptsLeft - 1, 0);
        setOtpAttemptsLeft(nextAttempts);
        setOtpError(
          `That code is incorrect. Check your email and try again. You have ${nextAttempts} attempt${nextAttempts === 1 ? "" : "s"} left.`,
        );
        return;
      }

      setStep("success");
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
      // Placeholder until resend-code API exists.
      await resendOtpPlaceholder({
        email: email.trim(),
        phone: phone.trim(),
      });
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

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
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

      {step === "signup" && (
        <>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface-lavender text-brand-blue">
              <UserRound className="size-6" aria-hidden />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-navy">
              Create your account
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm text-navy/70">
              Sign up as a family to find verified, compassionate
              caregivers for your family.
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <span className="h-1.5 flex-1 rounded-full bg-brand-blue" />
            <span className="h-1.5 flex-1 rounded-full bg-border" />
            <span className="h-1.5 flex-1 rounded-full bg-border" />
          </div>

          <form onSubmit={handleSignup} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-xs font-medium text-navy">
                Full name
              </label>

              <div className={inputWrapperClass(false, signupInputBase)}>
                <UserRound className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    clearSignupErrors();
                  }}
                  placeholder="e.g. Adebayo Johnson"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-medium text-navy">
                Email address
              </label>

              <div
                className={inputWrapperClass(
                  Boolean(fieldErrors.email),
                  signupInputBase,
                )}
              >
                <Mail className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearSignupErrors();
                  }}
                  placeholder="you@example.com"
                  className={inputClass}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </div>
              {fieldErrors.email ? (
                <FieldError>{fieldErrors.email}</FieldError>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-phone" className="text-xs font-medium text-navy">
                Phone number
              </label>

              <div className={inputWrapperClass(false, signupInputBase)}>
                <Phone className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    clearSignupErrors();
                  }}
                  placeholder="+234 803 123 4567"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-xs font-medium text-navy">
                Create password
              </label>

              <div
                className={inputWrapperClass(
                  Boolean(fieldErrors.password),
                  signupInputBase,
                )}
              >
                <LockKeyhole className="size-4 shrink-0 text-navy/50" aria-hidden />

                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearSignupErrors();
                  }}
                  placeholder="Create a strong password"
                  className={inputClass}
                  aria-invalid={Boolean(fieldErrors.password)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-navy/50 hover:text-navy"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {password ? (
                <PasswordStrengthMeter
                  score={passwordScore}
                  total={passwordChecks.length}
                  showWeakHint
                />
              ) : null}

              {fieldErrors.password ? (
                <FieldError>{fieldErrors.password}</FieldError>
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

            <div className="space-y-1.5">
              <label
                htmlFor="signup-confirm-password"
                className="text-xs font-medium text-navy"
              >
                Confirm password
              </label>
              <div
                className={inputWrapperClass(
                  Boolean(fieldErrors.confirmPassword),
                  signupInputBase,
                )}
              >
                <LockKeyhole className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    clearSignupErrors();
                  }}
                  placeholder="Re-enter your password"
                  className={inputClass}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="text-navy/50 hover:text-navy"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword ? (
                <FieldError>{fieldErrors.confirmPassword}</FieldError>
              ) : confirmPassword && passwordsMatch ? (
                <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <Check className="size-3.5" aria-hidden />
                  Passwords match
                </p>
              ) : null}
            </div>

            {fieldErrors.form ? (
              <FieldError>{fieldErrors.form}</FieldError>
            ) : null}

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-full"
            >
              {submitting ? "Creating account..." : "Create Account"}
              {!submitting ? (
                <ArrowRight className="size-4" aria-hidden />
              ) : null}
            </Button>
          </form>

          {onLogin ? (
            <p className="mt-5 text-center text-xs text-navy/70">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLogin}
                className="font-semibold text-brand-blue hover:text-brand-blue-hover"
              >
                Log in
              </button>
            </p>
          ) : null}
        </>
      )}

      {step === "verify" && (
        <>
          <div className="mb-7 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Mail className="size-5" aria-hidden />
              </span>
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Smartphone className="size-5" aria-hidden />
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-navy sm:text-[1.375rem]">
              Verify with email or phone number
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/60">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-navy break-all">{email}</span>{" "}
              and{" "}
              <span className="font-semibold text-navy">
                {maskPhone(phone)}
              </span>
              . Enter it below to verify your account.
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/70">
                Verification code
              </label>

              <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    aria-label={`Verification digit ${index + 1}`}
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
                        : "font-semibold text-emerald-700"
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

            <div className="flex items-start gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 text-left text-xs leading-relaxed text-navy/60">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                aria-hidden
              />
              <p>
                It can take a few minutes if you don&apos;t see it in your
                inbox. Please check your spam folder.{" "}
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
              {submitting ? "Verifying..." : "Verify & Continue"}
              {!submitting ? (
                <ArrowRight className="size-4" aria-hidden />
              ) : null}
            </Button>

            <button
              type="button"
              onClick={() => {
                setOtpError("");
                setStep("signup");
              }}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-blue-hover"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back to Sign Up
            </button>
          </form>
        </>
      )}

      {step === "success" && (
        <div className="pt-2 text-center">
          <SuccessBurstIcon />

          <h1 className="text-xl font-bold tracking-tight text-navy sm:text-[1.375rem]">
            Account successfully verified
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy/60">
            Welcome to CareVYA, {getFirstName(fullName)}. Next, tell us about
            the person who needs care so we can match you with the right
            caregivers.
          </p>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 text-left text-xs leading-relaxed text-navy/60">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
              aria-hidden
            />
            <p>
              Setting up a care profile takes about 3 minutes. You can save and
              finish later at any time.
            </p>
          </div>

          <Link
            href="/family/profile"
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Set Up Care Profile
            <ArrowRight className="size-4" aria-hidden />
          </Link>

          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm font-medium text-brand-blue hover:text-brand-blue-hover"
          >
            Skip &amp; Go to Dashboard
          </Link>

          <div className="mt-6 border-t border-[#E2E8F0] pt-5">
            <p className="text-xs text-navy/55">
              Need help?{" "}
              <Link
                href="/contact"
                className="font-medium text-brand-blue hover:text-brand-blue-hover"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
