import { BadgeCheck, Home, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/assets";

const pillars: {
  title: string;
  body: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Dignified Independence",
    body: "Keep your loved one comfortable at home with care that adapts to their routines, preferences, and family life.",
    Icon: Home,
  },
  {
    title: "Trust",
    body: "Replacing opaque broker agencies with transparent vetting, rates, and accountability families can actually see.",
    Icon: BadgeCheck,
  },
];

export function AboutMissionSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
              Purpose & Vision
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              Our Mission
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              To give families peace of mind by connecting them with trusted
              caregivers who provide compassionate, reliable support so every
              loved one can age safely, comfortably, and happily at home.
            </p>

            <h3 className="mt-10 text-2xl font-bold tracking-tight text-navy sm:mt-12 sm:text-3xl">
              Pillars
            </h3>
            <ul className="mt-5 space-y-4 sm:mt-6">
              {pillars.map(({ title, body, Icon }) => (
                <li
                  key={title}
                  className="rounded-3xl bg-surface-soft p-5 sm:p-6"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <h4 className="mt-4 text-lg font-bold text-navy sm:text-xl">
                    {title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-[5/6] lg:sticky lg:top-24 lg:aspect-auto lg:min-h-[32rem]">
            <Image
              src={assets.homeWhyCarevya}
              alt="Caregiver holding hands with an elderly woman while a child plays with a stethoscope nearby"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
