"use client";

import type {
  ClipboardEvent,
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
} from "react";
import { otpInputClass } from "@/features/auth/components/auth-feedback";

export const OTP_LENGTH = 6;
/** Fresh, empty OTP state. Spread it so each reset gets a new array. */
export const EMPTY_OTP: readonly string[] = Array.from(
  { length: OTP_LENGTH },
  () => "",
);

type OtpInputProps = {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  /** Parent keeps the refs so it can focus the first box (e.g. after resend). */
  inputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  hasError?: boolean;
  /** Called on every user edit so the parent can clear its error message. */
  onEdit?: () => void;
  labelPrefix: string;
};


export function OtpInput({
  value,
  onChange,
  inputRefs,
  hasError = false,
  onEdit,
  labelPrefix,
}: OtpInputProps) {
  function focusBox(index: number) {
    inputRefs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus();
  }

  /** Write several digits starting at `start`, then focus the box after them. */
  function fillFrom(start: number, raw: string) {
    const digits = raw
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH - start)
      .split("");
    if (digits.length === 0) return;

    onEdit?.();
    onChange((current) =>
      current.map((item, i) =>
        i >= start && i < start + digits.length ? digits[i - start] : item,
      ),
    );
    focusBox(start + digits.length);
  }

  function handleChange(index: number, raw: string) {
    onEdit?.();
    const digits = raw.replace(/\D/g, "");

    if (!digits) {
      onChange((current) =>
        current.map((item, i) => (i === index ? "" : item)),
      );
      return;
    }

    // Several digits at once means autofill. Two digits in a box that already
    // held one is just the user typing over it, so keep the newest digit.
    const typedOverExisting = Boolean(value[index]) && digits.length === 2;
    if (digits.length > 1 && !typedOverExisting) {
      fillFrom(index, digits);
      return;
    }

    const digit = digits.slice(-1);
    onChange((current) =>
      current.map((item, i) => (i === index ? digit : item)),
    );
    if (index < OTP_LENGTH - 1) focusBox(index + 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      focusBox(index - 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    fillFrom(index, event.clipboardData.getData("text"));
  }

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          aria-label={`${labelPrefix} ${index + 1}`}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.currentTarget.select()}
          className={otpInputClass(hasError)}
          aria-invalid={hasError}
        />
      ))}
    </div>
  );
}