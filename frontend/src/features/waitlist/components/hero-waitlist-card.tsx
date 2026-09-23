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
    <div className="w-full max-w-xl rounded-3xl border border-on-media/15 bg-glass p-4 shadow-2xl backdrop-blur-xl sm:p-5 md:rounded-[1.75rem] md:p-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div
          role="tablist"
          aria-label="Waitlist role"
          className="inline-flex w-full max-w-sm rounded-full bg-glass-deep p-1"
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
                  "flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
                  isActive
                    ? "bg-emerald text-navy"
                    : "bg-transparent text-on-media hover:text-on-media",
                )}
                onClick={() => form.setValue("role", option.value, { shouldDirty: true })}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:rounded-full sm:bg-white sm:p-1.5">
          <Input
            type="email"
            autoComplete="email"
            placeholder="Enter your email address..."
            aria-invalid={Boolean(form.formState.errors.email)}
            className={cn(
              "h-12 rounded-full border-0 bg-white px-5 text-navy shadow-none",
              "placeholder:text-muted",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              "sm:flex-1 sm:bg-transparent",
            )}
            {...form.register("email")}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-12 shrink-0 rounded-full px-6 sm:px-5"
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
      </form>

      <p className="-mx-4 -mb-4 mt-4 rounded-b-3xl bg-on-media px-4 py-3 text-center text-xs font-medium text-navy sm:mx-0 sm:mb-0 sm:mt-4 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:text-on-media md:rounded-[1.75rem]">
        Designed for safer elderly care in Nigeria
      </p>
    </div>
  );
}
