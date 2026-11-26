export type CaregiverRequestStatus = "pending" | "accepted" | "declined";

export type CaregiverCareTypeFilter =
  | "Clinical care"
  | "Non-clinical care"
  | "Personal & specialized care";

export type CaregiverRequest = {
  id: string;
  careseekerName: string;
  careseekerAvatarUrl: string;
  careType: CaregiverCareTypeFilter;
  proposedDate: string;
  proposedTime: string;
  location: string;
  status: CaregiverRequestStatus;
  requestedOn: string;
  requestedDateTime: string;
  languages: string;
  preferredCaregiver: string;
  pricingLabel: string;
  patient: {
    name: string;
    avatarUrl: string;
    bio: string;
    careType: string;
    languages: string;
    relationship: string;
    gender: string;
    mobility: string;
    age: string;
    dailyRoutines: string;
    arrangement: string;
    emergencyContact: string;
  };
};

export const CAREGIVER_REQUEST_DECLINE_REASONS = [
  "Pricing is too poor",
  "Schedule conflict",
  "Location is too far",
  "Outside my care specialty",
  "Personal reasons",
  "Something else",
] as const;

export const caregiverRequestsSeed: CaregiverRequest[] = [
  {
    id: "req-1",
    careseekerName: "Olumide",
    careseekerAvatarUrl: "/default-avatar.svg",
    careType: "Clinical care",
    proposedDate: "Mon, 29th Oct",
    proposedTime: "08:30AM",
    location: "Wuje, Lagos",
    status: "pending",
    requestedOn: "Sat, 18 Oct 2026",
    requestedDateTime: "Mon, 28 Oct • 10:00PM",
    languages: "English & Yoruba",
    preferredCaregiver: "Female",
    pricingLabel: "₦190,000",
    patient: {
      name: "Folake Adebayo",
      avatarUrl: "/default-avatar.svg",
      bio: "My mum is 77 years old and she needs assistance with daily activities, meal preparation, and companionship at home.",
      careType: "Non-clinical care",
      languages: "English & Igbo",
      relationship: "Mother",
      gender: "Female",
      mobility: "Partially mobile",
      age: "77 y/o",
      dailyRoutines: "Like a short morning walk and Yoruba gospel music.",
      arrangement: "Live-in, 15 Oct - 14 Nov 2026",
      emergencyContact: "Tunde Adebayo +234 444 666 7777",
    },
  },
  {
    id: "req-2",
    careseekerName: "Daniel Escobar",
    careseekerAvatarUrl: "/default-avatar.svg",
    careType: "Non-clinical care",
    proposedDate: "Wed, 19th Oct",
    proposedTime: "10:30AM",
    location: "Yaba, Lagos",
    status: "pending",
    requestedOn: "Fri, 17 Oct 2026",
    requestedDateTime: "Wed, 19 Oct • 10:30AM",
    languages: "English",
    preferredCaregiver: "Any",
    pricingLabel: "₦85,000",
    patient: {
      name: "Maria Escobar",
      avatarUrl: "/default-avatar.svg",
      bio: "Needs companionship and help with light household tasks a few days each week.",
      careType: "Non-clinical care",
      languages: "English & Spanish",
      relationship: "Mother",
      gender: "Female",
      mobility: "Fully mobile",
      age: "68 y/o",
      dailyRoutines: "Enjoys afternoon tea and short walks.",
      arrangement: "Part-time, Wed & Fri",
      emergencyContact: "Daniel Escobar +234 801 222 3333",
    },
  },
  {
    id: "req-3",
    careseekerName: "Joy Raminde",
    careseekerAvatarUrl: "/default-avatar.svg",
    careType: "Non-clinical care",
    proposedDate: "Wed, 29th Oct",
    proposedTime: "10:00AM",
    location: "Surulere, Lagos",
    status: "accepted",
    requestedOn: "Thu, 16 Oct 2026",
    requestedDateTime: "Wed, 29 Oct • 10:00AM",
    languages: "English & Yoruba",
    preferredCaregiver: "Female",
    pricingLabel: "₦150,000",
    patient: {
      name: "Bola Raminde",
      avatarUrl: "/default-avatar.svg",
      bio: "Needs overnight support and medication reminders.",
      careType: "Non-clinical care",
      languages: "Yoruba",
      relationship: "Aunt",
      gender: "Female",
      mobility: "Partially mobile",
      age: "74 y/o",
      dailyRoutines: "Evening prayers and light stretches.",
      arrangement: "Overnight, 29 Oct - 5 Nov 2026",
      emergencyContact: "Joy Raminde +234 809 111 2222",
    },
  },
  {
    id: "req-4",
    careseekerName: "Olumide",
    careseekerAvatarUrl: "/default-avatar.svg",
    careType: "Clinical care",
    proposedDate: "Mon, 29th Oct",
    proposedTime: "08:30AM",
    location: "Wuje, Lagos",
    status: "accepted",
    requestedOn: "Wed, 15 Oct 2026",
    requestedDateTime: "Mon, 29 Oct • 08:30AM",
    languages: "English & Yoruba",
    preferredCaregiver: "Female",
    pricingLabel: "₦190,000",
    patient: {
      name: "Folake Adebayo",
      avatarUrl: "/default-avatar.svg",
      bio: "Needs clinical monitoring and medication support at home.",
      careType: "Clinical care",
      languages: "English & Igbo",
      relationship: "Mother",
      gender: "Female",
      mobility: "Partially mobile",
      age: "77 y/o",
      dailyRoutines: "Short morning walk and gospel music.",
      arrangement: "Live-in, 15 Oct - 14 Nov 2026",
      emergencyContact: "Tunde Adebayo +234 444 666 7777",
    },
  },
  {
    id: "req-5",
    careseekerName: "Olumide",
    careseekerAvatarUrl: "/default-avatar.svg",
    careType: "Clinical care",
    proposedDate: "Mon, 29th Oct",
    proposedTime: "08:30AM",
    location: "Wuje, Lagos",
    status: "declined",
    requestedOn: "Tue, 14 Oct 2026",
    requestedDateTime: "Mon, 29 Oct • 08:30AM",
    languages: "English",
    preferredCaregiver: "Any",
    pricingLabel: "₦120,000",
    patient: {
      name: "Kunle Adebayo",
      avatarUrl: "/default-avatar.svg",
      bio: "Post-surgery recovery support requested for two weeks.",
      careType: "Clinical care",
      languages: "English",
      relationship: "Father",
      gender: "Male",
      mobility: "Limited mobility",
      age: "81 y/o",
      dailyRoutines: "Physio exercises mid-morning.",
      arrangement: "Full day, 2 weeks",
      emergencyContact: "Olumide +234 803 000 1111",
    },
  },
  {
    id: "req-6",
    careseekerName: "Olumide",
    careseekerAvatarUrl: "/default-avatar.svg",
    careType: "Clinical care",
    proposedDate: "Mon, 29th Oct",
    proposedTime: "08:30AM",
    location: "Wuje, Lagos",
    status: "declined",
    requestedOn: "Mon, 13 Oct 2026",
    requestedDateTime: "Mon, 29 Oct • 08:30AM",
    languages: "English & Yoruba",
    preferredCaregiver: "Male",
    pricingLabel: "₦95,000",
    patient: {
      name: "Sade Adebayo",
      avatarUrl: "/default-avatar.svg",
      bio: "Needs weekend companionship and meal support.",
      careType: "Non-clinical care",
      languages: "Yoruba",
      relationship: "Sister",
      gender: "Female",
      mobility: "Fully mobile",
      age: "64 y/o",
      dailyRoutines: "Market visits on Saturdays.",
      arrangement: "Weekends only",
      emergencyContact: "Olumide +234 803 000 1111",
    },
  },
];
