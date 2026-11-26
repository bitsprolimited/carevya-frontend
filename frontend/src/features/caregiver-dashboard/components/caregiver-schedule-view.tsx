"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AddTimeOffModal } from "@/features/caregiver-dashboard/components/add-time-off-modal";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import {
  bookingPreferences,
  buildMonthCells,
  formatScheduleDateKey,
  formatScheduleRangeLabel,
  parseScheduleDate,
  SCHEDULE_DEMO_TODAY,
  scheduleBookingBlocks,
  schedulePatients,
  timeOffSeed,
  weeklyVisitRows,
} from "@/features/caregiver-dashboard/data/mock-schedule";
import type {
  ScheduleBookingBlock,
  SchedulePatient,
  TimeOffEntry,
} from "@/features/caregiver-dashboard/types/schedule";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const accentStyles = {
  pink: {
    cell: "bg-[#FCE7F3] text-[#9D174D]",
    chip: "bg-[#FBCFE8] text-[#9D174D]",
  },
  green: {
    cell: "bg-[#DCFCE7] text-[#166534]",
    chip: "bg-[#BBF7D0] text-[#166534]",
  },
} as const;

function patientFor(id: string): SchedulePatient | undefined {
  return schedulePatients.find((patient) => patient.id === id);
}

function AcceptingToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Accepting new requests"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-emerald" : "bg-[#D7E0EA]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
          aria-hidden
        />
      </button>
      <span className="text-sm font-medium text-navy">
        Accepting new requests
      </span>
    </label>
  );
}

function ScheduleFilter({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const selectedPatient =
    selectedId === "all" ? null : patientFor(selectedId);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D7E0EA] bg-white px-3 text-sm font-semibold text-navy shadow-sm hover:bg-surface-soft"
      >
        <span className="relative size-6 overflow-hidden rounded-full bg-surface-soft">
          {selectedPatient ? (
            <Image
              src={selectedPatient.avatarUrl}
              alt=""
              fill
              sizes="24px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-[0.625rem] font-bold text-navy/50">
              All
            </span>
          )}
        </span>
        {selectedPatient ? selectedPatient.firstName : "All Schedules"}
        <ChevronDown className="size-4 text-navy/45" aria-hidden />
      </button>

      {open ? (
        <div
          id={menuId}
          role="listbox"
          aria-label="Schedule filter"
          className="absolute left-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white py-2 shadow-lg"
        >
          <p className="px-4 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wide text-navy/40">
            Caring for
          </p>
          <button
            type="button"
            role="option"
            aria-selected={selectedId === "all"}
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[#F8FAFC]",
              selectedId === "all" && "bg-[#EAF2FF]",
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#EEF2F7] text-xs font-bold text-navy/55">
              All
            </span>
            <span className="min-w-0 flex-1 font-semibold text-navy">
              All Schedules
            </span>
            {selectedId === "all" ? (
              <Check className="size-4 text-brand-blue" aria-hidden />
            ) : null}
          </button>
          {schedulePatients.map((patient) => {
            const selected = selectedId === patient.id;
            return (
              <button
                key={patient.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(patient.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[#F8FAFC]",
                  selected && "bg-[#EAF2FF]",
                )}
              >
                <span className="relative size-9 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={patient.avatarUrl}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-navy">
                    {patient.fullName}
                  </span>
                  <span className="block text-xs text-navy/45">
                    {patient.relation}
                  </span>
                </span>
                {selected ? (
                  <Check className="size-4 text-brand-blue" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function dayBookings(
  dateKey: string,
  filterId: string,
  bookings: ScheduleBookingBlock[],
) {
  return bookings.filter((booking) => {
    if (filterId !== "all" && booking.patientId !== filterId) return false;
    return booking.startDate <= dateKey && dateKey <= booking.endDate;
  });
}

function startChipForDay(
  dateKey: string,
  filterId: string,
  bookings: ScheduleBookingBlock[],
) {
  return bookings.find((booking) => {
    if (filterId !== "all" && booking.patientId !== filterId) return false;
    return booking.startDate === dateKey;
  });
}

export function CaregiverScheduleView() {
  const demoToday = parseScheduleDate(SCHEDULE_DEMO_TODAY);
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(demoToday.getFullYear(), demoToday.getMonth(), 1),
  );
  const [filterId, setFilterId] = useState("all");
  const [accepting, setAccepting] = useState(true);
  const [timeOff, setTimeOff] = useState<TimeOffEntry[]>(timeOffSeed);
  const [addOpen, setAddOpen] = useState(false);

  const monthLabel = monthCursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(
    () => buildMonthCells(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor],
  );

  const visibleBookings = useMemo(
    () =>
      filterId === "all"
        ? scheduleBookingBlocks
        : scheduleBookingBlocks.filter(
            (booking) => booking.patientId === filterId,
          ),
    [filterId],
  );

  const primaryLiveIn =
    visibleBookings.find((booking) => booking.arrangement === "Live-in") ??
    visibleBookings[0] ??
    null;

  const weeklyPaused = Boolean(primaryLiveIn);

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title="Schedule & Availability"
          subtitle="Careseekers see your availability. Live-in bookings block dates."
          showSearch={false}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ScheduleFilter selectedId={filterId} onChange={setFilterId} />
          <AcceptingToggle checked={accepting} onChange={setAccepting} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
          <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-navy">{monthLabel}</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() =>
                    setMonthCursor(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1,
                        ),
                    )
                  }
                  className="inline-flex size-9 items-center justify-center rounded-full text-navy/55 hover:bg-surface-soft hover:text-navy"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() =>
                    setMonthCursor(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1,
                        ),
                    )
                  }
                  className="inline-flex size-9 items-center justify-center rounded-full text-navy/55 hover:bg-surface-soft hover:text-navy"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="px-1 pb-1 text-center text-[0.6875rem] font-semibold uppercase tracking-wide text-navy/40"
                >
                  {day}
                </div>
              ))}

              {cells.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="min-h-20" />;
                }

                const dateKey = formatScheduleDateKey(date);
                const isToday = dateKey === SCHEDULE_DEMO_TODAY;
                const isFree = dateKey === "2026-10-14";
                const covering = dayBookings(dateKey, filterId, scheduleBookingBlocks);
                const startBooking = startChipForDay(
                  dateKey,
                  filterId,
                  scheduleBookingBlocks,
                );
                const startPatient = startBooking
                  ? patientFor(startBooking.patientId)
                  : null;
                const blocked = covering.length > 0 && !startBooking;
                const timeOffHit = timeOff.some(
                  (entry) =>
                    entry.startDate <= dateKey && dateKey <= entry.endDate,
                );

                return (
                  <div
                    key={dateKey}
                    className={cn(
                      "flex min-h-20 flex-col rounded-xl border px-1.5 py-1.5 sm:min-h-[5.5rem] sm:px-2 sm:py-2",
                      isToday
                        ? "border-brand-blue bg-white"
                        : startBooking && startPatient
                          ? cn(
                              "border-transparent",
                              accentStyles[startPatient.accent].cell,
                            )
                          : blocked
                            ? "border-transparent bg-[#EAF2FF]"
                            : timeOffHit
                              ? "border-transparent bg-[#F3F4F6]"
                              : "border-[#E8EEF5] bg-white",
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isToday ? "text-brand-blue" : "text-navy",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      {isFree ? (
                        <span className="size-1.5 rounded-full bg-emerald" />
                      ) : null}
                    </div>

                    {isToday ? (
                      <p className="mt-1 text-[0.625rem] font-semibold text-brand-blue">
                        Today
                      </p>
                    ) : null}

                    {isFree ? (
                      <p className="mt-auto text-[0.625rem] font-semibold text-emerald">
                        Free
                      </p>
                    ) : null}

                    {startBooking && startPatient ? (
                      <p
                        className={cn(
                          "mt-auto line-clamp-2 rounded-md px-1 py-0.5 text-[0.625rem] font-semibold leading-tight",
                          accentStyles[startPatient.accent].chip,
                        )}
                      >
                        {startPatient.firstName}, {startBooking.arrangement} ·{" "}
                        {startBooking.startTimeLabel}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E8EEF5] pt-4 text-xs text-navy/55">
              {primaryLiveIn ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-[#EAF2FF] ring-1 ring-[#D7E0EA]" />
                  Booked (live-in {primaryLiveIn.reference},{" "}
                  {formatScheduleRangeLabel(
                    primaryLiveIn.startDate,
                    primaryLiveIn.endDate,
                  )}
                  )
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <span className="relative size-3 rounded-sm bg-white ring-1 ring-[#D7E0EA]">
                  <span className="absolute top-0.5 right-0.5 size-1 rounded-full bg-emerald" />
                </span>
                Free for visits
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm bg-white ring-2 ring-brand-blue" />
                Today
              </span>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-navy">Weekly visits</h3>
                <button
                  type="button"
                  onClick={() =>
                    appToast.message("Weekly visit editing coming soon")
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit
                </button>
              </div>

              {weeklyPaused && primaryLiveIn ? (
                <div className="mt-3 rounded-xl bg-[#FFF7ED] px-3 py-2.5 text-xs leading-relaxed text-[#9A3412]">
                  Paused during your live-in booking (
                  {formatScheduleRangeLabel(
                    primaryLiveIn.startDate,
                    primaryLiveIn.endDate,
                  )}
                  ).
                </div>
              ) : null}

              <ul className="mt-3 space-y-2">
                {weeklyVisitRows.map((row) => (
                  <li
                    key={row.day}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span className="w-10 shrink-0 font-semibold text-navy">
                      {row.day}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-right text-navy/60",
                        row.slots.length === 0 && "text-navy/35",
                      )}
                    >
                      {row.slots.length === 0
                        ? "Off"
                        : row.slots.join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-bold text-navy">Booking preferences</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Areas
                  </dt>
                  <dd className="mt-1 text-navy/70">
                    {bookingPreferences.areas.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Travel
                  </dt>
                  <dd className="mt-1 text-navy/70">{bookingPreferences.travel}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Live-in
                  </dt>
                  <dd className="mt-1 text-navy/70">{bookingPreferences.liveIn}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Arrangements
                  </dt>
                  <dd className="mt-1 text-navy/70">
                    {bookingPreferences.arrangements.join(", ")}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-navy">Time off</h3>
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                >
                  <Plus className="size-3.5" aria-hidden />
                  Add
                </button>
              </div>

              <ul className="mt-3 space-y-2.5">
                {timeOff.length === 0 ? (
                  <li className="text-sm text-navy/45">No time off scheduled.</li>
                ) : (
                  timeOff.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] px-3 py-2.5"
                    >
                      <CalendarDays
                        className="mt-0.5 size-4 shrink-0 text-brand-blue"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy">
                          {entry.reason}
                        </p>
                        <p className="text-xs text-navy/50">
                          {formatScheduleRangeLabel(
                            entry.startDate,
                            entry.endDate,
                          )}
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <AddTimeOffModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        bookings={scheduleBookingBlocks}
        onAdd={({ reason, startDate, endDate }) => {
          const id = `time-off-${Date.now()}`;
          setTimeOff((current) => [
            { id, reason, startDate, endDate },
            ...current,
          ]);
          setAddOpen(false);
          appToast.success(
            `Time off added · careseekers can’t book you ${formatScheduleRangeLabel(startDate, endDate)}`,
          );
        }}
      />
    </CaregiverShell>
  );
}
