"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "@/components/shared/home-header";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { fadeUp, heroTransition, staggerContainer } from "@/lib/motion";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function HowItWorksHeroSection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section className="relative isolate bg-background">
      <div className="relative overflow-hidden bg-scrim">
        <Image
          src={assets.howItWorksHeroBackground}
          alt="Caregiver holding hands and talking with an elderly woman on a sofa at home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-scrim/55 md:bg-scrim/50"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-scrim/60 via-scrim/25 to-scrim/40"
        />

        <div className="relative z-10 flex min-h-[85svh] flex-col md:min-h-[100svh]">
          <HomeHeader variant="solid" />
          <motion.div
            className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-8 text-center md:px-6 md:pb-20"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              transition={heroTransition}
              className="font-sans text-[2.25rem] leading-[1.15] font-bold tracking-tight text-on-media sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.1]"
            >
              Quality Care made Simple
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={heroTransition}
              className="mt-5 max-w-xl text-base leading-relaxed text-on-media/90 sm:text-lg md:mt-6 md:max-w-2xl md:text-xl"
            >
              Whether you are looking for care or providing care, CareVYA makes
              the process easy, safe and stress free
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={heroTransition}
              className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
            >
              <Button
                type="button"
                size="lg"
                onClick={openModal}
                className="h-12 rounded-full px-8 text-base sm:h-14 sm:px-10 sm:text-lg"
              >
                Find Care
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={openModal}
                className={cn(
                  "h-12 rounded-full border-2 border-brand-blue bg-transparent px-8 text-base text-brand-blue shadow-none",
                  "hover:bg-brand-blue/10 hover:text-brand-blue",
                  "sm:h-14 sm:px-10 sm:text-lg",
                )}
              >
                Become a Caregiver
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
