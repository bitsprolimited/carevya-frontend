import {
  getCareRecipientCarePlan,
  getCareRecipientHealth,
  getCareRecipientHistory,
  getCareRecipientOverview,
  getEmergencyContacts,
} from "@/features/care-recipients/services/care-recipients-service";
import type { LovedOneProfile } from "@/features/dashboard/types/loved-one";
import { assets } from "@/lib/assets";
import { toDateOnly } from "@/lib/date";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

function ageFromDob(dob?: string | null): number {
  if (!dob) return 0;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const m = now.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age -= 1;
  return Math.max(0, age);
}


function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

const MOBILITY_LABELS: Record<string, string> = {
  walks_on_own: "Walks on own",
  walks_with_some_help: "Walks with some help",
  uses_wheelchair: "Uses a wheelchair",
  mostly_in_bed: "Mostly in bed",
};

const ARRANGEMENT_LABELS: Record<string, string> = {
  live_in: "Live-in",
  full_day: "Full day",
  part_time: "Part-time",
  overnight: "Overnight",
  weekends_only: "Weekends only",
};

const DAILY_LIVING_LABELS: Record<string, string> = {
  independent: "Independent",
  with_help: "Needs help",
  dependent: "Dependent",
  walks_on_own: "Walks on own",
  walks_with_some_help: "Walks with some help",
  uses_wheelchair: "Uses wheelchair",
  mostly_in_bed: "Mostly in bed",
};

function mobilityTone(
  level: string,
): "amber" | "emerald" | "blue" {
  if (level === "independent" || level === "walks_on_own") return "emerald";
  if (level === "dependent" || level === "mostly_in_bed") return "amber";
  return "blue";
}

function emptyProfile(id: string): LovedOneProfile {
  return {
    id,
    firstName: "Loved one",
    fullName: "Loved one",
    relationship: "",
    gender: "",
    dateOfBirth: "",
    age: 0,
    avatarUrl: assets.defaultAvatar,
    profileComplete: false,
    updatedLabel: "Not updated yet",
    area: "",
    city: "",
    lga: "",
    address: "",
    languages: [],
    preferredLanguage: "English",
    careTypeSummary: "",
    careTypeDetail: "",
    about: {
      fullName: "",
      relationship: "",
      dateOfBirth: "",
      gender: "",
      homeAddress: "",
      languages: "",
    },
    healthGlance: {
      conditions: [],
      mobility: "",
      allergies: "",
      medicines: "",
    },
    careNeeds: {
      typeOfCare: "",
      arrangement: "",
      careStarted: "",
      caregiverPreference: "",
    },
    nextCare: null,
    careTeam: [],
    emergencyContacts: [],
    recentActivity: [],
    conditions: [],
    medications: [],
    allergiesDiet: {
      medicineAllergies: "",
      foodAllergies: "",
      diet: "",
      fluids: "",
    },
    mobility: [],
    doctor: {
      name: "",
      role: "Doctor",
      clinic: "",
      phone: "",
      nextCheckup: "",
    },
    caregiverNotes: { body: "", meta: "" },
    carePlan: {
      typeOfCare: "",
      arrangement: "",
      schedule: "",
      startDate: "",
      duration: "",
      routine: [],
      preferences: {
        gender: "",
        languages: "",
        experience: "",
        other: "",
      },
      enjoys: [],
      home: {
        livesWith: "",
        home: "",
        caregiverRoom: "",
        power: "",
      },
    },
    homeAccess: {
      address: "",
      landmark: "",
      gettingIn: "",
      nearestHospital: "",
      parking: "",
    },
    documents: [],
    history: [],
    sharing: {
      healthDetails: true,
      documents: true,
      addressBeforeBook: false,
    },
  };
}

function pickRecipient(
  overview: Record<string, unknown>,
): Record<string, unknown> {
  if (overview.recipient && typeof overview.recipient === "object") {
    return overview.recipient as Record<string, unknown>;
  }
  if (overview.about && typeof overview.about === "object") {
    const about = overview.about as Record<string, unknown>;
    return { ...overview, ...about };
  }
  return overview;
}

/** Build LovedOneProfile strictly from Nest care-recipient APIs. */
export async function fetchLovedOneProfile(
  id: string,
): Promise<LovedOneProfile | null> {
  const [overviewRes, healthRes, carePlanRes, contactsRes, historyRes] =
    await Promise.all([
      getCareRecipientOverview(id),
      getCareRecipientHealth(id),
      getCareRecipientCarePlan(id),
      getEmergencyContacts(id),
      getCareRecipientHistory(id),
    ]);

  const overviewRoot = overviewRes as Record<string, unknown>;
  const recipient = pickRecipient(overviewRoot);
  const aboutBlock =
    overviewRoot.about && typeof overviewRoot.about === "object"
      ? (overviewRoot.about as Record<string, unknown>)
      : {};
  const healthAtAGlance =
    overviewRoot.healthAtAGlance &&
    typeof overviewRoot.healthAtAGlance === "object"
      ? (overviewRoot.healthAtAGlance as Record<string, unknown>)
      : {};
  const careNeedsBlock =
    overviewRoot.careNeeds && typeof overviewRoot.careNeeds === "object"
      ? (overviewRoot.careNeeds as Record<string, unknown>)
      : {};
  const careTeamRaw = Array.isArray(overviewRoot.careTeam)
    ? (overviewRoot.careTeam as Array<Record<string, unknown>>)
    : [];
  const recentActivityRaw = Array.isArray(overviewRoot.recentActivity)
    ? (overviewRoot.recentActivity as Array<Record<string, unknown>>)
    : [];

  const health = (healthRes.health ?? {}) as Record<string, unknown>;
  const carePlan = (carePlanRes.carePlan ?? {}) as Record<string, unknown>;
  const contacts = contactsRes.emergencyContacts ?? [];
  const historyRoot = historyRes as Record<string, unknown>;
  const historyItems =
    (historyRoot.items as Array<Record<string, unknown>> | undefined) ??
    (historyRoot.history as Array<Record<string, unknown>> | undefined) ??
    (historyRoot.visits as Array<Record<string, unknown>> | undefined) ??
    [];
  const fullName = str(
    recipient.fullName ?? aboutBlock.fullName,
    "Loved one",
  );
  const photoUrl = str(
    recipient.photoUrl ?? recipient.avatarUrl,
    assets.defaultAvatar,
  );
  const dob = str(
    recipient.dateOfBirth ?? aboutBlock.dateOfBirth,
    "",
  );
  const relationshipRaw = str(
    recipient.relationship ?? aboutBlock.relationship,
    "",
  );
  const relationship = relationshipRaw
    ? relationshipRaw.charAt(0).toUpperCase() + relationshipRaw.slice(1)
    : "";
  const genderRaw = str(recipient.gender ?? aboutBlock.gender, "");
  const gender = genderRaw
    ? genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1).toLowerCase()
    : "";
  const state = str(
    recipient.addressState ?? recipient.state ?? aboutBlock.state,
    "",
  );
  const lga = str(
    recipient.addressLga ?? recipient.lga ?? aboutBlock.lga,
    "",
  );
  const street = str(
    recipient.addressStreet ?? recipient.street ?? aboutBlock.homeAddress,
    "",
  );
  const addressLine = [street, lga, state].filter(Boolean).join(", ");
  const languages = asStringArray(
    recipient.languages ?? aboutBlock.languages,
  );

  const conditions = asStringArray(
    health.conditions ?? healthAtAGlance.conditions,
  );
  const medications = asStringArray(health.medications);
  const allergies = asStringArray(health.allergies);
  const mobilityKey = str(
    health.mobility ?? healthAtAGlance.mobility,
    "",
  );
  const mobilityLabel =
    MOBILITY_LABELS[mobilityKey] ??
    (mobilityKey ? mobilityKey.replace(/_/g, " ") : "");

  const careTypesList = asStringArray(
    carePlan.careTypes ?? careNeedsBlock.careTypes,
  );
  const careTypes = careTypesList.join(", ");
  const arrangement = str(
    carePlan.arrangement ?? careNeedsBlock.arrangement,
    "",
  );
  const arrangementLabel =
    ARRANGEMENT_LABELS[arrangement] ?? arrangement;

  const prefs = asStringArray(carePlan.caregiverPreferences);
  const enjoys = asStringArray(carePlan.enjoys);
  const home =
    carePlan.home && typeof carePlan.home === "object"
      ? (carePlan.home as Record<string, unknown>)
      : {};
  const dailyLiving =
    health.dailyLiving && typeof health.dailyLiving === "object"
      ? (health.dailyLiving as Record<string, unknown>)
      : {};

  const routineRaw = Array.isArray(carePlan.dailyRoutine)
    ? (carePlan.dailyRoutine as Array<Record<string, unknown>>)
    : [];

  const emergencyContacts = contacts.map((c, index) => ({
    id: str(c.id, `ec-${index}`),
    name: str(c.name, "Contact"),
    relationship: str(c.relationship, ""),
    orderLabel: index === 0 ? "1st contact" : "2nd contact",
    phone: str(c.phone, ""),
  }));

  // Prefer overview emergency contacts if tab endpoint empty
  const overviewContacts = Array.isArray(overviewRoot.emergencyContacts)
    ? (overviewRoot.emergencyContacts as Array<Record<string, unknown>>)
    : [];
  const finalContacts =
    emergencyContacts.length > 0
      ? emergencyContacts
      : overviewContacts.map((c, index) => ({
          id: str(c.id, `ec-${index}`),
          name: str(c.name, "Contact"),
          relationship: str(c.relationship, ""),
          orderLabel: index === 0 ? "1st contact" : "2nd contact",
          phone: str(c.phone, ""),
        }));

  const history = historyItems.map((item, index) => ({
    id: str(item.id, `hist-${index}`),
    title: str(item.title ?? item.type, "Care visit"),
    caregiver: str(item.caregiverName ?? item.caregiver, "Caregiver"),
    dateLabel: str(item.dateLabel ?? item.date, ""),
    status: str(item.status, "Completed"),
  }));

  const mobilityRows: LovedOneProfile["mobility"] = [];
  if (mobilityKey) {
    mobilityRows.push({
      label: "Walking",
      level: mobilityLabel,
      tone: mobilityTone(mobilityKey),
    });
  }
  for (const key of ["walking", "dressing", "eating", "toileting"] as const) {
    const val = str(dailyLiving[key], "");
    if (!val) continue;
    if (key === "walking" && mobilityKey) continue;
    mobilityRows.push({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      level: DAILY_LIVING_LABELS[val] ?? val.replace(/_/g, " "),
      tone: mobilityTone(val),
    });
  }

  const base = emptyProfile(id);
  const profileComplete =
    Boolean(fullName && fullName !== "Loved one") &&
    (conditions.length > 0 || Boolean(careTypes) || finalContacts.length > 0);

  return {
    ...base,
    id,
    firstName: firstName(fullName),
    fullName,
    relationship,
    gender,
    dateOfBirth: toDateOnly(dob),
    age: ageFromDob(dob),
    avatarUrl: photoUrl,
    profileComplete,
    updatedLabel: str(
      recipient.updatedAt
        ? `Updated ${toDateOnly(String(recipient.updatedAt))}`
        : "",
      profileComplete ? "Profile loaded" : "Incomplete profile",
    ),
    area: lga,
    city: state,
    lga,
    address: addressLine,
    languages,
    preferredLanguage: languages[0] ?? "English",
    careTypeSummary: arrangementLabel,
    careTypeDetail: careTypes,
    about: {
      fullName,
      relationship,
      dateOfBirth: toDateOnly(dob),
      gender,
      homeAddress: addressLine,
      languages: languages.join(", "),
    },
    healthGlance: {
      conditions,
      mobility: mobilityLabel,
      allergies: allergies.join("; "),
      medicines:
        medications.length > 0
          ? `${medications.length} medicine${medications.length === 1 ? "" : "s"}`
          : "",
    },
    careNeeds: {
      typeOfCare: careTypes,
      arrangement: arrangementLabel,
      careStarted: toDateOnly(
        str(carePlan.startDate ?? careNeedsBlock.careStarted, ""),
      ),
      caregiverPreference: prefs.join(", "),
    },
    nextCare: null,
    careTeam: careTeamRaw.map((member, index) => ({
      id: str(member.id, `team-${index}`),
      name: str(member.name, "Caregiver"),
      role: str(member.role, "Caregiver"),
      verified: Boolean(member.verified),
      avatarUrl: str(member.avatarUrl ?? member.photoUrl, assets.defaultAvatar),
      phone: str(member.phone, ""),
    })),
    emergencyContacts: finalContacts,
    recentActivity: recentActivityRaw.map((item, index) => ({
      id: str(item.id, `act-${index}`),
      title: str(item.title, "Activity"),
      detail: str(item.detail ?? item.description, ""),
      timeLabel: str(item.timeLabel ?? item.date, ""),
    })),
    conditions: conditions.map((name) => ({
      name,
      diagnosed: "",
      note: "",
    })),
    medications: medications.map((name, index) => ({
      id: `med-${index}`,
      name,
      form: "",
      purpose: "",
      schedule: "",
      instruction: "",
    })),
    allergiesDiet: {
      medicineAllergies: allergies.join("; "),
      foodAllergies: "",
      diet: str(health.diet, ""),
      fluids: "",
    },
    mobility: mobilityRows,
    doctor: {
      name: str(health.doctorName, ""),
      role: "Doctor",
      clinic: str(health.clinicName, ""),
      phone: str(health.doctorPhone, ""),
      nextCheckup: "",
    },
    caregiverNotes: {
      body: str(health.notesForCaregivers, ""),
      meta: "",
    },
    carePlan: {
      typeOfCare: careTypes,
      arrangement: arrangementLabel,
      schedule: str(carePlan.scheduleNote, ""),
      startDate: toDateOnly(str(carePlan.startDate, "")),
      duration: "",
      routine: routineRaw.map((row) => ({
        time: str(row.hour ?? row.time, ""),
        title: str(row.note ?? row.title, ""),
        note: str(row.detail, ""),
      })),
      preferences: {
        gender: prefs.find((p) => /female|male|gender/i.test(p)) ?? "",
        languages: prefs.filter((p) => /english|yoruba|hausa|igbo|pidgin/i.test(p)).join(", "),
        experience: prefs.find((p) => /experience|year/i.test(p)) ?? "",
        other: prefs.join(", "),
      },
      enjoys,
      home: {
        livesWith: str(home.livesWith, ""),
        home: str(home.home ?? home.type, ""),
        caregiverRoom: str(home.caregiverRoom, ""),
        power: str(home.power, ""),
      },
    },
    homeAccess: {
      address: addressLine,
      landmark: str(home.landmark, ""),
      gettingIn: str(home.gateInstructions ?? home.gettingIn, ""),
      nearestHospital: str(home.hospital ?? home.nearestHospital, ""),
      parking: str(home.parking, ""),
    },
    documents: [],
    history,
    sharing: {
      healthDetails: true,
      documents: true,
      addressBeforeBook: false,
    },
  };
}
