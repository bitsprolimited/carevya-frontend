import Image from "next/image";
import { HomeHeader } from "@/components/shared/home-header";
import { assets } from "@/lib/assets";

export function FaqsHeroSection() {
  return (
    <section className="relative isolate bg-background">
      <div className="relative overflow-hidden bg-scrim">
        <Image
          src={assets.faqsHeroBackground}
          alt="Caregiver hugging an elderly man who is smiling and holding a cane"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_30%] sm:object-[50%_28%] lg:object-center"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-scrim/65 md:bg-scrim/60"
        />

        <div className="relative z-10 flex min-h-[36svh] flex-col md:min-h-[42svh]">
          <HomeHeader variant="solid" />

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-4 text-center md:px-6 md:pb-12">
            <h1 className="font-sans text-[2rem] leading-[1.1] font-bold tracking-tight text-on-media sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              FAQs
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-media/90 sm:mt-4 sm:text-base md:max-w-2xl md:text-lg">
              Clear answers about our vetting, billing security, and local care
              continuity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
