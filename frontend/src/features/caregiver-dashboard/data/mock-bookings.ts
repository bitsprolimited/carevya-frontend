export type CaregiverBookingListStatus = "in_progress" | "completed";

export type CaregiverBookingTimelineStep = {
  id: string;
  label: string;
  detail: string;
  state: "done" | "current" | "upcoming";
};

export type CaregiverBooking = {
  id: string;
  reference: string;
  patientName: string;
  patientAvatarUrl: string;
  patientGender: string;
  patientInitials: string;
  patientAge: string;
  bookedByName: string;
  bookedByRelation: string;
  careLabel: string;
  careDurationLabel: string;
  datesLabel: string;
  startsLabel: string;
  agreedPriceLabel: string;
  priceNote: string;
  location: string;
  arrangement: string;
  listStatus: CaregiverBookingListStatus;
  reviewRating: number | null;
  statusBanner: string;
  checkInUnlocked: boolean;
  checkInUnlockHint: string;
  paidIntoWallet: boolean;
  careNeeded: string;
  languages: string;
  homeAddress: string;
  mobility: string;
  healthConditions: string;
  medications: string;
  allergies: string;
  dailyRoutine: string;
  emergencyContacts: Array<{ name: string; relation: string; phone: string }>;
  careseekerContact: { name: string; relation: string; phone: string };
  timeline: CaregiverBookingTimelineStep[];
  isUpcomingFeatured?: boolean;
};

export const CHECK_IN_TIMES = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
] as const;

export const CAREGIVER_BOOKING_ISSUE_OPTIONS = [
  "Last-minute cancellation",
  "Careseeker didn’t confirm care",
  "Safety or wellbeing concern",
  "Disagreement about the agreed price",
  "Payment or payout issue",
  "Something else",
] as const;

export type CaregiverReportBookingOption = {
  id: string;
  /** Compact trigger label, e.g. Grace Bills · #CV-2041 */
  triggerLabel: string;
  name: string;
  careLabel: string;
  dateLabel: string;
  reference: string;
  avatarUrl: string;
};

export const CAREGIVER_REPORT_NO_BOOKING_ID = "not-about-a-booking";

export function getCaregiverReportBookingOptions(): CaregiverReportBookingOption[] {
  return caregiverBookingsSeed
    .filter((booking) => booking.listStatus === "in_progress")
    .slice(0, 3)
    .map((booking) => ({
      id: booking.id,
      triggerLabel: `${booking.bookedByName} · ${booking.reference}`,
      name: booking.bookedByName,
      careLabel: booking.careLabel.replace(/ care$/i, ""),
      dateLabel: booking.startsLabel.split(" · ")[0] ?? booking.datesLabel,
      reference: booking.reference,
      avatarUrl: booking.patientAvatarUrl,
    }));
}

export const caregiverBookingsSeed: CaregiverBooking[] = [
  {
    id: "cv-2041",
    reference: "#CV-2041",
    patientName: "Folake Adebayo",
    patientAvatarUrl: "/default-avatar.svg",
    patientGender: "Female",
    patientInitials: "FA",
    patientAge: "74 years old",
    bookedByName: "Grace Bills",
    bookedByRelation: "Daughter",
    careLabel: "Live-in care",
    careDurationLabel: "1 month",
    datesLabel: "15 Oct – 14 Nov",
    startsLabel: "Thu 15 Oct · 8:00 AM",
    agreedPriceLabel: "₦185,000",
    priceNote: "Agreed in chat",
    location: "Yaba, Lagos",
    arrangement: "Live-in",
    listStatus: "in_progress",
    reviewRating: null,
    statusBanner: "Confirmed · care starts in 2 days",
    checkInUnlocked: true,
    checkInUnlockHint:
      "Check in unlocks on Thu 15 Oct when you’re at Folake’s home.",
    paidIntoWallet: true,
    careNeeded: "Non-clinical care, Personal care",
    languages: "English, Yoruba",
    homeAddress: "Flat 3, 21 Akinola Street, Yaba, Lagos",
    mobility: "Walks with some help (uses a walking stick)",
    healthConditions: "Hypertension, Arthritis",
    medications: "Amlodipine 5mg every morning",
    allergies: "Penicillin",
    dailyRoutine:
      "Short morning walk, Yoruba gospel music in the afternoon, bedtime by 9pm.",
    emergencyContacts: [
      {
        name: "Tunde Adebayo",
        relation: "Son",
        phone: "+234 803 111 2222",
      },
      {
        name: "Solomon Adebayo",
        relation: "Brother",
        phone: "+234 802 333 4444",
      },
    ],
    careseekerContact: {
      name: "Grace Bills",
      relation: "Daughter",
      phone: "+234 809 555 6666",
    },
    isUpcomingFeatured: true,
    timeline: [
      {
        id: "received",
        label: "Request received",
        detail: "Sat 10 Oct",
        state: "done",
      },
      {
        id: "accepted",
        label: "You accepted",
        detail: "Sat 10 Oct",
        state: "done",
      },
      {
        id: "price",
        label: "Price agreed",
        detail: "Mon 12 Oct",
        state: "done",
      },
      {
        id: "confirmed",
        label: "Grace confirmed the booking",
        detail: "Mon 12 Oct",
        state: "done",
      },
      {
        id: "starts",
        label: "Care starts",
        detail: "Thu 15 Oct",
        state: "current",
      },
      {
        id: "ends",
        label: "Care ends",
        detail: "Sat 14 Nov",
        state: "upcoming",
      },
      {
        id: "completed",
        label: "Care completed · Grace leaves a review",
        detail: "Sat 14 Nov",
        state: "upcoming",
      },
    ],
  },
  {
    id: "cv-1988",
    reference: "#CV-1988",
    patientName: "Mr. Femi Ojo",
    patientAvatarUrl: "/default-avatar.svg",
    patientGender: "Male",
    patientInitials: "FO",
    patientAge: "83",
    bookedByName: "Kemi Ojo",
    bookedByRelation: "Daughter",
    careLabel: "Respite care",
    careDurationLabel: "3 days",
    datesLabel: "21 – 23 Sep 2026",
    startsLabel: "Mon 21 Sep · 9:00 AM",
    agreedPriceLabel: "₦75,600",
    priceNote: "Agreed in chat",
    location: "Ikeja, Lagos",
    arrangement: "Respite",
    listStatus: "in_progress",
    reviewRating: 5,
    statusBanner: "In progress",
    checkInUnlocked: false,
    checkInUnlockHint: "Check in unlocks on the start date at the care home.",
    paidIntoWallet: true,
    careNeeded: "Non-clinical care",
    languages: "English",
    homeAddress: "12 Allen Avenue, Ikeja, Lagos",
    mobility: "Uses a walker",
    healthConditions: "Diabetes",
    medications: "Metformin morning and evening",
    allergies: "None",
    dailyRoutine: "Afternoon nap and evening news.",
    emergencyContacts: [
      { name: "Kemi Ojo", relation: "Daughter", phone: "+234 801 222 3333" },
    ],
    careseekerContact: {
      name: "Kemi Ojo",
      relation: "Daughter",
      phone: "+234 801 222 3333",
    },
    timeline: [
      {
        id: "received",
        label: "Request received",
        detail: "Fri 18 Sep",
        state: "done",
      },
      {
        id: "accepted",
        label: "You accepted",
        detail: "Fri 18 Sep",
        state: "done",
      },
      {
        id: "starts",
        label: "Care starts",
        detail: "Mon 21 Sep",
        state: "current",
      },
      {
        id: "ends",
        label: "Care ends",
        detail: "Wed 23 Sep",
        state: "upcoming",
      },
      {
        id: "completed",
        label: "Care completed",
        detail: "Wed 23 Sep",
        state: "upcoming",
      },
    ],
  },
  {
    id: "cv-1970",
    reference: "#CV-1970",
    patientName: "Mrs. Rita Okafor",
    patientAvatarUrl: "/default-avatar.svg",
    patientGender: "Female",
    patientInitials: "RO",
    patientAge: "79",
    bookedByName: "Chidi Okafor",
    bookedByRelation: "Son",
    careLabel: "Full day care",
    careDurationLabel: "5 days",
    datesLabel: "1 – 5 Sep 2026",
    startsLabel: "Tue 1 Sep · 8:00 AM",
    agreedPriceLabel: "₦140,000",
    priceNote: "Agreed in chat",
    location: "Surulere, Lagos",
    arrangement: "Full day",
    listStatus: "in_progress",
    reviewRating: 5,
    statusBanner: "In progress",
    checkInUnlocked: false,
    checkInUnlockHint: "Check in unlocks on the start date at the care home.",
    paidIntoWallet: true,
    careNeeded: "Personal care",
    languages: "English, Igbo",
    homeAddress: "8 Bode Thomas, Surulere, Lagos",
    mobility: "Partially mobile",
    healthConditions: "Arthritis",
    medications: "Pain relief as needed",
    allergies: "None",
    dailyRoutine: "Morning stretches and light meals.",
    emergencyContacts: [
      { name: "Chidi Okafor", relation: "Son", phone: "+234 807 444 5555" },
    ],
    careseekerContact: {
      name: "Chidi Okafor",
      relation: "Son",
      phone: "+234 807 444 5555",
    },
    timeline: [
      {
        id: "received",
        label: "Request received",
        detail: "Sun 30 Aug",
        state: "done",
      },
      {
        id: "accepted",
        label: "You accepted",
        detail: "Sun 30 Aug",
        state: "done",
      },
      {
        id: "starts",
        label: "Care starts",
        detail: "Tue 1 Sep",
        state: "current",
      },
      {
        id: "ends",
        label: "Care ends",
        detail: "Sat 5 Sep",
        state: "upcoming",
      },
      {
        id: "completed",
        label: "Care completed",
        detail: "Sat 5 Sep",
        state: "upcoming",
      },
    ],
  },
  {
    id: "cv-1901",
    reference: "#CV-1901",
    patientName: "Mr. Femi Ojo",
    patientAvatarUrl: "/default-avatar.svg",
    patientGender: "Male",
    patientInitials: "FO",
    patientAge: "83",
    bookedByName: "Kemi Ojo",
    bookedByRelation: "Daughter",
    careLabel: "Respite care",
    careDurationLabel: "3 days",
    datesLabel: "21 – 23 Sep 2026",
    startsLabel: "Mon 21 Sep · 9:00 AM",
    agreedPriceLabel: "₦75,600",
    priceNote: "Agreed in chat",
    location: "Ikeja, Lagos",
    arrangement: "Respite",
    listStatus: "completed",
    reviewRating: 5,
    statusBanner: "Completed",
    checkInUnlocked: false,
    checkInUnlockHint: "",
    paidIntoWallet: true,
    careNeeded: "Non-clinical care",
    languages: "English",
    homeAddress: "12 Allen Avenue, Ikeja, Lagos",
    mobility: "Uses a walker",
    healthConditions: "Diabetes",
    medications: "Metformin",
    allergies: "None",
    dailyRoutine: "Afternoon nap.",
    emergencyContacts: [
      { name: "Kemi Ojo", relation: "Daughter", phone: "+234 801 222 3333" },
    ],
    careseekerContact: {
      name: "Kemi Ojo",
      relation: "Daughter",
      phone: "+234 801 222 3333",
    },
    timeline: [
      {
        id: "completed",
        label: "Care completed",
        detail: "Wed 23 Sep",
        state: "done",
      },
    ],
  },
  {
    id: "cv-1880",
    reference: "#CV-1880",
    patientName: "Mrs. Rita Okafor",
    patientAvatarUrl: "/default-avatar.svg",
    patientGender: "Female",
    patientInitials: "RO",
    patientAge: "79",
    bookedByName: "Chidi Okafor",
    bookedByRelation: "Son",
    careLabel: "Full day care",
    careDurationLabel: "5 days",
    datesLabel: "1 – 5 Sep 2026",
    startsLabel: "Tue 1 Sep · 8:00 AM",
    agreedPriceLabel: "₦140,000",
    priceNote: "Agreed in chat",
    location: "Surulere, Lagos",
    arrangement: "Full day",
    listStatus: "completed",
    reviewRating: 5,
    statusBanner: "Completed",
    checkInUnlocked: false,
    checkInUnlockHint: "",
    paidIntoWallet: true,
    careNeeded: "Personal care",
    languages: "English, Igbo",
    homeAddress: "8 Bode Thomas, Surulere, Lagos",
    mobility: "Partially mobile",
    healthConditions: "Arthritis",
    medications: "Pain relief",
    allergies: "None",
    dailyRoutine: "Morning stretches.",
    emergencyContacts: [
      { name: "Chidi Okafor", relation: "Son", phone: "+234 807 444 5555" },
    ],
    careseekerContact: {
      name: "Chidi Okafor",
      relation: "Son",
      phone: "+234 807 444 5555",
    },
    timeline: [
      {
        id: "completed",
        label: "Care completed",
        detail: "Sat 5 Sep",
        state: "done",
      },
    ],
  },
  {
    id: "cv-1802",
    reference: "#CV-1802",
    patientName: "Mr. Dele Coker",
    patientAvatarUrl: "/default-avatar.svg",
    patientGender: "Male",
    patientInitials: "DC",
    patientAge: "76",
    bookedByName: "Ada Coker",
    bookedByRelation: "Daughter",
    careLabel: "Transport to clinic",
    careDurationLabel: "1 trip",
    datesLabel: "28 Aug 2026",
    startsLabel: "Thu 28 Aug · 10:00 AM",
    agreedPriceLabel: "₦16,000",
    priceNote: "Agreed in chat",
    location: "Lekki, Lagos",
    arrangement: "Transport",
    listStatus: "completed",
    reviewRating: 4.8,
    statusBanner: "Completed",
    checkInUnlocked: false,
    checkInUnlockHint: "",
    paidIntoWallet: true,
    careNeeded: "Transport",
    languages: "English",
    homeAddress: "Lekki Phase 1, Lagos",
    mobility: "Fully mobile",
    healthConditions: "None noted",
    medications: "None",
    allergies: "None",
    dailyRoutine: "Clinic visits monthly.",
    emergencyContacts: [
      { name: "Ada Coker", relation: "Daughter", phone: "+234 806 777 8888" },
    ],
    careseekerContact: {
      name: "Ada Coker",
      relation: "Daughter",
      phone: "+234 806 777 8888",
    },
    timeline: [
      {
        id: "completed",
        label: "Care completed",
        detail: "Thu 28 Aug",
        state: "done",
      },
    ],
  },
];
