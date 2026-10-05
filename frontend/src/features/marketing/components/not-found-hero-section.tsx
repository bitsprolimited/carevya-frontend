"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "@/components/shared/home-header";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function NotFoundHeroSection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section className="relative isolate bg-background">
      <div className="relative overflow-hidden bg-scrim">
        <Image
          src={assets.notFoundBackground}
          alt="Caregiver in navy scrubs smiling with an elderly woman at home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[45%_center] sm:object-center"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-scrim/60 md:bg-scrim/55"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-scrim/70 via-scrim/30 to-scrim/45"
        />

        <div className="relative z-10 flex min-h-[85svh] flex-col md:min-h-[100svh]">
          <HomeHeader variant="transparent" />

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-8 text-center md:px-6 md:pb-20">
            <h1 className="font-sans text-[4.5rem] leading-none font-bold tracking-tight text-on-media sm:text-7xl md:text-8xl lg:text-[7rem]">
              404
            </h1>
            <p className="mt-3 font-sans text-3xl leading-tight font-bold tracking-tight text-brand-blue sm:mt-4 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              Page Not Found
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-on-media/90 sm:mt-5 sm:text-base md:text-lg">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>

            <div className="mt-8 flex w-full max-w-lg flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                type="button"
                size="lg"
                onClick={openModal}
                className="h-12 rounded-full px-7 text-sm uppercase tracking-wide sm:h-14 sm:px-9 sm:text-base"
              >
                Book an Appointment
              </Button>
              <Link
                href="/"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-full border-2 border-on-media bg-transparent px-7 text-sm font-semibold uppercase tracking-wide text-on-media shadow-none transition-colors",
                  "hover:bg-on-media/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "sm:h-14 sm:px-9 sm:text-base",
                )}
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
