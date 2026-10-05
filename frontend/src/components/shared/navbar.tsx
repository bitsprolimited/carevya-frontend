"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/waitlist#for-you", label: "For You" },
  { href: "/waitlist#for-me", label: "For Me" },
  { href: "/waitlist#faq", label: "FAQ" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const openWaitlistModal = useWaitlistStore((state) => state.openModal);

  return (
    <>
      <nav
        aria-label="Primary"
        className="hidden items-center gap-6 md:flex"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-navy/80 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          "absolute inset-x-0 top-16 border-b border-border bg-white px-4 py-4 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            size="sm"
            className="mt-1 w-full"
            type="button"
            onClick={() => {
              setOpen(false);
              openWaitlistModal();
            }}
          >
            Join Waitlist
          </Button>
        </nav>
      </div>
    </>
  );
}
