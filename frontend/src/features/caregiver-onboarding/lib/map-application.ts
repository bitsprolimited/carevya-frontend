import {
  CAREGIVER_ARRANGEMENT_OPTIONS,
  CAREGIVER_AVAILABILITY_OPTIONS,
  CAREGIVER_CARE_TYPE_OPTIONS,
  CAREGIVER_FLEX_DAYS,
  CAREGIVER_HOUR_SLOT_OPTIONS,
  CAREGIVER_LANGUAGE_OPTIONS,
  CAREGIVER_OPEN_TO_OPTIONS,
  CAREGIVER_START_OPTIONS,
  CAREGIVER_TIME_OF_DAY_OPTIONS,
  CAREGIVER_TRAVEL_OPTIONS,
  CAREGIVER_WEEKDAY_OPTIONS,
  CAREGIVER_YEARS_OPTIONS,
  createEmptyWorkHistoryEntry,
  createTimeSlot,
  initialCaregiverOnboardingDraft,
  type CaregiverFlexDaySchedule,
  type CaregiverOnboardingDraft,
  type CaregiverUploadedDoc,
  type CaregiverWeekday,
} from "@/features/caregiver-onboarding/types";
import type {
  CaregiverApplicationStep,
  CaregiverReferenceRecord,
} from "@/features/caregiver-onboarding/services/caregiver-onboarding-service";
import { toDateOnly } from "@/lib/date";

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function trimmed(value: string): string {
  return value.trim();
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** The phone input is free-form; the API wants a compact number. */
export function compactPhone(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

/** "1,500" → 1500 (naira). Returns `null` when empty/invalid. */
export function parseNaira(value: string): number | null {
  const digits = digitsOnly(value);
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function formatNaira(kobo: number): string {
  return Math.round(kobo / 100).toLocaleString("en-NG");
}

/** The state list used by the UI differs from the API enum in two names. */
const STATE_TO_API: Record<string, string> = {
  "Federal Capital Territory": "FCT",
  Nassarawa: "Nasarawa",
};
const STATE_FROM_API: Record<string, string> = {
  FCT: "Federal Capital Territory",
  Nasarawa: "Nassarawa",
};

export function stateToApi(state: string): string {
  return STATE_TO_API[state] ?? state;
}

export function stateFromApi(state: string): string {
  return STATE_FROM_API[state] ?? state;
}

function weekdayToApi(day: CaregiverWeekday): string {
  return day.toLowerCase();
}

function weekdayFromApi(value: string): CaregiverWeekday | null {
  const lower = value.toLowerCase();
  return (
    CAREGIVER_WEEKDAY_OPTIONS.find((day) => day.toLowerCase() === lower) ??
    null
  );
}

/** Accepts "Present"/"present"/"current" and blank as "still working here". */
function isOngoing(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return !lower || lower === "present" || lower === "current";
}

/* -------------------------------------------------------------------------- */
/* Draft → API payloads                                                       */
/* -------------------------------------------------------------------------- */

export function draftToStepPayload(
  step: CaregiverApplicationStep,
  draft: CaregiverOnboardingDraft,
): Record<string, unknown> {
  switch (step) {
    case 1:
      return aboutPayload(draft);
    case 2:
      return servicesPayload(draft);
    case 3:
      return experiencePayload(draft);
    case 4:
      return availabilityPayload(draft);
    case 5:
      return ratesPayload(draft);
    case 6:
      return verificationPayload(draft);
  }
}

function aboutPayload(draft: CaregiverOnboardingDraft) {
  const middleName = trimmed(draft.middleName);
  const email = trimmed(draft.email);
  const photoUrl = trimmed(draft.photoUrl);
  const bio = trimmed(draft.bio);

  return {
    firstName: trimmed(draft.firstName),
    lastName: trimmed(draft.lastName),
    ...(middleName ? { middleName } : {}),
    ...(email ? { email } : {}),
    phone: compactPhone(draft.phone),
    dateOfBirth: toDateOnly(draft.dateOfBirth),
    gender: draft.gender,
    stateOfOrigin: stateToApi(draft.stateOfOrigin),
    lga: trimmed(draft.lga),
    streetAddress: trimmed(draft.streetAddress),
    ...(photoUrl ? { photoUrl } : {}),
    ...(bio ? { bio } : {}),
    languages: draft.languages,
  };
}

function servicesPayload(draft: CaregiverOnboardingDraft) {
  return {
    careType: draft.careType,
    specializations: draft.specialties,
    arrangements: draft.arrangements,
  };
}

function experiencePayload(draft: CaregiverOnboardingDraft) {
  const certificateName = trimmed(draft.certificateName);
  const licenceNumber = trimmed(draft.licenseNumber);
  const issuedBy = trimmed(draft.issuedBy);
  const yearIssued = Number(digitsOnly(draft.yearIssued));
  const trainingDocumentUrls = [
    draft.professionalLicense,
    draft.cvResume,
    draft.certificateDoc,
  ]
    .filter((doc): doc is CaregiverUploadedDoc => Boolean(doc))
    .map((doc) => doc.url);

  const workHistory = draft.workHistory
    .filter((entry) => entry.role.trim() || entry.employer.trim())
    .map((entry) => ({
      role: trimmed(entry.role),
      employer: trimmed(entry.employer),
      fromYear: Number(digitsOnly(entry.startYear)),
      ...(isOngoing(entry.endYear)
        ? {}
        : { toYear: Number(digitsOnly(entry.endYear)) }),
    }));

  return {
    ...(certificateName ? { certificateName } : {}),
    ...(licenceNumber ? { licenceNumber } : {}),
    ...(issuedBy ? { issuedBy } : {}),
    ...(yearIssued ? { yearIssued } : {}),
    ...(trainingDocumentUrls.length > 0 ? { trainingDocumentUrls } : {}),
    yearsOfExperience: draft.yearsExperience,
    workHistory,
    confirmedAccurate: draft.experienceConfirmed,
  };
}

function availabilityPayload(draft: CaregiverOnboardingDraft) {
  const base = {
    mode: draft.availabilityMode,
    areas: draft.workAreas.map(trimmed).filter(Boolean),
    travelKm: draft.travelDistance,
    availableToStart: draft.availableToStart,
  };

  if (draft.availabilityMode === "part_time") {
    return {
      ...base,
      preferredDays: draft.preferredDays.map(weekdayToApi),
      preferredTimeOfDay: draft.preferredTimesOfDay,
      preferredHours: draft.preferredHourSlots,
    };
  }

  if (draft.availabilityMode === "flexible") {
    return {
      ...base,
      openTo: draft.openTo,
      workingHours: CAREGIVER_FLEX_DAYS.map((meta) => {
        const day = draft.flexibleSchedule.find(
          (item) => item.dayId === meta.id,
        );
        const slot = day?.enabled ? day.slots[0] : undefined;
        return slot
          ? {
              weekday: meta.weekday,
              startTime: slot.start,
              endTime: slot.end,
            }
          : { weekday: meta.weekday, unavailable: true };
      }),
    };
  }

  // full_time — the UI promises roughly 40 hours of active care per week.
  return {
    ...base,
    hoursPerWeek: 40,
    openTo: draft.openTo,
  };
}

function ratesPayload(draft: CaregiverOnboardingDraft) {
  const toKobo = (value: string) => {
    const naira = parseNaira(value);
    return naira === null ? undefined : naira * 100;
  };
  const dayShift = toKobo(draft.dayShiftRate);
  const nightShift = toKobo(draft.nightShiftRate);
  const weekly = toKobo(draft.weeklyRate);
  const monthlyLiveIn = toKobo(draft.monthlyLiveInRate);

  return {
    ...(dayShift !== undefined ? { dayShift } : {}),
    ...(nightShift !== undefined ? { nightShift } : {}),
    ...(weekly !== undefined ? { weekly } : {}),
    ...(monthlyLiveIn !== undefined ? { monthlyLiveIn } : {}),
  };
}

function verificationPayload(draft: CaregiverOnboardingDraft) {
  const nin = digitsOnly(draft.nin);
  return {
    ...(nin.length === 11 ? { nin } : {}),
    ...(draft.idFrontDoc ? { ninIdFrontUrl: draft.idFrontDoc.url } : {}),
    ...(draft.idBackDoc ? { ninIdBackUrl: draft.idBackDoc.url } : {}),
    ...(draft.selfieWithIdDoc
      ? { idSelfieUrl: draft.selfieWithIdDoc.url }
      : {}),
    ...(draft.proofOfAddressDoc
      ? { proofOfAddressUrl: draft.proofOfAddressDoc.url }
      : {}),
    declarations: {
      accurate: draft.consentInfoAccurate,
      termsAccepted: draft.consentTerms,
    },
  };
}

/** Body for `POST .../submit`. */
export function draftToSubmitPayload(draft: CaregiverOnboardingDraft) {
  const nin = digitsOnly(draft.nin);
  return {
    ...(nin.length === 11 ? { nin } : {}),
    declarations: {
      accurate: draft.consentInfoAccurate,
      termsAccepted: draft.consentTerms,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* API application → draft                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The OpenAPI document types `application` as a bare object, so read it
 * defensively: sections may be nested (`application.about.firstName`) or
 * flat (`application.firstName`).
 */
function sectionOf(
  application: Record<string, unknown>,
  ...keys: string[]
): Record<string, unknown> {
  for (const key of keys) {
    const value = application[key];
    if (isRecord(value)) return value;
  }
  return application;
}

function pick(
  sources: Array<Record<string, unknown>>,
  ...keys: string[]
): unknown {
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null) return value;
    }
  }
  return undefined;
}

function str(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function strArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string");
}

function oneOf<T extends string>(
  value: unknown,
  options: readonly { value: T }[],
): T | undefined {
  const text = str(value);
  return options.find((option) => option.value === text)?.value;
}

function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const last = path.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}

function toDoc(value: unknown): CaregiverUploadedDoc | null {
  const url = str(value);
  return url ? { url, fileName: fileNameFromUrl(url) } : null;
}

function workingHoursToSchedule(value: unknown): CaregiverFlexDaySchedule[] {
  const rows = Array.isArray(value) ? value.filter(isRecord) : [];
  return CAREGIVER_FLEX_DAYS.map((meta) => {
    const row = rows.find(
      (item) => str(item.weekday)?.toLowerCase() === meta.weekday,
    );
    const start = str(row?.startTime);
    const end = str(row?.endTime);
    const enabled = Boolean(row) && row?.unavailable !== true && start && end;
    return {
      dayId: meta.id,
      enabled: Boolean(enabled),
      slots: enabled ? [createTimeSlot(start, end)] : [],
    };
  });
}

export function applicationToDraft(
  application: Record<string, unknown> | null | undefined,
  references: CaregiverReferenceRecord[] = [],
): CaregiverOnboardingDraft {
  const draft: CaregiverOnboardingDraft = {
    ...initialCaregiverOnboardingDraft,
    workHistory: [createEmptyWorkHistoryEntry()],
  };
  if (!application) return { ...draft, references };

  const root = application;
  const about = sectionOf(application, "about");
  const services = sectionOf(application, "services");
  const experience = sectionOf(application, "experience");
  const availability = sectionOf(application, "availability");
  const rates = sectionOf(application, "rates");
  const verification = sectionOf(application, "verification");

  // About
  const aboutSources = [about, root];
  draft.firstName = str(pick(aboutSources, "firstName")) ?? draft.firstName;
  draft.lastName = str(pick(aboutSources, "lastName")) ?? draft.lastName;
  draft.middleName = str(pick(aboutSources, "middleName")) ?? "";
  draft.email = str(pick(aboutSources, "email")) ?? draft.email;
  draft.phone = str(pick(aboutSources, "phone")) ?? draft.phone;
  draft.dateOfBirth = toDateOnly(str(pick(aboutSources, "dateOfBirth")));
  draft.gender = str(pick(aboutSources, "gender")) ?? draft.gender;
  const state = str(pick(aboutSources, "stateOfOrigin"));
  if (state) draft.stateOfOrigin = stateFromApi(state);
  draft.lga = str(pick(aboutSources, "lga")) ?? draft.lga;
  draft.streetAddress =
    str(pick(aboutSources, "streetAddress")) ?? draft.streetAddress;
  draft.photoUrl = str(pick(aboutSources, "photoUrl")) ?? draft.photoUrl;
  draft.bio = str(pick(aboutSources, "bio")) ?? draft.bio;
  const languages = strArray(pick(aboutSources, "languages"));
  if (languages?.length) {
    draft.languages = languages.filter((language) =>
      (CAREGIVER_LANGUAGE_OPTIONS as readonly string[]).includes(language),
    ) as CaregiverOnboardingDraft["languages"];
  }

  // Services
  const serviceSources = [services, root];
  draft.careType =
    oneOf(
      pick(serviceSources, "careType"),
      CAREGIVER_CARE_TYPE_OPTIONS,
    ) ?? draft.careType;
  const specializations = strArray(
    pick(serviceSources, "specializations", "specialisations"),
  );
  if (specializations) draft.specialties = specializations;
  const arrangements = strArray(pick(serviceSources, "arrangements"));
  if (arrangements) {
    draft.arrangements = arrangements.filter((value) =>
      CAREGIVER_ARRANGEMENT_OPTIONS.some((option) => option.value === value),
    ) as CaregiverOnboardingDraft["arrangements"];
  }

  // Experience
  const experienceSources = [experience, root];
  draft.certificateName =
    str(pick(experienceSources, "certificateName")) ?? "";
  draft.licenseNumber =
    str(pick(experienceSources, "licenceNumber", "licenseNumber")) ?? "";
  draft.issuedBy = str(pick(experienceSources, "issuedBy")) ?? "";
  draft.yearIssued = str(pick(experienceSources, "yearIssued")) ?? "";
  draft.yearsExperience =
    oneOf(
      pick(experienceSources, "yearsOfExperience"),
      CAREGIVER_YEARS_OPTIONS,
    ) ?? draft.yearsExperience;
  draft.experienceConfirmed =
    pick(experienceSources, "confirmedAccurate") === true;

  // The API keeps one flat list of training documents; the UI has three
  // slots, so they refill in order.
  const trainingUrls =
    strArray(pick(experienceSources, "trainingDocumentUrls")) ?? [];
  draft.professionalLicense = toDoc(trainingUrls[0]);
  draft.cvResume = toDoc(trainingUrls[1]);
  draft.certificateDoc = toDoc(trainingUrls[2]);

  const workHistory = pick(experienceSources, "workHistory");
  if (Array.isArray(workHistory) && workHistory.length > 0) {
    draft.workHistory = workHistory.filter(isRecord).map((entry) => ({
      ...createEmptyWorkHistoryEntry(),
      role: str(entry.role) ?? "",
      employer: str(entry.employer) ?? "",
      startYear: str(entry.fromYear) ?? "",
      endYear: str(entry.toYear) ?? "",
    }));
    if (draft.workHistory.length === 0) {
      draft.workHistory = [createEmptyWorkHistoryEntry()];
    }
  }

  // Availability
  const availabilitySources = [availability, root];
  draft.availabilityMode =
    oneOf(
      pick(availabilitySources, "mode", "availabilityMode"),
      CAREGIVER_AVAILABILITY_OPTIONS,
    ) ?? draft.availabilityMode;
  const openTo = strArray(pick(availabilitySources, "openTo"));
  if (openTo) {
    draft.openTo = openTo.filter((value) =>
      CAREGIVER_OPEN_TO_OPTIONS.some((option) => option.value === value),
    ) as CaregiverOnboardingDraft["openTo"];
  }
  const preferredDays = strArray(pick(availabilitySources, "preferredDays"));
  if (preferredDays) {
    draft.preferredDays = preferredDays
      .map(weekdayFromApi)
      .filter((day): day is CaregiverWeekday => Boolean(day));
  }
  const timesOfDay = strArray(
    pick(availabilitySources, "preferredTimeOfDay"),
  );
  if (timesOfDay) {
    draft.preferredTimesOfDay = timesOfDay.filter((value) =>
      CAREGIVER_TIME_OF_DAY_OPTIONS.some((option) => option.value === value),
    );
  }
  const preferredHours = strArray(pick(availabilitySources, "preferredHours"));
  if (preferredHours) {
    draft.preferredHourSlots = preferredHours.filter((value) =>
      CAREGIVER_HOUR_SLOT_OPTIONS.some((option) => option.value === value),
    );
  }
  const workingHours = pick(availabilitySources, "workingHours");
  if (Array.isArray(workingHours) && workingHours.length > 0) {
    draft.flexibleSchedule = workingHoursToSchedule(workingHours);
  }
  const areas = strArray(pick(availabilitySources, "areas"));
  if (areas && areas.length > 0) draft.workAreas = areas;
  draft.travelDistance =
    oneOf(pick(availabilitySources, "travelKm"), CAREGIVER_TRAVEL_OPTIONS) ??
    draft.travelDistance;
  draft.availableToStart =
    oneOf(
      pick(availabilitySources, "availableToStart"),
      CAREGIVER_START_OPTIONS,
    ) ?? draft.availableToStart;

  // Rates (stored in kobo)
  const rateSources = [rates, root];
  const rateFrom = (...keys: string[]) => {
    const raw = pick(rateSources, ...keys);
    const kobo = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(kobo) && kobo > 0 ? formatNaira(kobo) : "";
  };
  draft.dayShiftRate = rateFrom("dayShift", "dayShiftRate");
  draft.nightShiftRate = rateFrom("nightShift", "nightShiftRate");
  draft.weeklyRate = rateFrom("weekly", "weeklyRate");
  draft.monthlyLiveInRate = rateFrom("monthlyLiveIn", "monthlyLiveInRate");

  // Verification (the API only keeps the last four NIN digits, so the NIN
  // has to be re-entered if this step is revisited.)
  const verificationSources = [verification, root];
  draft.idFrontDoc = toDoc(pick(verificationSources, "ninIdFrontUrl"));
  draft.idBackDoc = toDoc(pick(verificationSources, "ninIdBackUrl"));
  draft.selfieWithIdDoc = toDoc(pick(verificationSources, "idSelfieUrl"));
  draft.proofOfAddressDoc = toDoc(
    pick(verificationSources, "proofOfAddressUrl"),
  );
  const declarations = pick(verificationSources, "declarations");
  if (isRecord(declarations)) {
    draft.consentInfoAccurate = declarations.accurate === true;
    draft.consentTerms = declarations.termsAccepted === true;
    // The background-check consent has no API field; it rides along with terms.
    draft.consentBackgroundCheck = declarations.termsAccepted === true;
  }

  draft.references = references.map((reference) => ({ ...reference }));

  return draft;
}

/* -------------------------------------------------------------------------- */
/* Misc                                                                       */
/* -------------------------------------------------------------------------- */

const SECTION_LABELS: Record<string, string> = {
  about: "About you",
  services: "Services",
  experience: "Experience",
  availability: "Availability",
  rates: "Pricing",
  verification: "Verification",
  references: "References",
  declarations: "Declarations",
};

function humanize(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return spaced;
}

/** `about.firstName` → "About you: first name" */
export function describeMissingField(path: string): string {
  const [head, ...rest] = path.split(".");
  const section = SECTION_LABELS[head] ?? humanize(head);
  if (rest.length === 0) return section.charAt(0).toUpperCase() + section.slice(1);
  return `${section.charAt(0).toUpperCase() + section.slice(1)}: ${rest
    .map(humanize)
    .join(" ")}`;
}

/** Maps a missing-field path to the wizard step that owns it (0-based). */
export function stepIndexForMissingField(path: string): number | null {
  const head = path.split(".")[0];
  const order = [
    "about",
    "services",
    "experience",
    "availability",
    "rates",
    "verification",
  ];
  const direct = order.indexOf(head);
  if (direct >= 0) return direct;
  if (head === "references" || head === "declarations") return 5;
  return null;
}
