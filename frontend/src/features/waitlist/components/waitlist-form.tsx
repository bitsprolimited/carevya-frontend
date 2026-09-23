"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import {
  waitlistJoinSchema,
  type WaitlistJoinInput,
} from "@/features/waitlist/types";

export function WaitlistForm() {
  const increment = useWaitlistStore((state) => state.increment);
  const count = useWaitlistStore((state) => state.count);

  const form = useForm<WaitlistJoinInput>({
    resolver: zodResolver(waitlistJoinSchema) as Resolver<WaitlistJoinInput>,
    defaultValues: {
      email: "",
      location: "",
      role: "family",
    },
  });

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      increment();
      form.reset({ email: "", location: "", role: "family" });
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <Input
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        aria-invalid={Boolean(form.formState.errors.email)}
        {...form.register("email")}
      />
      {form.formState.errors.email ? (
        <p className="text-xs text-danger" role="alert">
          {form.formState.errors.email.message}
        </p>
      ) : null}

      <Input
        type="text"
        autoComplete="address-level2"
        placeholder="Enter your location..."
        aria-invalid={Boolean(form.formState.errors.location)}
        {...form.register("location")}
      />
      {form.formState.errors.location ? (
        <p className="text-xs text-danger" role="alert">
          {form.formState.errors.location.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-full sm:w-auto"
      >
        {mutation.isPending ? "Joining..." : "Join Waitlist"}
      </Button>

      <p className="text-xs text-muted">
        Join over {count}+ on the waitlist already! Starting in Nigeria.
      </p>

      {mutation.isError ? (
        <p className="text-xs text-danger" role="alert">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
