import { Skeleton } from "@/components/ui/skeleton";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";

function TopbarSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 sm:w-56" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-full max-w-sm flex-1 rounded-full sm:w-72" />
        <Skeleton className="hidden size-10 rounded-full lg:block" />
      </div>
    </div>
  );
}

function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 border-b border-[#E8EEF5] py-2 last:border-b-0"
          >
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CaregiverCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}

function LovedOneProfileContentSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading care profile"
    >
      <span className="sr-only">Loading care profile…</span>
      <TopbarSkeleton />

      <div className="mt-5 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="mt-4 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full sm:size-24" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-52 rounded-full" />
          </div>
        </div>
        <div className="mt-5 flex gap-4 border-b border-[#E8EEF5] pb-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-16 sm:w-20" />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <CardSkeleton rows={5} />
          <CardSkeleton rows={3} />
        </div>
        <div className="space-y-5">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={3} />
          <CardSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}

function DashboardHomeContentSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 lg:px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <span className="sr-only">Loading dashboard…</span>
      <TopbarSkeleton />

      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm"
          >
            <Skeleton className="mb-3 size-9 rounded-full" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="mt-2 h-3.5 w-24" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-5 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <CaregiverCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full shrink-0 space-y-4 xl:w-80">
          <CardSkeleton rows={3} />
          <CardSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}

export function FindCareContentSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading caregivers"
    >
      <span className="sr-only">Loading caregivers…</span>
      <TopbarSkeleton />
      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CaregiverCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function BookingsContentSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading bookings"
    >
      <span className="sr-only">Loading bookings…</span>
      <TopbarSkeleton />
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileContentSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <span className="sr-only">Loading profile…</span>
      <TopbarSkeleton />
      <div className="mt-5 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <CardSkeleton rows={3} />
      </div>
    </div>
  );
}

function DashboardPageContentSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading…</span>
      <TopbarSkeleton />
      <div className="mt-5 space-y-4">
        <CardSkeleton rows={5} />
        <CardSkeleton rows={4} />
        <CardSkeleton rows={3} />
      </div>
    </div>
  );
}

export function CareProfileWizardSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading care profile"
    >
      <span className="sr-only">Loading your care profile…</span>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="mt-8 space-y-4 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between gap-3">
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
    </div>
  );
}

export function InlineListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
      className="mt-3 space-y-2"
    >
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#E8EEF5] px-3.5 py-3"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-56 max-w-full" />
        </div>
      ))}
    </div>
  );
}

export function LovedOneProfileSkeleton() {
  return (
    <CareseekerShell>
      <LovedOneProfileContentSkeleton />
    </CareseekerShell>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <CareseekerShell>
      <DashboardHomeContentSkeleton />
    </CareseekerShell>
  );
}

export function DashboardPageSkeleton() {
  return (
    <CareseekerShell>
      <DashboardPageContentSkeleton />
    </CareseekerShell>
  );
}
