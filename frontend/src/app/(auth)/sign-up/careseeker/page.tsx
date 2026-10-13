import type { Metadata } from "next";
import Link from "next/link";
import { SignupFlow } from "@/features/auth/components/signup-flow";

export const metadata: Metadata = {
  title: "Create Your Account | CareVYA",
  description:
    "Create your CareVYA careseeker account and find trusted caregivers for your family.",
};

export default function CareseekerSignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-soft">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-navy"
            aria-label="CareVYA home"
          >
            <span className="text-brand-blue">Care</span>VYA
          </Link>

          <p className="text-sm text-navy/70">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              Log in
            </Link>
          </p>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <SignupFlow />
      </main>

      <footer className="bg-[#10182D] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold">
              CareVYA
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
              Thoughtful care discovery and coordination, built around trust,
              dignity, and family support.
            </p>
            <p className="mt-3 text-xs font-semibold text-emerald-400">
              © CARE CERTIFIED
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Quick Links</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/65">
              <Link href="/">Home</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/contact-us">Contact Us</Link>
              <Link href="/faqs">FAQs</Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Verification</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/65">
              <Link href="/verification">Background Checks</Link>
              <Link href="/verification">Clearance</Link>
              <Link href="/verification">Clinical Reference</Link>
              <Link href="/verification">Skills Review</Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Location</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Lagos, Nigeria
            </p>
            <Link
              href="/contact-us"
              className="mt-2 inline-block text-sm text-blue-300"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} CareVYA. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}