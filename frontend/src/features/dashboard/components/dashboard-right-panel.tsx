"use client";

import { BadgeCheck, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type {
  CareRecipient,
  DashboardAppointment,
} from "@/features/dashboard/types";
import { mockWeekDays } from "@/features/dashboard/data/mock";
import { cn } from "@/lib/utils";

export function DashboardRightPanel({
  recipients,
  appointments,
  selectedDay,
  onSelectDay,
}: {
  recipients: CareRecipient[];
  appointments: DashboardAppointment[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 xl:w-[20rem]">
      <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-navy">Caring for</h2>
        <ul className="mt-3 space-y-2">
          {recipients.map((recipient) => (
            <li key={recipient.id}>
              <Link
                href={`/careseeker/recipients/${recipient.id}`}
                className="flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-surface-soft"
              >
                <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={recipient.avatarUrl}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-navy">
                    {recipient.fullName}
                  </span>
                  <span className="block truncate text-xs text-navy/50">
                    {recipient.relationship}, {recipient.age}, {recipient.area},{" "}
                    {recipient.city}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-navy/35"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/careseeker/care-profile"
          className="mt-3 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
        >
          + Add a Care Recipient
        </Link>
      </section>

      <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-navy">Care Appointments</h2>
          <Link
            href="/careseeker/bookings"
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            View all
          </Link>
        </div>

        <div className="mt-3 flex justify-between gap-1">
          {mockWeekDays.map((day) => {
            const active = day.day === selectedDay;
            return (
              <button
                key={day.day}
                type="button"
                onClick={() => onSelectDay(day.day)}
                className={cn(
                  "flex flex-1 flex-col items-center rounded-xl px-1 py-2 text-center transition-colors",
                  active
                    ? "bg-brand-blue text-white"
                    : "text-navy/60 hover:bg-surface-soft",
                )}
              >
                <span className="text-[0.625rem] font-medium">{day.label}</span>
                <span className="mt-0.5 text-sm font-bold">{day.day}</span>
              </button>
            );
          })}
        </div>

        <ul className="mt-4 space-y-3">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] p-3"
            >
              <p className="text-sm font-semibold text-navy">
                {appointment.title}
              </p>
              <p className="mt-0.5 text-xs text-navy/55">
                {appointment.dateLabel} · {appointment.timeLabel}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="relative size-7 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={appointment.caregiverAvatarUrl}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </span>
                <span className="truncate text-xs font-medium text-navy">
                  {appointment.caregiverName}
                </span>
                <BadgeCheck
                  className="size-3.5 shrink-0 fill-emerald text-white"
                  aria-hidden
                />
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/careseeker/bookings"
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-[#D7E0EA] bg-white text-sm font-semibold text-navy transition-colors hover:bg-surface-soft"
        >
          View all bookings
        </Link>
      </section>
    </aside>
  );
}
