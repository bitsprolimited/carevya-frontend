"use client";

import { ArrowRight, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import { cn } from "@/lib/utils";

type TimelineStatus = "completed" | "in_progress" | "pending";

function formatSubmittedAt(iso: string | null): string {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(",", " ·");
}

function StatusPill({ status }: { status: TimelineStatus }) {
  const label =
    status === "completed"
      ? "Completed"
      : status === "in_progress"
        ? "In progress"
        : "Pending";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
        status === "completed" && "bg-emerald-50 text-emerald-700",
        status === "in_progress" && "bg-[#E8F1FF] text-brand-blue",
        status === "pending" && "bg-[#FFF4E8] text-[#C67A2F]",
      )}
    >
      {label}
    </span>
  );
}

function TimelineIcon({ status }: { status: TimelineStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full border-2 border-[#C9D3E0] bg-white">
        <span className="size-2.5 rounded-full bg-navy/55" />
      </span>
    );
  }

  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full border-2 border-[#D7DEE8] bg-white">
      <Circle className="size-2 text-transparent" aria-hidden />
    </span>
  );
}

export function SuccessStep({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  const draft = useCaregiverOnboardingStore((state) => state.draft);
  const submittedAt = useCaregiverOnboardingStore((state) => state.submittedAt);
  const applicationStatus = useCaregiverOnboardingStore(
    (state) => state.applicationStatus,
  );
  const rejectionReason = useCaregiverOnboardingStore(
    (state) => state.rejectionReason,
  );

  const firstName = draft.firstName.trim() || "there";
  const area = draft.workAreas[0] || "your area";
  const referenceNames = draft.references
    .slice(0, 2)
    .map((ref) => `${ref.title} ${ref.fullName}`.trim())
    .filter(Boolean);

  const referenceCopy =
    referenceNames.length >= 2
      ? `We'll call ${referenceNames[0]} and ${referenceNames[1]}`
      : referenceNames.length === 1
        ? `We'll call ${referenceNames[0]}`
        : "We'll call your listed references";

  const steps: {
    title: string;
    detail: string;
    status: TimelineStatus;
  }[] = [
    {
      title: "Profile Submitted",
      detail: formatSubmittedAt(submittedAt),
      status: "completed",
    },
    {
      title: "NIN Verification",
      detail: "In progress · usually within 24 hours",
      status: "in_progress",
    },
    {
      title: "Reference calls",
      detail: referenceCopy,
      status: "pending",
    },
    {
      title: "Background Check",
      detail: "Starts after your references are confirmed",
      status: "pending",
    },
    {
      title: "Profile is Live",
      detail: `Careseekers near ${area} can now find, message and book you`,
      status: "pending",
    },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span
          className="relative inline-flex size-16 items-center justify-center"
          aria-hidden
        >
          <span className="absolute inset-0 rounded-[1.35rem] bg-emerald-100" />
          <span className="relative inline-flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100">
            <Check className="size-6" strokeWidth={3} />
          </span>
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]">
          You&apos;re all set, {firstName}! 🎉
        </h1>
        <p className="mt-2 max-w-md text-sm text-navy/60">
          Checks take 5 to 7 working days. Don&apos;t worry, we&apos;ll notify
          you on WhatsApp and Email as you progress
        </p>
      </div>

      {applicationStatus === "rejected" ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700"
        >
          <p className="font-semibold">
            Your application wasn&apos;t approved.
          </p>
          {rejectionReason ? <p className="mt-1">{rejectionReason}</p> : null}
        </div>
      ) : null}

      <ol className="mt-8 space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const next = steps[index + 1];
          const lineDone = step.status === "completed";

          return (
            <li key={step.title} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className={cn(
                    "absolute top-7 left-[13px] h-[calc(100%-1.25rem)] w-px",
                    lineDone && next?.status === "completed"
                      ? "bg-emerald-500"
                      : lineDone
                        ? "bg-gradient-to-b from-emerald-500 to-[#D7DEE8]"
                        : "border-l border-dashed border-[#D7DEE8]",
                  )}
                  aria-hidden
                />
              ) : null}

              <div className="relative z-10 shrink-0">
                <TimelineIcon status={step.status} />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        step.status === "pending" ? "text-navy/55" : "text-navy",
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-navy/50">{step.detail}</p>
                  </div>
                  <StatusPill status={step.status} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <Button
        type="button"
        onClick={onGoToDashboard}
        className="mt-8 h-12 w-full rounded-full text-[0.9375rem]"
      >
        Go to Dashboard
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
