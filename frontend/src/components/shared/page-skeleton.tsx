import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div
      className="flex flex-col"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading…</span>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-scrim">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-scrim/80 via-scrim/55 to-scrim/75 md:bg-gradient-to-r md:from-scrim/85 md:via-scrim/50 md:to-scrim/40"
        />

        <div className="relative z-10 flex min-h-[85svh] flex-col md:min-h-[100svh]">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] md:px-6 lg:px-8 xl:px-10">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-9 rounded-full bg-on-media/20 sm:size-10" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-20 bg-on-media/25" />
                <Skeleton className="h-2.5 w-28 bg-on-media/15" />
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Skeleton className="h-9 w-36 rounded-full bg-on-media/20" />
              <Skeleton className="h-10 w-28 rounded-full bg-on-media/25" />
            </div>
            <Skeleton className="size-9 rounded-md bg-on-media/20 md:hidden" />
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-5 pb-14 pt-4 md:justify-center md:px-6 md:pb-20 lg:px-8 xl:px-10">
            <div className="max-w-xl space-y-5 md:max-w-2xl md:space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-9 w-full max-w-lg bg-on-media/25 sm:h-11 md:h-12" />
                <Skeleton className="h-9 w-[88%] max-w-md bg-on-media/20 sm:h-11 md:h-12" />
                <Skeleton className="h-9 w-[70%] max-w-sm bg-on-media/15 sm:h-11 md:h-12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-md bg-on-media/15" />
                <Skeleton className="h-4 w-[92%] max-w-sm bg-on-media/10" />
                <Skeleton className="h-4 w-[75%] max-w-xs bg-on-media/10" />
              </div>
              <Skeleton className="h-12 w-40 rounded-full bg-on-media/25" />
            </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="bg-background px-5 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-10">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Skeleton className="mx-auto h-8 w-56 md:h-9 md:w-72" />
            <Skeleton className="mx-auto h-4 w-full max-w-md" />
            <Skeleton className="mx-auto h-4 w-3/4 max-w-sm" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 rounded-2xl border border-border/60 bg-surface-soft/40 p-5"
              >
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-[90%]" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface-soft/50 px-5 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl flex-1 space-y-3">
            <Skeleton className="h-8 w-64 md:h-9" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>
          <Skeleton className="h-12 w-44 rounded-full" />
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-border/50 bg-footer px-5 py-10 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-full bg-on-media/15" />
            <Skeleton className="h-4 w-24 bg-on-media/20" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-3 w-16 bg-on-media/10" />
            <Skeleton className="h-3 w-16 bg-on-media/10" />
            <Skeleton className="h-3 w-16 bg-on-media/10" />
            <Skeleton className="h-3 w-16 bg-on-media/10" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-5 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading…</span>
      <div className="w-full max-w-md space-y-6">
        <div className="mx-auto space-y-3 text-center">
          <Skeleton className="mx-auto size-12 rounded-full" />
          <Skeleton className="mx-auto h-7 w-40" />
          <Skeleton className="mx-auto h-4 w-56" />
        </div>
        <div className="space-y-3 rounded-2xl border border-border/60 bg-surface-soft/40 p-6">
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
