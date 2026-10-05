"use client";

import { ClipboardCheck, Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { assets } from "@/lib/assets";

const badges = [
  { label: "100% Identity Screened", Icon: ShieldCheck },
  { label: "Confidentiality", Icon: Lock },
  { label: "Clinical Reference Checks", Icon: ClipboardCheck },
] as const;

export function HomeWhySection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section id="why-carevya" className="scroll-mt-24 bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
              Why CareVYA
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              Care tailored to your loved one&apos;s routines, mobility, and
              everyday needs.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Finding the right person to care for someone you love is a big
              decision. CareVYA gives you the information you need to get to
              know your caregiver, understand their experience, and feel
              confident before care begins.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
              {badges.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3.5 py-2 text-sm font-medium text-emerald-dark"
                >
                  <Icon aria-hidden className="size-4 shrink-0" />
                  {label}
                </li>
              ))}
            </ul>

            <Button
              type="button"
              className="mt-8 h-12 rounded-full px-8 text-base shadow-sm"
              onClick={openModal}
            >
              Meet CareVYA
            </Button>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[5/4] lg:aspect-auto lg:min-h-[28rem]">
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
