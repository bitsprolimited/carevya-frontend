"use client";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CARE_PROFILE_STEPS } from "@/features/care-profile/types";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function CareProfileShell({
  stepIndex = 0,
  isReviewing = false,
  hideProgress = false,
  reviewTitle,
  onSelectStep,
  children,
}: {
  stepIndex?: number;
  isReviewing?: boolean;
  hideProgress?: boolean;
  reviewTitle?: string;
  onSelectStep?: (index: number) => void;
  children: ReactNode;
}) {
  const stepNumber = stepIndex + 1;

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <header className="border-b border-[#E2E8F0] bg-white">
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
            <Link href="/get-started" className="hover:text-brand-blue-hover">
              Save &amp; exit
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {!hideProgress ? (
          isReviewing ? (
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                {reviewTitle ?? "Review your care profile"}
              </h1>
              <p className="mt-2 text-sm text-navy/60">
                Check the details below to make changes before you finish setup.
              </p>
            </div>
          ) : (
            <div className="mb-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <p className="font-semibold text-brand-blue">
                Step {stepNumber} of {CARE_PROFILE_STEPS.length}
              </p>
              <p className="text-navy/55">Takes about 3 minutes</p>
            </div>
          )
        ) : null}

        {!hideProgress ? (
          <nav
            aria-label="Care profile steps"
            className="mb-6 overflow-x-auto border-b border-[#E2E8F0]"
          >
            <ol className="flex min-w-max gap-5 sm:gap-6">
              {CARE_PROFILE_STEPS.map((step, index) => {
                const active = index === stepIndex;
                const done = !isReviewing && index < stepIndex;
                const clickable = Boolean(isReviewing && onSelectStep);

                return (
                  <li key={step.id}>
                    {clickable ? (
                      <button
                        type="button"
                        onClick={() => onSelectStep?.(index)}
                        className={cn(
                          "inline-flex whitespace-nowrap border-b-2 pb-3 text-xs font-medium sm:text-sm",
                          active
                            ? "border-brand-blue text-brand-blue"
                            : "border-transparent text-navy/45 hover:text-navy/70",
                        )}
                      >
                        {step.label}
                      </button>
                    ) : (
                      <span
                        className={cn(
                          "inline-block whitespace-nowrap border-b-2 pb-3 text-xs font-medium sm:text-sm",
                          active
                            ? "border-brand-blue text-navy"
                            : done
                              ? "border-transparent text-navy/70"
                              : "border-transparent text-navy/40",
                        )}
                      >
                        {step.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8">
          {children}
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-navy/55">
          <ShieldCheck
            className="size-3.5 shrink-0 text-emerald-600"
            aria-hidden
          />
          Your details are private and only shared with caregivers you choose to
          book.
        </p>
      </main>
    </div>
  );
}
