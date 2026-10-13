"use client";

import { ClipboardList, Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { assets } from "@/lib/assets";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { href: "/waitlist#for-you", label: "For Families/Care seekers" },
  { href: "/waitlist#for-me", label: "For Qualified Caregivers" },
  { href: "/waitlist#verify", label: "Verification Protocol" },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Trust" },
  { href: "/standards", label: "Care Standards" },
] as const;

const trustBadges = [
  {
    label: "100% Identity Screened",
    Icon: ShieldCheck,
  },
  {
    label: "Clinical Reference Checks",
    Icon: ClipboardList,
  },
  {
    label: "Private Family Circle",
    Icon: Lock,
  },
] as const;

type IconProps = SVGProps<SVGSVGElement>;

function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.99 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1-.004-4.125 2.062 2.062 0 0 1 .004 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "https://www.instagram.com/care_vya?stkn=MW10ZHc5eTdsZHhlMw==", label: "Instagram", Icon: InstagramIcon },
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedInIcon },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  const openWaitlistModal = useWaitlistStore((state) => state.openModal);
  return (
    <footer className="relative mt-auto bg-footer text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr_1fr] lg:gap-12">
          <div className="space-y-4">
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
            >
              <span className="relative size-9 shrink-0 overflow-hidden sm:size-10">
                <Image
                  src={assets.logo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </span>
              <span className="text-lg font-bold tracking-tight sm:text-xl">
                CareVYA
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
              Reimagining eldercare coordination through rigorous multi-tier
              verification, background integrity, and human warmth.
              <span className="hidden lg:inline">
                {" "}
                Empowering families with real-time confidence.
              </span>
            </p>
          </div>

          <nav
            aria-label="Footer sections"
            className="hidden flex-col gap-3 lg:flex"
          >
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ul className="flex flex-col gap-2.5 lg:hidden">
            {trustBadges.map(({ label, Icon }) => (
              <li key={label}>
                <TrustBadge label={label} Icon={Icon} />
              </li>
            ))}
          </ul>

          <div className="space-y-2">
            <p className="text-base font-semibold tracking-tight sm:text-lg">
              Trusted Care, Always
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              Verified caregivers, regular check-ins, and family support.
            </p>
            <button
              type="button"
              onClick={openWaitlistModal}
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Reserve your waitlist slot
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <ul className="hidden flex-wrap gap-2.5 lg:flex">
            {trustBadges.map(({ label, Icon }) => (
              <li key={label}>
                <TrustBadge label={label} Icon={Icon} />
              </li>
            ))}
          </ul>

          <ul className="flex items-center gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-white text-navy transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 lg:mt-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <p className="text-xs leading-relaxed text-white/55 sm:text-sm lg:whitespace-nowrap">
            © 2026 CareVYA Health Inc. All rights reserved.
            <span className="mt-1 block lg:mt-0 lg:inline">
              {" "}
              Compassionate eldercare infrastructure.
            </span>
          </p>

          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75 lg:shrink-0"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 hidden md:bottom-6 md:right-6 lg:block">
        <button
          type="button"
          onClick={scrollToTop}
          className={cn(
            "pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-brand-blue shadow-sm",
            "transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-footer",
          )}
        >
          <span aria-hidden>↑</span>
          Back to Top
        </button>
      </div>
    </footer>
  );
}

function TrustBadge({
  label,
  Icon,
}: {
  label: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-surface-lavender px-3.5 py-2 text-xs font-medium text-navy sm:text-sm">
      <Icon className="size-4 shrink-0 text-emerald" aria-hidden />
      {label}
    </span>
  );
}
