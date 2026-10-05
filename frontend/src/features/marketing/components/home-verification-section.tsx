import {
  IdCard,
  ScanFace,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/assets";

const tiers: {
  tier: string;
  title: string;
  body: string;
  Icon: LucideIcon;
}[] = [
  {
    tier: "TIER 01",
    title: "Identity Verification",
    body: "Ensuring every caregiver is who they say they are.",
    Icon: ScanFace,
  },
  {
    tier: "TIER 02",
    title: "Care Skills Check",
    body: "Checking practical care skills and how caregivers handle difficult situations.",
    Icon: IdCard,
  },
  {
    tier: "TIER 03",
    title: "Reference Checks",
    body: "We contact references directly to confirm experience, reliability, and care history.",
    Icon: Users,
  },
  {
    tier: "TIER 04",
    title: "Secure Care",
    body: "Complete our verification process to build trust with families and become eligible for care opportunities.",
    Icon: Shield,
  },
];

export function HomeVerificationSection() {
  return (
    <section id="verification" className="scroll-mt-24 bg-surface-soft">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
            Verification/Trust
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            We verify everything before anyone ever steps through the door.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Every caregiver follows CareVYA&apos;s verification and care
            standards, with ongoing checks for quality and safety.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-7">
            {tiers.map(({ tier, title, body, Icon }) => (
              <li
                key={tier}
                className="rounded-3xl bg-background p-5 shadow-sm sm:p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <p className="mt-4 text-xs font-bold tracking-wide text-navy">
                  {tier}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>

          <div className="relative min-h-[22rem] overflow-hidden rounded-3xl sm:min-h-[28rem] lg:col-span-5 lg:min-h-0">
            <Image
              src={assets.homeVerification}
              alt="Caregiver in blue scrubs smiling with an elderly woman seated with a cane at home"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
