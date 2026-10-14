import type { CareProfileDraft } from "@/features/care-profile/types";
import { getCarePronouns } from "@/features/care-profile/lib/pronouns";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function validateDateOfBirth(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "required";

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length !== 8) return "Enter a valid date.";

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (month < 1 || month > 12 || year < 1900) return "Enter a valid date.";

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    if (month === 2) {
      return "Enter a valid date. February only has 28 or 29 days.";
    }
    return `Enter a valid date. ${MONTH_NAMES[month - 1]} only has ${daysInMonth} days.`;
  }

  const date = new Date(year, month - 1, day);
  if (date > new Date()) return "Enter a valid date of birth.";

  return null;
}

export function validatePhoneNumber(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "required";

  const digits = trimmed.replace(/\D/g, "");
  let local = digits;
  if (local.startsWith("234") && local.length >= 13) local = local.slice(3);
  if (local.startsWith("0") && local.length >= 11) local = local.slice(1);

  if (local.length < 10 || local.length > 11) {
    return "Enter a valid phone number, e.g. +234 803 123 4567.";
  }

  return null;
}

export function possessiveLabel(draft: CareProfileDraft): string {
  const pronouns = getCarePronouns(draft);
  if (pronouns.subject === "you") return "your";
  return pronouns.possessive;
}

export function aboutThemTitle(draft: CareProfileDraft): string {
  if (draft.recipient === "myself") {
    return "Tell us about yourself";
  }
  const pronouns = getCarePronouns(draft);
  if (pronouns.label === "them" || pronouns.label === "you") {
    return "Tell us about the person who needs care";
  }
  return `Tell us about your ${pronouns.label}`;
}

function joinMissing(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export type FinishSetupIssues = {
  canFinish: boolean;
  about?: string;
  emergency?: string;
  missingConsentTerms: boolean;
};

/** Cross-step checks used on the review / finish screen. */
export function getFinishSetupIssues(draft: CareProfileDraft): FinishSetupIssues {
  const possess = possessiveLabel(draft);
  const aboutMissing: string[] = [];
  if (!draft.fullName.trim()) aboutMissing.push("full name");
  if (validateDateOfBirth(draft.dateOfBirth)) aboutMissing.push("date of birth");
  if (!draft.gender) aboutMissing.push("gender");

  const emergencyMissing: string[] = [];
  if (!draft.emergencyName.trim()) {
    emergencyMissing.push("emergency contact's full name");
  }
  if (!draft.relationshipToYou) {
    emergencyMissing.push("emergency contact's relationship to you");
  }
  if (validatePhoneNumber(draft.emergencyPhone)) {
    emergencyMissing.push("a valid emergency phone number");
  }

  const missingConsentTerms = !draft.consentTerms;
  const canFinish =
    aboutMissing.length === 0 &&
    emergencyMissing.length === 0 &&
    draft.consentMatch &&
    draft.consentAccurate &&
    draft.consentTerms &&
    Boolean(draft.recipient) &&
    draft.careTypes.length > 0 &&
    Boolean(draft.frequency) &&
    draft.conditions.length > 0 &&
    Boolean(draft.mobility);

  return {
    canFinish,
    about:
      aboutMissing.length > 0
        ? `Add ${possess} ${joinMissing(aboutMissing)} before finishing setup.`
        : undefined,
    emergency:
      emergencyMissing.length === 1 &&
      emergencyMissing[0] === "emergency contact's relationship to you"
        ? "Add your emergency contact's relationship to you."
        : emergencyMissing.length > 0
          ? `Add your ${joinMissing(emergencyMissing)}.`
          : undefined,
    missingConsentTerms,
  };
}
