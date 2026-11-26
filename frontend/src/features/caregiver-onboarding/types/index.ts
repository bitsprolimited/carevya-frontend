export const CAREGIVER_ONBOARDING_STEPS = [
  { id: "about", label: "About you" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "availability", label: "Availability" },
  { id: "rates", label: "Pricing" },
  { id: "verification", label: "Verification" },
] as const;

export type CaregiverOnboardingStepId =
  (typeof CAREGIVER_ONBOARDING_STEPS)[number]["id"];

export const CAREGIVER_LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
] as const;

export type CaregiverLanguage =
  (typeof CAREGIVER_LANGUAGE_OPTIONS)[number];

/** The API only accepts `male` | `female`. */
export const CAREGIVER_GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
] as const;

export const CAREGIVER_CARE_TYPE_OPTIONS = [
  {
    value: "non_clinical",
    title: "Non-Clinical care",
    description:
      "Companionship, Comfort and Daily routine support, Personal care assistance, Meal assistance and Careseeker communication.",
  },
  {
    value: "clinical",
    title: "Clinical care",
    description:
      "Nursing care, clinical monitoring, Medication administration, Symptom management and Wound care.",
  },
  {
    value: "personal_specialized",
    title: "Personal & Specialized care",
    description:
      "Mobility assistance, Daily routine support, Supervision, Monitoring & Reporting changes and Medication reminders.",
  },
] as const;

export type CaregiverCareType =
  (typeof CAREGIVER_CARE_TYPE_OPTIONS)[number]["value"];

export type CaregiverChoice = { value: string; label: string };

/** Fallback chip source; `GET /onboarding/caregiver/application/options` wins when available. */
export const CAREGIVER_SPECIALTY_OPTIONS: readonly CaregiverChoice[] = [
  { value: "companionship", label: "Companionship" },
  { value: "elderly_care", label: "Elderly care" },
  { value: "emergency_care", label: "Emergency Care" },
  { value: "personal_care", label: "Personal care" },
  { value: "mobility_support", label: "Mobility support" },
  { value: "dementia_care", label: "Dementia care" },
  { value: "infant_care", label: "Infant care" },
  { value: "alzheimers_care", label: "Alzheimers care" },
  { value: "disability_support", label: "Disability support" },
  { value: "post_surgery_care", label: "Post-surgery care" },
  {
    value: "transport_to_appointments",
    label: "Transport to appointments",
  },
  { value: "other", label: "Other" },
];

export const CAREGIVER_ARRANGEMENT_OPTIONS = [
  { value: "live_in", label: "Live-in" },
  { value: "full_day", label: "Full day" },
  { value: "overnight", label: "Overnight" },
  { value: "part_time", label: "Part-time (a few hours)" },
  { value: "weekends_only", label: "Weekends only" },
] as const;

export type CaregiverArrangement =
  (typeof CAREGIVER_ARRANGEMENT_OPTIONS)[number]["value"];

export const CAREGIVER_YEARS_OPTIONS = [
  { value: "0_1", label: "0 - 1 year" },
  { value: "1_3", label: "1 - 3 years" },
  { value: "3_5", label: "3 - 5 years" },
  { value: "5_plus", label: "5 years +" },
] as const;

export type CaregiverYearsExperience =
  (typeof CAREGIVER_YEARS_OPTIONS)[number]["value"];

export type CaregiverWorkHistoryEntry = {
  id: string;
  role: string;
  employer: string;
  startYear: string;
  /** Leave empty (or "Present") for a current role. */
  endYear: string;
};

export type CaregiverUploadedDoc = {
  url: string;
  fileName: string;
};

export const CAREGIVER_AVAILABILITY_OPTIONS = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "flexible", label: "Flexible" },
] as const;

export type CaregiverAvailabilityMode =
  (typeof CAREGIVER_AVAILABILITY_OPTIONS)[number]["value"];

/** Values are the API `openTo` enum. */
export const CAREGIVER_OPEN_TO_OPTIONS = [
  {
    value: "flexible",
    label: "On-call requests for short visits",
  },
  {
    value: "overnight",
    label: "Overnight stays, or on-demand support when needed",
  },
  {
    value: "weekend",
    label: "Weekend care",
  },
  {
    value: "emergency",
    label: "Last-minute / Emergency calls",
  },
  {
    value: "short_term",
    label: "Short visits (4 hours min)",
  },
] as const;

export type CaregiverOpenTo =
  (typeof CAREGIVER_OPEN_TO_OPTIONS)[number]["value"];

export const CAREGIVER_WEEKDAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type CaregiverWeekday =
  (typeof CAREGIVER_WEEKDAY_OPTIONS)[number];

/** Values are the API `preferredTimeOfDay` enum. */
export const CAREGIVER_TIME_OF_DAY_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Nights" },
] as const;

/** Values are the API `preferredHours` enum. */
export const CAREGIVER_HOUR_SLOT_OPTIONS = [
  { value: "8am_12pm", label: "8am - 12pm" },
  { value: "12pm_5pm", label: "12pm - 5pm" },
  { value: "5pm_9pm", label: "5pm - 9pm" },
  { value: "custom", label: "Custom" },
] as const;

/** Values are the API `travelKm` enum. */
export const CAREGIVER_TRAVEL_OPTIONS = [
  { value: "5", label: "Up to 5 km" },
  { value: "10", label: "Up to 10 km" },
  { value: "20", label: "Up to 20 km" },
  { value: "anywhere", label: "Anywhere in Lagos" },
] as const;

export type CaregiverTravelDistance =
  (typeof CAREGIVER_TRAVEL_OPTIONS)[number]["value"];

/** Values are the API `availableToStart` enum. */
export const CAREGIVER_START_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "within_2_weeks", label: "Within 2 weeks" },
  { value: "within_a_month", label: "Within a month" },
  { value: "flexible", label: "Flexible" },
] as const;

export type CaregiverStartTiming =
  (typeof CAREGIVER_START_OPTIONS)[number]["value"];

export const CAREGIVER_DEFAULT_AREAS = [
  "Yaba",
  "Surulere",
  "Ebute Metta",
  "Akoka",
] as const;

export const CAREGIVER_FLEX_DAYS = [
  { id: "sun", label: "S", weekday: "sunday" },
  { id: "mon", label: "M", weekday: "monday" },
  { id: "tue", label: "T", weekday: "tuesday" },
  { id: "wed", label: "W", weekday: "wednesday" },
  { id: "thu", label: "T", weekday: "thursday" },
  { id: "fri", label: "F", weekday: "friday" },
  { id: "sat", label: "S", weekday: "saturday" },
] as const;

export type CaregiverFlexDayId =
  (typeof CAREGIVER_FLEX_DAYS)[number]["id"];

/** `start` / `end` are 24h `HH:mm` (what `<input type="time">` produces). */
export type CaregiverTimeSlot = {
  id: string;
  start: string;
  end: string;
};

/** The API accepts one start/end pair per weekday, so `slots` holds at most one. */
export type CaregiverFlexDaySchedule = {
  dayId: CaregiverFlexDayId;
  enabled: boolean;
  slots: CaregiverTimeSlot[];
};

export const CAREGIVER_RATE_FIELDS = [
  {
    key: "dayShiftRate",
    label: "Day Shift",
    hint: "8am - 6pm",
    placeholder: "15,000",
  },
  {
    key: "nightShiftRate",
    label: "Night Shift",
    hint: "7pm - 7am",
    placeholder: "25,000",
  },
  {
    key: "weeklyRate",
    label: "Weekly Rate",
    hint: "7-days engagement",
    placeholder: "85,000",
  },
  {
    key: "monthlyLiveInRate",
    label: "Monthly - Live-in",
    hint: "Off days included",
    placeholder: "250,000",
  },
] as const;

export type CaregiverRateFieldKey =
  (typeof CAREGIVER_RATE_FIELDS)[number]["key"];

export type CaregiverReference = {
  /** Server id once saved via `POST .../references`. */
  id: string;
  title: string;
  fullName: string;
  phone: string;
  relationship: string;
};

export type CaregiverOnboardingDraft = {
  photoUrl: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  stateOfOrigin: string;
  lga: string;
  streetAddress: string;
  bio: string;
  languages: CaregiverLanguage[];
  /** The API stores a single care type. */
  careType: CaregiverCareType | "";
  /** API specialisation values (see `CAREGIVER_SPECIALTY_OPTIONS`). */
  specialties: string[];
  arrangements: CaregiverArrangement[];
  certificateName: string;
  licenseNumber: string;
  issuedBy: string;
  yearIssued: string;
  /** Training documents — all three are sent as `trainingDocumentUrls` (kind `certificate`). */
  professionalLicense: CaregiverUploadedDoc | null;
  cvResume: CaregiverUploadedDoc | null;
  certificateDoc: CaregiverUploadedDoc | null;
  yearsExperience: CaregiverYearsExperience | "";
  workHistory: CaregiverWorkHistoryEntry[];
  experienceConfirmed: boolean;
  availabilityMode: CaregiverAvailabilityMode;
  openTo: CaregiverOpenTo[];
  preferredDays: CaregiverWeekday[];
  /** API `preferredTimeOfDay` values. */
  preferredTimesOfDay: string[];
  /** API `preferredHours` values. */
  preferredHourSlots: string[];
  workAreas: string[];
  travelDistance: CaregiverTravelDistance | "";
  availableToStart: CaregiverStartTiming | "";
  flexibleSchedule: CaregiverFlexDaySchedule[];
  dayShiftRate: string;
  nightShiftRate: string;
  weeklyRate: string;
  monthlyLiveInRate: string;
  nin: string;
  idFrontDoc: CaregiverUploadedDoc | null;
  idBackDoc: CaregiverUploadedDoc | null;
  selfieWithIdDoc: CaregiverUploadedDoc | null;
  proofOfAddressDoc: CaregiverUploadedDoc | null;
  references: CaregiverReference[];
  /** UI-only consent; the API has no field for it. */
  consentBackgroundCheck: boolean;
  /** Sent as `declarations.accurate`. */
  consentInfoAccurate: boolean;
  /** Sent as `declarations.termsAccepted`. */
  consentTerms: boolean;
};

export function createEmptyWorkHistoryEntry(): CaregiverWorkHistoryEntry {
  return {
    id: `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "",
    employer: "",
    startYear: "",
    endYear: "",
  };
}

export function createTimeSlot(
  start = "09:00",
  end = "21:00",
): CaregiverTimeSlot {
  return {
    id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    start,
    end,
  };
}

export function createDefaultFlexibleSchedule(): CaregiverFlexDaySchedule[] {
  const enabledDays = new Set<CaregiverFlexDayId>([
    "sun",
    "tue",
    "wed",
    "thu",
    "fri",
  ]);
  return CAREGIVER_FLEX_DAYS.map((day) => ({
    dayId: day.id,
    enabled: enabledDays.has(day.id),
    slots: enabledDays.has(day.id) ? [createTimeSlot()] : [],
  }));
}

export const initialCaregiverOnboardingDraft: CaregiverOnboardingDraft = {
  photoUrl: "",
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  stateOfOrigin: "",
  lga: "",
  streetAddress: "",
  bio: "",
  languages: ["English"],
  careType: "",
  specialties: [],
  arrangements: ["live_in", "full_day", "overnight"],
  certificateName: "",
  licenseNumber: "",
  issuedBy: "",
  yearIssued: "",
  professionalLicense: null,
  cvResume: null,
  certificateDoc: null,
  yearsExperience: "",
  workHistory: [createEmptyWorkHistoryEntry()],
  experienceConfirmed: false,
  availabilityMode: "full_time",
  openTo: ["flexible", "overnight", "weekend", "emergency", "short_term"],
  preferredDays: [],
  preferredTimesOfDay: [],
  preferredHourSlots: [],
  workAreas: [...CAREGIVER_DEFAULT_AREAS],
  travelDistance: "10",
  availableToStart: "immediately",
  flexibleSchedule: createDefaultFlexibleSchedule(),
  dayShiftRate: "",
  nightShiftRate: "",
  weeklyRate: "",
  monthlyLiveInRate: "",
  nin: "",
  idFrontDoc: null,
  idBackDoc: null,
  selfieWithIdDoc: null,
  proofOfAddressDoc: null,
  references: [],
  consentBackgroundCheck: false,
  consentInfoAccurate: false,
  consentTerms: false,
};
