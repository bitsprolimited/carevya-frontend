export type ScheduleDayPart = "Morning" | "Afternoon" | "Evening" | "Night";

export type ScheduleWeekday =
  | "Mon"
  | "Tue"
  | "Wed"
  | "Thu"
  | "Fri"
  | "Sat"
  | "Sun";

export type SchedulePatient = {
  id: string;
  firstName: string;
  fullName: string;
  relation: string;
  avatarUrl: string;
  accent: "pink" | "green";
};

export type ScheduleBookingBlock = {
  id: string;
  reference: string;
  patientId: string;
  arrangement: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTimeLabel: string;
};

export type WeeklyVisitRow = {
  day: ScheduleWeekday;
  slots: ScheduleDayPart[];
};

export type BookingPreferences = {
  areas: string[];
  travel: string;
  liveIn: string;
  arrangements: string[];
};

export type TimeOffEntry = {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
};
