"use client";

import Link from "next/link";

function MessagesEmptyIllustration() {
  return (
    <div className="relative flex size-[9.5rem] items-center justify-center sm:size-44">
      <span
        aria-hidden
        className="absolute inset-2 rounded-[42%] bg-[#EAF2FF] sm:inset-3"
      />
      <span
        aria-hidden
        className="absolute left-1 top-8 size-12 rounded-[1.35rem] bg-[#D6E6FF]/70 sm:left-2 sm:size-14"
      />
      <span
        aria-hidden
        className="absolute bottom-6 right-2 size-10 rounded-full bg-[#C8DBFF]/80 sm:bottom-8 sm:right-3 sm:size-11"
      />

      <svg
        viewBox="0 0 120 120"
        className="relative z-10 size-24 drop-shadow-sm sm:size-28"
        aria-hidden
      >
        <rect
          x="28"
          y="42"
          width="64"
          height="48"
          rx="10"
          fill="#FFFFFF"
          stroke="#3B82F6"
          strokeWidth="3.5"
        />
        <path
          d="M28 54 L60 76 L92 54"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="46"
          y="34"
          width="28"
          height="14"
          rx="4"
          fill="#60A5FA"
        />
        <circle cx="88" cy="34" r="16" fill="#2563EB" />
        <path
          d="M81 34 H95 M88 27 V41"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="95" cy="26" r="3.5" fill="#22C55E" />
      </svg>
    </div>
  );
}

export function MessagesEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <MessagesEmptyIllustration />

      <h2 className="mt-8 text-xl font-bold tracking-tight text-navy sm:text-2xl">
        No Messages Yet!
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/55">
        Your messages will appear here when you connect with a caregiver.
      </p>
      <Link
        href="/careseeker/caregivers"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-blue px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Find a Caregiver
      </Link>
    </div>
  );
}
