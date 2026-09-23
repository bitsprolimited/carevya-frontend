"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        "relative w-full max-w-[40rem] overflow-hidden rounded-[2rem] p-6 shadow-2xl sm:p-8 md:rounded-[2.25rem]",
        /* Liquid frosted glass — photo shows through */
        "border border-on-media/25",
        "bg-gradient-to-b from-glass-liquid-top via-glass-liquid-mid to-glass-liquid-bottom",
        "backdrop-blur-2xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-glass-fill",
      )}
    >
      {/* Soft top-left light rim (glass highlight) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-on-media/20 via-transparent to-transparent"
      />
      {/* Subtle bronze depth toward bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-tl from-gold-deep/20 via-transparent to-transparent"
      />

      <form
        className="relative z-10 flex flex-col gap-5 sm:gap-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div
          role="tablist"
          aria-label="Waitlist role"
          className="inline-flex w-fit max-w-full items-center rounded-full bg-glass-deep p-1"
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
                  "rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5 sm:py-2.5",
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

        <div className="flex min-h-14 items-center gap-2 rounded-full bg-on-media p-1.5 pl-4 sm:pl-5">
          <Input
            type="email"
            autoComplete="email"
            placeholder="Enter your email address..."
            aria-invalid={Boolean(form.formState.errors.email)}
            className={cn(
              "h-11 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-navy shadow-none sm:text-base",
              "placeholder:text-muted",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
            {...form.register("email")}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-11 shrink-0 rounded-full px-4 text-sm sm:px-6 sm:text-base"
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

        <div className="pt-1">
          <div
            aria-hidden
            className="h-px w-full bg-gradient-to-r from-on-media/5 via-on-media/35 to-on-media/5"
          />
          <p className="pt-4 text-left text-sm text-on-media sm:pt-5">
            Designed for safer elderly care in Nigeria
          </p>
        </div>
      </form>
    </div>
  );
}
