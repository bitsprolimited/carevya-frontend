export const CARE_PROFILE_STEPS = [
  { id: "who", label: "Who needs care" },
  { id: "about", label: "About them" },
  { id: "needs", label: "Care needs" },
  { id: "health", label: "Health" },
  { id: "emergency", label: "Emergency Contact" },
] as const;

export type CareProfileStepId = (typeof CARE_PROFILE_STEPS)[number]["id"];

export type CareRecipient =
  | "myself"
  | "family_member"
  | "someone_in_my_care";

export type Relationship =
  | "Grandmother"
  | "Mother"
  | "Grandfather"
  | "Father"
  | "Brother"
  | "Uncle"
  | "Wife"
  | "Husband"
  | "Sister"
  | "Aunt"
  | "Old Neighbor"
  | "Counselor"
  | "Other";

export type CareType =
  | "non_clinical"
  | "clinical"
  | "personal_specialized";

export type CareFrequency =
  | "live_in"
  | "full_day"
  | "part_time"
  | "overnight"
  | "weekends_only";

export type CareStartTiming = "asap" | "specific_date";

export type GenderPreference = "no_preference" | "female" | "male";

export type Mobility =
  | "walks_alone"
  | "walks_with_help"
  | "wheelchair"
  | "mostly_in_bed";

export type ReachChannel = "whatsapp" | "phone" | "sms" | "email";

export type CareProfileDraft = {
  recipient: CareRecipient | null;
  relationship: Relationship | null;
  relationshipOther: string;

  fullName: string;
  dateOfBirth: string;
  gender: string;
  state: string;
  lga: string;
  photoName: string;
  photoConfirmed: boolean;
  ninName: string;
  ninConfirmed: boolean;
  languages: string[];
  languageOther: string;

  careTypes: CareType[];
  frequency: CareFrequency | null;
  startTiming: CareStartTiming | null;
  startDate: string;
  caregiverGender: GenderPreference;

  conditions: string[];
  conditionOther: string;
  mobility: Mobility | null;
  medications: string;
  additionalInfo: string;

  emergencyName: string;
  relationshipToYou: string;
  relationshipToCareRecipient: string;
  emergencyPhone: string;
  reachChannels: ReachChannel[];
  consentMatch: boolean;
  consentAccurate: boolean;
  consentTerms: boolean;
};

export const initialCareProfileDraft: CareProfileDraft = {
  recipient: null,
  relationship: null,
  relationshipOther: "",

  fullName: "",
  dateOfBirth: "",
  gender: "",
  state: "",
  lga: "",
  photoName: "",
  photoConfirmed: false,
  ninName: "",
  ninConfirmed: false,
  languages: [],
  languageOther: "",

  careTypes: [],
  frequency: null,
  startTiming: "asap",
  startDate: "",
  caregiverGender: "no_preference",

  conditions: [],
  conditionOther: "",
  mobility: null,
  medications: "",
  additionalInfo: "",

  emergencyName: "",
  relationshipToYou: "",
  relationshipToCareRecipient: "",
  emergencyPhone: "",
  reachChannels: [],
  consentMatch: false,
  consentAccurate: false,
  consentTerms: false,
};

export const FAMILY_RELATIONSHIPS: {
  label: Relationship;
  icon: string;
}[] = [
  { label: "Grandmother", icon: "👵" },
  { label: "Mother", icon: "👩" },
  { label: "Grandfather", icon: "👴" },
  { label: "Father", icon: "👨" },
  { label: "Brother", icon: "👦" },
  { label: "Uncle", icon: "👨" },
  { label: "Wife", icon: "👩" },
  { label: "Husband", icon: "👨" },
  { label: "Sister", icon: "👧" },
  { label: "Aunt", icon: "👩" },
];

export const GUARDIAN_RELATIONSHIPS: {
  label: Relationship;
  icon: string;
}[] = [
  { label: "Old Neighbor", icon: "👵" },
  { label: "Counselor", icon: "👩‍💼" },
];

export const LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
  "Other",
] as const;

export const CONDITION_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Arthritis",
  "Dementia / Alzheimer’s",
  "Stroke",
  "Parkinson’s",
  "Heart condition",
  "None of these",
  "Other",
] as const;

export const NONE_OF_THESE_CONDITION = "None of these";
