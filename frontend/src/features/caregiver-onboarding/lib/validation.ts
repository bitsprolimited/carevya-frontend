import type { CaregiverOnboardingDraft } from "@/features/caregiver-onboarding/types";
import {
  isValidNigerianMobile,
  NIGERIAN_PHONE_ERROR,
} from "@/lib/phone";

export const CAREGIVER_MAX_REFERENCES = 3;
export const CAREGIVER_MIN_REFERENCES = 2;

const MIN_YEAR = 1950;
const MAX_RATE_NAIRA = 100_000_000;

export type CaregiverAboutErrors = Partial<
  Record<
    | "photoUrl"
    | "firstName"
    | "lastName"
    | "middleName"
    | "email"
    | "phone"
    | "dateOfBirth"
    | "gender"
    | "stateOfOrigin"
    | "lga"
    | "streetAddress"
    | "bio"
    | "languages",
    string
  >
>;

export type CaregiverServicesErrors = Partial<
  Record<"careTypes" | "specialties" | "arrangements", string>
>;

export type CaregiverExperienceErrors = Partial<
  Record<
    | "yearsExperience"
    | "experienceConfirmed"
    | "workHistory"
    | "licenseNumber"
    | "yearIssued",
    string
  >
>;

export type CaregiverAvailabilityErrors = Partial<
  Record<
    | "availabilityMode"
    | "preferredDays"
    | "preferredTimesOfDay"
    | "preferredHourSlots"
    | "flexibleSchedule"
    | "workAreas"
    | "travelDistance"
    | "availableToStart",
    string
  >
>;

export type CaregiverRatesErrors = Partial<
  Record<
    | "dayShiftRate"
    | "nightShiftRate"
    | "weeklyRate"
    | "monthlyLiveInRate",
    string
  >
>;

export type CaregiverVerificationErrors = Partial<
  Record<
    | "nin"
    | "idFrontDoc"
    | "idBackDoc"
    | "selfieWithIdDoc"
    | "proofOfAddressDoc"
    | "references"
    | "consentBackgroundCheck"
    | "consentInfoAccurate"
    | "consentTerms",
    string
  >
>;

function currentYear(): number {
  return new Date().getFullYear();
}

function parseYear(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d{4}$/.test(trimmed)) return null;
  return Number(trimmed);
}

function yearInRange(year: number): boolean {
  return year >= MIN_YEAR && year <= currentYear();
}

export function validateCaregiverAbout(
  draft: CaregiverOnboardingDraft,
): CaregiverAboutErrors {
  const errors: CaregiverAboutErrors = {};

  const first = draft.firstName.trim();
  if (!first) errors.firstName = "Enter your first name.";
  else if (first.length < 2 || first.length > 60) {
    errors.firstName = "First name must be 2 to 60 characters.";
  }

  const last = draft.lastName.trim();
  if (!last) errors.lastName = "Enter your last name.";
  else if (last.length < 2 || last.length > 60) {
    errors.lastName = "Last name must be 2 to 60 characters.";
  }

  if (draft.middleName.trim().length > 60) {
    errors.middleName = "Middle name must be 60 characters or fewer.";
  }

  if (!draft.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!draft.phone.trim()) {
    errors.phone = "Enter your phone number.";
  } else if (!isValidNigerianMobile(draft.phone)) {
    errors.phone = NIGERIAN_PHONE_ERROR;
  }

  if (!draft.dateOfBirth.trim()) {
    errors.dateOfBirth = "Enter your date of birth.";
  }

  if (!draft.gender.trim()) errors.gender = "Select your gender.";
  if (!draft.stateOfOrigin.trim()) {
    errors.stateOfOrigin = "Select your state of origin.";
  }
  if (!draft.lga.trim()) errors.lga = "Select your LGA.";

  const street = draft.streetAddress.trim();
  if (!street) {
    errors.streetAddress = "Enter your street address.";
  } else if (street.length < 5) {
    errors.streetAddress = "Enter your full street address.";
  } else if (street.length > 200) {
    errors.streetAddress = "Street address must be 200 characters or fewer.";
  }

  const bio = draft.bio.trim();
  if (!bio) {
    errors.bio = "Add a short bio.";
  } else if (bio.length < 20) {
    errors.bio = "Write at least a short sentence about yourself.";
  } else if (bio.length > 500) {
    errors.bio = "Bio must be 500 characters or fewer.";
  }

  if (draft.languages.length === 0) {
    errors.languages = "Select at least one language.";
  }

  return errors;
}

export function validateCaregiverServices(
  draft: CaregiverOnboardingDraft,
): CaregiverServicesErrors {
  const errors: CaregiverServicesErrors = {};
  if (!draft.careType) {
    errors.careTypes = "Select the type of care you offer.";
  }
  if (draft.specialties.length === 0) {
    errors.specialties = "Select at least one specialty.";
  } else if (draft.specialties.length > 12) {
    errors.specialties = "Select up to 12 specialties.";
  }
  if (draft.arrangements.length === 0) {
    errors.arrangements = "Select at least one care arrangement.";
  }
  return errors;
}

export function validateCaregiverExperience(
  draft: CaregiverOnboardingDraft,
): CaregiverExperienceErrors {
  const errors: CaregiverExperienceErrors = {};

  if (!draft.yearsExperience) {
    errors.yearsExperience = "Select your years of experience.";
  }

  if (draft.careType === "clinical" && !draft.licenseNumber.trim()) {
    errors.licenseNumber =
      "A licence or registration number is required for clinical care.";
  }

  if (draft.yearIssued.trim()) {
    const year = parseYear(draft.yearIssued);
    if (year === null || !yearInRange(year)) {
      errors.yearIssued = `Enter a year between ${String(MIN_YEAR)} and ${String(currentYear())}.`;
    }
  }

  const filled = draft.workHistory.filter(
    (entry) =>
      entry.role.trim() ||
      entry.employer.trim() ||
      entry.startYear.trim() ||
      entry.endYear.trim(),
  );

  if (filled.length === 0) {
    errors.workHistory = "Add at least one role to your work history.";
  } else {
    for (const entry of filled) {
      const role = entry.role.trim();
      const employer = entry.employer.trim();
      if (!role || !employer || !entry.startYear.trim()) {
        errors.workHistory =
          "Complete the role, employer and start year for each work history entry.";
        break;
      }
      if (role.length < 2 || employer.length < 2) {
        errors.workHistory =
          "Role and employer must be at least 2 characters.";
        break;
      }
      const start = parseYear(entry.startYear);
      if (start === null || !yearInRange(start)) {
        errors.workHistory = `Start year must be between ${String(MIN_YEAR)} and ${String(currentYear())}.`;
        break;
      }
      const endRaw = entry.endYear.trim().toLowerCase();
      if (endRaw && endRaw !== "present" && endRaw !== "current") {
        const end = parseYear(entry.endYear);
        if (end === null || !yearInRange(end)) {
          errors.workHistory = `End year must be between ${String(MIN_YEAR)} and ${String(currentYear())}, or "Present".`;
          break;
        }
        if (end < start) {
          errors.workHistory = "End year can't be before the start year.";
          break;
        }
      }
    }
  }

  if (!draft.experienceConfirmed) {
    errors.experienceConfirmed =
      "Confirm that your experience and qualifications are accurate.";
  }

  return errors;
}

export function validateCaregiverAvailability(
  draft: CaregiverOnboardingDraft,
): CaregiverAvailabilityErrors {
  const errors: CaregiverAvailabilityErrors = {};

  if (!draft.availabilityMode) {
    errors.availabilityMode = "Select your availability.";
  }

  if (draft.availabilityMode === "part_time") {
    if (draft.preferredDays.length === 0) {
      errors.preferredDays = "Select at least one preferred day.";
    }
    if (draft.preferredTimesOfDay.length === 0) {
      errors.preferredTimesOfDay = "Select at least one preferred time of day.";
    }
    if (draft.preferredHourSlots.length === 0) {
      errors.preferredHourSlots = "Select at least one preferred hour slot.";
    }
  }

  if (draft.availabilityMode === "flexible") {
    const enabledDays = draft.flexibleSchedule.filter((day) => day.enabled);
    if (enabledDays.length === 0) {
      errors.flexibleSchedule = "Enable at least one working day.";
    } else {
      const incomplete = enabledDays.some((day) => {
        const slot = day.slots[0];
        return !slot || !slot.start || !slot.end;
      });
      const inverted = enabledDays.some((day) => {
        const slot = day.slots[0];
        return Boolean(slot?.start && slot.end && slot.start >= slot.end);
      });
      if (incomplete) {
        errors.flexibleSchedule =
          "Add start and end times for each available day.";
      } else if (inverted) {
        errors.flexibleSchedule =
          "The end time must be after the start time.";
      }
    }
  }

  if (draft.workAreas.length === 0) {
    errors.workAreas = "Add at least one work area.";
  } else if (draft.workAreas.length > 10) {
    errors.workAreas = "You can add up to 10 work areas.";
  } else if (draft.workAreas.some((area) => area.trim().length > 60)) {
    errors.workAreas = "Area names must be 60 characters or fewer.";
  }
  if (!draft.travelDistance) {
    errors.travelDistance = "Select how far you can travel.";
  }
  if (!draft.availableToStart) {
    errors.availableToStart = "Select when you can start.";
  }

  return errors;
}

function parseRateAmount(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount;
}

export function validateCaregiverRates(
  draft: CaregiverOnboardingDraft,
): CaregiverRatesErrors {
  const errors: CaregiverRatesErrors = {};
  const fields = [
    { key: "dayShiftRate" as const, label: "day shift rate" },
    { key: "nightShiftRate" as const, label: "night shift rate" },
    { key: "weeklyRate" as const, label: "weekly rate" },
    { key: "monthlyLiveInRate" as const, label: "monthly live-in rate" },
  ];

  for (const field of fields) {
    const amount = parseRateAmount(draft[field.key]);
    if (amount === null) {
      errors[field.key] = `Enter a valid ${field.label}.`;
    } else if (amount > MAX_RATE_NAIRA) {
      errors[field.key] = "That amount is too high.";
    }
  }

  return errors;
}

export function formatNinInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
}

export function validateCaregiverVerification(
  draft: CaregiverOnboardingDraft,
): CaregiverVerificationErrors {
  const errors: CaregiverVerificationErrors = {};
  const ninDigits = draft.nin.replace(/\D/g, "");

  if (!ninDigits) {
    errors.nin = "Enter your National Identity Number.";
  } else if (ninDigits.length !== 11) {
    errors.nin = "NIN must be 11 digits.";
  }

  if (!draft.idFrontDoc) {
    errors.idFrontDoc = "Upload the front of your ID.";
  }
  if (!draft.idBackDoc) {
    errors.idBackDoc = "Upload the back of your ID.";
  }
  if (!draft.selfieWithIdDoc) {
    errors.selfieWithIdDoc = "Upload a selfie holding your ID.";
  }
  if (!draft.proofOfAddressDoc) {
    errors.proofOfAddressDoc = "Upload a proof of address.";
  }

  if (draft.references.length < CAREGIVER_MIN_REFERENCES) {
    errors.references = `Add at least ${String(CAREGIVER_MIN_REFERENCES)} references.`;
  }

  if (!draft.consentBackgroundCheck) {
    errors.consentBackgroundCheck =
      "Consent to a background check is required.";
  }
  if (!draft.consentInfoAccurate) {
    errors.consentInfoAccurate = "Confirm your information is accurate.";
  }
  if (!draft.consentTerms) {
    errors.consentTerms = "Agree to the terms to continue.";
  }

  return errors;
}
