"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "@/components/shared/home-header";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { fadeUp, heroTransition, staggerContainer } from "@/lib/motion";
import { assets } from "@/lib/assets";

export function HomeHeroSection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section className="relative isolate bg-background">
      <div className="relative overflow-hidden bg-scrim">
        <Image
          src={assets.homeHeroBackground}
          alt="Caregiver supporting an elderly woman walking with a cane at home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-[72%_center] lg:object-center"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-scrim/55 via-scrim/40 to-scrim/70 md:bg-gradient-to-r md:from-scrim/70 md:via-scrim/35 md:to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-scrim/40 via-transparent to-scrim/25 md:from-scrim/15 md:to-scrim/20"
        />

        <div className="relative z-10 flex min-h-[85svh] flex-col md:min-h-[100svh]">
          <HomeHeader variant="transparent" />

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-5 pb-14 pt-4 md:justify-center md:px-6 md:pb-20 md:pt-4 lg:px-8 xl:px-10">
            <motion.div
              className="max-w-xl space-y-5 md:max-w-2xl md:space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={fadeUp}
                transition={heroTransition}
                className="font-sans text-[2rem] leading-[1.2] font-bold tracking-tight text-on-media sm:text-4xl md:text-5xl md:leading-[1.15] lg:text-[3.5rem] lg:leading-[1.12]"
              >
                Where every elder feels truly cherished and safe at home.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                transition={heroTransition}
                className="max-w-md text-base leading-relaxed text-on-media/90 sm:text-lg md:max-w-lg md:leading-relaxed"
              >
                We connect families / care seekers across Nigeria with verified
                independent caregivers. Structured checks, transparent rates and
                real human warmth.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={heroTransition}
                className="pt-1"
              >
                <Button
                  type="button"
                  size="lg"
                  onClick={openModal}
                  className="h-12 rounded-full px-8 text-base sm:h-14 sm:px-10 sm:text-lg"
                >
                  Get Started Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
