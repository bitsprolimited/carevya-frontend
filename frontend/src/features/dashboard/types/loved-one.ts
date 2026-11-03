export type LovedOneTab =
  | "overview"
  | "health"
  | "care-plan"
  | "history"
  | "contacts";

export type LovedOneProfile = {
  id: string;
  firstName: string;
  fullName: string;
  relationship: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  avatarUrl: string;
  profileComplete: boolean;
  updatedLabel: string;
  area: string;
  city: string;
  lga: string;
  address: string;
  languages: string[];
  preferredLanguage: string;
  careTypeSummary: string;
  careTypeDetail: string;
  about: {
    fullName: string;
    relationship: string;
    dateOfBirth: string;
    gender: string;
    homeAddress: string;
    languages: string;
  };
  healthGlance: {
    conditions: string[];
    mobility: string;
    allergies: string;
    medicines: string;
  };
  careNeeds: {
    typeOfCare: string;
    arrangement: string;
    careStarted: string;
    caregiverPreference: string;
  };
  nextCare: {
    title: string;
    whenLabel: string;
    caregiverName: string;
    untilLabel: string;
    bookingId: string;
  } | null;
  careTeam: Array<{
    id: string;
    name: string;
    role: string;
    verified: boolean;
    avatarUrl: string;
    phone: string;
  }>;
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    orderLabel: string;
    phone: string;
    isYou?: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    detail: string;
    timeLabel: string;
  }>;
  conditions: Array<{
    name: string;
    diagnosed: string;
    note: string;
  }>;
  medications: Array<{
    id: string;
    name: string;
    form: string;
    purpose: string;
    schedule: string;
    instruction: string;
  }>;
  allergiesDiet: {
    medicineAllergies: string;
    foodAllergies: string;
    diet: string;
    fluids: string;
  };
  mobility: Array<{
    label: string;
    level: string;
    tone: "amber" | "emerald" | "blue";
  }>;
  doctor: {
    name: string;
    role: string;
    clinic: string;
    phone: string;
    nextCheckup: string;
  };
  caregiverNotes: {
    body: string;
    meta: string;
  };
  carePlan: {
    typeOfCare: string;
    arrangement: string;
    schedule: string;
    startDate: string;
    duration: string;
    routine: Array<{ time: string; title: string; note?: string }>;
    preferences: {
      gender: string;
      languages: string;
      experience: string;
      other: string;
    };
    enjoys: string[];
    home: {
      livesWith: string;
      home: string;
      caregiverRoom: string;
      power: string;
    };
  };
  homeAccess: {
    address: string;
    landmark: string;
    gettingIn: string;
    nearestHospital: string;
    parking: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  history: Array<{
    id: string;
    title: string;
    caregiver: string;
    dateLabel: string;
    status: string;
  }>;
  sharing: {
    healthDetails: boolean;
    documents: boolean;
    addressBeforeBook: boolean;
  };
};
