
"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type SignupStep = "signup" | "verify" | "success";

const inputWrapper =
  "flex h-11 items-center gap-3 rounded-full border border-border bg-white px-4 transition focus-within:ring-2 focus-within:ring-ring";

const inputClass =
  "min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/40";

export function SignupFlow() {
  const [step, setStep] = useState<SignupStep>("signup");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
  ];

  const passwordScore = passwordChecks.filter(
    (check) => check.valid,
  ).length;

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (passwordScore !== passwordChecks.length) {
      setError("Please meet all password requirements.");
      return;
    }

    // TODO: Call the registration API before moving to verification.
    setStep("verify");
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((current) =>
      current.map((item, i) => (i === index ? digit : item)),
    );
  }

  function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (otp.some((digit) => !digit)) {
      setError("Enter all six digits of your verification code.");
      return;
    }

    // TODO: Verify the OTP with your backend.
    // Only show success after the API confirms verification.
    setError(
      "OTP verification is not connected yet. Connect your verification API to continue.",
    );
  }

  function handleResendCode() {
    setError(
      "Connect your resend-code API before requesting a new verification code.",
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
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
              Sign up as a careseeker to find verified, compassionate
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

              <div className={inputWrapper}>
                <UserRound className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="e.g. Adebayo Johnson"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-medium text-navy">
                Email address
              </label>

              <div className={inputWrapper}>
                <Mail className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-phone" className="text-xs font-medium text-navy">
                Phone number
              </label>

              <div className={inputWrapper}>
                <Phone className="size-4 shrink-0 text-navy/50" aria-hidden />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+234 803 123 4567"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-xs font-medium text-navy">
                Create password
              </label>

              <div className={inputWrapper}>
                <LockKeyhole className="size-4 shrink-0 text-navy/50" aria-hidden />

                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a strong password"
                  className={inputClass}
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

              <div className="flex gap-1 pt-1" aria-label={`Password strength: ${passwordScore} of 4 requirements met`}>
                {passwordChecks.map((check) => (
                  <span
                    key={check.label}
                    className={`h-1 flex-1 rounded-full ${
                      check.valid ? "bg-emerald-500" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[11px] text-navy/60">
                Password strength:{" "}
                {passwordScore === 4
                  ? "Strong"
                  : passwordScore >= 2
                    ? "Getting stronger"
                    : "Not strong enough"}
              </p>

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

            {error && (
              <p role="alert" className="text-xs text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" className="h-11 w-full rounded-full">
              Create Account
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-navy/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              Log in
            </Link>
          </p>
        </>
      )}

      {step === "verify" && (
        <>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-7" aria-hidden />
            </div>

            <h1 className="text-xl font-bold text-navy">
              Verify with email or phone number
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm text-navy/70">
              We&apos;ll need to verify your account using the code sent to
              your contact details.
            </p>

            <p className="mt-3 break-all text-xs font-medium text-navy">
              {email}
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <span className="h-1.5 flex-1 rounded-full bg-brand-blue" />
            <span className="h-1.5 flex-1 rounded-full bg-brand-blue" />
            <span className="h-1.5 flex-1 rounded-full bg-border" />
          </div>

          <form onSubmit={handleVerification} className="space-y-5">
            <label className="block text-xs font-medium text-navy">
              Verification code
            </label>

            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  aria-label={`Verification digit ${index + 1}`}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => updateOtp(index, event.target.value)}
                  className="h-12 min-w-0 rounded-lg border border-border text-center text-lg font-semibold text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-ring"
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-navy/60">
              <span>Check your inbox for your code.</span>
              <button
                type="button"
                onClick={handleResendCode}
                className="shrink-0 font-semibold text-brand-blue hover:text-brand-blue-hover"
              >
                Resend code
              </button>
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" className="h-11 w-full rounded-full">
              Verify &amp; Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("signup");
              }}
              className="flex w-full items-center justify-center gap-1 text-xs font-medium text-brand-blue hover:text-brand-blue-hover"
            >
              <ArrowLeft className="size-3" aria-hidden />
              Back to Sign Up
            </button>
          </form>
        </>
      )}

      {step === "success" && (
        <div className="py-4 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-blue-50 text-brand-blue">
            <CheckCircle2 className="size-10" aria-hidden />
          </div>

          <h1 className="text-xl font-bold text-navy">
            Account successfully verified
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-navy/70">
            Welcome to CareVYA! You&apos;re one step closer to finding
            trusted, compassionate care for your family.
          </p>

          <div className="mt-6 rounded-xl bg-surface-soft p-4 text-left text-xs text-navy/70">
            <p className="flex items-center gap-2 font-medium text-emerald-700">
              <CheckCircle2 className="size-4" aria-hidden />
              Your account is verified.
            </p>
            <p className="mt-2">
              Complete your care profile to help us find the right caregivers
              for your needs.
            </p>
          </div>

         
             <Link
               href="/careseeker/profile"
               className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-4 text-sm font-medium text-white transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
               >
               Set Up Care Profile
             <ArrowRight className="size-4" aria-hidden />
            </Link>


          <Link
            href="/dashboard"
            className="mt-4 inline-block text-xs font-medium text-brand-blue hover:text-brand-blue-hover"
          >
            Skip &amp; Go to Dashboard
          </Link>

          <p className="mt-6 text-xs text-navy/60">
            Need help?{" "}
            <Link href="/contact-us" className="font-medium text-brand-blue">
              Contact Support
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
