import { assets } from "@/lib/assets";
import type { CaregiverPublicProfile } from "@/features/caregiver-dashboard/types/profile";

export const PROFILE_CARE_TYPE_OPTIONS = [
  "Non-clinical care",
  "Clinical care",
  "Personal & specialized care",
] as const;

export const PROFILE_SPECIALIZATION_OPTIONS = [
  "Companionship",
  "Elderly care",
  "Emergency care",
  "Personal care",
  "Mobility support",
  "Dementia care",
  "Infant care",
  "Disability support",
  "Post-surgery care",
  "Transport to appointments",
] as const;

export const PROFILE_ARRANGEMENT_OPTIONS = [
  "Live-in",
  "Full day",
  "Part-time",
  "Overnight",
  "Weekends only",
] as const;

export const PROFILE_LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
] as const;

export const PROFILE_TRAVEL_OPTIONS = [
  "Up to 5 km",
  "Up to 10 km",
  "Up to 20 km",
  "Anywhere in Lagos",
] as const;

export const caregiverProfileSeed: CaregiverPublicProfile = {
  fullName: "Emeka Okonkwo",
  photoUrl: assets.homeTestimonialAvatarD,
  verified: true,
  yearsLabel: "5+ years experience",
  rating: 4.9,
  reviewCount: 32,
  location: "Yaba, Lagos",
  gender: "Male",
  bio: "Caring, patient caregiver with 8 years supporting older adults with non-clinical and personal care. I help with daily routines, meals, hygiene and mobility. Families tell me I’m calm in difficult moments and keep them updated.",
  careType: "Non-clinical care",
  specializations: [
    "Companionship",
    "Emergency care",
    "Dementia care",
    "Transport to appointments",
  ],
  arrangements: ["Live-in", "Full day", "Part-time"],
  languages: ["English", "Yoruba", "Igbo"],
  areas: ["Yaba", "Surulere", "Ebute Metta", "Akoka"],
  travelLabel: "Up to 10 km",
  rates: {
    dayShift: 15_000,
    nightShift: 25_000,
    weekly: 85_000,
    monthlyLiveIn: 250_000,
  },
  availability: {
    modeLabel: "Full time · 40 hrs/week",
    openToLabel: "On-call, overnight, short visits",
    startLabel: "Immediately",
  },
  credentials: [
    {
      id: "c1",
      title: "Registered nurse licence",
      detail: "Nursing & Midwifery Council of Nigeria · 2019",
      status: "licence_checked",
    },
    {
      id: "c2",
      title: "Home caregiver",
      detail: "Sunrise Home Care · 2021 – 2023",
      status: "reference_checked",
    },
    {
      id: "c3",
      title: "Private caregiver",
      detail: "Careseeker in Surulere · 2023 – Present",
      status: "reference_checked",
    },
    {
      id: "c4",
      title: "Certificate in Caregiving",
      detail: "Lagos State · 2020",
      status: "certificate_checked",
    },
    {
      id: "c5",
      title: "First Aid & CPR",
      detail: "Red Cross · 2024",
      status: "certificate_checked",
    },
    {
      id: "c6",
      title: "Dementia Care Training",
      detail: "Alzheimer’s Association · 2022",
      status: "certificate_checked",
    },
  ],
  verification: [
    { id: "v1", label: "Identity (NIN)", done: true },
    { id: "v2", label: "Background check", done: true },
    { id: "v3", label: "Proof of address", done: true },
    { id: "v4", label: "References (2 of 2 confirmed)", done: true },
    { id: "v5", label: "Training certificates (3 checked)", done: true },
  ],
  reviews: [
    {
      id: "r1",
      authorName: "Kemi Ojo",
      rating: 5,
      dateLabel: "2 weeks ago",
      body: "Emeka was wonderful with my mum. Punctual, kind, and always kept us updated.",
    },
    {
      id: "r2",
      authorName: "Chidi Okafor",
      rating: 5,
      dateLabel: "1 month ago",
      body: "Reliable overnight care. We felt safe leaving dad with him.",
    },
  ],
};

export function formatProfileNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function formatRateInput(amount: number): string {
  return Math.round(amount).toLocaleString("en-NG");
}

export function parseRateInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}
