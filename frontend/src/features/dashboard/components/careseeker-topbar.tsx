"use client";

import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Headphones,
  LogOut,
  Plus,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoutConfirmModal } from "@/features/dashboard/components/logout-confirm-modal";
import { NotificationsDropdown } from "@/features/dashboard/components/notifications-dropdown";
import { mockRecipients, mockUser } from "@/features/dashboard/data/mock";
import { useNotificationsStore } from "@/features/dashboard/hooks/use-notifications-store";
import type { CareRecipient } from "@/features/dashboard/types";
import { useHydrated } from "@/hooks/use-hydrated";
import { useSession } from "@/lib/auth-client";
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
  const { data: session } = useSession();
  // Keep SSR + first client paint on mock data to avoid hydration mismatches.
  const displayFullName =
    (hydrated && session?.user?.name?.trim()) || mockUser.fullName;
  const displayEmail =
    (hydrated && session?.user?.email) || mockUser.email;
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [localRecipientId, setLocalRecipientId] = useState(
    recipientId ?? mockRecipients[0]?.id ?? null,
  );
  const [localQuery, setLocalQuery] = useState(searchQuery ?? "");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const recipientMenuRef = useRef<HTMLDivElement>(null);

  const activeRecipientId = recipientId ?? localRecipientId;
  const selectedRecipient: CareRecipient | undefined =
    mockRecipients.find((item) => item.id === activeRecipientId) ??
    mockRecipients[0];
  const query = searchQuery ?? localQuery;
  const unreadNotifications = useNotificationsStore((state) =>
    state.items.filter((item) => item.unread).length,
  );

  function selectRecipient(id: string) {
    setLocalRecipientId(id);
    onRecipientChange?.(id);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!userMenuOpen && !menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (userMenuOpen && !userMenuRef.current?.contains(target)) {
        setUserMenuOpen(false);
      }
      if (menuOpen && !recipientMenuRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [userMenuOpen, menuOpen]);

  return (
    <>
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
                  onClick={() => {
                    setMenuOpen((open) => !open);
                    setUserMenuOpen(false);
                    setNotificationsOpen(false);
                  }}
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
                      {mockRecipients.map((recipient) => {
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

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setUserMenuOpen(false);
                  setMenuOpen(false);
                }}
                className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-navy hover:bg-surface-soft"
              >
                <Bell className="size-4" aria-hidden />
                {unreadNotifications > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.625rem] font-bold text-white">
                    +{unreadNotifications > 9 ? "9" : unreadNotifications}
                  </span>
                ) : null}
              </button>
              <NotificationsDropdown
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                aria-expanded={userMenuOpen}
                onClick={() => {
                  setUserMenuOpen((open) => !open);
                  setNotificationsOpen(false);
                  setMenuOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white py-1.5 pr-2.5 pl-1.5 hover:bg-surface-soft"
              >
                <span className="relative size-8 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={mockUser.avatarUrl}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold text-navy">
                    {displayFullName}
                  </span>
                  <span className="block text-[0.6875rem] text-navy/45">
                    {mockUser.roleLabel}
                  </span>
                </span>
                <ChevronDown className="size-3.5 text-navy/45" aria-hidden />
              </button>

              {userMenuOpen ? (
                <div className="absolute top-full right-0 z-40 mt-2 w-[min(100vw-2rem,16.5rem)] overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-xl">
                  <div className="flex items-center gap-3 border-b border-[#E8EEF5] px-3.5 py-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                      <Image
                        src={mockUser.avatarUrl}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-navy">
                        {displayFullName}
                      </p>
                      <p className="truncate text-xs text-navy/50">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <nav className="py-1.5">
                    <Link
                      href="/careseeker/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-navy hover:bg-surface-soft"
                    >
                      <UserRound className="size-4 text-navy/55" aria-hidden />
                      My profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setNotificationsOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-navy hover:bg-surface-soft"
                    >
                      <Bell className="size-4 text-navy/55" aria-hidden />
                      <span className="flex-1">Notifications</span>
                      {unreadNotifications > 0 ? (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[0.625rem] font-bold text-white">
                          {unreadNotifications}
                        </span>
                      ) : null}
                    </button>
                    <Link
                      href="/careseeker/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-navy hover:bg-surface-soft"
                    >
                      <Settings className="size-4 text-navy/55" aria-hidden />
                      Settings
                    </Link>
                    <Link
                      href="/careseeker/help"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-navy hover:bg-surface-soft"
                    >
                      <Headphones className="size-4 text-navy/55" aria-hidden />
                      Help &amp; Support
                    </Link>
                  </nav>

                  <div className="border-t border-[#E8EEF5] py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setLogoutOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger/5"
                    >
                      <LogOut className="size-4" aria-hidden />
                      Log out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}
