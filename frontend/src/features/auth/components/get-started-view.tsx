"use client";

import { HeartHandshake, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { RoleCard } from "@/features/auth/components/role-card";
import {
  useAuthModalStore,
  type AuthView,
} from "@/features/auth/hooks/use-auth-modal-store";

function isAuthView(value: string | null): value is Exclude<AuthView, null> {
  return value === "login" || value === "signup" || value === "forgot-password";
}

export function GetStartedView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openModal = useAuthModalStore((state) => state.openModal);

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (!isAuthView(auth)) return;

    openModal(auth);
    router.replace("/get-started", { scroll: false });
  }, [openModal, router, searchParams]);

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
          onClick={() => openModal("signup")}
        />
        <RoleCard
          Icon={HeartHandshake}
          title="I'm a Caregiver"
          description="I'm looking for dignified caregiving work, companion care, or household healthcare roles."
          ctaLabel="Sign up as Caregiver"
          onClick={() => {
            window.alert("Caregiver signup is coming soon.");
          }}
        />
      </div>

      <p className="text-sm text-navy/80">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => openModal("login")}
          className="rounded-sm font-semibold text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Log In
        </button>
      </p>

      <AuthModal />
    </section>
  );
}
