import Image from "next/image";
import { HomeHeader } from "@/components/shared/home-header";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const fanPhotos = [
  {
    src: assets.aboutHeroFan1,
    alt: "Caregiver supporting an elderly woman using a walker at home",
    className:
      "z-10 -rotate-[14deg] translate-y-4 sm:translate-y-6 lg:translate-y-8",
    size: "h-40 w-[7.25rem] sm:h-56 sm:w-40 md:h-72 md:w-[13rem] lg:h-[19.5rem] lg:w-[13.5rem]",
  },
  {
    src: assets.aboutHeroFan2,
    alt: "Caregiver sitting with an elderly man on a garden bench",
    className:
      "z-20 -rotate-[7deg] -translate-y-1 sm:-translate-y-2",
    size: "h-44 w-32 sm:h-60 sm:w-44 md:h-80 md:w-[14.5rem] lg:h-[21rem] lg:w-[14.5rem]",
  },
  {
    src: assets.aboutHeroFan3,
    alt: "Caregiver with an elderly couple, one seated in a wheelchair",
    className: "z-30 rotate-0 -translate-y-3 sm:-translate-y-5 lg:-translate-y-6",
    size: "h-48 w-36 sm:h-64 sm:w-48 md:h-[22rem] md:w-64 lg:h-[24rem] lg:w-[16.5rem]",
  },
  {
    src: assets.aboutHeroFan4,
    alt: "Caregiver and elderly woman gardening together outdoors",
    className:
      "z-20 rotate-[7deg] -translate-y-1 sm:-translate-y-2",
    size: "h-44 w-32 sm:h-60 sm:w-44 md:h-80 md:w-[14.5rem] lg:h-[21rem] lg:w-[14.5rem]",
  },
  {
    src: assets.aboutHeroFan5,
    alt: "Two caregivers coordinating care notes at a table",
    className:
      "z-10 rotate-[14deg] translate-y-4 sm:translate-y-6 lg:translate-y-8",
    size: "h-40 w-[7.25rem] sm:h-56 sm:w-40 md:h-72 md:w-[13rem] lg:h-[19.5rem] lg:w-[13.5rem]",
  },
] as const;

export function AboutHeroSection() {
  return (
    <section className="bg-background">
      <HomeHeader variant="solid" />

      <div className="mx-auto w-full max-w-5xl px-5 pt-8 pb-4 text-center md:px-6 md:pt-12 lg:pt-14">
        <h1 className="font-sans text-[2rem] leading-[1.15] font-bold tracking-tight text-navy sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
          Born from care, built on trust.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg md:mt-5 md:text-xl">
          Eighteen years of passionately caring for the people who matter most
          to us, every single day.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl overflow-hidden px-2 pb-12 pt-6 sm:px-4 sm:pb-16 sm:pt-8 md:pb-20 lg:pt-10">
        <ul
          aria-label="Care moments"
          className="flex items-end justify-center -space-x-6 sm:-space-x-8 md:-space-x-10 lg:-space-x-12"
        >
          {fanPhotos.map((photo) => (
            <li
              key={photo.src}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-2xl border-[3px] border-background shadow-lg sm:rounded-3xl sm:border-4",
                photo.size,
                photo.className,
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 260px"
                className="object-cover object-center"
                priority
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
