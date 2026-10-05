import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const steps = [
  {
    index: "01",
    title: "Discover",
    body: "Share your loved one's routines, care needs, preferences, and the support they need.",
  },
  {
    index: "02",
    title: "Vetting & Match",
    body: "We verify qualifications, background checks, references, and match you with 2–3 vetted caregiver profiles.",
  },
  {
    index: "03",
    title: "Care Chemistry Session",
    body: "Meet caregiver in person for a relaxed, no-obligation 30-minute introduction to see if it feels like the right fit.",
  },
  {
    index: "04",
    title: "Daily Peace of Mind",
    body: "Verified check-ins, care logs, real-time family updates, and secure payments.",
  },
] as const;

const stats = [
  { value: "36", label: "Care givers Onboarded" },
  { value: "100%", label: "Background verified" },
  { value: "4.9/5", label: "Average family rating" },
  { value: "98%", label: "Caregiver retention rate year-over-year" },
] as const;

export function HomeHowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="flex flex-col justify-center lg:col-span-4">
            <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
              How CareVYA Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              From the first call to everyday peace of mind.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              A thoughtful care-matching process built on transparent
              verification, type of care needed and location of Careseeker.
            </p>
            <p className="mt-5 flex items-start gap-2.5 text-sm font-medium text-muted md:text-base">
              <span
                aria-hidden
                className="mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-blue"
              />
              Checked in person. Transparent. Results-driven.
            </p>
            <div className="mt-8">
              <Link
                href="#how-it-works-process"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-full bg-brand-blue px-7 text-base font-semibold text-white shadow-sm",
                  "transition-colors hover:bg-brand-blue-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                See How It Works
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ol
              id="how-it-works-process"
              className="scroll-mt-28 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-6"
            >
              {steps.map((step) => (
                <li key={step.index} className="flex flex-col">
                  <span className="text-4xl font-bold tracking-tight text-brand-blue/35 sm:text-[2.75rem]">
                    {step.index}
                  </span>
                  <span
                    aria-hidden
                    className="my-2.5 h-10 w-px border-l border-dashed border-brand-blue/45"
                  />
                  <h3 className="text-base font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-3xl sm:mt-12 md:aspect-[2/1]">
              <Image
                src={assets.homeHowItWorks}
                alt="Caregiver in blue scrubs holding hands and laughing with an elderly woman in a wheelchair at home"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-blue to-footer">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-on-media/25 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-8 text-center md:px-6 md:py-10",
              )}
            >
              <p className="text-3xl font-bold tracking-tight text-on-media sm:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 max-w-[11rem] text-xs leading-snug text-on-media/90 sm:text-sm md:max-w-none">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
