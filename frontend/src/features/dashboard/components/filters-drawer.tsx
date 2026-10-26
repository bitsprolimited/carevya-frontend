"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import {
  ARRANGEMENT_OPTIONS,
  CARE_CATEGORY_OPTIONS,
  SORT_OPTIONS,
  type CareArrangement,
  type CareCategory,
  type CaregiverSort,
  type CareRecipient,
  type DashboardFilters,
} from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS = ["English", "Yoruba", "Igbo", "Hausa", "Pidgin"];

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        selected
          ? "border-brand-blue bg-[#E8F0FE] text-brand-blue"
          : "border-[#D7E0EA] bg-white text-navy/70 hover:border-navy/30",
      )}
    >
      {selected ? (
        <span className="text-[0.65rem]" aria-hidden>
          ✓
        </span>
      ) : null}
      {label}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[#E8EEF5] px-5 py-4">
      <p className="mb-3 text-sm font-semibold text-navy">{title}</p>
      {children}
    </div>
  );
}

export function FiltersDrawer({
  open,
  onClose,
  filters,
  onChange,
  recipients,
  resultCount,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  recipients: CareRecipient[];
  resultCount: number;
  onClear: () => void;
}) {
  if (!open) return null;

  function toggleCategory(value: CareCategory) {
    const has = filters.categories.includes(value);
    onChange({
      ...filters,
      categories: has
        ? filters.categories.filter((item) => item !== value)
        : [...filters.categories, value],
    });
  }

  function toggleArrangement(value: CareArrangement) {
    const has = filters.arrangements.includes(value);
    onChange({
      ...filters,
      arrangements: has
        ? filters.arrangements.filter((item) => item !== value)
        : [...filters.arrangements, value],
    });
  }

  function toggleLanguage(value: string) {
    const has = filters.languages.includes(value);
    onChange({
      ...filters,
      languages: has
        ? filters.languages.filter((item) => item !== value)
        : [...filters.languages, value],
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-scrim/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-drawer-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E8EEF5] px-5 py-4">
          <h2 id="filters-drawer-title" className="text-lg font-bold text-navy">
            All filters
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/60 hover:bg-surface-soft"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Section title="Type of care">
            <div className="flex flex-col gap-2.5">
              {CARE_CATEGORY_OPTIONS.map((option) => {
                const checked = filters.categories.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-2.5 text-sm text-navy"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(option.value)}
                      className="mt-0.5 size-4 rounded border-[#D7E0EA] text-brand-blue focus:ring-brand-blue"
                    />
                    <span>
                      {option.label}
                      {option.value === "clinical" ? (
                        <span className="mt-0.5 block text-xs text-navy/50">
                          Clinical care is only offered by verified health
                          professionals.
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>

          <Section title="Who needs care?">
            <div className="flex flex-wrap gap-2">
              {recipients.map((recipient) => (
                <Pill
                  key={recipient.id}
                  label={recipient.fullName}
                  selected={filters.recipientId === recipient.id}
                  onClick={() =>
                    onChange({
                      ...filters,
                      recipientId:
                        filters.recipientId === recipient.id
                          ? null
                          : recipient.id,
                    })
                  }
                />
              ))}
            </div>
          </Section>

          <Section title="Care type">
            <div className="flex flex-wrap gap-2">
              {CARE_CATEGORY_OPTIONS.map((option) => (
                <Pill
                  key={option.value}
                  label={option.label}
                  selected={filters.categories.includes(option.value)}
                  onClick={() => toggleCategory(option.value)}
                />
              ))}
            </div>
          </Section>

          <Section title="Sort">
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <Pill
                  key={option.value}
                  label={option.label}
                  selected={filters.sort === option.value}
                  onClick={() =>
                    onChange({
                      ...filters,
                      sort: option.value as CaregiverSort,
                    })
                  }
                />
              ))}
            </div>
          </Section>

          <Section title="Arrangement">
            <div className="flex flex-wrap gap-2">
              {ARRANGEMENT_OPTIONS.map((option) => (
                <Pill
                  key={option.value}
                  label={option.label}
                  selected={filters.arrangements.includes(option.value)}
                  onClick={() => toggleArrangement(option.value)}
                />
              ))}
            </div>
          </Section>

          <Section title="Caregiver gender">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "any", label: "Any" },
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                ] as const
              ).map((option) => (
                <Pill
                  key={option.value}
                  label={option.label}
                  selected={filters.gender === option.value}
                  onClick={() =>
                    onChange({ ...filters, gender: option.value })
                  }
                />
              ))}
            </div>
          </Section>

          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <Pill
                  key={lang}
                  label={lang}
                  selected={filters.languages.includes(lang)}
                  onClick={() => toggleLanguage(lang)}
                />
              ))}
            </div>
          </Section>
        </div>

        <div className="flex gap-3 border-t border-[#E8EEF5] px-5 py-4">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[#D7E0EA] bg-white text-sm font-semibold text-navy hover:bg-surface-soft"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white hover:bg-brand-blue-hover"
          >
            Show {resultCount} results
          </button>
        </div>
      </div>
    </div>
  );
}
