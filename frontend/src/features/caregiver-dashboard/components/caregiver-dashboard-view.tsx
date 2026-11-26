"use client";

import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Inbox,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import {
  caregiverAppointments,
  caregiverDashboardStats,
  caregiverRecentBookings,
  caregiverRecentMessages,
  type CaregiverBookingStatus,
} from "@/features/caregiver-dashboard/data/mock";
import { cn } from "@/lib/utils";

function statusStyles(status: CaregiverBookingStatus) {
  if (status === "successful") {
    return {
      label: "Successful",
      className: "bg-[#E9F9F1] text-emerald-700",
    };
  }
  if (status === "rejected") {
    return {
      label: "Rejected",
      className: "bg-[#FEECEC] text-danger",
    };
  }
  return {
    label: "Pending",
    className: "bg-[#FFF6E5] text-amber-700",
  };
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
  tone: "rose" | "blue" | "green" | "purple";
}) {
  const tones = {
    rose: {
      card: "bg-[#FDECEE]",
      icon: "bg-white text-[#E45B6B]",
    },
    blue: {
      card: "bg-[#EAF2FF]",
      icon: "bg-white text-brand-blue",
    },
    green: {
      card: "bg-[#EAF8F1]",
      icon: "bg-white text-emerald-600",
    },
    purple: {
      card: "bg-[#F1ECFF]",
      icon: "bg-white text-[#7B61FF]",
    },
  }[tone];

  return (
    <div
      className={cn(
        "flex min-h-[5.5rem] items-center gap-3 rounded-2xl px-4 py-3.5",
        tones.card,
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
          tones.icon,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-bold tracking-tight text-navy sm:text-xl">
          {value}
        </p>
        <p className="text-xs text-navy/55">{label}</p>
      </div>
    </div>
  );
}

export function CaregiverDashboardView() {
  const [searchQuery, setSearchQuery] = useState("");

  const bookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return caregiverRecentBookings;
    return caregiverRecentBookings.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.careType.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title="Overview"
          subtitle="Your schedule and bookings in one place."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Upcoming care"
            value={caregiverDashboardStats.upcomingCare}
            icon={CalendarDays}
            tone="rose"
          />
          <StatCard
            label="New request"
            value={String(caregiverDashboardStats.newRequests)}
            icon={Inbox}
            tone="blue"
          />
          <StatCard
            label="Earnings"
            value={caregiverDashboardStats.earnings}
            icon={CreditCard}
            tone="green"
          />
          <StatCard
            label="Completed bookings"
            value={String(caregiverDashboardStats.completedBookings)}
            icon={ClipboardList}
            tone="purple"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-[#E8EEF5] px-5 py-4">
              <h2 className="text-base font-semibold text-navy">
                Recent bookings
              </h2>
              <Link
                href="/caregiver/bookings"
                className="text-sm font-medium text-brand-blue hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#EEF2F7] text-xs text-navy/45">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Caretype</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Time</th>
                    <th className="px-3 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const status = statusStyles(booking.status);
                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-[#F1F5F9] last:border-0"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="relative size-8 overflow-hidden rounded-full bg-surface-soft">
                              <Image
                                src={booking.avatarUrl}
                                alt=""
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </span>
                            <span className="font-medium text-navy">
                              {booking.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-navy/70">
                          {booking.careType}
                        </td>
                        <td className="px-3 py-3 text-navy/70">{booking.date}</td>
                        <td className="px-3 py-3 text-navy/70">{booking.time}</td>
                        <td className="px-3 py-3 font-medium text-navy">
                          {booking.price}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              status.className,
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-navy">
                  Appointment
                </h2>
                <Link
                  href="/caregiver/schedule"
                  className="text-sm font-medium text-brand-blue hover:underline"
                >
                  View calendar →
                </Link>
              </div>
              <ol className="space-y-4">
                {caregiverAppointments.map((item, index) => (
                  <li key={item.id} className="relative flex gap-3">
                    {index < caregiverAppointments.length - 1 ? (
                      <span
                        className="absolute top-7 left-[5px] h-[calc(100%-0.5rem)] w-px bg-emerald-400"
                        aria-hidden
                      />
                    ) : null}
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-navy/45">
                        {item.dateLabel} · {item.timeRange}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-navy">
                        {item.clientName}
                      </p>
                      <p className="text-xs text-navy/55">{item.careType}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-navy">
                  Recent Messages
                </h2>
                <Link
                  href="/caregiver/messages"
                  className="text-sm font-medium text-brand-blue hover:underline"
                >
                  View all →
                </Link>
              </div>
              <ul className="space-y-4">
                {caregiverRecentMessages.map((message) => (
                  <li key={message.id} className="flex items-start gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand-blue">
                      {message.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-navy">
                          {message.name}
                        </p>
                        <p className="shrink-0 text-[0.6875rem] text-navy/40">
                          {message.timeLabel}
                        </p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-navy/55">
                        {message.preview}
                      </p>
                    </div>
                    {message.unread ? (
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-brand-blue" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </CaregiverShell>
  );
}
