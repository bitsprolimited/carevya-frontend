"use client";

import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CareseekerSidebar } from "@/features/dashboard/components/careseeker-sidebar";
import { cn } from "@/lib/utils";

export function CareseekerShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0">
        <CareseekerSidebar />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-scrim/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 shadow-2xl">
            <CareseekerSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E8EEF5] bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-9 items-center justify-center rounded-lg text-navy hover:bg-surface-soft"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="text-sm font-bold text-navy">
            <span className="text-brand-blue">Care</span>VYA
          </span>
        </div>

        <div className={cn("flex min-h-0 flex-1 flex-col")}>{children}</div>
      </div>
    </div>
  );
}
