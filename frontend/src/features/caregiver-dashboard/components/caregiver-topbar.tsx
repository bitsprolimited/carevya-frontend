"use client";

import { Search } from "lucide-react";
import { CaregiverAccountControls } from "@/features/caregiver-dashboard/components/caregiver-account-controls";

export function CaregiverTopbar({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  showSearch = true,
}: {
  title: string;
  subtitle: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-navy/55">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:max-w-2xl lg:flex-1 lg:justify-end">
        {showSearch ? (
          <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-full border border-[#D7E0EA] bg-white px-4 shadow-sm">
            <Search className="size-4 shrink-0 text-navy/40" aria-hidden />
            <input
              type="search"
              value={searchQuery ?? ""}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search requests, careseekers or bookings."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-navy outline-none placeholder:text-navy/40"
            />
          </div>
        ) : null}
        <div className="hidden shrink-0 lg:block">
          <CaregiverAccountControls showName />
        </div>
      </div>
    </header>
  );
}
