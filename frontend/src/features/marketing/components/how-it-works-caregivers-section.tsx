"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const caregiverSteps = [
  {
    step: "Step 1",
    title: "Create Your Profile",
    body: "Caregivers sign up and create a professional profile with their experience, qualifications, care specialties, availability, and service area",
  },
  {
    step: "Step 2",
    title: "Get Verified",
    body: "CareVYA verifies the caregiver's identity and relevant credentials before their profile becomes discoverable",
  },
  {
    step: "Step 3",
    title: "Apply for Care role",
    body: "Choose to apply from the list of care role that is closer to you and match your care type.",
  },
  {
    step: "Step 4",
    title: "Get Hired",
    body: "Get hired by existing care role application and start earning income.",
  },
] as const;

export function HowItWorksCaregiversSection() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <section className="bg-surface-soft">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase sm:normal-case sm:tracking-normal sm:text-sm sm:font-semibold">
            For Caregivers
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.2]">
            Simple Steps every caregiver undergoes before getting listed on
            CareVYA
          </h2>
          <Button
            type="button"
            className="mt-7 h-11 rounded-full px-7 text-base sm:mt-8 sm:h-12 sm:px-8"
            onClick={openModal}
          >
            Become a Caregiver
          </Button>
        </div>

        <div className="mt-12 grid items-stretch gap-8 sm:mt-14 lg:mt-16 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="relative min-h-[22rem] overflow-hidden rounded-3xl sm:min-h-[28rem] lg:min-h-full">
            <Image
              src={assets.howItWorksCaregivers}
              alt="Caregiver in blue scrubs smiling with an elderly woman seated with a cane at home"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <ol className="flex flex-col justify-center">
            {caregiverSteps.map(({ step, title, body }, index) => {
              const isLast = index === caregiverSteps.length - 1;
              return (
                <li key={step} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5">
                  <div className="relative flex w-12 shrink-0 flex-col items-center">
                    <span
                      className="relative z-10 flex size-8 items-center justify-center rounded-full border-[3px] border-brand-blue bg-background"
                      aria-hidden
                    >
                      <span className="size-3 rounded-full bg-brand-blue" />
                    </span>
                    {!isLast ? (
                      <span
                        aria-hidden
                        className="absolute top-8 bottom-0 w-px border-l-2 border-dashed border-brand-blue/50"
                      />
                    ) : null}
                  </div>
                  <div className={cn("min-w-0 flex-1", !isLast && "pb-1")}>
                    <p className="text-sm font-medium text-muted">{step}</p>
                    <h3 className="mt-1 text-lg font-bold tracking-tight text-navy sm:text-xl">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                      {body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
