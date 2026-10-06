"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNigeriaLocations } from "@/features/waitlist/hooks/use-nigeria-locations";
import { waitlistStatsKey } from "@/features/waitlist/hooks/use-waitlist-stats";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import {
  waitlistJoinSchema,
  type WaitlistJoinInput,
  type WaitlistRole,
} from "@/features/waitlist/types";
import { ApiError } from "@/lib/api";
import { duration, easeOutExpo, fadeIn, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const roleOptions: {
  value: WaitlistRole;
  label: string;
  Icon: typeof User;
}[] = [
  { value: "care_seeker", label: "Care Seeker", Icon: User },
  { value: "caregiver", label: "Caregivers", Icon: Users },
];

const defaults: WaitlistJoinInput = {
  role: "care_seeker",
  fullName: "",
  email: "",
  phone: "",
  state: "",
  lga: "",
};

const fieldShell =
  "flex h-12 w-full items-center gap-2.5 rounded-2xl border border-glass-field-border bg-glass-field px-3.5 text-sm text-on-media placeholder:text-on-media/55 focus-within:border-on-media/60";

function normalizePhone(raw: string) {
  const p = raw.replace(/[\s()-]/g, "");
  if (p.startsWith("+")) return p;
  if (p.startsWith("234")) return `+${p}`;
  if (p.startsWith("0")) return `+234${p.slice(1)}`;
  return p;
}


function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const body = err.body;
    if (
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string" &&
      body.message
    ) {
      return body.message;
    }
    return "Something went wrong. Please try again.";
  }
  if (err instanceof TypeError) {
    return "Network error. Please check your connection and try again.";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

export function WaitlistModal() {
  const titleId = useId();
  const queryClient = useQueryClient();
  const isOpen = useWaitlistStore((s) => s.isModalOpen);
  const closeModal = useWaitlistStore((s) => s.closeModal);
  const locationsQuery = useNigeriaLocations();

  const form = useForm<WaitlistJoinInput>({
    resolver: zodResolver(waitlistJoinSchema) as Resolver<WaitlistJoinInput>,
    defaultValues: defaults,
  });

  const selectedRole = form.watch("role");
  const selectedState = form.watch("state");
  const stateOptions = locationsQuery.data?.states ?? [];
  const lgas = selectedState
    ? (locationsQuery.data?.lgasByState[selectedState] ?? [])
    : [];
  const locationsLoading = locationsQuery.isPending;
  const locationsFailed = locationsQuery.isError;

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: (res) => {
      if (!res.meta?.alreadyJoined) {
        queryClient.invalidateQueries({ queryKey: waitlistStatsKey });
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) {
      form.reset(defaults);
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when modal opens/closes
  }, [isOpen]);

  const result = mutation.data;
  const alreadyJoined = Boolean(result?.meta?.alreadyJoined);
  const position = result?.data?.position;
  const referralCode = result?.data?.referralCode;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="presentation"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: duration.fast, ease: easeOutExpo }}
        >
          <motion.button
            type="button"
            aria-label="Close waitlist modal"
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: duration.base, ease: easeOutExpo }}
            className={cn(
              "relative z-10 flex max-h-[min(92svh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem]",
              "border border-on-media/30 bg-glass-modal shadow-2xl",
              "backdrop-blur-2xl backdrop-saturate-150",
            )}
          >
        <button
          type="button"
          aria-label="Close"
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 inline-flex size-9 items-center justify-center rounded-full bg-on-media/15 text-on-media transition-colors hover:bg-on-media/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="overflow-y-auto px-5 pt-8 pb-6 sm:px-7 sm:pt-9 sm:pb-7">
          <div className="pr-8 text-center">
            <h2
              id={titleId}
              className="text-2xl font-bold tracking-tight text-on-media sm:text-[1.65rem]"
            >
              Join the Waitlist
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-media/75">
              Be the first to know when we&apos;re ready to support you or your
              loved ones.
            </p>
          </div>

          {mutation.isSuccess ? (
            <div
              className="mt-8 flex flex-col items-center gap-3 text-center"
              role="status"
            >
              <p className="text-sm font-medium text-on-media">
                {alreadyJoined
                  ? "You're already on the waitlist."
                  : (result?.message ??
                    "You're on the waitlist — we'll be in touch.")}
              </p>
              {position != null || referralCode ? (
                <p className="text-xs text-on-media/75">
                  {position != null ? `Your position: #${position}` : null}
                  {referralCode ? (
                    <>
                      {position != null ? " · " : null}
                      Referral code: <strong>{referralCode}</strong>
                    </>
                  ) : null}
                </p>
              ) : null}
              <Button
                type="button"
                onClick={closeModal}
                className="mt-2 h-11 rounded-full bg-brand-blue px-6 text-on-media hover:bg-brand-blue-hover"
              >
                Done
              </Button>
            </div>
          ) : (
            <form
              className="mt-6 flex flex-col gap-3.5"
              onSubmit={form.handleSubmit((values) =>
                mutation.mutate({
                  ...values,
                  phone: normalizePhone(values.phone),
                }),
              )}
              noValidate
            >
              <div
                role="tablist"
                aria-label="Waitlist role"
                className="mx-auto inline-flex w-full max-w-sm items-center rounded-full bg-glass-deep p-1"
              >
                {roleOptions.map(({ value, label, Icon }) => {
                  const isActive = selectedRole === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={cn(
                        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
                        isActive
                          ? "bg-brand-blue text-on-media shadow-sm"
                          : "bg-transparent text-on-media",
                      )}
                      onClick={() =>
                        form.setValue("role", value, { shouldDirty: true })
                      }
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </div>
              {form.formState.errors.role ? (
                <p className="text-xs text-danger" role="alert">
                  {form.formState.errors.role.message}
                </p>
              ) : null}

              <label className={fieldShell}>
                <User className="size-4 shrink-0 text-on-media/70" aria-hidden />
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Full Name"
                  aria-invalid={Boolean(form.formState.errors.fullName)}
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-on-media outline-none placeholder:text-on-media/55"
                  {...form.register("fullName")}
                />
              </label>
              {form.formState.errors.fullName ? (
                <p className="text-xs text-danger" role="alert">
                  {form.formState.errors.fullName.message}
                </p>
              ) : null}

              <label className={fieldShell}>
                <Mail className="size-4 shrink-0 text-on-media/70" aria-hidden />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-on-media outline-none placeholder:text-on-media/55"
                  {...form.register("email")}
                />
              </label>
              {form.formState.errors.email ? (
                <p className="text-xs text-danger" role="alert">
                  {form.formState.errors.email.message}
                </p>
              ) : null}

              <label className={fieldShell}>
                <Phone className="size-4 shrink-0 text-on-media/70" aria-hidden />
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="Phone Number"
                  aria-invalid={Boolean(form.formState.errors.phone)}
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-on-media outline-none placeholder:text-on-media/55"
                  {...form.register("phone")}
                />
              </label>
              {form.formState.errors.phone ? (
                <p className="text-xs text-danger" role="alert">
                  {form.formState.errors.phone.message}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                {locationsLoading ? (
                  <div
                    className="col-span-2 grid grid-cols-2 gap-3"
                    role="status"
                    aria-live="polite"
                    aria-label="Loading location options"
                  >
                    <span className="sr-only">Loading location options…</span>
                    <Skeleton className="h-12 w-full rounded-2xl bg-on-media/20" />
                    <Skeleton className="h-12 w-full rounded-2xl bg-on-media/15" />
                  </div>
                ) : (
                  <>
                    <div className="min-w-0">
                      <Controller
                        name="state"
                        control={form.control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={stateOptions}
                            value={field.value}
                            onChange={(next) => {
                              field.onChange(next);
                              form.setValue("lga", "");
                            }}
                            placeholder="State"
                            aria-label="State"
                            disabled={locationsFailed}
                            invalid={Boolean(form.formState.errors.state)}
                            emptyMessage={
                              locationsFailed
                                ? "Couldn’t load states"
                                : "No matches"
                            }
                            icon={
                              <MapPin
                                className="size-4 shrink-0 text-on-media/70"
                                aria-hidden
                              />
                            }
                          />
                        )}
                      />
                      {form.formState.errors.state ? (
                        <p className="mt-1 text-xs text-danger" role="alert">
                          {form.formState.errors.state.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <Controller
                        name="lga"
                        control={form.control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={lgas}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="LGA"
                            aria-label="LGA"
                            disabled={locationsFailed || !selectedState}
                            invalid={Boolean(form.formState.errors.lga)}
                            emptyMessage={
                              locationsFailed
                                ? "Couldn’t load LGAs"
                                : selectedState
                                  ? "No matches"
                                  : "Select a state first"
                            }
                            icon={
                              <Building2
                                className="size-4 shrink-0 text-on-media/70"
                                aria-hidden
                              />
                            }
                          />
                        )}
                      />
                      {form.formState.errors.lga ? (
                        <p className="mt-1 text-xs text-danger" role="alert">
                          {form.formState.errors.lga.message}
                        </p>
                      ) : null}
                    </div>
                  </>
                )}
              </div>

              {locationsFailed ? (
                <p className="text-center text-xs text-danger" role="alert">
                  Couldn’t load Nigerian states. Check your connection and try
                  again.
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 h-12 w-full rounded-full bg-brand-blue text-base text-on-media hover:bg-brand-blue-hover"
              >
                {mutation.isPending ? "Joining..." : "Join Waitlist"}
                <ArrowRight className="size-4" aria-hidden />
              </Button>

              {mutation.isPending ? (
                <p className="text-center text-xs text-on-media/70">
                  This can take a few seconds
                </p>
              ) : null}

              {mutation.isError ? (
                <p className="text-center text-xs text-danger" role="alert">
                  {getErrorMessage(mutation.error)}
                </p>
              ) : null}
            </form>
          )}
        </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}