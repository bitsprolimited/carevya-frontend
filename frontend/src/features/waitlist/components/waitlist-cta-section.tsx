"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { assets } from "@/lib/assets";

export function WaitlistCtaSection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section
      id="join-waitlist"
      className="relative isolate overflow-hidden bg-scrim"
    >
      <Image
        src={assets.waitlistCtaBackground}
        alt="Caregivers and elderly clients sharing a warm moment together"
        fill
        sizes="100vw"
        className="scale-105 object-cover object-center blur-[2px]"
      />
      <div aria-hidden className="absolute inset-0 bg-scrim/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-20 text-center md:px-6 md:py-24 lg:py-28">
        <div className="relative size-14 sm:size-16">
          <Image
            src={assets.logo}
            alt="CareVYA"
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold tracking-tight text-on-media sm:text-4xl lg:whitespace-nowrap lg:text-[2.75rem]">
          Your loved ones deserve nothing less than dignity.
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-media-muted sm:text-base md:text-lg">
          Join our gentle revolution in community-focused eldercare. We promise
          zero spam, no endless sales calls, only respectful, reliable updates.
        </p>

        <Button
          type="button"
          className="mt-8 h-12 rounded-full px-8 text-base sm:mt-10 sm:h-14 sm:px-10 sm:text-lg"
          onClick={openModal}
        >
          Join Waitlist Now
        </Button>
      </div>
    </section>
  );
}
