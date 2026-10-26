import type { Caregiver } from "@/features/dashboard/types";

export type AvailabilitySlot = "morning" | "afternoon" | "evening";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ExperienceItem = {
  id: string;
  title: string;
  detail: string;
  badge: "Reference checked" | "Checked by CareVYA";
};

export type CaregiverReview = {
  id: string;
  author: string;
  rating: number;
  dateLabel: string;
  body: string;
};

export type PriceBreakdownItem = {
  label: string;
  amountLabel: string;
};

export type VerificationItem = {
  id: string;
  label: string;
  status: string;
};

export type CaregiverProfile = Caregiver & {
  firstName: string;
  headline: string;
  reviewCount: number;
  yearsExperience: number;
  about: string;
  services: string[];
  alsoOffers: string[];
  arrangements: string[];
  areasCovered: string[];
  areasNote: string;
  clinicalNote?: string;
  experience: ExperienceItem[];
  availability: Record<Weekday, Partial<Record<AvailabilitySlot, boolean>>>;
  availabilityNote: string;
  reviews: CaregiverReview[];
  priceBreakdown: PriceBreakdownItem[];
  verification: VerificationItem[];
};
