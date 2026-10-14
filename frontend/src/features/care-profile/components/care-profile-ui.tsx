"use client";

import {
  Calendar,
  Check,
  ChevronDown,
  CircleAlert,
  Info,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
      <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-relaxed text-red-700"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

/** Convert `DD / MM / YYYY` (or close variants) to `YYYY-MM-DD` for native date inputs. */
function toIsoDate(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return "";
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
}

/** Format a native `YYYY-MM-DD` value as `DD / MM / YYYY`. */
function fromIsoDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day} / ${month} / ${year}`;
}

export function OptionCard({
  title,
  description,
  selected,
  onSelect,
  icon,
  imageSrc,
  imageAlt = "",
}: {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border bg-white px-4 py-4 text-left transition-colors",
        selected
          ? "border-brand-blue bg-[#F0F6FF] ring-1 ring-brand-blue"
          : "border-[#D7DEE8] hover:border-brand-blue/40",
      )}
    >
      {imageSrc ? (
        <span className="relative mt-0.5 size-11 shrink-0 overflow-hidden rounded-full bg-[#F0F6FF]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="44px"
            className="object-cover object-top"
          />
        </span>
      ) : icon ? (
        <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-lavender text-brand-blue">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-navy">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-navy/60">
          {description}
        </span>
      </span>
      <span
        className={cn(
          "mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
          selected
            ? "border-brand-blue bg-brand-blue text-white"
            : "border-[#D7DEE8] bg-white",
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

export function Chip({
  label,
  selected,
  onToggle,
  icon,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
        selected
          ? "border-brand-blue bg-[#E8F1FF] text-navy"
          : "border-[#D7DEE8] bg-white text-navy hover:border-brand-blue/40",
      )}
    >
      {label}
      {icon ? (
        <span className="text-base leading-none" aria-hidden>
          {icon}
        </span>
      ) : null}
      {selected ? (
        <Check className="size-3.5 text-brand-blue" strokeWidth={3} />
      ) : null}
    </button>
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-navy"
    >
      {children}
    </label>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  invalid = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  invalid?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-full border bg-white px-4 focus-within:ring-2",
        invalid
          ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-200/70"
          : "border-[#D7DEE8] focus-within:border-brand-blue focus-within:ring-brand-blue/20",
      )}
    >
      {icon}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid}
        className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/35"
      />
    </div>
  );
}

export function DateField({
  id,
  value,
  onChange,
  placeholder = "DD / MM / YYYY",
  max,
  min,
  invalid = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** ISO `YYYY-MM-DD`. Prefer a stable string from the parent, not `new Date()` in render. */
  max?: string;
  min?: string;
  invalid?: boolean;
}) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const isoValue = toIsoDate(value);

  function openPicker() {
    const input = pickerRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // fall through to click()
      }
    }
    input.click();
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-full border bg-white px-4 focus-within:ring-2",
          invalid
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-200/70"
            : "border-[#D7DEE8] focus-within:border-brand-blue focus-within:ring-brand-blue/20",
        )}
      >
        <button
          type="button"
          onClick={openPicker}
          className="inline-flex shrink-0 text-navy/40 transition-colors hover:text-brand-blue"
          aria-label="Open date picker"
        >
          <Calendar className="size-4" aria-hidden />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid}
          className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/35"
          autoComplete="bday"
        />
      </div>
      <input
        ref={pickerRef}
        type="date"
        value={isoValue}
        max={max}
        min={min}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute left-4 top-full h-0 w-0 opacity-0"
        onChange={(event) => onChange(fromIsoDate(event.target.value))}
      />
    </div>
  );
}

export function SelectField({
  id,
  value,
  onChange,
  placeholder,
  options,
  invalid = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        className={cn(
          "h-12 w-full appearance-none rounded-full border bg-white px-4 pr-10 text-sm outline-none focus:ring-2",
          invalid
            ? "border-red-400 focus:border-red-500 focus:ring-red-200/70"
            : "border-[#D7DEE8] focus:border-brand-blue focus:ring-brand-blue/20",
          value ? "text-navy" : "text-navy/35",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-navy/40"
        aria-hidden
      />
    </div>
  );
}

export function UploadBox({
  title,
  hint = "JPEG or PNG, must not exceed 5mb",
  helperText = "Photo must be clear and not blurry",
  fileName,
  onFile,
}: {
  title: string;
  hint?: string;
  helperText?: string;
  fileName: string;
  onFile: (name: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-navy">{title}</p>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#D7DEE8] bg-white px-4 py-8 text-center transition-colors hover:border-brand-blue/40 hover:bg-[#F8FBFF]">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#F0F6FF] text-brand-blue">
          <Upload className="size-5" aria-hidden />
        </span>
        <span className="mt-3 text-sm font-medium text-navy">
          {fileName ? "Replace file" : "Click to upload"}
        </span>
        <span className="mt-1 text-xs text-navy/55">{hint}</span>
        {fileName ? (
          <span className="mt-2 max-w-full truncate text-xs text-brand-blue">
            {fileName}
          </span>
        ) : null}
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            onFile(file?.name ?? "");
          }}
        />
      </label>
      <p className="flex items-start gap-1.5 text-xs text-navy/55">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>{helperText}</span>
      </p>
    </div>
  );
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-[#D7DEE8] bg-white px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
    />
  );
}
