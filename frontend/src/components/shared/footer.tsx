"use client";

import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#contact", label: "Contact Us" },
  { href: "/#faq", label: "FAQs" },
] as const;

const verificationLinks = [
  { href: "/#verification", label: "Background Checks" },
  { href: "/#verification", label: "Clearance" },
  { href: "/#verification", label: "Clinical Reference" },
  { href: "/#verification", label: "Skills Review" },
  { href: "/#verification", label: "Continuous Monitoring" },
] as const;

type IconProps = SVGProps<SVGSVGElement>;

function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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

const socialLinks: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
];

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-base font-bold text-on-media">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-on-media/75 transition-colors hover:text-on-media focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer id="contact" className="scroll-mt-24 bg-footer text-on-media">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
            >
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={assets.logo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="text-xl font-bold tracking-tight">CareVYA</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-on-media/80">
              Thoughtful care discovery and coordination, built around trust,
              dignity, and family support.
            </p>
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-emerald uppercase">
              <BadgeCheck aria-hidden className="size-4 shrink-0" />
              Care Certified
            </p>
            <ul className="flex items-center gap-2.5 pt-1">
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-brand-blue text-on-media transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FooterLinkList title="Quick Links" links={quickLinks} />
          </div>

          <div className="lg:col-span-3">
            <FooterLinkList title="Verification" links={verificationLinks} />
          </div>

          <div className="lg:col-span-3">
            <p className="text-base font-bold text-on-media">Location</p>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-on-media/75">
              <p>5 Ajayi Street, Onike-Yaba, Lagos</p>
              <p>
                <a
                  href="mailto:hello@carevya.com.ng"
                  className="transition-colors hover:text-on-media focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  hello@carevya.com.ng
                </a>
              </p>
              <p>
                <a
                  href="tel:+2348060814178"
                  className="font-medium text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  +234 806 081 4178
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 lg:mt-14">
          <p className="text-sm font-medium text-on-media/80">
            Subscribe to our Newsletter
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-3 max-w-xl"
          >
            <div className="flex items-center gap-2 rounded-full bg-background p-1.5 pl-5 shadow-sm">
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className={cn(
                  "h-10 min-w-0 flex-1 rounded-full border-0 bg-transparent px-0 text-navy shadow-none",
                  "placeholder:text-muted focus-visible:ring-0 focus-visible:ring-offset-0",
                )}
              />
              <Button
                type="submit"
                className="h-10 shrink-0 rounded-full px-6 text-sm"
              >
                Subscribe
              </Button>
            </div>
          </form>
          {subscribed ? (
            <p className="mt-2 text-sm text-emerald" role="status">
              Thanks — you&apos;re on the list.
            </p>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-on-media/10 pt-8 text-xs text-on-media/60 sm:text-sm md:flex-row md:items-center md:justify-between md:gap-6">
          <p>© 2026 CareVYA Technologies Ltd. Nigeria.</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 md:justify-center">
            <Link
              href="/terms"
              className="transition-colors hover:text-on-media focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Terms of Services
            </Link>
            <span aria-hidden>|</span>
            <Link
              href="/privacy"
              className="transition-colors hover:text-on-media focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Privacy policy
            </Link>
          </p>
          <p className="md:text-right">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

/** Shared marketing footer (home + waitlist). */
export function Footer() {
  return <SiteFooter />;
}
