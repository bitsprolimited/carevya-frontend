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
import type { LovedOneProfile } from "@/features/dashboard/types/loved-one";
import { cn } from "@/lib/utils";

const RELATIONSHIPS = [
  "Mother",
  "Father",
  "Spouse",
  "Parent",
  "Sibling",
  "Other",
] as const;
const GENDERS = ["Female", "Male", "Other"] as const;
const STATES = ["Lagos", "Abuja", "Rivers", "Oyo"] as const;
const LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Hausa",
  "Igbo",
  "Pidgin",
  "Other",
] as const;

export function EditLovedOneDrawer({
  open,
  onClose,
  profile,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  profile: LovedOneProfile;
  onSave?: (patch: Partial<LovedOneProfile>) => void;
}) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [relationship, setRelationship] = useState(profile.relationship);
  const [gender, setGender] = useState(profile.gender);
  const [dob, setDob] = useState("12 / 03 / 1952");
  const [address, setAddress] = useState(
    profile.address.split(",")[0] ?? profile.address,
  );
  const [state, setState] = useState(profile.city);
  const [lga, setLga] = useState(profile.lga);
  const [languages, setLanguages] = useState(profile.languages);

  useEffect(() => {
    if (!open) return;
    setFullName(profile.fullName);
    setRelationship(profile.relationship);
    setGender(profile.gender);
    setDob(
      profile.dateOfBirth
        .replace(/(\d+)\s+(\w+)\s+(\d+)/, (_, d, m, y) => {
          const months: Record<string, string> = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
          };
          return `${d.padStart(2, "0")} / ${months[m] ?? "01"} / ${y}`;
        })
        .replace(/^(\d) /, "0$1 "),
    );
    setAddress(profile.address.split(",")[0]?.trim() ?? profile.address);
    setState(profile.city);
    setLga(profile.lga);
    setLanguages(profile.languages);
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

  function handleSave() {
    onSave?.({
      fullName,
      relationship,
      gender,
      address: `${address}, ${profile.area}, ${state}`,
      city: state,
      lga,
      languages,
      about: {
        ...profile.about,
        fullName,
        relationship,
        gender,
        homeAddress: `${address}, ${profile.area}, ${state}`,
        languages: languages.join(", "),
      },
    });
    onClose();
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
            <h2 className="text-lg font-bold text-navy">
              Edit {profile.firstName}&apos;s details
            </h2>
            <p className="mt-0.5 text-sm text-navy/55">
              Changes are shared with caregivers you&apos;ve booked.
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
              <p className="text-xs text-navy/50">JPG or PNG, up to 5 MB</p>
              <button
                type="button"
                className="mt-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
              >
                Change photo
              </button>
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
                Relationship to you
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
            <p className="mb-2 text-xs font-medium text-navy/55">
              Languages {profile.gender === "Female" ? "she" : "he"} speaks
            </p>
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
                    {selected ? <Check className="size-3.5" aria-hidden /> : null}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
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
            onClick={handleSave}
            className="h-11 flex-1 rounded-full"
          >
            Save changes
          </Button>
        </div>
      </aside>
    </div>
  );
}
