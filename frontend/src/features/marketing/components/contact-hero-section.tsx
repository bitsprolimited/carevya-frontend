import Image from "next/image";
import { HomeHeader } from "@/components/shared/home-header";
import { assets } from "@/lib/assets";

export function ContactHeroSection() {
  return (
    <section className="relative isolate bg-background">
      <div className="relative overflow-hidden bg-scrim">
        <Image
          src={assets.contactHeroBackground}
          alt="CareVYA support agent smiling while wearing a headset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%] sm:object-center"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-scrim/60 md:bg-scrim/55"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-scrim/65 via-scrim/30 to-scrim/45"
        />

        <div className="relative z-10 flex min-h-[70svh] flex-col md:min-h-[85svh]">
          <HomeHeader variant="transparent" />

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-8 text-center md:px-6 md:pb-20">
            <h1 className="font-sans text-[2.5rem] leading-[1.1] font-bold tracking-tight text-on-media sm:text-5xl md:text-6xl lg:text-[4rem]">
              Contact Us
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-on-media/90 sm:mt-5 sm:text-lg md:max-w-2xl md:text-xl">
              Reach out to us, our team is on standby and ready to help you 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
