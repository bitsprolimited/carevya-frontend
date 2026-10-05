"use client";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.41-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
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

function FooterNavColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-on-media sm:text-base">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
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

export function SiteFooter({ className }: { className?: string }) {
  const [email, setEmail] = useState("");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmail("");
  }

  return (
    <footer
      id="contact"
      className={cn("scroll-mt-24 bg-footer text-on-media", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr_0.95fr_1.1fr] lg:gap-8 xl:gap-12">
          <div>
            <Link
              href="/"
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

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-media/80">
              Thoughtful care discovery and coordination, built around trust,
              dignity, and family support.
            </p>

            <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-emerald uppercase">
              <ShieldCheck aria-hidden className="size-4 shrink-0" />
              Care Certified
            </p>

            <ul className="mt-5 flex items-center gap-2.5">
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

          <FooterNavColumn title="Quick Links" links={quickLinks} />
          <FooterNavColumn title="Verification" links={verificationLinks} />

          <div>
            <h3 className="text-sm font-bold text-on-media sm:text-base">
              Location
            </h3>
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

        <div className="mt-12 max-w-xl lg:ml-auto lg:max-w-2xl">
          <p className="text-sm text-on-media/80">
            Subscribe to our Newsletter
          </p>
          <form
            onSubmit={handleSubscribe}
            className="mt-3 flex items-center gap-2 rounded-full bg-on-media p-1.5 shadow-sm"
          >
            <label htmlFor="site-footer-newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="site-footer-newsletter"
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="johndoe@gmail.com"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-navy outline-none placeholder:text-muted"
            />
            <Button
              type="submit"
              className="h-10 shrink-0 rounded-full px-5 text-sm sm:h-11 sm:px-6"
            >
              Subscribe
            </Button>
          </form>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-on-media/10 pt-6 text-xs text-on-media/55 sm:text-sm lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 CareVYA Technologies Ltd. Nigeria.</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
