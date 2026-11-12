"use client";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CareseekerAccountControls } from "@/features/dashboard/components/careseeker-account-controls";
import { useCareRecipientsStore } from "@/features/care-recipients/hooks/use-care-recipients-store";
import type { CareRecipient } from "@/features/dashboard/types";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function CareseekerTopbar({
  title,
  subtitle,
  recipientId,
  onRecipientChange,
  searchQuery,
  onSearchChange,
  showSearch = true,
}: {
  title: string;
  subtitle: string;
  recipientId?: string | null;
  onRecipientChange?: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  /** Hide recipient + search (e.g. Messages page). */
  showSearch?: boolean;
}) {
  const hydrated = useHydrated();
  const loadRecipients = useCareRecipientsStore((state) => state.load);
  const recipients = useCareRecipientsStore((state) => state.items);

  useEffect(() => {
    if (!hydrated) return;
    void loadRecipients();
  }, [hydrated, loadRecipients]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [localRecipientId, setLocalRecipientId] = useState(
    recipientId ?? recipients[0]?.id ?? null,
  );
  const [localQuery, setLocalQuery] = useState(searchQuery ?? "");
  const recipientMenuRef = useRef<HTMLDivElement>(null);

  const activeRecipientId = recipientId ?? localRecipientId;
  const selectedRecipient: CareRecipient | undefined =
    recipients.find((item) => item.id === activeRecipientId) ?? recipients[0];
  const query = searchQuery ?? localQuery;

  function selectRecipient(id: string) {
    setLocalRecipientId(id);
    onRecipientChange?.(id);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!recipientMenuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-navy/55">{subtitle}</p>
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center",
          showSearch
            ? "flex-1 lg:max-w-xl xl:max-w-lg 2xl:max-w-xl lg:justify-end"
            : "shrink-0 justify-end",
        )}
      >
        {showSearch ? (
          <div className="relative flex h-10 min-w-0 flex-1 items-center rounded-full border border-[#D7E0EA] bg-white pl-1.5 pr-3 shadow-sm sm:h-11">
            <div className="relative" ref={recipientMenuRef}>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-label="Switch care recipient"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-full bg-[#F3F6FB] py-1.5 pr-2.5 pl-1.5 text-sm font-semibold text-navy"
              >
                <span className="relative size-7 overflow-hidden rounded-full bg-surface-soft">
                  {selectedRecipient ? (
                    <Image
                      src={selectedRecipient.avatarUrl}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : null}
                </span>
                {selectedRecipient?.firstName ?? "Select"}
                <ChevronDown className="size-3.5 text-navy/50" aria-hidden />
              </button>

              {menuOpen ? (
                <div className="absolute top-full left-0 z-40 mt-2 w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-xl">
                  <p className="px-4 pt-3 pb-1.5 text-[0.6875rem] font-semibold tracking-wide text-navy/40 uppercase">
                    Caring for
                  </p>
                  <ul className="px-2 pb-2">
                    {recipients.map((recipient) => {
                      const selected = recipient.id === activeRecipientId;
                      return (
                        <li key={recipient.id}>
                          <button
                            type="button"
                            onClick={() => selectRecipient(recipient.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                              selected
                                ? "bg-[#EAF2FF]"
                                : "hover:bg-surface-soft",
                            )}
                          >
                            <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                              <Image
                                src={recipient.avatarUrl}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold text-navy">
                                  {recipient.fullName}
                                </span>
                                {recipient.profileProgress ? (
                                  <span className="shrink-0 rounded-full bg-[#FFF1E0] px-1.5 py-0.5 text-[0.625rem] font-semibold text-amber-700">
                                    Profile {recipient.profileProgress.completed}/
                                    {recipient.profileProgress.total}
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-navy/50">
                                {recipient.relationship} · {recipient.age} ·{" "}
                                {recipient.area}, {recipient.city}
                              </span>
                            </span>
                            {selected ? (
                              <Check
                                className="size-4 shrink-0 text-brand-blue"
                                aria-hidden
                              />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="border-t border-[#E8EEF5] px-2 py-2">
                    <Link
                      href="/careseeker/care-profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 hover:bg-surface-soft"
                    >
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-brand-blue">
                        <Plus className="size-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-navy">
                          Add someone you care for
                        </span>
                        <span className="mt-0.5 block text-xs text-navy/50">
                          Set up a care profile in 3 minutes.
                        </span>
                      </span>
                    </Link>
                    <Link
                      href="/careseeker/profile"
                      onClick={() => setMenuOpen(false)}
                      className="mt-0.5 flex items-center justify-between rounded-xl px-2.5 py-2.5 text-sm font-semibold text-brand-blue hover:bg-[#EAF2FF]/60"
                    >
                      Manage people you care for
                      <ChevronRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setLocalQuery(event.target.value);
                onSearchChange?.(event.target.value);
              }}
              placeholder={`Find care for ${selectedRecipient?.firstName ?? "someone"}`}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-navy outline-none placeholder:text-navy/40"
            />
            <Search className="size-4 shrink-0 text-navy/40" aria-hidden />
          </div>
        ) : null}

        {/* Desktop/tablet: account controls live here. Mobile uses shell nav. */}
        <div className="hidden items-center gap-2 lg:flex">
          <CareseekerAccountControls showName />
        </div>
      </div>
    </header>
  );
}
