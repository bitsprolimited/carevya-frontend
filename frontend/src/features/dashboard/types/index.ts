export type CareCategory =
  | "non_clinical"
  | "personal_specialized"
  | "clinical";

export type CareArrangement = "live_in" | "full_day" | "part_time" | "overnight";

export type CaregiverSort =
  | "recommended"
  | "highest_rated"
  | "nearest"
  | "price_asc"
  | "price_desc"
  | "most_experienced";

export type CareRecipient = {
  id: string;
  firstName: string;
  fullName: string;
  relationship: string;
  age: number;
  area: string;
  city: string;
  avatarUrl: string;
};

export type Caregiver = {
  id: string;
  name: string;
  verified: boolean;
  category: CareCategory;
  categoryLabel: string;
  rating: number;
  area: string;
  city: string;
  priceLabel: string;
  priceAmount: number;
  arrangement?: CareArrangement;
  gender: "female" | "male";
  languages: string[];
  imageUrl: string;
  saved?: boolean;
  recipientIds: string[];
};

export type DashboardAppointment = {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  caregiverName: string;
  caregiverAvatarUrl: string;
  dayOfMonth: number;
};

export type DashboardStats = {
  appointments: { count: number; detail: string };
  pendingRequests: { count: number; detail: string };
  unreadMessages: { count: number; detail: string };
};

export type DashboardFilters = {
  categories: CareCategory[];
  arrangements: CareArrangement[];
  recipientId: string | null;
  sort: CaregiverSort;
  gender: "any" | "female" | "male";
  languages: string[];
};

export const CARE_CATEGORY_OPTIONS: {
  value: CareCategory;
  label: string;
}[] = [
  { value: "non_clinical", label: "Non-clinical care" },
  { value: "personal_specialized", label: "Personal & specialized care" },
  { value: "clinical", label: "Clinical care" },
];

export const ARRANGEMENT_OPTIONS: {
  value: CareArrangement;
  label: string;
}[] = [
  { value: "live_in", label: "Live-in" },
  { value: "full_day", label: "Full day" },
  { value: "part_time", label: "Part-time" },
  { value: "overnight", label: "Overnight" },
];

export const SORT_OPTIONS: { value: CaregiverSort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "highest_rated", label: "Highest rated" },
  { value: "nearest", label: "Nearest to me" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "most_experienced", label: "Most experienced" },
];

export const defaultDashboardFilters = (
  recipientId: string | null = null,
): DashboardFilters => ({
  categories: ["non_clinical", "personal_specialized"],
  arrangements: [],
  recipientId,
  sort: "recommended",
  gender: "any",
  languages: [],
});
