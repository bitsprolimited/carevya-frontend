import Link from "next/link";

const footerLinks = [
  { href: "/#for-you", label: "Find care" },
  { href: "/#for-me", label: "Become a provider" },
  { href: "/#faq", label: "FAQ" },
] as const;

const trustBadges = [
  "100% Identity Guaranteed",
  "Clinical Reference Checks",
  "Trusted Family Choice",
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="text-lg font-bold tracking-tight">
            Care<span className="text-brand-blue">VYA</span>
          </p>
          <p className="max-w-md text-sm leading-relaxed text-white/75">
            Redefining home care with reliability, compassion, and transparency.
            We connect families with verified caregivers and agencies — we do not
            provide care services ourselves.
          </p>
          <ul className="flex flex-wrap gap-2 pt-2">
            {trustBadges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/85"
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Quick links
          </p>
          <nav aria-label="Footer" className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-white/55 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} CareVYA. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
