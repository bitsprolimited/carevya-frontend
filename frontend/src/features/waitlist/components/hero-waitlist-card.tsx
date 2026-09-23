"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import {
  heroWaitlistSchema,
  type HeroWaitlistInput,
  type WaitlistRole,
} from "@/features/waitlist/types";
import { cn } from "@/lib/utils";

const roleOptions: { value: WaitlistRole; label: string }[] = [
  { value: "family", label: "Care Seeker" },
  { value: "caregiver", label: "Caregivers" },
];

export function HeroWaitlistCard() {
  const increment = useWaitlistStore((state) => state.increment);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    onSuccess: () => {
      increment();
      form.reset({ email: "", role: selectedRole });
    },
  });

  return (
    <div
      className={cn(
        "relative w-full max-w-[40rem] overflow-hidden rounded-[1.75rem] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6 md:max-w-none md:rounded-[2.25rem] md:p-8",
        "border border-on-media/30",
        /* Mobile: frosts into white section below; desktop: warm liquid glass */
        "bg-gradient-to-b from-on-media/20 via-on-media/35 to-on-media/85",
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

      <form
        className="relative z-10 flex flex-col gap-4 sm:gap-5 md:gap-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
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

        <div className="flex min-h-12 items-center gap-1.5 rounded-full bg-on-media p-1 pl-3.5 sm:min-h-14 sm:gap-2 sm:p-1.5 sm:pl-5">
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
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-10 shrink-0 rounded-full px-3 text-xs sm:h-11 sm:px-5 sm:text-sm md:px-6 md:text-base"
          >
            {mutation.isPending ? "Joining..." : "Join Waitlist"}
          </Button>
        </div>

        {form.formState.errors.email ? (
          <p className="text-xs text-danger" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}

        {mutation.isError ? (
          <p className="text-xs text-danger" role="alert">
            Something went wrong. Please try again.
          </p>
        ) : null}

        {mutation.isSuccess ? (
          <p className="text-xs font-medium text-emerald" role="status">
            You&apos;re on the waitlist — we&apos;ll be in touch.
          </p>
        ) : null}

        <p className="text-center text-xs font-medium text-navy md:text-left md:text-sm md:font-normal md:text-on-media">
          Designed for safer elderly care in Nigeria
        </p>
      </form>
    </div>
  );
}
