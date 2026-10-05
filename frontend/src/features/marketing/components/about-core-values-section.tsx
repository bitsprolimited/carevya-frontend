import {
  ClipboardCheck,
  Eye,
  HandCoins,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

type ValueCard = {
  title: string;
  body: string;
  Icon: LucideIcon;
  className: string;
};

const values: ValueCard[] = [
  {
    title: "Dignity Above All",
    body: "Every older adult deserves independence, attentive care, and genuine human connection in the comfort of home.",
    Icon: Sparkles,
    className: "lg:col-start-1 lg:row-start-1",
  },
  {
    title: "Transparency",
    body: "Clear caregiver rates, no hidden fees, and honest reviews you can trust.",
    Icon: Eye,
    className: "lg:col-start-2 lg:row-start-1",
  },
  {
    title: "Care Quality",
    body: "A thorough vetting process including background checks and reference verification.",
    Icon: ClipboardCheck,
    className: "lg:col-start-3 lg:row-start-2",
  },
  {
    title: "Fair Compensation",
    body: "Care givers keep more of what they earn, supporting fair pay and sustainable care work.",
    Icon: HandCoins,
    className: "lg:col-start-4 lg:row-start-2",
  },
];

function ValueCardItem({ title, body, Icon, className }: ValueCard) {
  return (
    <article
      className={cn(
        "rounded-3xl bg-surface-soft p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-navy sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
        {body}
      </p>
    </article>
  );
}

export function AboutCoreValuesSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            Our Core Values
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            Built without compromises to protect vulnerable elders and support
            devoted adult children.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
          {values.map((value) => (
            <ValueCardItem key={value.title} {...value} />
          ))}

          <div className="relative min-h-[14rem] overflow-hidden rounded-3xl sm:min-h-[16rem] lg:col-span-2 lg:col-start-3 lg:row-start-1 lg:min-h-0 lg:h-full">
            <Image
              src={assets.aboutCoreValuesPhotoA}
              alt="Younger woman hugging an older woman from behind, both smiling"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div className="relative min-h-[14rem] overflow-hidden rounded-3xl sm:min-h-[16rem] lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:min-h-0 lg:h-full">
            <Image
              src={assets.aboutCoreValuesPhotoB}
              alt="Caregiver in blue scrubs showing a pill organizer to an elderly man in a wheelchair"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
