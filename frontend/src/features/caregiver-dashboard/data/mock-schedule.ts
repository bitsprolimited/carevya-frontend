import { assets } from "@/lib/assets";
import type {
  BookingPreferences,
  ScheduleBookingBlock,
  SchedulePatient,
  TimeOffEntry,
  WeeklyVisitRow,
} from "@/features/caregiver-dashboard/types/schedule";

/** Demo "today" so the October 2026 calendar matches the designs. */
export const SCHEDULE_DEMO_TODAY = "2026-10-13";

export const schedulePatients: SchedulePatient[] = [
  {
    id: "folake",
    firstName: "Folake",
    fullName: "Folake Adebayo",
    relation: "Mother",
    avatarUrl: assets.homeTestimonialAvatarA,
    accent: "pink",
  },
  {
    id: "musa",
    firstName: "Musa",
    fullName: "Musa Adebayo",
    relation: "Father",
    avatarUrl: assets.homeTestimonialAvatarB,
    accent: "green",
  },
];

export const scheduleBookingBlocks: ScheduleBookingBlock[] = [
  {
    id: "cv-2041",
    reference: "#CV-2041",
    patientId: "folake",
    arrangement: "Live-in",
    startDate: "2026-10-15",
    endDate: "2026-11-14",
    startTimeLabel: "8AM",
  },
  {
    id: "cv-2048",
    reference: "#CV-2048",
    patientId: "musa",
    arrangement: "Live-in",
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    startTimeLabel: "10AM",
  },
];

export const weeklyVisitRows: WeeklyVisitRow[] = [
  { day: "Mon", slots: ["Morning", "Afternoon"] },
  { day: "Tue", slots: ["Morning", "Afternoon"] },
  { day: "Wed", slots: ["Afternoon"] },
  { day: "Thu", slots: ["Morning", "Afternoon"] },
  { day: "Fri", slots: ["Morning", "Afternoon", "Evening", "Night"] },
  { day: "Sat", slots: ["Afternoon", "Evening", "Night"] },
  { day: "Sun", slots: [] },
];

export const bookingPreferences: BookingPreferences = {
  areas: ["Yaba", "Surulere", "Ebute Metta", "Akoka"],
  travel: "Up to 10 km from Yaba",
  liveIn: "Up to 3 months at a time",
  arrangements: ["Live-in", "Full day", "Overnight"],
};

export const timeOffSeed: TimeOffEntry[] = [
  {
    id: "christmas",
    reason: "Christmas break",
    startDate: "2026-12-24",
    endDate: "2026-12-26",
  },
];

export function parseScheduleDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatScheduleDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatScheduleDayLabel(value: string): string {
  const date = parseScheduleDate(value);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatScheduleRangeLabel(start: string, end: string): string {
  const startDate = parseScheduleDate(start);
  const endDate = parseScheduleDate(end);
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const startMonth = startDate.toLocaleDateString("en-GB", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-GB", { month: "short" });

  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDay} – ${endDay} ${endMonth}`;
  }

  return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

export function inclusiveDayCount(start: string, end: string): number {
  const startMs = parseScheduleDate(start).getTime();
  const endMs = parseScheduleDate(end).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) {
    return 0;
  }
  return Math.floor((endMs - startMs) / 86_400_000) + 1;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function buildMonthCells(year: number, monthIndex: number): Array<Date | null> {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // Monday-first grid
  const mondayIndex = (first.getDay() + 6) % 7;
  const cells: Array<Date | null> = Array.from({ length: mondayIndex }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}
