"use client";

import { ArrowRight, Check, ChevronDown, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  formatRateInput,
  parseRateInput,
  PROFILE_ARRANGEMENT_OPTIONS,
  PROFILE_CARE_TYPE_OPTIONS,
  PROFILE_LANGUAGE_OPTIONS,
  PROFILE_SPECIALIZATION_OPTIONS,
  PROFILE_TRAVEL_OPTIONS,
} from "@/features/caregiver-dashboard/data/mock-profile";
import type { CaregiverPublicProfile } from "@/features/caregiver-dashboard/types/profile";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
        selected
          ? "border-brand-blue bg-[#E8F1FF] font-medium text-brand-blue"
          : "border-[#D7DEE8] bg-white text-navy/70 hover:border-brand-blue/40",
      )}
    >
      {label}
      {selected ? (
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      ) : null}
    </button>
  );
}

function RateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
      </label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-navy/45">
          ₦
        </span>
        <input
          id={id}
          inputMode="numeric"
          value={formatRateInput(value)}
          onChange={(event) => onChange(parseRateInput(event.target.value))}
          className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white py-2 pr-3.5 pl-8 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

export function EditCaregiverProfileModal({
  open,
  profile,
  onClose,
  onSave,
}: {
  open: boolean;
  profile: CaregiverPublicProfile;
  onClose: () => void;
  onSave: (next: CaregiverPublicProfile) => void;
}) {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);

  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const [bio, setBio] = useState(profile.bio);
  const [careType, setCareType] = useState(profile.careType);
  const [specializations, setSpecializations] = useState(profile.specializations);
  const [arrangements, setArrangements] = useState(profile.arrangements);
  const [languages, setLanguages] = useState(profile.languages);
  const [areas, setAreas] = useState(profile.areas);
  const [areaDraft, setAreaDraft] = useState("");
  const [travelLabel, setTravelLabel] = useState(profile.travelLabel);
  const [travelOpen, setTravelOpen] = useState(false);
  const [rates, setRates] = useState(profile.rates);

  useEffect(() => {
    if (!open) return;
    setPhotoUrl(profile.photoUrl);
    setBio(profile.bio);
    setCareType(profile.careType);
    setSpecializations(profile.specializations);
    setArrangements(profile.arrangements);
    setLanguages(profile.languages);
    setAreas(profile.areas);
    setAreaDraft("");
    setTravelLabel(profile.travelLabel);
    setTravelOpen(false);
    setRates(profile.rates);
  }, [open, profile]);

  useEffect(() => {
    if (!travelOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!travelRef.current?.contains(event.target as Node)) {
        setTravelOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [travelOpen]);

  function addArea() {
    const next = areaDraft.trim();
    if (!next) return;
    if (areas.some((area) => area.toLowerCase() === next.toLowerCase())) {
      setAreaDraft("");
      return;
    }
    setAreas((current) => [...current, next]);
    setAreaDraft("");
  }

  function handleSave() {
    if (!bio.trim()) {
      appToast.error("Please add a short bio");
      return;
    }
    if (!careType) {
      appToast.error("Select a care type");
      return;
    }
    onSave({
      ...profile,
      photoUrl,
      bio: bio.trim(),
      careType,
      specializations,
      arrangements,
      languages,
      areas,
      travelLabel,
      rates,
    });
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-2xl"
    >
      <div className="max-h-[min(90vh,52rem)] overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-xl font-bold tracking-tight text-navy"
            >
              Edit profile
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              This is what careseekers see when they find you.
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

        <div className="mt-5 flex items-center gap-4">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-surface-soft sm:size-20">
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="80px"
              unoptimized={photoUrl.startsWith("blob:")}
              className="object-cover"
            />
          </span>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                setPhotoUrl(url);
                appToast.message("Photo updated — save to keep changes");
              }}
            />
            <Button
              type="button"
              variant="secondary"
              className="h-10 rounded-full px-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Change photo
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="profile-bio"
            className="text-sm font-semibold text-navy"
          >
            About you
          </label>
          <textarea
            id="profile-bio"
            rows={4}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="mt-1.5 w-full resize-y rounded-2xl border border-[#D7E0EA] bg-white px-3.5 py-3 text-sm leading-relaxed text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-semibold text-navy">Care type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROFILE_CARE_TYPE_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={careType === option}
                  onToggle={() => setCareType(option)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">Specializations</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROFILE_SPECIALIZATION_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={specializations.includes(option)}
                  onToggle={() =>
                    setSpecializations((current) => toggleValue(current, option))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">Arrangements</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROFILE_ARRANGEMENT_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={arrangements.includes(option)}
                  onToggle={() =>
                    setArrangements((current) => toggleValue(current, option))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">Languages</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROFILE_LANGUAGE_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={languages.includes(option)}
                  onToggle={() =>
                    setLanguages((current) => toggleValue(current, option))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">Areas you work in</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() =>
                    setAreas((current) =>
                      current.filter((item) => item !== area),
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue bg-[#E8F1FF] px-3.5 py-2 text-sm font-medium text-brand-blue"
                >
                  {area}
                  <X className="size-3.5" aria-hidden />
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                type="text"
                value={areaDraft}
                onChange={(event) => setAreaDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addArea();
                  }
                }}
                placeholder="Add an area"
                className="h-10 min-w-[10rem] flex-1 rounded-full border border-[#D7E0EA] bg-white px-3.5 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={addArea}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D7E0EA] bg-white px-3.5 text-sm font-semibold text-brand-blue hover:bg-surface-soft"
              >
                <Plus className="size-3.5" aria-hidden />
                Add area
              </button>
            </div>
          </div>

          <div ref={travelRef} className="relative">
            <p className="text-sm font-semibold text-navy">
              How far can you travel?
            </p>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={travelOpen}
              onClick={() => setTravelOpen((value) => !value)}
              className="mt-1.5 flex h-11 w-full items-center justify-between rounded-xl border border-[#D7E0EA] bg-white px-3.5 text-left text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{travelLabel}</span>
              <ChevronDown className="size-4 text-navy/45" aria-hidden />
            </button>
            {travelOpen ? (
              <div
                role="listbox"
                className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg"
              >
                {PROFILE_TRAVEL_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={option === travelLabel}
                    onClick={() => {
                      setTravelLabel(option);
                      setTravelOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-[#F8FAFC]",
                      option === travelLabel && "bg-[#EAF2FF]",
                    )}
                  >
                    {option}
                    {option === travelLabel ? (
                      <Check className="size-4 text-brand-blue" aria-hidden />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold text-navy">
              Your rates (starting prices)
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <RateField
                id="rate-day"
                label="Day shift (8am – 6pm)"
                value={rates.dayShift}
                onChange={(dayShift) => setRates((current) => ({ ...current, dayShift }))}
              />
              <RateField
                id="rate-night"
                label="Night shift (7pm – 7am)"
                value={rates.nightShift}
                onChange={(nightShift) =>
                  setRates((current) => ({ ...current, nightShift }))
                }
              />
              <RateField
                id="rate-weekly"
                label="Weekly (7 days)"
                value={rates.weekly}
                onChange={(weekly) => setRates((current) => ({ ...current, weekly }))}
              />
              <RateField
                id="rate-monthly"
                label="Monthly - live-in"
                value={rates.monthlyLiveIn}
                onChange={(monthlyLiveIn) =>
                  setRates((current) => ({ ...current, monthlyLiveIn }))
                }
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-navy/50">
              Availability, weekly hours and time off are edited in Schedule.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-11 flex-1 rounded-full"
          >
            Save changes
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
