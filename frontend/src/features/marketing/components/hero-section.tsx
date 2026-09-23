import Image from "next/image";
import { Heart, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/shared/header";
import { HeroWaitlistCard } from "@/features/waitlist/components/hero-waitlist-card";
import { assets } from "@/lib/assets";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy">
      <Image
        src={assets.heroBackground}
        alt="Caregiver and elderly woman reviewing care plans together on a tablet"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-[72%_center] lg:object-right"
      />

      {/* Readable scrim — stronger on the left / mobile, lighter over subjects */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/25 md:from-navy/80 md:via-navy/45 md:to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/40 md:from-navy/50 md:to-navy/30"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <SiteHeader variant="transparent" />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-8 px-4 pb-10 pt-6 md:gap-10 md:px-6 md:pb-14 lg:px-8 lg:pb-16">
          <div className="max-w-xl space-y-4 md:max-w-2xl md:space-y-5">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-on-media sm:text-5xl lg:text-6xl">
              Find trusted care,{" "}
              <span className="block sm:inline">Closer to home.</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-on-media-muted sm:text-lg">
              Discover verified caregivers, compare their experience and
              services, and connect with the right provider for your loved one.
            </p>
          </div>

          <div id="hero-waitlist" className="w-full max-w-xl scroll-mt-24">
            <HeroWaitlistCard />
          </div>

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-on-media md:gap-x-5">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck
                aria-hidden
                className="size-5 shrink-0 text-emerald"
              />
              Care, verified.
            </li>
            <li
              aria-hidden
              className="hidden h-4 w-px bg-on-media/40 sm:block"
            />
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
    </section>
  );
}
