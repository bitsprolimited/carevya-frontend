"use client";

import {
  Bell,
  ChevronDown,
  Headphones,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CaregiverNotificationsDropdown } from "@/features/caregiver-dashboard/components/caregiver-notifications-dropdown";
import { useCaregiverNotificationsStore } from "@/features/caregiver-dashboard/hooks/use-caregiver-notifications-store";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import { LogoutConfirmModal } from "@/features/dashboard/components/logout-confirm-modal";
import { useHydrated } from "@/hooks/use-hydrated";
import { assets } from "@/lib/assets";
import { useSession } from "@/lib/auth-client";

export function CaregiverAccountControls({
  showName = true,
}: {
  showName?: boolean;
}) {
  const hydrated = useHydrated();
  const { data: session } = useSession();
  const draft = useCaregiverOnboardingStore((state) => state.draft);

  const displayFullName =
    (hydrated &&
      (draft.firstName || draft.lastName
        ? `${draft.firstName} ${draft.lastName}`.trim()
        : session?.user?.name?.trim())) ||
    "Caregiver";
  const avatarUrl =
    (hydrated && (draft.photoUrl || session?.user?.image)) ||
    assets.defaultAvatar;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = useCaregiverNotificationsStore(
    (state) => state.items.filter((item) => item.unread).length,
  );

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
      <div className="flex items-center gap-2">
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
                +{unreadNotifications > 9 ? "9" : unreadNotifications}
              </span>
            ) : null}
          </button>
          <CaregiverNotificationsDropdown
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={userMenuOpen}
            onClick={() => {
              setUserMenuOpen((open) => !open);
              setNotificationsOpen(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white py-1.5 pr-2.5 pl-1.5 hover:bg-surface-soft"
          >
            <span className="relative size-8 overflow-hidden rounded-full bg-surface-soft">
              <Image
                src={avatarUrl}
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            {showName ? (
              <span className="min-w-0 max-w-[9rem] text-left sm:max-w-none">
                <span className="block truncate text-xs font-semibold text-navy">
                  {displayFullName}
                </span>
                <span className="block truncate text-[0.6875rem] text-navy/45">
                  Caregiver
                </span>
              </span>
            ) : null}
            <ChevronDown className="size-3.5 text-navy/45" aria-hidden />
          </button>

          {userMenuOpen ? (
            <div className="absolute top-full right-0 z-40 mt-2 w-[min(100vw-2rem,16.5rem)] overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-xl">
              <div className="flex items-center gap-3 border-b border-[#E8EEF5] px-3.5 py-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={avatarUrl}
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
                  <p className="truncate text-xs text-navy/50">Caregiver</p>
                </div>
              </div>

              <nav className="py-1.5">
                <Link
                  href="/caregiver/profile"
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
                  href="/caregiver/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-navy hover:bg-surface-soft"
                >
                  <Settings className="size-4 text-navy/55" aria-hidden />
                  Settings
                </Link>
                <Link
                  href="/caregiver/help"
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

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}
