"use client";

import { HeartHandshake, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { RoleCard } from "@/features/auth/components/role-card";
import { SignupFlow } from "@/features/auth/components/signup-flow";

export function GetStartedView() {
  const [careseekerSignupOpen, setCareseekerSignupOpen] = useState(false);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-4 py-12 md:px-6 md:py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          Join CareVYA
        </h1>
        <p className="text-sm text-navy/70 sm:text-base">
          How would you like to get started?
        </p>
      </header>

      <div className="grid w-full gap-6 sm:grid-cols-2">
        <RoleCard
          Icon={UserRound}
          title="I'm a Careseeker"
          description="I'm looking for verified, compassionate elder companions, specialized nurses, or vetted caregivers for my family."
          ctaLabel="Sign up as Careseeker"
          onClick={() => setCareseekerSignupOpen(true)}
        />
        <RoleCard
          Icon={HeartHandshake}
          title="I'm a Caregiver"
          description="I'm looking for dignified caregiving work, companion care, or household healthcare roles."
          ctaLabel="Sign up as Caregiver"
          href="/sign-up/caregiver"
        />
      </div>

      <p className="text-sm text-navy/80">
        Already have an account?{" "}
        <Link
          href="/login"
          className="rounded-sm font-semibold text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Log In
        </Link>
      </p>

      <Modal
        isOpen={careseekerSignupOpen}
        onClose={() => setCareseekerSignupOpen(false)}
        className="max-h-[min(92vh,52rem)] max-w-md overflow-y-auto"
      >
        {careseekerSignupOpen ? (
          <SignupFlow key="careseeker-signup-modal" />
        ) : null}
      </Modal>
    </section>
  );
}
