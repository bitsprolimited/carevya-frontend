import type { OnboardingProfile } from "@/features/onboarding/services/onboarding-service";
import type {
  CareFrequency,
  CareProfileDraft,
  CareRecipient,
  CareStartTiming,
  CareType,
  Mobility,
  ReachChannel,
  Relationship,
} from "@/features/care-profile/types";
import { initialCareProfileDraft } from "@/features/care-profile/types";

const CARE_TYPE_TO_API: Record<CareType, string> = {
  companionship: "companion",
  personal_care: "personal",
  nursing_care: "nursing",
  memory_care: "memory",
  recovery_support: "recovery",
  household_help: "household",
};

const CARE_TYPE_FROM_API: Record<string, CareType> = {
  companion: "companionship",
  companionship: "companionship",
  personal: "personal_care",
  personal_care: "personal_care",
  nursing: "nursing_care",
  nursing_care: "nursing_care",
  memory: "memory_care",
  memory_care: "memory_care",
  recovery: "recovery_support",
  recovery_support: "recovery_support",
  household: "household_help",
  household_help: "household_help",
};

const MOBILITY_TO_API: Record<Mobility, string> = {
  walks_alone: "walks_on_own",
  walks_with_help: "walks_with_some_help",
  wheelchair: "uses_wheelchair",
  mostly_in_bed: "mostly_in_bed",
};

const MOBILITY_FROM_API: Record<string, Mobility> = {
  walks_on_own: "walks_alone",
  walks_alone: "walks_alone",
  walks_with_some_help: "walks_with_help",
  walks_with_help: "walks_with_help",
  uses_wheelchair: "wheelchair",
  wheelchair: "wheelchair",
  mostly_in_bed: "mostly_in_bed",
};

const REACH_TO_API: Record<ReachChannel, string> = {
  whatsapp: "whatsapp",
  phone: "phone_call",
  sms: "sms",
  email: "email",
};

const REACH_FROM_API: Record<string, ReachChannel> = {
  whatsapp: "whatsapp",
  phone_call: "phone",
  phone: "phone",
  sms: "sms",
  email: "email",
};

const RECIPIENT_TO_API: Record<CareRecipient, string> = {
  myself: "self",
  family_member: "family_member",
  someone_in_my_care: "someone_in_my_care",
};

const RECIPIENT_FROM_API: Record<string, CareRecipient> = {
  self: "myself",
  myself: "myself",
  family_member: "family_member",
  someone_in_my_care: "someone_in_my_care",
};

function startTimingToApi(draft: CareProfileDraft): {
  startDateFlexType: "flexible" | "specific";
  specificStartDate?: string;
  careStartDate?: string;
} {
  if (draft.startTiming === "specific_date" && draft.startDate) {
    return {
      startDateFlexType: "specific",
      specificStartDate: draft.startDate,
    };
  }
  return {
    startDateFlexType: "flexible",
    ...(draft.startDate ? { careStartDate: draft.startDate } : {}),
  };
}

function startTimingFromApi(profile: OnboardingProfile): {
  startTiming: CareStartTiming | null;
  startDate: string;
} {
  if (profile.startDateFlexType === "specific") {
    return {
      startTiming: "specific_date",
      startDate: profile.specificStartDate ?? "",
    };
  }
  return {
    startTiming: "asap",
    startDate: profile.careStartDate ?? "",
  };
}

export function draftToStep1(draft: CareProfileDraft) {
  if (!draft.recipient) throw new Error("Select who needs care.");
  const careRecipientType = RECIPIENT_TO_API[draft.recipient];
  const relationship =
    draft.relationship === "Other"
      ? draft.relationshipOther.trim()
      : draft.relationship;
  return {
    careRecipientType,
    ...(careRecipientType !== "self" && relationship
      ? { relationshipToRecipient: relationship }
      : {}),
  };
}

export function draftToStep2(draft: CareProfileDraft) {
  const languages = draft.languages
    .filter((lang) => lang !== "Other")
    .concat(
      draft.languageOther.trim() ? [draft.languageOther.trim()] : [],
    );
  const gender =
    draft.gender === "male" || draft.gender === "female"
      ? draft.gender
      : undefined;
  if (!gender) throw new Error("Select a gender.");
  return {
    recipientFullName: draft.fullName.trim(),
    recipientDateOfBirth: draft.dateOfBirth,
    recipientGender: gender,
    recipientState: draft.state,
    recipientLga: draft.lga,
    recipientLanguages: languages.length ? languages : ["English"],
    ...(draft.photoUrl ? { recipientPhotoUrl: draft.photoUrl } : {}),
    ...(draft.ninUrl ? { recipientNinUrl: draft.ninUrl } : {}),
  };
}

export function draftToStep3(draft: CareProfileDraft) {
  if (!draft.frequency) throw new Error("Select care frequency.");
  return {
    careTypes: draft.careTypes.map((type) => CARE_TYPE_TO_API[type] ?? type),
    careFrequency: draft.frequency,
    ...startTimingToApi(draft),
    caregiverGenderPreference: draft.caregiverGender,
  };
}

export function draftToStep4(draft: CareProfileDraft) {
  if (!draft.mobility) throw new Error("Select mobility.");
  const conditions = draft.conditions
    .filter((item) => item !== "Other" && item !== "None of these")
    .concat(draft.conditionOther.trim() ? [draft.conditionOther.trim()] : []);
  return {
    healthConditions: conditions.length ? conditions : ["None"],
    mobility: MOBILITY_TO_API[draft.mobility],
    ...(draft.medications.trim()
      ? { medicationsOrAllergies: draft.medications.trim() }
      : {}),
    ...(draft.additionalInfo.trim()
      ? { notesForCaregiver: draft.additionalInfo.trim() }
      : {}),
  };
}

export function draftToStep5(draft: CareProfileDraft) {
  const preferred =
    draft.reachChannels[0] != null
      ? REACH_TO_API[draft.reachChannels[0]]
      : "phone_call";
  return {
    emergencyContactName: draft.emergencyName.trim(),
    emergencyRelationshipToYou: draft.relationshipToYou,
    emergencyRelationshipToRecipient: draft.relationshipToCareRecipient,
    emergencyPhone: draft.emergencyPhone.trim(),
    preferredContactMethod: preferred,
    consentDataSharing: draft.consentMatch,
    consentAccuracy: draft.consentAccurate,
    consentTerms: draft.consentTerms,
  };
}

export function draftToStepPayload(step: 1 | 2 | 3 | 4 | 5, draft: CareProfileDraft) {
  switch (step) {
    case 1:
      return draftToStep1(draft);
    case 2:
      return draftToStep2(draft);
    case 3:
      return draftToStep3(draft);
    case 4:
      return draftToStep4(draft);
    case 5:
      return draftToStep5(draft);
  }
}

export function profileToDraft(profile: OnboardingProfile): CareProfileDraft {
  const recipient = profile.careRecipientType
    ? (RECIPIENT_FROM_API[profile.careRecipientType] ?? null)
    : null;
  const relationshipRaw = profile.relationshipToRecipient ?? "";
  const knownRelationships = new Set<string>([
    "Grandmother",
    "Mother",
    "Grandfather",
    "Father",
    "Brother",
    "Uncle",
    "Wife",
    "Husband",
    "Sister",
    "Aunt",
    "Old Neighbor",
    "Counselor",
  ]);
  const relationship = knownRelationships.has(relationshipRaw)
    ? (relationshipRaw as Relationship)
    : relationshipRaw
      ? "Other"
      : null;

  const careTypes = (profile.careTypes ?? [])
    .map((type) => CARE_TYPE_FROM_API[type])
    .filter(Boolean) as CareType[];

  const start = startTimingFromApi(profile);
  const preferred = profile.preferredContactMethod
    ? REACH_FROM_API[profile.preferredContactMethod]
    : undefined;

  return {
    ...initialCareProfileDraft,
    recipient,
    relationship,
    relationshipOther:
      relationship === "Other" ? relationshipRaw : "",
    fullName: profile.recipientFullName ?? "",
    dateOfBirth: profile.recipientDateOfBirth ?? "",
    gender: profile.recipientGender ?? "",
    state: profile.recipientState ?? "",
    lga: profile.recipientLga ?? "",
    photoUrl: profile.recipientPhotoUrl ?? "",
    photoName: profile.recipientPhotoUrl ? "Uploaded photo" : "",
    photoConfirmed: Boolean(profile.recipientPhotoUrl),
    ninUrl: profile.recipientNinUrl ?? "",
    ninName: profile.recipientNinUrl ? "Uploaded NIN" : "",
    ninConfirmed: Boolean(profile.recipientNinUrl),
    languages: profile.recipientLanguages ?? [],
    careTypes,
    frequency: (profile.careFrequency as CareFrequency | null) ?? null,
    startTiming: start.startTiming,
    startDate: start.startDate,
    caregiverGender:
      (profile.caregiverGenderPreference as CareProfileDraft["caregiverGender"]) ??
      "no_preference",
    conditions: profile.healthConditions ?? [],
    mobility: profile.mobility
      ? (MOBILITY_FROM_API[profile.mobility] ?? null)
      : null,
    medications: profile.medicationsOrAllergies ?? "",
    additionalInfo: profile.notesForCaregiver ?? "",
    emergencyName: profile.emergencyContactName ?? "",
    relationshipToYou: profile.emergencyRelationshipToYou ?? "",
    relationshipToCareRecipient:
      profile.emergencyRelationshipToRecipient ?? "",
    emergencyPhone: profile.emergencyPhone ?? "",
    reachChannels: preferred ? [preferred] : [],
    consentMatch: Boolean(profile.consentDataSharing),
    consentAccurate: Boolean(profile.consentAccuracy),
    consentTerms: Boolean(profile.consentTerms),
  };
}
