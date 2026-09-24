"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const audienceTabs = [
  { id: "families", label: "Families", href: "/#for-you" },
  { id: "carers", label: "Carers", href: "/#for-me" },
] as const;

type SiteHeaderProps = {
  variant?: "transparent" | "solid";
};

function scrollToWaitlist() {
  const target =
    document.getElementById("hero-waitlist-mobile") ??
    document.getElementById("hero-waitlist");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function SiteHeader({ variant = "transparent" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState<(typeof audienceTabs)[number]["id"]>(
    "families",
  );
  const isTransparent = variant === "transparent";

  return (
    //This is the header component
    <header
      className={cn(
        "relative z-40 w-full",
        isTransparent
          ? "bg-transparent"
          : "border-b border-border/80 bg-white/90 backdrop-blur-md",
      )}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:h-[4.5rem] md:px-6 lg:px-8 xl:px-10">
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          <span className="flex flex-col leading-tight">
            <span
              className={cn(
                "text-base font-bold tracking-tight sm:text-lg",
                isTransparent ? "text-on-media" : "text-navy",
              )}
            >
              CareVYA
            </span>
            <span
              className={cn(
                "text-[0.65rem] sm:text-xs",
                isTransparent ? "text-on-media-muted" : "text-muted",
              )}
            >
              Care, closer to home.
            </span>
          </span>
        </Link>

        <div
          role="tablist"
          aria-label="Audience"
          className="absolute left-[calc(50%+2.75rem)] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-media p-1 shadow-sm md:inline-flex"
        >
          {audienceTabs.map((tab) => {
            const isActive = audience === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                role="tab"
                aria-selected={isActive}
                onClick={() => setAudience(tab.id)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "font-bold text-navy"
                    : "font-medium text-navy/50 hover:text-navy",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "ml-auto md:hidden",
            isTransparent &&
              "text-on-media hover:bg-on-media/10 hover:text-on-media",
          )}
          aria-expanded={open}
          aria-controls="hero-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </div>

      <Button
        type="button"
        className="absolute top-1/2 right-12 hidden h-10 -translate-y-1/2 rounded-full px-5 md:inline-flex lg:right-16 xl:right-24"
        onClick={scrollToWaitlist}
      >
        Join Waitlist
        <ArrowRight className="size-4" aria-hidden />
      </Button>

      <div
        id="hero-mobile-nav"
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-b border-on-media/20 px-4 py-4 md:hidden",
          "bg-gradient-to-b from-glass-liquid-top via-glass-liquid-mid to-glass-liquid-bottom",
          "backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-glass-fill",
          open ? "block" : "hidden",
        )}
      >
        <nav
          aria-label="Mobile"
          className="flex flex-col items-end gap-2 text-right"
        >
          {audienceTabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-on-media hover:bg-on-media/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                setAudience(tab.id);
                setOpen(false);
              }}
            >
              {tab.label}
            </Link>
          ))}
          <Button
            type="button"
            className="mt-1 w-full rounded-full"
            onClick={() => {
              setOpen(false);
              scrollToWaitlist();
            }}
          >
            Join Waitlist
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </nav>
      </div>
    </header>
  );
}

/** @deprecated Prefer SiteHeader — kept as alias for existing imports */
export function Header(props: SiteHeaderProps) {
  return <SiteHeader {...props} />;
}
