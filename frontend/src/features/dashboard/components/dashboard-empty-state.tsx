"use client";

import { MapPin, Search } from "lucide-react";

export function DashboardEmptyState({
  areaLabel,
  onEditFilters,
  onClearFilters,
}: {
  areaLabel: string;
  onEditFilters: () => void;
  onClearFilters: () => void;
}) {
  return (
    <section className="mt-2">
      <p className="text-sm font-medium text-navy/60">
        0 caregivers match your filters
      </p>

      <div className="mt-4 flex flex-col items-center rounded-2xl border border-[#E8EEF5] bg-white px-6 py-12 text-center shadow-sm">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#E8F0FE]" />
          <span className="absolute size-16 rounded-full border-2 border-dashed border-brand-blue/30" />
          <MapPin
            className="absolute size-5 text-brand-blue/50"
            style={{ top: "1.1rem", left: "1.35rem" }}
            aria-hidden
          />
          <MapPin
            className="absolute size-4 text-brand-blue/35"
            style={{ bottom: "1.35rem", right: "1.2rem" }}
            aria-hidden
          />
          <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-brand-blue text-white shadow-md">
            <Search className="size-5" aria-hidden />
          </span>
        </div>

        <h2 className="mt-6 text-lg font-bold text-navy">
          No caregivers match all your filters
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/55">
          Try removing a filter or searching a wider area around {areaLabel}.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onEditFilters}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#D7E0EA] bg-white px-6 text-sm font-semibold text-navy hover:bg-surface-soft"
          >
            Edit filters
          </button>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-blue px-6 text-sm font-semibold text-white hover:bg-brand-blue-hover"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </section>
  );
}
