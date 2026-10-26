"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  const control = (
    <button
      id={toggleId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        label || description ? "mt-0.5" : "",
        checked ? "bg-brand-blue" : "bg-[#D7E0EA]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
        aria-hidden
      />
    </button>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {label ? (
          <label htmlFor={toggleId} className="text-sm font-semibold text-navy">
            {label}
          </label>
        ) : null}
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-navy/55">
            {description}
          </p>
        ) : null}
      </div>
      {control}
    </div>
  );
}
