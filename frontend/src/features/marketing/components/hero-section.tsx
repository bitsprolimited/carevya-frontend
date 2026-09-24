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
          className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-right"
        />

        {/* Mobile: darker scrim for copy; desktop: lighter left wash */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-scrim/60 via-scrim/45 to-scrim/75 md:bg-gradient-to-r md:from-scrim/45 md:via-scrim/15 md:to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-scrim/55 via-transparent to-scrim/35 md:from-scrim/20 md:to-scrim/10"
        />

        <div className="relative z-10 flex min-h-[78svh] flex-col md:min-h-[100svh]">
          <SiteHeader variant="transparent" />

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-36 pt-2 md:justify-center md:gap-10 md:px-6 md:pb-14 md:pt-6 lg:px-8 lg:pb-16 xl:px-10">
            <div className="max-w-xl space-y-3 md:max-w-2xl md:space-y-5">
              <h1 className="font-lato text-[32px] leading-[40px] font-bold tracking-normal text-on-media md:font-sans md:text-5xl md:leading-[1.15] lg:text-6xl">
                <span className="whitespace-nowrap">Find trusted care,</span>
                <br className="md:hidden" />{" "}
                <span className="whitespace-nowrap">closer to home.</span>
              </h1>
              <p className="font-inter max-w-[370px] text-[20px] leading-[28px] font-normal tracking-normal text-on-media/80 md:font-sans md:max-w-lg md:text-lg md:leading-relaxed">
                Discover verified caregivers, compare their experience and
                services, and connect with the right provider for your loved
                one.
              </p>
            </div>

            {/* Desktop waitlist sits in-hero */}
            <div
              id="hero-waitlist"
              className="mt-8 hidden w-full max-w-xl scroll-mt-24 md:mt-0 md:block md:max-w-2xl lg:max-w-3xl xl:max-w-2xl"
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
                  className="size-5 shrink-0 text-emerald"
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
        className="relative z-20 -mt-28 px-5 pb-4 md:hidden"
      >
        <HeroWaitlistCard />
      </div>
    </section>
  );
}
