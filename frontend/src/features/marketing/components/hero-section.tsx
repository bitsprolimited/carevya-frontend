import Image from "next/image";
import { Heart, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/shared/header";
import { HeroWaitlistCard } from "@/features/waitlist/components/hero-waitlist-card";
import { assets } from "@/lib/assets";

export function HeroSection() {
  return (
    <section className="relative isolate bg-background">
      {/* Media + copy band */}
      <div className="relative overflow-hidden bg-scrim">
        <Image
          src={assets.heroBackground}
          alt="Caregiver and elderly woman reviewing care plans together on a tablet"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] sm:object-[68%_center] lg:object-right"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-scrim/25 via-scrim/10 to-scrim/35 md:bg-gradient-to-r md:from-scrim/45 md:via-scrim/15 md:to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-scrim/20 via-transparent to-scrim/15 md:from-scrim/20 md:to-scrim/10"
        />

        <div className="relative z-10 flex min-h-[72svh] flex-col md:min-h-[100svh]">
          <SiteHeader variant="transparent" />

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-28 pt-4 md:justify-center md:gap-10 md:px-6 md:pb-14 md:pt-6 lg:px-8 lg:pb-16 xl:px-10">
            <div className="max-w-xl space-y-3 pt-2 md:max-w-2xl md:space-y-5 md:pt-0">
              <h1 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-on-media sm:text-4xl md:text-5xl lg:text-6xl">
                Find trusted care, closer to home.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-on-media-muted sm:text-base md:max-w-lg md:text-lg">
                Discover verified caregivers, compare their experience and
                services, and connect with the right provider for your loved
                one.
              </p>
            </div>

            {/* Desktop waitlist sits in-hero */}
            <div
              id="hero-waitlist"
              className="mt-8 hidden w-full max-w-xl scroll-mt-24 md:mt-0 md:block"
            >
              <HeroWaitlistCard />
            </div>

            <ul className="mt-8 hidden flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-on-media md:mt-0 md:flex">
              <li className="inline-flex items-center gap-2">
                <ShieldCheck
                  aria-hidden
                  className="size-5 shrink-0 text-emerald"
                />
                Care, verified.
              </li>
              <li aria-hidden className="h-4 w-px bg-on-media/40" />
              <li className="inline-flex items-center gap-2">
                <Heart
                  aria-hidden
                  className="size-5 shrink-0 fill-emerald text-emerald"
                />
                Family, first.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile: glass card floats over hero → white content seam */}
      <div
        id="hero-waitlist-mobile"
        className="relative z-20 -mt-24 px-4 pb-2 md:hidden"
      >
        <HeroWaitlistCard />
      </div>
    </section>
  );
}
