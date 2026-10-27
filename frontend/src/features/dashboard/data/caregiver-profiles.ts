import { buildFindCareCatalog } from "@/features/dashboard/data/find-care-catalog";
import { mockCaregivers } from "@/features/dashboard/data/mock";
import type { Caregiver } from "@/features/dashboard/types";
import type {
  CaregiverProfile,
  Weekday,
} from "@/features/dashboard/types/caregiver-profile";

const WEEKDAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const emekaAvailability: CaregiverProfile["availability"] = {
  monday: { morning: true, afternoon: true },
  tuesday: { morning: true, afternoon: true },
  wednesday: { afternoon: true },
  thursday: { morning: true, afternoon: true },
  friday: { morning: true, afternoon: true, evening: true },
  saturday: { afternoon: true, evening: true },
  sunday: {},
};

function firstNameFrom(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function buildDefaultProfile(caregiver: Caregiver): CaregiverProfile {
  const firstName = firstNameFrom(caregiver.name);
  const emptyAvailability = Object.fromEntries(
    WEEKDAYS.map((day) => [day, {}]),
  ) as CaregiverProfile["availability"];

  return {
    ...caregiver,
    firstName,
    headline: `${caregiver.categoryLabel} · Speaks ${caregiver.languages.join(", ")}.`,
    reviewCount: Math.max(8, Math.round(caregiver.rating * 6)),
    yearsExperience: 5,
    about: `${firstName} provides compassionate, reliable care for older adults. Families appreciate clear updates, patience, and a calm presence at home.`,
    services: [caregiver.categoryLabel],
    alsoOffers: ["Medication reminders", "Transport to appointments"],
    arrangements: caregiver.arrangement
      ? [
          caregiver.arrangement === "live_in"
            ? "Live-in"
            : caregiver.arrangement === "full_day"
              ? "Full day"
              : caregiver.arrangement === "overnight"
                ? "Overnight"
                : "Part-time",
        ]
      : ["Full day"],
    areasCovered: [caregiver.area, caregiver.city],
    areasNote: `up to 10 km from ${caregiver.area}`,
    clinicalNote:
      caregiver.category === "clinical"
        ? undefined
        : `${firstName} does not offer clinical care.`,
    experience: [
      {
        id: "exp-1",
        title: `Home caregiver · Family in ${caregiver.area}`,
        detail: "2021 – Present · Day and overnight support.",
        badge: "Reference checked",
      },
      {
        id: "exp-2",
        title: "First Aid & CPR · St John Ambulance",
        detail: "2024 · valid to Jun 2026.",
        badge: "Checked by CareVYA",
      },
    ],
    availability: emptyAvailability,
    availabilityNote: `Message ${firstName} to confirm open dates and arrangement.`,
    reviews: [
      {
        id: "rev-1",
        author: "Kemi Ojo",
        rating: 5,
        dateLabel: "Sep 2026",
        body: `${firstName} was calm, kind and sent updates every evening.`,
      },
    ],
    priceBreakdown: [
      {
        label: "Live-in (per month)",
        amountLabel: `₦${caregiver.priceAmount.toLocaleString("en-NG")}`,
      },
    ],
    verification: [
      { id: "v1", label: "Identity (NIN)", status: "Verified" },
      { id: "v2", label: "Background check", status: "Clear" },
      { id: "v3", label: "References", status: "Checked" },
      { id: "v4", label: "Training", status: "Certificates checked" },
    ],
  };
}

const emekaProfile: CaregiverProfile = {
  ...mockCaregivers.find((item) => item.id === "emeka")!,
  firstName: "Emeka",
  headline: "Non-clinical & personal care · Speaks English, Yoruba, Igbo.",
  reviewCount: 32,
  yearsExperience: 8,
  about:
    "Emeka has spent 8 years supporting older adults at home with daily living, companionship and dementia-friendly routines. Families trust him for calm communication, reliable handovers and respectful care.",
  services: ["Non-clinical care", "Personal & specialized care"],
  alsoOffers: [
    "Dementia & memory support",
    "Transport to appointments",
    "Medication reminders",
  ],
  arrangements: ["Live-in", "Full day", "Overnight"],
  areasCovered: ["Yaba", "Surulere", "Ebute Metta", "Akoka"],
  areasNote: "up to 10 km from Yaba",
  clinicalNote: "Emeka does not offer clinical care.",
  experience: [
    {
      id: "e1",
      title: "Home caregiver · Sunrise Home Care",
      detail: "2019 – 2025 · Live-in and full-day care.",
      badge: "Reference checked",
    },
    {
      id: "e2",
      title: "Private caregiver · Family in Surulere",
      detail: "2016 – 2019 · Dementia care for a parent.",
      badge: "Reference checked",
    },
    {
      id: "e3",
      title: "Certificate in Caregiving · Nigerian Red Cross",
      detail: "2017.",
      badge: "Checked by CareVYA",
    },
    {
      id: "e4",
      title: "First Aid & CPR · St John Ambulance",
      detail: "2024 · valid to Jun 2026.",
      badge: "Checked by CareVYA",
    },
    {
      id: "e5",
      title: "Dementia Care Training",
      detail: "2022.",
      badge: "Checked by CareVYA",
    },
  ],
  availability: emekaAvailability,
  availabilityNote:
    "Booked for live-in 15 Oct – 14 Nov · overnight care available Fri & Sat · next free from 15 Nov",
  reviews: [
    {
      id: "r1",
      author: "Kemi Ojo",
      rating: 5,
      dateLabel: "Sep 2026",
      body: "Emeka looked after my dad for 3 days while we travelled. Calm, kind and sent updates every evening.",
    },
    {
      id: "r2",
      author: "Chidi Okafor",
      rating: 5,
      dateLabel: "Sep 2026",
      body: "Always on time and so patient with my mum. We'll book him again.",
    },
  ],
  priceBreakdown: [
    { label: "Live-in (per month)", amountLabel: "₦210,000" },
    { label: "Full day (10 hrs)", amountLabel: "₦28,000" },
    { label: "Overnight", amountLabel: "₦20,000" },
  ],
  verification: [
    { id: "v1", label: "Identity (NIN)", status: "Verified" },
    { id: "v2", label: "Background check", status: "Clear" },
    { id: "v3", label: "References", status: "2 checked" },
    { id: "v4", label: "Training", status: "Certificates checked" },
  ],
};

const profileOverrides: Record<string, CaregiverProfile> = {
  emeka: emekaProfile,
};

export function getCaregiverProfile(id: string): CaregiverProfile | null {
  const override = profileOverrides[id];
  if (override) return override;

  const caregiver =
    mockCaregivers.find((item) => item.id === id) ??
    buildFindCareCatalog().find((item) => item.id === id);
  if (!caregiver) return null;
  return buildDefaultProfile(caregiver);
}

export function getCaregiverProfileIds(): string[] {
  const catalogIds = buildFindCareCatalog().map((item) => item.id);
  return Array.from(new Set([...mockCaregivers.map((item) => item.id), ...catalogIds]));
}
