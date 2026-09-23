import Image from "next/image";
import {
  Check,
  Gem,
  Handshake,
  Users,
  type LucideIcon,
} from "lucide-react";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

type CommunityFeature = {
  title: string;
  description: string;
};

type CommunityBlock = {
  id: "families" | "caregivers";
  theme: "blue" | "green";
  Icon: LucideIcon;
  labelDesktop: string;
  labelMobile: string;
  title: string;
  body: string;
  features: readonly CommunityFeature[];
  waitlist: string;
  waitlistMobile: string;
  imageSrc: string;
  imageAlt: string;
};

const communities: readonly CommunityBlock[] = [
  {
    id: "families",
    theme: "blue",
    Icon: Users,
    labelDesktop: "FOR FAMILIES & CARESEEKERS",
    labelMobile: "FOR FAMILIES & RELATIVES",
    title: "Compassion you can lean on",
    body: "Whether you live far away, work long hours, or manage care from abroad, stay informed and confident every day.",
    features: [
      {
        title: "Daily Welfare Logs",
        description:
          "Your caregiver tracks your medication, meals, and mood, with updates synced to your phone.",
      },
      {
        title: "Replacement Guarantee",
        description:
          "If your caregiver is unwell, a trusted backup steps in to keep your care going.",
      },
      {
        title: "Direct Family Advisor",
        description:
          "A Caregiver to help you find the right care and make adjustments.",
      },
    ],
    waitlist: "50+ Care Seekers joined CareVYA's waitlist",
    waitlistMobile: "50+ Families joined CareVYA's waitlist",
    imageSrc: assets.communityFamily,
    imageAlt:
      "A multi-generational family laughing together outdoors",
  },
  {
    id: "caregivers",
    theme: "green",
    Icon: Handshake,
    labelDesktop: "FOR PROFESSIONAL CAREGIVERS",
    labelMobile: "FOR PROFESSIONAL CARERS",
    title: "Dignity & Fair compensation",
    body: "Choose your schedule, set your rates, and work with families who value your skills.",
    features: [
      {
        title: "Guaranteed Payment",
        description: "No chasing payments. Get paid for every work you do.",
      },
      {
        title: "Safety & Check-in Support",
        description:
          "Emergency support and family checks before every home placement.",
      },
    ],
    waitlist: "30+ Caregivers joined CareVYA's waitlist",
    waitlistMobile: "30+ Caregivers joined CareVYA's waitlist",
    imageSrc: assets.communityCaregiver,
    imageAlt:
      "A smiling caregiver in scrubs brushing an elderly woman's hair",
  },
] as const;

const themeMap = {
  blue: {
    label: "text-brand-blue",
    iconWrap: "bg-brand-blue/10 text-brand-blue",
    check: "bg-emerald text-on-media",
    footer: "bg-surface-lavender",
    footerIcon: "bg-brand-blue text-on-media",
  },
  green: {
    label: "text-emerald-dark",
    iconWrap: "bg-emerald/15 text-emerald-dark",
    check: "bg-emerald text-on-media",
    footer: "bg-emerald/10",
    footerIcon: "bg-emerald-dark text-on-media",
  },
} as const;

function CommunityCard({ block }: { block: CommunityBlock }) {
  const theme = themeMap[block.theme];
  const { Icon } = block;

  return (
    <article
      id={block.id === "families" ? "for-you" : "for-me"}
      className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-background p-5 shadow-sm sm:rounded-[1.75rem] sm:p-6 md:p-7"
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11",
            theme.iconWrap,
          )}
        >
          {block.id === "caregivers" ? (
            <>
              <Gem aria-hidden className="size-5 lg:hidden" />
              <Icon aria-hidden className="hidden size-5 lg:block" />
            </>
          ) : (
            <Icon aria-hidden className="size-5" />
          )}
        </span>
        <div>
          <p
            className={cn(
              "text-[0.65rem] font-bold tracking-[0.12em] uppercase sm:text-xs",
              theme.label,
            )}
          >
            <span className="lg:hidden">{block.labelMobile}</span>
            <span className="hidden lg:inline">{block.labelDesktop}</span>
          </p>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold tracking-tight text-navy sm:text-2xl">
        {block.title}
      </h3>
      <p className="mt-2 hidden text-sm leading-relaxed text-muted lg:block lg:text-[0.95rem]">
        {block.body}
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-4">
        {block.features.map((feature) => (
          <li key={feature.title} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                theme.check,
              )}
            >
              <Check aria-hidden className="size-3 stroke-[3]" />
            </span>
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-bold text-navy">{feature.title}: </span>
              {feature.description}
            </p>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-6 flex items-center gap-3 rounded-2xl px-3.5 py-3 sm:px-4",
          theme.footer,
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            theme.footerIcon,
          )}
        >
          <Users aria-hidden className="size-4" />
        </span>
        <p className="text-sm font-semibold text-navy">
          <span className="lg:hidden">{block.waitlistMobile}</span>
          <span className="hidden lg:inline">{block.waitlist}</span>
        </p>
      </div>
    </article>
  );
}

function CommunityImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/5] h-full min-h-[280px] overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] lg:aspect-auto lg:min-h-[28rem]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

export function OneStandardSection() {
  const families = communities[0];
  const caregivers = communities[1];

  if (!families || !caregivers) {
    return null;
  }

  return (
    <section
      id="one-standard"
      className="bg-surface-soft px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.14em] text-brand-blue uppercase">
            Two Communities • One Standard
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy md:text-3xl lg:text-[2.15rem]">
            Built with equal respect for families &amp; caregivers
          </h2>
        </div>

        {/*
          Mobile order: card → image → card → image
          Desktop zigzag: card | image / image | card
        */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:gap-6 lg:grid-cols-2 lg:gap-7">
          <div className="order-1 lg:order-1">
            <CommunityCard block={families} />
          </div>
          <div className="order-2 lg:order-2">
            <CommunityImage
              src={families.imageSrc}
              alt={families.imageAlt}
              priority
            />
          </div>
          <div className="order-4 lg:order-3">
            <CommunityImage
              src={caregivers.imageSrc}
              alt={caregivers.imageAlt}
            />
          </div>
          <div className="order-3 lg:order-4">
            <CommunityCard block={caregivers} />
          </div>
        </div>
      </div>
    </section>
  );
}
