"use client";

import {
  ArrowLeft,
  Calendar,
  Check,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { encodeHealthAllergiesDiet } from "@/features/dashboard/lib/map-loved-one-from-api";
import type { LovedOneTab, LovedOneProfile } from "@/features/dashboard/types/loved-one";
import { toDateOnly, toIso8601Date } from "@/lib/date";
import { cn } from "@/lib/utils";

const RELATIONSHIPS = [
  "Mother",
  "Father",
  "Spouse",
  "Parent",
  "Sibling",
  "Grandparent",
  "Other",
] as const;
const GENDERS = ["Female", "Male"] as const;
const STATES = [
  "Lagos",
  "FCT",
  "Rivers",
  "Oyo",
  "Ogun",
  "Kano",
  "Kaduna",
  "Enugu",
  "Anambra",
  "Delta",
] as const;
const LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Hausa",
  "Igbo",
  "Pidgin",
  "Other",
] as const;

const MOBILITY_OPTIONS = [
  { value: "walks_on_own", label: "Walks on own" },
  { value: "walks_with_some_help", label: "Walks with some help" },
  { value: "uses_wheelchair", label: "Uses a wheelchair" },
  { value: "mostly_in_bed", label: "Mostly in bed" },
] as const;

const ARRANGEMENT_OPTIONS = [
  { value: "live_in", label: "Live-in" },
  { value: "full_day", label: "Full day" },
  { value: "part_time", label: "Part-time" },
  { value: "overnight", label: "Overnight" },
  { value: "weekends_only", label: "Weekends only" },
] as const;

const CHANNEL_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone_call", label: "Phone call" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
] as const;

export type LovedOneEditSection =
  | Extract<LovedOneTab, "overview" | "health" | "care-plan" | "contacts">
  | "allergies-diet"
  | "home"
  | "preferences"
  | "routine";

export type LovedOneEditPayload = {
  section: LovedOneEditSection;
  profilePatch: Partial<LovedOneProfile>;
  basics?: {
    fullName: string;
    relationship: string;
    gender: "male" | "female";
    dateOfBirth?: string;
    addressState: string;
    addressLga: string;
    addressStreet: string;
    languages: Array<"English" | "Pidgin" | "Yoruba" | "Hausa" | "Igbo" | "Other">;
  };
  health?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    diet: string;
    mobility?:
      | "walks_on_own"
      | "walks_with_some_help"
      | "uses_wheelchair"
      | "mostly_in_bed";
    doctorName: string;
    doctorPhone: string;
    clinicName: string;
    notesForCaregivers: string;
  };
  carePlan?: {
    careTypes: string[];
    arrangement?:
      | "live_in"
      | "full_day"
      | "part_time"
      | "overnight"
      | "weekends_only";
    scheduleNote: string;
    caregiverPreferences: string[];
    enjoys: string[];
    dailyRoutine?: Array<{ hour: string; note: string }>;
    home?: {
      livesWith: string;
      home: string;
      caregiverRoom: string;
      power: string;
    };
  };
  contacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    preferredChannel?: "whatsapp" | "phone_call" | "sms" | "email";
  }>;
};

function mobilityValueFromLabel(label: string): string {
  const found = MOBILITY_OPTIONS.find(
    (option) =>
      option.label === label ||
      option.value === label ||
      label.toLowerCase().includes(option.value.replace(/_/g, " ")),
  );
  return found?.value ?? "";
}

function arrangementValueFromLabel(label: string): string {
  const found = ARRANGEMENT_OPTIONS.find(
    (option) =>
      option.label === label ||
      option.value === label ||
      label.toLowerCase().includes(option.value.replace(/_/g, " ")),
  );
  return found?.value ?? "";
}

export function EditLovedOneDrawer({
  open,
  onClose,
  profile,
  section = "overview",
  onSave,
  onChangePhoto,
  photoUploading = false,
}: {
  open: boolean;
  onClose: () => void;
  profile: LovedOneProfile;
  section?: LovedOneEditSection;
  onSave?: (payload: LovedOneEditPayload) => void | Promise<void>;
  onChangePhoto?: () => void;
  photoUploading?: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [relationship, setRelationship] = useState(profile.relationship);
  const [gender, setGender] = useState(profile.gender);
  const [dob, setDob] = useState(toDateOnly(profile.dateOfBirth));
  const [address, setAddress] = useState(
    profile.address.split(",")[0] ?? profile.address,
  );
  const [state, setState] = useState(profile.city);
  const [lga, setLga] = useState(profile.lga);
  const [languages, setLanguages] = useState(profile.languages);

  const [conditionsText, setConditionsText] = useState(
    profile.healthGlance.conditions.join(", "),
  );
  const [medicationsText, setMedicationsText] = useState(
    profile.medications.map((m) => m.name).join(", "),
  );
  const [allergiesText, setAllergiesText] = useState(
    profile.allergiesDiet.medicineAllergies.replace(/;\s*/g, ", "),
  );
  const [foodAllergiesText, setFoodAllergiesText] = useState(
    profile.allergiesDiet.foodAllergies.replace(/;\s*/g, ", "),
  );
  const [diet, setDiet] = useState(profile.allergiesDiet.diet);
  const [fluids, setFluids] = useState(profile.allergiesDiet.fluids);
  const [mobility, setMobility] = useState(
    mobilityValueFromLabel(profile.healthGlance.mobility),
  );
  const [doctorName, setDoctorName] = useState(profile.doctor.name);
  const [doctorPhone, setDoctorPhone] = useState(profile.doctor.phone);
  const [clinicName, setClinicName] = useState(profile.doctor.clinic);
  const [notes, setNotes] = useState(profile.caregiverNotes.body);

  const [careTypesText, setCareTypesText] = useState(
    profile.carePlan.typeOfCare,
  );
  const [arrangement, setArrangement] = useState(
    arrangementValueFromLabel(profile.carePlan.arrangement),
  );
  const [scheduleNote, setScheduleNote] = useState(profile.carePlan.schedule);
  const [prefsText, setPrefsText] = useState(
    profile.carePlan.preferences.other ||
      [
        profile.carePlan.preferences.gender,
        profile.carePlan.preferences.languages,
      ]
        .filter(Boolean)
        .join(", "),
  );
  const [prefGender, setPrefGender] = useState(
    profile.carePlan.preferences.gender,
  );
  const [prefLanguages, setPrefLanguages] = useState(
    profile.carePlan.preferences.languages,
  );
  const [prefExperience, setPrefExperience] = useState(
    profile.carePlan.preferences.experience,
  );
  const [prefOther, setPrefOther] = useState(
    profile.carePlan.preferences.other,
  );
  const [enjoysText, setEnjoysText] = useState(
    profile.carePlan.enjoys.join(", "),
  );
  const [livesWith, setLivesWith] = useState(profile.carePlan.home.livesWith);
  const [homeType, setHomeType] = useState(profile.carePlan.home.home);
  const [caregiverRoom, setCaregiverRoom] = useState(
    profile.carePlan.home.caregiverRoom,
  );
  const [power, setPower] = useState(profile.carePlan.home.power);
  const [routineRows, setRoutineRows] = useState(
    profile.carePlan.routine.map((item) => ({
      time: item.time,
      title: item.title,
      note: item.note ?? "",
    })),
  );

  const [contact1Name, setContact1Name] = useState(
    profile.emergencyContacts[0]?.name ?? "",
  );
  const [contact1Rel, setContact1Rel] = useState(
    profile.emergencyContacts[0]?.relationship ?? "",
  );
  const [contact1Phone, setContact1Phone] = useState(
    profile.emergencyContacts[0]?.phone ?? "",
  );
  const [contact1Channel, setContact1Channel] = useState("whatsapp");
  const [contact2Name, setContact2Name] = useState(
    profile.emergencyContacts[1]?.name ?? "",
  );
  const [contact2Rel, setContact2Rel] = useState(
    profile.emergencyContacts[1]?.relationship ?? "",
  );
  const [contact2Phone, setContact2Phone] = useState(
    profile.emergencyContacts[1]?.phone ?? "",
  );
  const [contact2Channel, setContact2Channel] = useState("phone_call");

  useEffect(() => {
    if (!open) return;
    setFullName(profile.fullName);
    setRelationship(profile.relationship);
    setGender(profile.gender);
    setDob(toDateOnly(profile.dateOfBirth));
    setAddress(profile.address.split(",")[0]?.trim() ?? profile.address);
    setState(profile.city);
    setLga(profile.lga);
    setLanguages(profile.languages);
    setConditionsText(profile.healthGlance.conditions.join(", "));
    setMedicationsText(profile.medications.map((m) => m.name).join(", "));
    setAllergiesText(
      profile.allergiesDiet.medicineAllergies.replace(/;\s*/g, ", "),
    );
    setFoodAllergiesText(
      profile.allergiesDiet.foodAllergies.replace(/;\s*/g, ", "),
    );
    setDiet(profile.allergiesDiet.diet);
    setFluids(profile.allergiesDiet.fluids);
    setMobility(mobilityValueFromLabel(profile.healthGlance.mobility));
    setDoctorName(profile.doctor.name);
    setDoctorPhone(profile.doctor.phone);
    setClinicName(profile.doctor.clinic);
    setNotes(profile.caregiverNotes.body);
    setCareTypesText(profile.carePlan.typeOfCare);
    setArrangement(arrangementValueFromLabel(profile.carePlan.arrangement));
    setScheduleNote(profile.carePlan.schedule);
    setPrefsText(
      profile.carePlan.preferences.other ||
        [
          profile.carePlan.preferences.gender,
          profile.carePlan.preferences.languages,
        ]
          .filter(Boolean)
          .join(", "),
    );
    setPrefGender(profile.carePlan.preferences.gender);
    setPrefLanguages(profile.carePlan.preferences.languages);
    setPrefExperience(profile.carePlan.preferences.experience);
    setPrefOther(profile.carePlan.preferences.other);
    setEnjoysText(profile.carePlan.enjoys.join(", "));
    setLivesWith(profile.carePlan.home.livesWith);
    setHomeType(profile.carePlan.home.home);
    setCaregiverRoom(profile.carePlan.home.caregiverRoom);
    setPower(profile.carePlan.home.power);
    setRoutineRows(
      profile.carePlan.routine.map((item) => ({
        time: item.time,
        title: item.title,
        note: item.note ?? "",
      })),
    );
    setContact1Name(profile.emergencyContacts[0]?.name ?? "");
    setContact1Rel(profile.emergencyContacts[0]?.relationship ?? "");
    setContact1Phone(profile.emergencyContacts[0]?.phone ?? "");
    setContact2Name(profile.emergencyContacts[1]?.name ?? "");
    setContact2Rel(profile.emergencyContacts[1]?.relationship ?? "");
    setContact2Phone(profile.emergencyContacts[1]?.phone ?? "");
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function toggleLanguage(lang: string) {
    setLanguages((current) =>
      current.includes(lang)
        ? current.filter((item) => item !== lang)
        : [...current, lang],
    );
  }

  function splitCsv(value: string): string[] {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  const title =
    section === "health"
      ? `Edit ${profile.firstName}'s health`
      : section === "allergies-diet"
        ? `Edit allergies & diet`
        : section === "care-plan"
          ? `Edit ${profile.firstName}'s care plan`
          : section === "home"
            ? `Edit ${profile.firstName}'s home`
            : section === "preferences"
              ? `Edit caregiver preferences`
              : section === "routine"
                ? `Edit ${profile.firstName}'s daily routine`
                : section === "contacts"
                  ? `Edit emergency contacts`
                  : `Edit ${profile.firstName}'s details`;

  function currentDailyRoutine() {
    const rows =
      section === "routine"
        ? routineRows
        : profile.carePlan.routine.map((item) => ({
            time: item.time,
            title: item.title,
            note: item.note ?? "",
          }));
    return rows
      .filter((item) => item.time.trim() || item.title.trim())
      .map((item) => ({
        hour: item.time.trim(),
        note: item.note.trim()
          ? `${item.title.trim()} — ${item.note.trim()}`
          : item.title.trim(),
      }));
  }

  function updateRoutineRow(
    index: number,
    key: "time" | "title" | "note",
    value: string,
  ) {
    setRoutineRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    );
  }

  function currentHome() {
    return {
      livesWith,
      home: homeType,
      caregiverRoom,
      power,
    };
  }

  function currentPreferences() {
    return {
      gender: prefGender.trim(),
      languages: prefLanguages.trim(),
      experience: prefExperience.trim(),
      other: prefOther.trim(),
    };
  }

  function preferencesToChips(prefs: {
    gender: string;
    languages: string;
    experience: string;
    other: string;
  }): string[] {
    return [
      prefs.gender,
      ...splitCsv(prefs.languages),
      prefs.experience,
      prefs.other,
    ].filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (section === "health" || section === "allergies-diet") {
        const conditions =
          section === "health"
            ? splitCsv(conditionsText)
            : profile.healthGlance.conditions;
        const medications =
          section === "health"
            ? splitCsv(medicationsText)
            : profile.medications.map((item) => item.name);
        const medicineAllergies = splitCsv(allergiesText);
        const foodAllergies = splitCsv(foodAllergiesText);
        const encoded = encodeHealthAllergiesDiet({
          medicineAllergies,
          foodAllergies,
          diet,
          fluids,
        });
        const mobilityValue =
          section === "health"
            ? mobility
            : mobilityValueFromLabel(profile.healthGlance.mobility);
        const nextDoctorName =
          section === "health" ? doctorName : profile.doctor.name;
        const nextDoctorPhone =
          section === "health" ? doctorPhone : profile.doctor.phone;
        const nextClinicName =
          section === "health" ? clinicName : profile.doctor.clinic;
        const nextNotes =
          section === "health" ? notes : profile.caregiverNotes.body;

        await onSave?.({
          section,
          health: {
            conditions,
            medications,
            allergies: encoded.allergies,
            diet: encoded.diet,
            mobility: mobilityValue
              ? (mobilityValue as NonNullable<
                  LovedOneEditPayload["health"]
                >["mobility"])
              : undefined,
            doctorName: nextDoctorName,
            doctorPhone: nextDoctorPhone,
            clinicName: nextClinicName,
            notesForCaregivers: nextNotes,
          },
          profilePatch: {
            healthGlance: {
              conditions,
              mobility:
                MOBILITY_OPTIONS.find((o) => o.value === mobilityValue)
                  ?.label ?? profile.healthGlance.mobility,
              allergies: medicineAllergies.join("; "),
              medicines:
                medications.length > 0
                  ? `${medications.length} medicine${medications.length === 1 ? "" : "s"}`
                  : "",
            },
            conditions: conditions.map((name) => ({
              name,
              diagnosed: "",
              note: "",
            })),
            medications: medications.map((name, index) => ({
              id: profile.medications[index]?.id ?? `med-${index}`,
              name,
              form: profile.medications[index]?.form ?? "",
              purpose: profile.medications[index]?.purpose ?? "",
              schedule: profile.medications[index]?.schedule ?? "",
              instruction: profile.medications[index]?.instruction ?? "",
            })),
            allergiesDiet: {
              medicineAllergies: medicineAllergies.join("; "),
              foodAllergies: foodAllergies.join("; "),
              diet,
              fluids,
            },
            doctor: {
              ...profile.doctor,
              name: nextDoctorName,
              phone: nextDoctorPhone,
              clinic: nextClinicName,
            },
            caregiverNotes: { body: nextNotes, meta: "" },
          },
        });
      } else if (
        section === "care-plan" ||
        section === "home" ||
        section === "preferences" ||
        section === "routine"
      ) {
        const careTypes = splitCsv(careTypesText);
        const preferences = currentPreferences();
        const caregiverPreferences =
          section === "preferences"
            ? preferencesToChips(preferences)
            : splitCsv(prefsText);
        const enjoys = splitCsv(enjoysText);
        const arrangementLabel =
          ARRANGEMENT_OPTIONS.find((o) => o.value === arrangement)?.label ??
          arrangement;
        const home = currentHome();
        const dailyRoutine = currentDailyRoutine();
        const routineForUi =
          section === "routine"
            ? routineRows
                .filter((item) => item.time.trim() || item.title.trim())
                .map((item) => ({
                  time: item.time.trim(),
                  title: item.title.trim() || item.time.trim(),
                  note: item.note.trim() || undefined,
                }))
            : profile.carePlan.routine;
        await onSave?.({
          section,
          carePlan: {
            careTypes,
            arrangement: arrangement
              ? (arrangement as NonNullable<
                  LovedOneEditPayload["carePlan"]
                >["arrangement"])
              : undefined,
            scheduleNote,
            caregiverPreferences,
            enjoys,
            dailyRoutine,
            home,
          },
          profilePatch: {
            careNeeds: {
              ...profile.careNeeds,
              typeOfCare: careTypes.join(", "),
              arrangement: arrangementLabel,
              caregiverPreference: caregiverPreferences.join(", "),
            },
            carePlan: {
              ...profile.carePlan,
              typeOfCare: careTypes.join(", "),
              arrangement: arrangementLabel,
              schedule: scheduleNote,
              preferences:
                section === "preferences"
                  ? preferences
                  : {
                      ...profile.carePlan.preferences,
                      other: caregiverPreferences.join(", "),
                    },
              enjoys,
              home,
              routine: routineForUi,
            },
            careTypeDetail: careTypes.join(", "),
            careTypeSummary: arrangementLabel,
          },
        });
      } else if (section === "contacts") {
        const contacts = [
          contact1Name.trim()
            ? {
                name: contact1Name.trim(),
                relationship: contact1Rel.trim() || "Family",
                phone: contact1Phone.trim(),
                preferredChannel: contact1Channel as
                  | "whatsapp"
                  | "phone_call"
                  | "sms"
                  | "email",
              }
            : null,
          contact2Name.trim()
            ? {
                name: contact2Name.trim(),
                relationship: contact2Rel.trim() || "Family",
                phone: contact2Phone.trim(),
                preferredChannel: contact2Channel as
                  | "whatsapp"
                  | "phone_call"
                  | "sms"
                  | "email",
              }
            : null,
        ].filter(Boolean) as NonNullable<LovedOneEditPayload["contacts"]>;

        await onSave?.({
          section,
          contacts,
          profilePatch: {
            emergencyContacts: contacts.map((c, index) => ({
              id: profile.emergencyContacts[index]?.id ?? `ec-${index}`,
              name: c.name,
              relationship: c.relationship,
              orderLabel: index === 0 ? "1st contact" : "2nd contact",
              phone: c.phone,
            })),
          },
        });
      } else {
        const langList = languages.filter((lang) =>
          LANGUAGE_OPTIONS.includes(lang as (typeof LANGUAGE_OPTIONS)[number]),
        ) as Array<
          "English" | "Pidgin" | "Yoruba" | "Hausa" | "Igbo" | "Other"
        >;
        await onSave?.({
          section: "overview",
          basics: {
            fullName,
            relationship,
            gender: gender.toLowerCase() === "male" ? "male" : "female",
            dateOfBirth: toIso8601Date(dob),
            addressState: state,
            addressLga: lga,
            addressStreet: address,
            languages: langList.length ? langList : ["English"],
          },
          profilePatch: {
            fullName,
            firstName: fullName.trim().split(/\s+/)[0] || fullName,
            relationship,
            gender,
            dateOfBirth: toDateOnly(dob),
            address: `${address}, ${lga}, ${state}`,
            city: state,
            lga,
            languages,
            about: {
              ...profile.about,
              fullName,
              relationship,
              gender,
              dateOfBirth: toDateOnly(dob),
              homeAddress: `${address}, ${lga}, ${state}`,
              languages: languages.join(", "),
            },
          },
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close editor"
        className="absolute inset-0 bg-[#C5CED8]/55"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#E8EEF5] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-navy">{title}</h2>
            <p className="mt-0.5 text-sm text-navy/55">
              Changes sync to CareVYA for caregivers you book.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/40 hover:bg-surface-soft hover:text-navy"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {section === "overview" ? (
            <>
              <div className="flex items-center gap-3">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={profile.avatarUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">Profile photo</p>
                  {photoUploading ? (
                    <p className="text-xs text-navy/50">Uploading photo…</p>
                  ) : onChangePhoto ? (
                    <button
                      type="button"
                      onClick={onChangePhoto}
                      className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                    >
                      Change photo
                    </button>
                  ) : (
                    <p className="text-xs text-navy/50">
                      JPG, PNG, or WebP up to 5 MB
                    </p>
                  )}
                </div>
              </div>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Full name
                </span>
                <span className="flex h-11 items-center gap-2 rounded-xl border border-[#D7E0EA] bg-white px-3">
                  <UserRound className="size-4 text-navy/40" aria-hidden />
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-navy outline-none"
                  />
                </span>
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-navy/55">
                    Relationship
                  </span>
                  <select
                    value={relationship}
                    onChange={(event) => setRelationship(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                  >
                    {RELATIONSHIPS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-navy/55">
                    Gender
                  </span>
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                  >
                    {GENDERS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Date of birth
                </span>
                <span className="flex h-11 items-center gap-2 rounded-xl border border-[#D7E0EA] bg-white px-3">
                  <Calendar className="size-4 text-navy/40" aria-hidden />
                  <input
                    type="date"
                    value={dob}
                    onChange={(event) => setDob(event.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-navy outline-none"
                  />
                </span>
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Home address
                </span>
                <span className="flex h-11 items-center gap-2 rounded-xl border border-[#D7E0EA] bg-white px-3">
                  <MapPin className="size-4 text-navy/40" aria-hidden />
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-navy outline-none"
                  />
                </span>
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-navy/55">
                    State
                  </span>
                  <select
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                  >
                    {STATES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-navy/55">
                    Area / LGA
                  </span>
                  <input
                    value={lga}
                    onChange={(event) => setLga(event.target.value)}
                    className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                  />
                </label>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-medium text-navy/55">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const selected = languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                          selected
                            ? "border-brand-blue bg-[#EAF2FF] text-brand-blue"
                            : "border-[#D7E0EA] bg-white text-navy/70",
                        )}
                      >
                        {selected ? (
                          <Check className="size-3.5" aria-hidden />
                        ) : null}
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {section === "allergies-diet" ? (
            <div className="space-y-4">
              <Field
                label="Medicine allergies (comma-separated)"
                value={allergiesText}
                onChange={setAllergiesText}
              />
              <Field
                label="Food allergies (comma-separated)"
                value={foodAllergiesText}
                onChange={setFoodAllergiesText}
              />
              <Field label="Diet" value={diet} onChange={setDiet} />
              <Field label="Fluids" value={fluids} onChange={setFluids} />
            </div>
          ) : null}

          {section === "health" ? (
            <div className="space-y-4">
              <Field
                label="Conditions (comma-separated)"
                value={conditionsText}
                onChange={setConditionsText}
              />
              <Field
                label="Medications (comma-separated)"
                value={medicationsText}
                onChange={setMedicationsText}
              />
              <Field
                label="Medicine allergies (comma-separated)"
                value={allergiesText}
                onChange={setAllergiesText}
              />
              <Field
                label="Food allergies (comma-separated)"
                value={foodAllergiesText}
                onChange={setFoodAllergiesText}
              />
              <Field label="Diet" value={diet} onChange={setDiet} />
              <Field label="Fluids" value={fluids} onChange={setFluids} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Mobility
                </span>
                <select
                  value={mobility}
                  onChange={(event) => setMobility(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                >
                  <option value="">Select</option>
                  {MOBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Doctor name"
                value={doctorName}
                onChange={setDoctorName}
              />
              <Field
                label="Doctor phone"
                value={doctorPhone}
                onChange={setDoctorPhone}
              />
              <Field
                label="Clinic / hospital"
                value={clinicName}
                onChange={setClinicName}
              />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Notes for caregivers
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[#D7E0EA] bg-white px-3 py-2.5 text-sm text-navy outline-none"
                />
              </label>
            </div>
          ) : null}

          {section === "care-plan" ? (
            <div className="space-y-4">
              <Field
                label="Care types (comma-separated)"
                value={careTypesText}
                onChange={setCareTypesText}
              />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Arrangement
                </span>
                <select
                  value={arrangement}
                  onChange={(event) => setArrangement(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                >
                  <option value="">Select</option>
                  {ARRANGEMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Schedule note"
                value={scheduleNote}
                onChange={setScheduleNote}
              />
              <Field
                label="Caregiver preferences (comma-separated)"
                value={prefsText}
                onChange={setPrefsText}
              />
              <Field
                label="Enjoys (comma-separated)"
                value={enjoysText}
                onChange={setEnjoysText}
              />
            </div>
          ) : null}

          {section === "home" ? (
            <div className="space-y-4">
              <Field
                label="Lives with"
                value={livesWith}
                onChange={setLivesWith}
              />
              <Field
                label="Home"
                value={homeType}
                onChange={setHomeType}
              />
              <Field
                label="Caregiver's room"
                value={caregiverRoom}
                onChange={setCaregiverRoom}
              />
              <Field label="Power" value={power} onChange={setPower} />
            </div>
          ) : null}

          {section === "preferences" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Gender
                </span>
                <select
                  value={prefGender}
                  onChange={(event) => setPrefGender(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
                >
                  <option value="">No preference</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>
              <Field
                label="Languages"
                value={prefLanguages}
                onChange={setPrefLanguages}
              />
              <Field
                label="Experience"
                value={prefExperience}
                onChange={setPrefExperience}
              />
              <Field label="Other" value={prefOther} onChange={setPrefOther} />
            </div>
          ) : null}

          {section === "routine" ? (
            <div className="space-y-4">
              <p className="text-sm text-navy/55">
                Add the times and activities caregivers should follow for{" "}
                {profile.firstName}.
              </p>
              {routineRows.map((row, index) => (
                <div
                  key={`routine-${index}`}
                  className="rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-navy/55">
                      Step {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setRoutineRows((current) =>
                          current.filter((_, rowIndex) => rowIndex !== index),
                        )
                      }
                      className="text-xs font-semibold text-danger hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 space-y-2.5">
                    <Field
                      label="Time"
                      value={row.time}
                      onChange={(value) =>
                        updateRoutineRow(index, "time", value)
                      }
                    />
                    <Field
                      label="Activity"
                      value={row.title}
                      onChange={(value) =>
                        updateRoutineRow(index, "title", value)
                      }
                    />
                    <Field
                      label="Note (optional)"
                      value={row.note}
                      onChange={(value) =>
                        updateRoutineRow(index, "note", value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setRoutineRows((current) => [
                    ...current,
                    { time: "", title: "", note: "" },
                  ])
                }
                className="h-10 w-full rounded-full"
              >
                Add routine step
              </Button>
            </div>
          ) : null}

          {section === "contacts" ? (
            <div className="space-y-6">
              <ContactFields
                title="1st contact"
                name={contact1Name}
                relationship={contact1Rel}
                phone={contact1Phone}
                channel={contact1Channel}
                onName={setContact1Name}
                onRelationship={setContact1Rel}
                onPhone={setContact1Phone}
                onChannel={setContact1Channel}
              />
              <ContactFields
                title="2nd contact"
                name={contact2Name}
                relationship={contact2Rel}
                phone={contact2Phone}
                channel={contact2Channel}
                onName={setContact2Name}
                onRelationship={setContact2Rel}
                onPhone={setContact2Phone}
                onChannel={setContact2Channel}
              />
            </div>
          ) : null}
        </div>

        <div className="flex gap-2.5 border-t border-[#E8EEF5] px-5 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 flex-1 rounded-full"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="h-11 flex-1 rounded-full"
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-navy/55">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
      />
    </label>
  );
}

function ContactFields({
  title,
  name,
  relationship,
  phone,
  channel,
  onName,
  onRelationship,
  onPhone,
  onChannel,
}: {
  title: string;
  name: string;
  relationship: string;
  phone: string;
  channel: string;
  onName: (value: string) => void;
  onRelationship: (value: string) => void;
  onPhone: (value: string) => void;
  onChannel: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-navy">{title}</p>
      <div className="space-y-3">
        <Field label="Full name" value={name} onChange={onName} />
        <Field
          label="Relationship"
          value={relationship}
          onChange={onRelationship}
        />
        <Field label="Phone" value={phone} onChange={onPhone} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-navy/55">
            Preferred channel
          </span>
          <select
            value={channel}
            onChange={(event) => onChannel(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none"
          >
            {CHANNEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
