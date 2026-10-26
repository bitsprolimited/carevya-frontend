"use client";

import {
  CalendarDays,
  Headphones,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutConfirmModal } from "@/features/dashboard/components/logout-confirm-modal";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const menuLinks = [
  { href: "/careseeker", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/careseeker/caregivers", label: "Find Care", icon: Search },
  { href: "/careseeker/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/careseeker/messages", label: "Messages", icon: MessageSquare },
  { href: "/careseeker/profile", label: "Profile", icon: UserRound },
] as const;

const accountLinks = [
  { href: "/careseeker/settings", label: "Settings", icon: Settings },
  { href: "/contact", label: "Help & Support", icon: Headphones },
] as const;

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-[#E8F0FE] text-brand-blue"
          : "text-navy/70 hover:bg-surface-soft hover:text-navy",
      )}
    >
      <Icon className="size-[1.125rem] shrink-0" aria-hidden />
      {label}
    </Link>
  );
}

export function CareseekerSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <aside
        className={cn(
          "flex h-full w-[15.5rem] shrink-0 flex-col border-r border-[#E8EEF5] bg-white",
          className,
        )}
      >
        <div className="flex items-center gap-2 px-5 pt-5 pb-6">
          <Link
            href="/careseeker"
            className="inline-flex items-center gap-2"
            onClick={onNavigate}
          >
            <span className="relative size-8 overflow-hidden">
              <Image
                src={assets.logo}
                alt=""
                fill
                sizes="32px"
                className="object-contain"
              />
            </span>
            <span className="text-lg font-bold tracking-tight text-navy">
              <span className="text-brand-blue">Care</span>VYA
            </span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
          <div>
            <p className="mb-2 px-3 text-[0.6875rem] font-semibold tracking-wide text-navy/40 uppercase">
              Menu
            </p>
            <nav className="flex flex-col gap-0.5" aria-label="Main">
              {menuLinks.map((link) => (
                <span key={link.href} onClick={onNavigate}>
                  <NavItem
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                    active={isActive(link.href, "exact" in link && link.exact)}
                  />
                </span>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-2 px-3 text-[0.6875rem] font-semibold tracking-wide text-navy/40 uppercase">
              Account
            </p>
            <nav className="flex flex-col gap-0.5" aria-label="Account">
              {accountLinks.map((link) => (
                <span key={link.href} onClick={onNavigate}>
                  <NavItem
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                    active={isActive(link.href)}
                  />
                </span>
              ))}
            </nav>
          </div>

          <div className="mt-auto rounded-2xl bg-navy px-4 py-4 text-white">
            <p className="text-sm font-semibold">Still need help?</p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              Talk to a CareVYA team member any time, day or night (24/7).
            </p>
            <Link
              href="/contact"
              onClick={onNavigate}
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-white text-xs font-semibold text-navy transition-colors hover:bg-white/90"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <div className="border-t border-[#E8EEF5] px-3 py-3">
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              setLogoutOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
          >
            <LogOut className="size-[1.125rem]" aria-hidden />
            Log out
          </button>
        </div>
      </aside>

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}
