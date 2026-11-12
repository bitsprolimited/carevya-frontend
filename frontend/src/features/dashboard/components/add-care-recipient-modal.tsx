"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  createCareRecipient,
  type CareRecipientRelationship,
  type CreateCareRecipientInput,
} from "@/features/care-recipients/services/care-recipients-service";
import { useCareRecipientsStore } from "@/features/care-recipients/hooks/use-care-recipients-store";
import { useNigeriaLocations } from "@/features/waitlist/hooks/use-nigeria-locations";
import { toDateOnly } from "@/lib/date";
import { cn } from "@/lib/utils";

const RELATIONSHIP_OPTIONS: {
  value: CareRecipientRelationship;
  label: string;
}[] = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "grandparent", label: "Grandparent" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

const LANGUAGE_OPTIONS = [
  "English",
  "Pidgin",
  "Yoruba",
  "Hausa",
  "Igbo",
  "Other",
] as const;

type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

export function AddCareRecipientModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const refresh = useCareRecipientsStore((state) => state.refresh);
  const setSelectedId = useCareRecipientsStore((state) => state.setSelectedId);
  const { data: locations } = useNigeriaLocations();

  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] =
    useState<CareRecipientRelationship | "">("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [languages, setLanguages] = useState<LanguageOption[]>(["English"]);
  const [addressState, setAddressState] = useState("");
  const [addressLga, setAddressLga] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stateOptions = useMemo(
    () => locations?.states ?? [],
    [locations?.states],
  );

  const lgaOptions = useMemo(() => {
    if (!addressState || !locations?.lgasByState) return [];
    return locations.lgasByState[addressState] ?? [];
  }, [addressState, locations?.lgasByState]);

  function resetForm() {
    setFullName("");
    setRelationship("");
    setGender("");
    setDateOfBirth("");
    setLanguages(["English"]);
    setAddressState("");
    setAddressLga("");
    setAddressStreet("");
    setError(null);
    setSaving(false);
  }

  function handleClose() {
    if (saving) return;
    resetForm();
    onClose();
  }

  function toggleLanguage(language: LanguageOption) {
    setLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language],
    );
  }

  async function handleSubmit() {
    setError(null);
    const name = fullName.trim();
    const dob = toDateOnly(dateOfBirth);
    if (!name) {
      setError("Enter their full name.");
      return;
    }
    if (!relationship) {
      setError("Select your relationship to them.");
      return;
    }
    if (!gender) {
      setError("Select their gender.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      setError("Enter a valid date of birth.");
      return;
    }
    if (!languages.length) {
      setError("Select at least one language.");
      return;
    }

    const body: CreateCareRecipientInput = {
      fullName: name,
      relationship,
      gender,
      dateOfBirth: dob,
      languages,
      ...(addressState ? { addressState } : {}),
      ...(addressLga ? { addressLga } : {}),
      ...(addressStreet.trim()
        ? { addressStreet: addressStreet.trim() }
        : {}),
    };

    setSaving(true);
    try {
      const created = await createCareRecipient(body);
      await refresh();
      setSelectedId(created.id);
      resetForm();
      onClose();
      router.push(`/careseeker/recipients/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't add this care recipient.",
      );
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-lg">
      <div className="max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E8EEF5] bg-white px-5 py-6 shadow-xl sm:px-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-brand-blue">
            <Plus className="size-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold text-navy">
              Add someone you care for
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              Create their care recipient profile, then finish the rest of their
              care details.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3.5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-navy/70">
              Full name
            </span>
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="e.g. Folake Adeyemi"
              className="h-11 rounded-xl border-[#D7E0EA]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-navy/70">
              Relationship
            </span>
            <select
              value={relationship}
              onChange={(event) =>
                setRelationship(
                  event.target.value as CareRecipientRelationship | "",
                )
              }
              className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none focus:border-brand-blue"
            >
              <option value="">Select relationship</option>
              {RELATIONSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy/70">
                Gender
              </span>
              <select
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value as "male" | "female" | "")
                }
                className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white px-3 text-sm text-navy outline-none focus:border-brand-blue"
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy/70">
                Date of birth
              </span>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
                className="h-11 rounded-xl border-[#D7E0EA]"
              />
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-navy/70">
              Languages
            </span>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((language) => {
                const selected = languages.includes(language);
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      selected
                        ? "border-brand-blue bg-[#EAF2FF] text-brand-blue"
                        : "border-[#D7E0EA] bg-white text-navy/70 hover:border-brand-blue/40",
                    )}
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-navy/70">
                State (optional)
              </span>
              <SearchableSelect
                variant="light"
                value={addressState}
                onChange={(value) => {
                  setAddressState(value);
                  setAddressLga("");
                }}
                options={stateOptions}
                placeholder="Select state"
              />
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-navy/70">
                LGA (optional)
              </span>
              <SearchableSelect
                variant="light"
                value={addressLga}
                onChange={setAddressLga}
                options={lgaOptions}
                placeholder="Select LGA"
                disabled={!addressState}
              />
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-navy/70">
              Street address (optional)
            </span>
            <Input
              value={addressStreet}
              onChange={(event) => setAddressStreet(event.target.value)}
              placeholder="e.g. 12 Awolowo Road, Ikoyi"
              className="h-11 rounded-xl border-[#D7E0EA]"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-medium text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={saving}
            className="h-11 rounded-full px-5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving}
            className="h-11 rounded-full px-5"
          >
            {saving ? "Adding…" : "Add care recipient"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
