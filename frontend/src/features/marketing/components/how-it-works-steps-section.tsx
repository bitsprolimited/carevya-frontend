"use client";

import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";

const steps = [
  {
    step: "Step 1",
    title: "Tell us what you need",
    body: "Start by sharing your care needs, preferences, location and the kind of support you're looking for",
  },
  {
    step: "Step 2",
    title: "Discover trusted care",
    body: "Explore verified caregivers that match your needs, preferences and level of support",
  },
  {
    step: "Step 3",
    title: "Connect before you commit",
    body: "View profiles, ask questions and chat with a caregiver of your choice before making a decision",
  },
  {
    step: "Step 4",
    title: "Choose care with confidence",
    body: "Once you've found the right fit, book your care and move forward knowing you've made an informed choice",
  },
] as const;

export function HowItWorksStepsSection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section className="bg-surface-soft">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
            How CareVYA Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.2]">
            From finding support to choosing with confidence, CareVYA makes
            every step easier
          </h2>
          <Button
            type="button"
            className="mt-7 h-11 rounded-full px-7 text-base sm:mt-8 sm:h-12 sm:px-8"
            onClick={openModal}
          >
            Find Care
          </Button>
        </div>

        <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:mt-16">
          {steps.map(({ step, title, body }) => (
            <li
              key={step}
              className="rounded-3xl bg-background p-6 shadow-sm sm:p-8"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-blue text-on-media">
                <BadgeCheck aria-hidden className="size-5" strokeWidth={2} />
              </span>
              <p className="mt-5 text-sm font-medium text-muted">{step}</p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-navy sm:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
