"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useMediaQuery } from "@/hooks/use-media-query";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import { waitlistStatsKey } from "@/features/waitlist/hooks/use-waitlist-stats";
import {
  heroWaitlistSchema,
  type HeroWaitlistInput,
  type WaitlistRole,
} from "@/features/waitlist/types";
// import { cn } from "@/lib/utils";

const roleOptions: { value: WaitlistRole; label: string }[] = [
  { value: "family", label: "Care Seeker" },
  { value: "caregiver", label: "Caregivers" },
];
void roleOptions; // kept for when the role toggle is restored

export function HeroWaitlistCard() {
  const queryClient = useQueryClient();
  // const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<HeroWaitlistInput>({
    resolver: zodResolver(heroWaitlistSchema) as Resolver<HeroWaitlistInput>,
    defaultValues: {
      email: "",
      role: "family",
    },
  });

  const selectedRole = form.watch("role");

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: (res) => {
      // Refresh the real count only for genuinely new signups
      if (!res.meta?.alreadyJoined) {
        queryClient.invalidateQueries({ queryKey: waitlistStatsKey });
      }
      form.reset({ email: "", role: selectedRole });
    },
  });

  const result = mutation.data;
  const alreadyJoined = Boolean(result?.meta?.alreadyJoined);
  const position = result?.data?.position;
  const referralCode = result?.data?.referralCode;

  return (
    <>
      {/* Transparent liquid glass card — temporarily hidden
      <div
        className={cn(
          "relative w-full max-w-[40rem] overflow-hidden rounded-[1.75rem] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6 md:max-w-none md:rounded-[2.25rem] md:p-8",
          "border border-on-media/25",
          "bg-gradient-to-b from-on-media/25 via-on-media/55 to-on-media",
          "backdrop-blur-2xl backdrop-saturate-150",
          "md:border-on-media/25 md:from-glass-liquid-top md:via-glass-liquid-mid md:to-glass-liquid-bottom",
          "md:supports-[backdrop-filter]:bg-glass-fill",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-on-media/30 via-transparent to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden rounded-[inherit] bg-gradient-to-tl from-gold-deep/20 via-transparent to-transparent md:block"
        />
      </div>
      */}

      <form
        className="relative z-10 flex flex-col items-start gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        {/* Role toggle — temporarily hidden
        <div
          role="tablist"
          aria-label="Waitlist role"
          className="inline-flex w-full items-center rounded-full bg-glass-deep p-1 md:w-fit"
        >
          {roleOptions.map((option) => {
            const isActive = selectedRole === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "flex-1 rounded-full px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors md:flex-none md:px-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
                  isActive
                    ? "bg-emerald text-navy shadow-sm"
                    : "bg-transparent text-on-media",
                )}
                onClick={() =>
                  form.setValue("role", option.value, { shouldDirty: true })
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
        */}

        {/* Email field — temporarily hidden
        <div className="flex min-h-12 items-center gap-1.5 rounded-full bg-on-media p-1 pl-3.5 shadow-sm sm:min-h-14 sm:gap-2 sm:p-1.5 sm:pl-5">
          <Input
            type="email"
            autoComplete="email"
            placeholder={
              isDesktop ? "Enter your email address..." : "Enter mail"
            }
            aria-invalid={Boolean(form.formState.errors.email)}
            className={cn(
              "h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-navy shadow-none sm:h-11 sm:text-base",
              "placeholder:text-muted",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
            {...form.register("email")}
          />
        </div>
        */}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-10 shrink-0 rounded-full px-5 text-sm sm:h-11 sm:px-6 sm:text-base md:px-8"
        >
          {mutation.isPending ? "Joining..." : "Join Waitlist"}
        </Button>

        {/*
        {form.formState.errors.email ? (
          <p className="text-xs text-danger" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
        */}

        {mutation.isError ? (
          <p className="text-xs text-danger" role="alert">
            {mutation.error instanceof Error && mutation.error.message
              ? mutation.error.message
              : "Something went wrong. Please try again."}
          </p>
        ) : null}

        {mutation.isSuccess ? (
          <div className="flex flex-col gap-1" role="status">
            <p className="text-xs font-medium text-emerald">
              {alreadyJoined
                ? "You're already on the waitlist."
                : "You're on the waitlist — we'll be in touch."}
            </p>
            {position != null || referralCode ? (
              <p className="text-xs text-navy md:text-on-media">
                {position != null ? `Your position: #${position}` : null}
                {referralCode ? (
                  <>
                    {position != null ? " · " : null}
                    Referral code: <strong>{referralCode}</strong>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Nigeria line — temporarily hidden
        <div className="border-t border-navy/10 pt-3 md:border-on-media/20">
          <p className="text-left text-xs font-medium text-navy md:text-sm md:font-normal md:text-on-media">
            Designed for safer elderly care in Nigeria
          </p>
        </div>
        */}
      </form>
    </>
  );
}

