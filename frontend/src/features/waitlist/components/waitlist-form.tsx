"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import {
  useWaitlistStats,
  waitlistStatsKey,
} from "@/features/waitlist/hooks/use-waitlist-stats";
import {
  waitlistJoinSchema,
  type WaitlistJoinInput,
} from "@/features/waitlist/types";

const defaults: WaitlistJoinInput = {
  email: "",
  location: "",
  role: "family",
};

export function WaitlistForm() {
  const queryClient = useQueryClient();
  const { data: stats } = useWaitlistStats();

  const form = useForm<WaitlistJoinInput>({
    resolver: zodResolver(waitlistJoinSchema) as Resolver<WaitlistJoinInput>,
    defaultValues: defaults,
  });

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: (res) => {
      // Refresh the real count after a genuinely new signup
      if (!res.meta?.alreadyJoined) {
        queryClient.invalidateQueries({ queryKey: waitlistStatsKey });
      }
      form.reset(defaults);
    },
  });

  if (mutation.isSuccess) {
    const { data, meta, message } = mutation.data;
    const position = data?.position; // fixed: no top-level fallback
    return (
      <div className="flex w-full flex-col gap-2" role="status">
        <p className="text-sm font-medium">
          {meta?.alreadyJoined
            ? meta.roleChanged
              ? "You're already on the list. We've updated your details."
              : "You're already on the list."
            : message}
        </p>
        {position != null || data?.referralCode ? (
          <p className="text-xs text-muted">
            {position != null ? `Your position: #${position}` : null}
            {data?.referralCode ? (
              <>
                {" · Referral code: "}
                <strong>{data.referralCode}</strong>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    );
  }

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
       {stats ? `Join over ${stats.total} on the waitlist already! ` : ""}
          Starting in Nigeria.
        </p>

      {mutation.isError ? (
        <p className="text-xs text-danger" role="alert">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Something went wrong. Please try again."}
        </p>
      ) : null}
    </form>
  );
}