"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import type { CaregiverBookingListStatus } from "@/features/caregiver-dashboard/data/mock-bookings";
import { useCaregiverBookingsStore } from "@/features/caregiver-dashboard/hooks/use-caregiver-bookings-store";
import { cn } from "@/lib/utils";

export function CaregiverBookingsView() {
  const items = useCaregiverBookingsStore((state) => state.items);
  const [tab, setTab] = useState<CaregiverBookingListStatus>("in_progress");

  const upcoming = items.find((item) => item.isUpcomingFeatured) ?? items[0];
  const counts = useMemo(
    () => ({
      in_progress: items.filter((item) => item.listStatus === "in_progress")
        .length,
      completed: items.filter((item) => item.listStatus === "completed").length,
    }),
    [items],
  );

  const rows = items.filter((item) => item.listStatus === tab);

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title="Bookings"
          subtitle="Confirmed care, agreed prices and history in one place."
          showSearch={false}
        />

        {upcoming ? (
          <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={upcoming.patientAvatarUrl}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-bold text-navy">
                      {upcoming.patientName}
                    </p>
                    <Link
                      href={`/caregiver/bookings/${upcoming.id}`}
                      className="text-sm font-semibold text-brand-blue hover:underline"
                    >
                      {upcoming.reference}
                    </Link>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-navy/55">
                    <span>Booked by {upcoming.bookedByName}</span>
                    <span className="inline-flex rounded-full bg-[#EEF2F7] px-2 py-0.5 text-xs font-medium text-navy/60">
                      {upcoming.bookedByRelation}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/caregiver/messages"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-semibold text-navy hover:bg-surface-soft"
                >
                  Message {upcoming.bookedByName.split(" ")[0]}
                </Link>
                <Link
                  href={`/caregiver/bookings/${upcoming.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-brand-blue px-4 text-sm font-semibold text-white hover:bg-brand-blue-hover"
                >
                  View booking
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Arrangement", value: upcoming.arrangement },
                { label: "Duration", value: upcoming.datesLabel },
                { label: "Starts", value: upcoming.startsLabel },
                { label: "Agreed price", value: upcoming.agreedPriceLabel },
                { label: "Location", value: upcoming.location },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-[#F5F7FB] px-3.5 py-3"
                >
                  <p className="text-xs text-navy/45">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex items-center gap-5 border-b border-[#E8EEF5]">
          {(
            [
              {
                id: "in_progress" as const,
                label: "In progress",
                count: counts.in_progress,
              },
              {
                id: "completed" as const,
                label: "Completed",
                count: counts.completed,
              },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "border-b-2 pb-3 text-sm font-medium transition-colors",
                  active
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-navy/50 hover:text-navy",
                )}
              >
                {item.label} ({item.count})
              </button>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EEF2F7] text-xs tracking-wide text-navy/45 uppercase">
                  <th className="px-5 py-3 font-medium">Cared for</th>
                  <th className="px-3 py-3 font-medium">Care</th>
                  <th className="px-3 py-3 font-medium">Dates</th>
                  <th className="px-3 py-3 font-medium">Agreed price</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Review</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-[#F1F5F9] last:border-0"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/caregiver/bookings/${booking.id}`}
                        className="flex items-center gap-3"
                      >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand-blue">
                          {booking.patientInitials}
                        </span>
                        <span>
                          <span className="block font-semibold text-navy">
                            {booking.patientName}, {booking.patientAge}
                          </span>
                          <span className="mt-0.5 block text-xs text-navy/50">
                            Booked by {booking.bookedByName}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-medium text-navy">{booking.careLabel}</p>
                      <p className="text-xs text-navy/50">
                        {booking.careDurationLabel}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-navy/70">
                      {booking.datesLabel}
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-semibold text-navy">
                        {booking.agreedPriceLabel}
                      </p>
                      <p className="text-xs text-navy/45">{booking.priceNote}</p>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          booking.listStatus === "completed"
                            ? "bg-[#E9F9F1] text-emerald-700"
                            : "bg-[#FFF6E5] text-amber-700",
                        )}
                      >
                        {booking.listStatus === "completed"
                          ? "Completed"
                          : "In progress"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {booking.reviewRating != null ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy">
                          <Star
                            className="size-3.5 fill-amber-400 text-amber-400"
                            aria-hidden
                          />
                          {booking.reviewRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-navy/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </CaregiverShell>
  );
}
