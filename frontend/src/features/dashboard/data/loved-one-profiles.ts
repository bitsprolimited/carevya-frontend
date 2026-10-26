import { assets } from "@/lib/assets";
import type { LovedOneProfile } from "@/features/dashboard/types/loved-one";

const folake: LovedOneProfile = {
  id: "folake",
  firstName: "Folake",
  fullName: "Folake Adebayo",
  relationship: "Mother",
  gender: "Female",
  dateOfBirth: "12 Mar 1952",
  age: 74,
  avatarUrl: assets.homeTestimonialAvatarC,
  profileComplete: true,
  updatedLabel: "Updated 14 Oct 2026",
  area: "Yaba",
  city: "Lagos",
  lga: "Lagos Mainland",
  address: "14 Herbert Macaulay Way, Yaba, Lagos",
  languages: ["English", "Yoruba"],
  preferredLanguage: "Yoruba",
  careTypeSummary: "Live-in care",
  careTypeDetail: "Companionship, personal care",
  about: {
    fullName: "Folake Adebayo",
    relationship: "Mother",
    dateOfBirth: "12 Mar 1952",
    gender: "Female",
    homeAddress: "14 Herbert Macaulay Way, Yaba, Lagos",
    languages: "English, Yoruba (prefers Yoruba at home)",
  },
  healthGlance: {
    conditions: ["Hypertension", "Arthritis (knees)"],
    mobility: "Walks with some help (uses a walking stick)",
    allergies: "Penicillin — causes a rash",
    medicines: "3 daily medicines — needs reminders",
  },
  careNeeds: {
    typeOfCare: "Non-clinical · Personal care",
    arrangement: "Live-in",
    careStarted: "15 Oct 2026",
    caregiverPreference: "Yoruba-speaking, elderly care experience",
  },
  nextCare: {
    title: "Live-in care starts today",
    whenLabel: "Thu 15 Oct · 8:00 AM",
    caregiverName: "Emeka Okonkwo",
    untilLabel: "until 14 Nov",
    bookingId: "cv-2041",
  },
  careTeam: [
    {
      id: "emeka",
      name: "Emeka Okonkwo",
      role: "Live-in care",
      verified: true,
      avatarUrl: assets.aboutMemberDevG,
      phone: "+234 801 000 1111",
    },
    {
      id: "chinedu",
      name: "Chinedu Obi",
      role: "Transport to clinic",
      verified: true,
      avatarUrl: assets.aboutMemberDevE,
      phone: "+234 802 000 2222",
    },
  ],
  emergencyContacts: [
    {
      id: "tunde",
      name: "Tunde Adebayo",
      relationship: "Son",
      orderLabel: "1st contact",
      phone: "+234 809 111 2233",
    },
    {
      id: "grace",
      name: "Grace Bills",
      relationship: "Daughter",
      orderLabel: "2nd contact",
      phone: "+234 809 221 3340",
      isYou: true,
    },
  ],
  recentActivity: [
    {
      id: "a1",
      title: "Emeka accepted live-in care booking",
      detail: "Confirm by Wed 14 Oct",
      timeLabel: "Today · 11:02 AM",
    },
    {
      id: "a2",
      title: "You updated Folake’s medicines",
      detail: "Added Glucosamine 1500 mg",
      timeLabel: "Yesterday",
    },
    {
      id: "a3",
      title: "Chinedu completed transport to clinic",
      detail: "Sat 11 Oct · LUTH",
      timeLabel: "4 days ago",
    },
  ],
  conditions: [
    {
      name: "Hypertension",
      diagnosed: "Diagnosed 2015",
      note: "Managed with Amlodipine. Check blood pressure each morning before medicine.",
    },
    {
      name: "Arthritis (knees)",
      diagnosed: "Diagnosed 2019",
      note: "Uses a walking stick for longer walks. Avoid stairs when possible.",
    },
  ],
  medications: [
    {
      id: "m1",
      name: "Amlodipine 5 mg",
      form: "Tablet",
      purpose: "Blood pressure",
      schedule: "Once daily · 8:00 AM",
      instruction: "Take with breakfast",
    },
    {
      id: "m2",
      name: "Paracetamol 500 mg",
      form: "Tablet",
      purpose: "Knee pain",
      schedule: "When needed",
      instruction: "No more than 6 tablets a day",
    },
    {
      id: "m3",
      name: "Glucosamine 1500 mg",
      form: "Supplement",
      purpose: "Joints",
      schedule: "Once daily · 8:00 PM",
      instruction: "Take after dinner",
    },
  ],
  allergiesDiet: {
    medicineAllergies: "Penicillin — causes a rash and swelling",
    foodAllergies: "None known",
    diet: "Soft meals preferred; enjoys pepper soup and pap",
    fluids: "Encourage water through the day; tea with breakfast",
  },
  mobility: [
    { label: "Walking", level: "Some help", tone: "amber" },
    { label: "Dressing", level: "Some help", tone: "amber" },
    { label: "Eating", level: "Independent", tone: "emerald" },
    { label: "Toileting", level: "Independent", tone: "emerald" },
    { label: "Medicines", level: "Reminders", tone: "blue" },
  ],
  doctor: {
    name: "Dr. Adaeze Nwosu",
    role: "GP",
    clinic: "LUTH, Idi-Araba",
    phone: "+234 803 555 0101",
    nextCheckup: "Tue 20 Oct · 9:00 AM",
  },
  caregiverNotes: {
    body: "She likes a calm morning: wash face, blood pressure check, then Amlodipine with breakfast. Speak Yoruba when you can — she follows English, but Yoruba puts her at ease.",
    meta: "Added by you · 12 Oct",
  },
  carePlan: {
    typeOfCare: "Companionship, Personal care",
    arrangement: "Live-in",
    schedule: "Monday to Saturday",
    startDate: "15 October 2026",
    duration: "1 month",
    routine: [
      {
        time: "7:00 AM",
        title: "Wake and freshen up",
        note: "Help with washing face and dressing if needed",
      },
      {
        time: "8:00 AM",
        title: "Breakfast and morning medicine",
        note: "Check blood pressure before Amlodipine",
      },
      {
        time: "10:00 AM",
        title: "Short walk or sitting outside",
        note: "Use walking stick; rest if knees ache",
      },
      {
        time: "1:00 PM",
        title: "Lunch and rest",
        note: "Soft meal preferred",
      },
      {
        time: "4:00 PM",
        title: "Companionship / gospel music",
        note: "Yoruba gospel or light chat with family calls",
      },
      {
        time: "7:00 PM",
        title: "Dinner",
        note: "Evening medicine after dinner",
      },
      {
        time: "9:30 PM",
        title: "Bedtime routine",
        note: "Help settle; night light on",
      },
    ],
    preferences: {
      gender: "No preference",
      languages: "Yoruba and English",
      experience: "Elderly care, arthritis, hypertension support",
      other: "Non-smoker · Comfortable cooking Nigerian meals",
    },
    enjoys: [
      "Yoruba gospel music",
      "Morning walks",
      "Pepper soup",
      "Family calls",
      "Watching Nollywood",
    ],
    home: {
      livesWith: "Alone — Tunde visits",
      home: "Bungalow, no stairs",
      caregiverRoom: "Spare bedroom with a fan",
      power: "Inverter backup at night",
    },
  },
  homeAccess: {
    address: "14 Herbert Macaulay Way, Yaba, Lagos",
    landmark: "Opposite Yaba Bus Stop — blue gate",
    gettingIn: "Ring the bell. Folake or Mrs. Ogunleye opens the gate.",
    nearestHospital: "LUTH, Idi-Araba — about 15 minutes by car",
    parking: "Street parking only",
  },
  documents: [
    { id: "d1", name: "Medical summary — LUTH", type: "PDF" },
    { id: "d2", name: "Prescription — October 2026", type: "JPG" },
    { id: "d3", name: "Blood pressure log", type: "PDF" },
  ],
  history: [
    {
      id: "h1",
      title: "Transport to clinic",
      caregiver: "Chinedu Obi",
      dateLabel: "Sat 11 Oct 2026 · 10:30 AM",
      status: "Completed",
    },
    {
      id: "h2",
      title: "Companionship visit",
      caregiver: "Amina Bello",
      dateLabel: "Wed 1 Oct 2026 · 2:00 PM",
      status: "Completed",
    },
    {
      id: "h3",
      title: "Live-in care request",
      caregiver: "Ngozi Uche",
      dateLabel: "Mon 22 Sep 2026",
      status: "Declined",
    },
  ],
  sharing: {
    healthDetails: true,
    documents: true,
    addressBeforeBook: false,
  },
};

const musa: LovedOneProfile = {
  ...folake,
  id: "musa",
  firstName: "Musa",
  fullName: "Musa Adebayo",
  relationship: "Father",
  gender: "Male",
  dateOfBirth: "4 Jan 1946",
  age: 80,
  avatarUrl: assets.homeTestimonialAvatarD,
  profileComplete: false,
  updatedLabel: "Updated 2 Oct 2026",
  area: "Surulere",
  city: "Lagos",
  lga: "Surulere",
  address: "22 Bode Thomas Street, Surulere, Lagos",
  preferredLanguage: "English",
  careTypeSummary: "Part-time care",
  careTypeDetail: "Companionship",
  about: {
    fullName: "Musa Adebayo",
    relationship: "Father",
    dateOfBirth: "4 Jan 1946",
    gender: "Male",
    homeAddress: "22 Bode Thomas Street, Surulere, Lagos",
    languages: "English, Yoruba",
  },
  healthGlance: {
    conditions: ["Type 2 diabetes"],
    mobility: "Walks independently indoors",
    allergies: "None known",
    medicines: "2 daily medicines",
  },
  careNeeds: {
    typeOfCare: "Non-clinical",
    arrangement: "Part-time",
    careStarted: "Not started",
    caregiverPreference: "Male caregiver preferred",
  },
  nextCare: null,
  careTeam: [],
  emergencyContacts: [
    {
      id: "grace",
      name: "Grace Bills",
      relationship: "Daughter",
      orderLabel: "1st contact",
      phone: "+234 809 221 3340",
      isYou: true,
    },
  ],
  recentActivity: [
    {
      id: "a1",
      title: "Care profile started",
      detail: "2 of 5 sections complete",
      timeLabel: "2 Oct",
    },
  ],
  conditions: [
    {
      name: "Type 2 diabetes",
      diagnosed: "Diagnosed 2012",
      note: "Monitor meals; keep glucose snacks nearby.",
    },
  ],
  medications: [
    {
      id: "m1",
      name: "Metformin 500 mg",
      form: "Tablet",
      purpose: "Blood sugar",
      schedule: "Twice daily",
      instruction: "Take with meals",
    },
  ],
  allergiesDiet: {
    medicineAllergies: "None known",
    foodAllergies: "None known",
    diet: "Low sugar meals",
    fluids: "Plenty of water",
  },
  mobility: [
    { label: "Walking", level: "Independent", tone: "emerald" },
    { label: "Dressing", level: "Independent", tone: "emerald" },
    { label: "Eating", level: "Independent", tone: "emerald" },
    { label: "Toileting", level: "Independent", tone: "emerald" },
    { label: "Medicines", level: "Reminders", tone: "blue" },
  ],
  doctor: {
    name: "Dr. Kunle Adeyemi",
    role: "GP",
    clinic: "Surulere Medical Centre",
    phone: "+234 803 555 0202",
    nextCheckup: "Not scheduled",
  },
  caregiverNotes: {
    body: "Prefers quiet afternoons and radio news. Remind him about evening Metformin.",
    meta: "Added by you · 2 Oct",
  },
  carePlan: {
    ...folake.carePlan,
    typeOfCare: "Companionship",
    arrangement: "Part-time",
    schedule: "Weekday afternoons",
    startDate: "Not set",
    duration: "—",
    enjoys: ["Radio news", "Chess", "Pepper soup"],
    home: {
      livesWith: "With family during the week",
      home: "Flat, one flight of stairs",
      caregiverRoom: "Sitting room seating",
      power: "NEPA + small generator",
    },
  },
  homeAccess: {
    address: "22 Bode Thomas Street, Surulere, Lagos",
    landmark: "Near National Stadium",
    gettingIn: "Call Grace before arriving",
    nearestHospital: "Lagoon Hospital Surulere — 10 minutes",
    parking: "Compound parking if available",
  },
  documents: [],
  history: [],
  sharing: {
    healthDetails: true,
    documents: false,
    addressBeforeBook: false,
  },
};

const profiles: Record<string, LovedOneProfile> = {
  folake,
  musa,
};

export function getLovedOneProfile(id: string): LovedOneProfile | undefined {
  return profiles[id];
}

export function getLovedOneProfileIds(): string[] {
  return Object.keys(profiles);
}
