"use client";

import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export function MessagesEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative flex size-28 items-center justify-center">
        <span className="absolute inset-0 rounded-[2rem] bg-[#EAF2FF]" />
        <span className="absolute -left-2 top-4 size-10 rounded-2xl bg-[#D6E6FF]" />
        <span className="absolute -right-1 bottom-3 size-8 rounded-full bg-[#C8DBFF]" />
        <span className="relative z-10 inline-flex size-16 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-sm">
          <Mail className="size-8" aria-hidden />
        </span>
        <span className="absolute top-2 right-1 z-10 inline-flex size-9 items-center justify-center rounded-full bg-brand-blue text-white shadow-md">
          <MessageCircle className="size-4" aria-hidden />
        </span>
      </div>

      <h2 className="mt-8 text-xl font-bold tracking-tight text-navy sm:text-2xl">
        No Messages Yet!
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/55">
        Your messages will appear here when you connect with a care provider
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
