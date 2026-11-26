"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CAREGIVER_ONBOARDING_STEPS } from "@/features/caregiver-onboarding/types";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function CaregiverOnboardingShell({
  stepIndex = 0,
  onSaveAndLogout,
  hideStepper = false,
  bare = false,
  children,
}: {
  stepIndex?: number;
  onSaveAndLogout?: () => void;
  hideStepper?: boolean;
  /** Review-style layout: no card chrome around children */
  bare?: boolean;
  children: ReactNode;
}) {
  const stepNumber = stepIndex + 1;
  const progress = ((stepIndex + 1) / CAREGIVER_ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="relative size-8 overflow-hidden">
              <Image
                src={assets.logo}
                alt=""
                fill
                sizes="32px"
                className="object-contain"
              />
            </span>
            <span className="text-lg font-bold tracking-tight text-navy">
              <span className="text-brand-blue">Care</span>VYA
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium text-brand-blue">
            <Link href="/contact" className="hover:text-brand-blue-hover">
              Need help?
            </Link>
            {onSaveAndLogout ? (
              <button
                type="button"
                onClick={onSaveAndLogout}
                className="hover:text-brand-blue-hover"
              >
                Save &amp; Logout
              </button>
            ) : (
              <Link href="/get-started" className="hover:text-brand-blue-hover">
                Save &amp; Logout
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pt-24 pb-8 sm:px-6 sm:pb-10">
        {!hideStepper ? (
          <div
            className={cn(
              "mb-6",
              "lg:sticky lg:top-16 lg:z-40 lg:bg-[#F5F7FB] lg:pt-1",
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <p className="font-semibold text-brand-blue">
                Step {stepNumber} of {CAREGIVER_ONBOARDING_STEPS.length}
              </p>
              <p className="text-navy/55">Takes about 10 minutes</p>
            </div>

            <div
              className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-brand-blue transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <nav
              aria-label="Caregiver onboarding steps"
              className="overflow-x-auto border-b border-[#E2E8F0] bg-[#F5F7FB]"
            >
              <ol className="flex min-w-max gap-5 sm:gap-6">
                {CAREGIVER_ONBOARDING_STEPS.map((step, index) => {
                  const active = index === stepIndex;
                  const done = index < stepIndex;

                  return (
                    <li key={step.id}>
                      <span
                        className={cn(
                          "inline-block whitespace-nowrap border-b-2 pb-3 text-xs font-medium sm:text-sm",
                          active
                            ? "border-brand-blue font-semibold text-navy"
                            : done
                              ? "border-transparent text-navy/70"
                              : "border-transparent text-navy/40",
                        )}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        ) : null}

        {bare ? (
          children
        ) : (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
