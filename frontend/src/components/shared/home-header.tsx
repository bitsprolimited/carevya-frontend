"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", match: "/" },
  { label: "How It Works", href: "/how-it-works", match: "/how-it-works", chevron: true },
  { label: "About Us", href: "/#about", match: null },
  { label: "Contact Us", href: "/#contact", match: null },
  { label: "FAQs", href: "/#faq", match: null },
] as const;

type HomeHeaderProps = {
  variant?: "transparent" | "solid";
};

export function HomeHeader({ variant = "transparent" }: HomeHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const openWaitlistModal = useWaitlistStore((state) => state.openModal);
  const isTransparent = variant === "transparent";

  return (
    <header
      className={cn(
        "relative z-40 w-full",
        isTransparent
          ? "bg-transparent"
          : "border-b border-border/80 bg-white/90 backdrop-blur-md",
      )}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:h-[4.5rem] md:px-6 lg:px-8 xl:px-10">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full sm:size-10">
            <Image
              src={assets.logo}
              alt="CareVYA"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span
            className={cn(
              "text-base font-bold tracking-tight sm:text-lg",
              isTransparent ? "text-on-media" : "text-navy",
            )}
          >
            CareVYA
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:flex xl:gap-8"
        >
          {navLinks.map((link) => {
            const active =
              link.match !== null &&
              (link.match === "/"
                ? pathname === "/"
                : pathname === link.match ||
                  pathname.startsWith(`${link.match}/`));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isTransparent
                    ? active
                      ? "text-brand-blue"
                      : "text-on-media hover:text-on-media/80"
                    : active
                      ? "text-brand-blue"
                      : "text-navy/70 hover:text-navy",
                  active && "border-b-2 border-brand-blue pb-0.5",
                )}
              >
                {link.label}
                {"chevron" in link && link.chevron ? (
                  <ChevronDown aria-hidden className="size-3.5 opacity-80" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            className="hidden h-10 rounded-full px-5 md:inline-flex"
            onClick={openWaitlistModal}
          >
            Get Started
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "lg:hidden",
              isTransparent &&
                "text-on-media hover:bg-on-media/10 hover:text-on-media",
            )}
            aria-expanded={open}
            aria-controls="home-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      <div
        id="home-mobile-nav"
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-b border-on-media/20 px-4 py-4 lg:hidden",
          "bg-gradient-to-b from-glass-liquid-top via-glass-liquid-mid to-glass-liquid-bottom",
          "backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-glass-fill",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-on-media hover:bg-on-media/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            type="button"
            className="mt-2 w-full rounded-full"
            onClick={() => {
              setOpen(false);
              openWaitlistModal();
            }}
          >
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
}
