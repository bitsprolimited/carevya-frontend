"use client";

import { Lock } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  EMPTY_OTP,
  OtpInput,
  OTP_LENGTH,
} from "@/features/auth/components/otp-input";
import {
  maskAccountNumber,
  maskedCaregiverPhone,
  PAYOUT_OTP_CORRECT,
  PAYOUT_OTP_EXPIRY_SECONDS,
  PAYOUT_OTP_MAX_ATTEMPTS,
} from "@/features/caregiver-dashboard/data/mock-earnings";
import type { PayoutAccount } from "@/features/caregiver-dashboard/types/earnings";

function formatExpiry(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function VerifyPayoutOtpModal({
  open,
  draft,
  onBack,
  onClose,
  onVerified,
}: {
  open: boolean;
  draft: Omit<PayoutAccount, "verified"> | null;
  onBack: () => void;
  onClose: () => void;
  onVerified: (account: PayoutAccount) => void;
}) {
  const titleId = useId();
  const [otp, setOtp] = useState<string[]>([...EMPTY_OTP]);
  const [expiresIn, setExpiresIn] = useState(PAYOUT_OTP_EXPIRY_SECONDS);
  const [attemptsLeft, setAttemptsLeft] = useState(PAYOUT_OTP_MAX_ATTEMPTS);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    setOtp([...EMPTY_OTP]);
    setExpiresIn(PAYOUT_OTP_EXPIRY_SECONDS);
    setAttemptsLeft(PAYOUT_OTP_MAX_ATTEMPTS);
    setError("");
    setSubmitting(false);
    const timer = window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || expiresIn <= 0) return;
    const id = window.setInterval(() => {
      setExpiresIn((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, expiresIn]);

  async function handleVerify() {
    if (!draft) return;
    const code = otp.join("");
    if (code.length !== OTP_LENGTH || submitting) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (expiresIn <= 0) {
      setError("That code has expired. Resend a new code and try again.");
      setSubmitting(false);
      return;
    }

    if (code !== PAYOUT_OTP_CORRECT) {
      const nextAttempts = Math.max(0, attemptsLeft - 1);
      setAttemptsLeft(nextAttempts);
      setError(
        nextAttempts > 0
          ? `That code is incorrect. Check your SMS and try again. You have ${nextAttempts} attempt${nextAttempts === 1 ? "" : "s"} left.`
          : "That code is incorrect. No attempts left — resend a new code.",
      );
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onVerified({ ...draft, verified: true });
  }

  function handleResend() {
    setOtp([...EMPTY_OTP]);
    setError("");
    setAttemptsLeft(PAYOUT_OTP_MAX_ATTEMPTS);
    setExpiresIn(PAYOUT_OTP_EXPIRY_SECONDS);
    otpRefs.current[0]?.focus();
  }

  if (!draft) return null;

  const codeComplete = otp.join("").length === OTP_LENGTH;
  const lockedOut = attemptsLeft <= 0;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-brand-blue">
          <Lock className="size-6" aria-hidden />
        </div>

        <h2
          id={titleId}
          className="mt-4 text-center text-xl font-bold tracking-tight text-navy"
        >
          Confirm it&apos;s you
        </h2>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-navy/55">
          To keep your earnings safe, we sent a 6-digit code to{" "}
          {maskedCaregiverPhone}. Enter it to add {draft.bankShortName}{" "}
          {maskAccountNumber(draft.accountNumber)} as your payout account.
        </p>

        <div className="mt-5">
          <OtpInput
            value={otp}
            onChange={setOtp}
            inputRefs={otpRefs}
            hasError={Boolean(error)}
            onEdit={() => setError("")}
            labelPrefix="Payout verification digit"
          />
          {error ? (
            <p className="mt-3 text-sm leading-relaxed text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-navy/50">
            Code expires in{" "}
            <span className="font-semibold text-navy">
              {formatExpiry(expiresIn)}
            </span>
          </p>
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            Resend code
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F5F7FB] px-3.5 py-3 text-xs leading-relaxed text-navy/55">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p>
            CareVYA will never call or message you to ask for this code.
            Don&apos;t share it with anyone.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="h-11 flex-1 rounded-full"
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={!codeComplete || submitting || lockedOut || expiresIn <= 0}
            onClick={() => void handleVerify()}
            className="h-11 flex-1 rounded-full"
          >
            {submitting ? "Verifying..." : "Verify & add account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
