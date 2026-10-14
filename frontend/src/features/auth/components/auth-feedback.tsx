"use client";

import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-1.5 text-xs text-red-600">
      <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-relaxed text-red-700"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

export function inputWrapperClass(hasError?: boolean, base?: string) {
  return cn(
    base ??
      "flex h-12 items-center gap-3 rounded-full border bg-white px-4 transition focus-within:ring-2",
    hasError
      ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-200/70"
      : "border-[#D7DEE8] focus-within:border-brand-blue focus-within:ring-brand-blue/20",
  );
}

export function otpInputClass(hasError?: boolean) {
  return cn(
    "h-12 min-w-0 rounded-xl border text-center text-lg font-semibold text-navy outline-none transition",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200/70"
      : "border-[#D7DEE8] focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20",
  );
}

export type StrengthTone = {
  label: string;
  barClass: string;
  textClass: string;
};

export function getPasswordStrength(score: number, total: number): StrengthTone {
  if (score <= 1) {
    return {
      label: "Weak",
      barClass: "bg-red-500",
      textClass: "text-red-600",
    };
  }
  if (score < total) {
    return {
      label: score >= total - 1 ? "Good" : "Getting stronger",
      barClass: "bg-amber-400",
      textClass: "text-amber-700",
    };
  }
  return {
    label: "Strong",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  };
}

export function PasswordStrengthMeter({
  score,
  total,
  showWeakHint = false,
}: {
  score: number;
  total: number;
  showWeakHint?: boolean;
}) {
  const strength = getPasswordStrength(score, total);
  const highlightWeak = showWeakHint && score > 0 && score <= 1;

  return (
    <div className="space-y-1.5">
      <div
        className="flex gap-1"
        aria-label={`Password strength: ${strength.label}`}
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full",
              index < score
                ? highlightWeak
                  ? "bg-red-500"
                  : strength.barClass
                : "bg-[#E2E8F0]",
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-[11px]",
          highlightWeak ? "text-red-600" : "text-navy/60",
        )}
      >
        Password strength:{" "}
        <span
          className={cn(
            "font-medium",
            highlightWeak ? "text-red-600" : strength.textClass,
          )}
        >
          {strength.label}
        </span>
      </p>
    </div>
  );
}
