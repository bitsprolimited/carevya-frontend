"use client";

import { Bell, ChevronDown, Search, Settings, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoutConfirmModal } from "@/features/dashboard/components/logout-confirm-modal";
import { NotificationsDropdown } from "@/features/dashboard/components/notifications-dropdown";
import { mockRecipients, mockUser } from "@/features/dashboard/data/mock";
import { useNotificationsStore } from "@/features/dashboard/hooks/use-notifications-store";
import type { CareRecipient } from "@/features/dashboard/types";
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
  const { data: session } = useSession();
  const displayFullName = session?.user?.name?.trim() || mockUser.fullName;
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [localRecipientId, setLocalRecipientId] = useState(
    recipientId ?? mockRecipients[0]?.id ?? null,
  );
  const [localQuery, setLocalQuery] = useState(searchQuery ?? "");
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    if (!userMenuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [userMenuOpen]);

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
              ? "flex-1 lg:max-w-2xl lg:justify-end"
              : "shrink-0 justify-end",
          )}
        >
          {showSearch ? (
            <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-full border border-[#D7E0EA] bg-white pl-1.5 pr-3 shadow-sm">
              <div className="relative">
                <button
                  type="button"
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
                  <div className="absolute top-full left-0 z-20 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg">
                    {mockRecipients.map((recipient) => (
                      <button
                        key={recipient.id}
                        type="button"
                        onClick={() => selectRecipient(recipient.id)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-soft",
                          recipient.id === activeRecipientId
                            ? "font-semibold text-brand-blue"
                            : "text-navy",
                        )}
                      >
                        <span className="relative size-6 overflow-hidden rounded-full bg-surface-soft">
                          <Image
                            src={recipient.avatarUrl}
                            alt=""
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        </span>
                        {recipient.firstName}
                      </button>
                    ))}
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
                }}
                className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-navy hover:bg-surface-soft"
              >
                <Bell className="size-4" aria-hidden />
                {unreadNotifications > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.625rem] font-bold text-white">
                    +{unreadNotifications}
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
                <div className="absolute top-full right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg">
                  <Link
                    href="/careseeker/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-navy hover:bg-surface-soft"
                  >
                    <UserRound className="size-4 text-navy/55" aria-hidden />
                    My profile
                  </Link>
                  <Link
                    href="/careseeker/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-navy hover:bg-surface-soft"
                  >
                    <Settings className="size-4 text-navy/55" aria-hidden />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-danger hover:bg-danger/5"
                  >
                    Log out
                  </button>
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
