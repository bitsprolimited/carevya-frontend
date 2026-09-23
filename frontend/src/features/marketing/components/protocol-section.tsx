"use client";

import { Filter, QrCode } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const protocolSteps = [
  {
    id: "find",
    index: "01",
    label: "FIND THE RIGHT CARE",
    title: "Care that fits your family",
    body: "Connect with carers matched to your loved one's care needs, from mobility support and companionship to specialised and live-in care.",
    callout: "Filter by neighborhood and medical competencies.",
  },
  {
    id: "verify",
    index: "02",
    label: "VETTING & TRUST",
    title: "Verified before they meet your family",
    body: "Multi-layer checks — identity, background, skills, and interviews — so every connection starts from trust.",
    callout: "Guaranteed verification on every CareVYA provider.",
  },
  {
    id: "connect",
    index: "03",
    label: "CONNECT WITH PEACE",
    title: "Stay close to every care moment",
    body: "Tools that keep families informed and carers supported throughout the care journey.",
    callout: "Care logs, updates, and direct family access.",
  },
] as const;

export function ProtocolSection() {
  const [active, setActive] = useState(0);
  const step = protocolSteps[active] ?? protocolSteps[0];

  return (
    <section
      id="protocol"
      className="bg-background px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-14 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs font-bold tracking-[0.14em] text-brand-blue uppercase">
          The CareVYA Protocol
        </p>
        <h2 className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-navy md:text-3xl lg:text-4xl">
          Find, verify and connect with care you can trust.
        </h2>

        <article className="mt-8 rounded-2xl border border-border bg-background p-5 shadow-sm md:mt-10 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-bold tracking-wide text-brand-blue uppercase">
              {step.index} • {step.label}
            </p>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
              <QrCode aria-hidden className="size-4" />
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-navy md:text-2xl">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
            {step.body}
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-lavender px-4 py-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald/15 text-emerald-dark">
              <Filter aria-hidden className="size-3.5" />
            </span>
            <p className="text-sm font-medium text-navy">{step.callout}</p>
          </div>
        </article>

        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Protocol steps"
        >
          {protocolSteps.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show step ${item.index}: ${item.label}`}
                className={cn(
                  "size-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "bg-navy" : "bg-border hover:bg-muted",
                )}
                onClick={() => setActive(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
