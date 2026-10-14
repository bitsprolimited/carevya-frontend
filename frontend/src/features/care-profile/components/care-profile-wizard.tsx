"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { CareProfileComplete } from "@/features/care-profile/components/care-profile-complete";
import { CareProfileShell } from "@/features/care-profile/components/care-profile-shell";
import {
  Chip,
  DateField,
  ErrorBanner,
  FieldError,
  FieldLabel,
  OptionCard,
  SelectField,
  TextArea,
  TextInput,
  UploadBox,
} from "@/features/care-profile/components/care-profile-ui";
import { useCareProfileStore } from "@/features/care-profile/hooks/use-care-profile-store";
import {
  capitalize,
  getCarePronouns,
} from "@/features/care-profile/lib/pronouns";
import {
  aboutThemTitle,
  getFinishSetupIssues,
  possessiveLabel,
  validateDateOfBirth,
  validatePhoneNumber,
} from "@/features/care-profile/lib/validation";
import {
  CARE_PROFILE_STEPS,
  CARE_START_OPTIONS,
  CARE_TYPE_OPTIONS,
  CAREGIVER_GENDER_OPTIONS,
  CONDITION_OPTIONS,
  EMERGENCY_RELATIONSHIP_OPTIONS,
  FAMILY_RELATIONSHIPS,
  GENDER_OPTIONS,
  GUARDIAN_RELATIONSHIPS,
  LANGUAGE_OPTIONS,
  NONE_OF_THESE_CONDITION,
  type CareFrequency,
  type CareProfileDraft,
  type CareStartTiming,
  type CareType,
  type Mobility,
  type ReachChannel,
} from "@/features/care-profile/types";
import { useNigeriaLocations } from "@/features/waitlist/hooks/use-nigeria-locations";
import { assets } from "@/lib/assets";

function StepActions({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueIcon = "arrow",
  disableContinue,
}: {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueIcon?: "arrow" | "check";
  disableContinue?: boolean;
}) {
  return (
    <div
      className={
        onBack
          ? "mt-8 flex items-center gap-3"
          : "mt-8 flex justify-center"
      }
    >
      {onBack ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="h-12 shrink-0 rounded-full px-5"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
      ) : null}
      <Button
        type="button"
        onClick={onContinue}
        disabled={disableContinue}
        className={
          onBack
            ? "h-12 min-w-0 flex-1 rounded-full"
            : "h-12 w-full max-w-md rounded-full px-8"
        }
      >
        {continueLabel}
        {continueIcon === "check" ? (
          <Check className="size-4" strokeWidth={3} aria-hidden />
        ) : (
          <ArrowRight className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
}

type StepNavProps = {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueIcon?: "arrow" | "check";
};

function WhoNeedsCareStep({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueIcon = "arrow",
}: StepNavProps) {
  const draft = useCareProfileStore((state) => state.draft);
  const patchDraft = useCareProfileStore((state) => state.patchDraft);
  const [errors, setErrors] = useState<{
    recipient?: string;
    relationship?: string;
  }>({});

  const needsRelationship =
    draft.recipient === "family_member" ||
    draft.recipient === "someone_in_my_care";

  function handleContinue() {
    const next: typeof errors = {};
    if (!draft.recipient) {
      next.recipient = "Choose who you're arranging care for.";
    }
    if (needsRelationship && !draft.relationship) {
      next.relationship = "Choose your relationship to them.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onContinue();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        Who needs care?
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Tell us who you&apos;re arranging care for so we can find the right
        caregivers.
      </p>

      <p className="mt-6 mb-3 text-sm font-medium text-navy">
        Who are you arranging care for?
      </p>

      <div className="space-y-3">
        <OptionCard
          title="Myself"
          description="I'm looking for care and support for myself."
          selected={draft.recipient === "myself"}
          onSelect={() => {
            setErrors((current) => ({ ...current, recipient: undefined }));
            patchDraft({
              recipient: "myself",
              relationship: null,
              relationshipOther: "",
            });
          }}
          imageSrc={assets.careProfileRecipient}
        />
        <OptionCard
          title="A family member"
          description="A parent, grandparent, spouse or another relative."
          selected={draft.recipient === "family_member"}
          onSelect={() => {
            setErrors((current) => ({ ...current, recipient: undefined }));
            patchDraft({
              recipient: "family_member",
              relationship: null,
              relationshipOther: "",
            });
          }}
          imageSrc={assets.careProfileRecipient}
        />
        <OptionCard
          title="Someone in my care"
          description="I'm a guardian or arranging care on someone else's behalf."
          selected={draft.recipient === "someone_in_my_care"}
          onSelect={() => {
            setErrors((current) => ({ ...current, recipient: undefined }));
            patchDraft({
              recipient: "someone_in_my_care",
              relationship: null,
              relationshipOther: "",
            });
          }}
          imageSrc={assets.careProfileRecipient}
        />
      </div>
      {errors.recipient ? <FieldError>{errors.recipient}</FieldError> : null}

      {needsRelationship ? (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-navy">
            What is your relationship to them?
          </p>
          <div className="flex flex-wrap gap-2">
            {(draft.recipient === "someone_in_my_care"
              ? GUARDIAN_RELATIONSHIPS
              : FAMILY_RELATIONSHIPS
            ).map((item) => (
              <Chip
                key={item.label}
                label={item.label}
                icon={item.icon}
                selected={draft.relationship === item.label}
                onToggle={() => {
                  setErrors((current) => ({
                    ...current,
                    relationship: undefined,
                  }));
                  patchDraft({
                    relationship: item.label,
                    relationshipOther: "",
                  });
                }}
              />
            ))}
          </div>
          {errors.relationship ? (
            <FieldError>{errors.relationship}</FieldError>
          ) : null}
        </div>
      ) : null}

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        continueLabel={continueLabel}
        continueIcon={continueIcon}
      />
    </div>
  );
}

function AboutThemStep({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueIcon = "arrow",
}: StepNavProps) {
  const draft = useCareProfileStore((state) => state.draft);
  const patchDraft = useCareProfileStore((state) => state.patchDraft);
  const pronouns = getCarePronouns(draft);
  const possess = possessiveLabel(draft);
  const locations = useNigeriaLocations();
  const [errors, setErrors] = useState<{
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    state?: string;
    lga?: string;
    languages?: string;
    languageOther?: string;
  }>({});
  const [todayIso, setTodayIso] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTodayIso(new Date().toISOString().slice(0, 10));
  }, []);

  const stateOptions = locations.data?.states ?? [];
  const lgas = draft.state
    ? (locations.data?.lgasByState[draft.state] ?? [])
    : [];

  function clearError(key: keyof typeof errors) {
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleContinue() {
    const next: typeof errors = {};
    if (!draft.fullName.trim()) {
      next.fullName = `Enter ${possess} full name.`;
    }
    const dobError = validateDateOfBirth(draft.dateOfBirth);
    if (dobError === "required") {
      next.dateOfBirth = `Enter ${possess} date of birth.`;
    } else if (dobError) {
      next.dateOfBirth = dobError;
    }
    if (!draft.gender) {
      next.gender = `Select ${possess} gender.`;
    }
    if (!draft.state) {
      next.state = "Select a state.";
    }
    if (!draft.lga) {
      next.lga = "Select an area / LGA.";
    }
    if (draft.languages.length === 0) {
      next.languages = `Select at least one language ${
        pronouns.subject === "you" ? "you speak" : `${pronouns.subject} speaks`
      }.`;
    }
    if (draft.languages.includes("Other") && !draft.languageOther.trim()) {
      next.languageOther = "Please specify the other language.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onContinue();
  }

  function toggleLanguage(language: string) {
    clearError("languages");
    const selected = draft.languages.includes(language);
    patchDraft({
      languages: selected
        ? draft.languages.filter((item) => item !== language)
        : [...draft.languages, language],
      languageOther:
        language === "Other" && selected ? "" : draft.languageOther,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        {aboutThemTitle(draft)}
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        These details help caregivers understand who they&apos;ll be caring for.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="care-full-name">Full name</FieldLabel>
          <TextInput
            id="care-full-name"
            value={draft.fullName}
            onChange={(value) => {
              clearError("fullName");
              patchDraft({ fullName: value });
            }}
            placeholder="e.g. Folake Adebayo"
            icon={<User className="size-4 text-navy/40" aria-hidden />}
            invalid={Boolean(errors.fullName)}
          />
          {errors.fullName ? <FieldError>{errors.fullName}</FieldError> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="care-dob">Date of birth</FieldLabel>
            <DateField
              id="care-dob"
              value={draft.dateOfBirth}
              onChange={(value) => {
                clearError("dateOfBirth");
                patchDraft({ dateOfBirth: value });
              }}
              max={todayIso}
              invalid={Boolean(errors.dateOfBirth)}
            />
            {errors.dateOfBirth ? (
              <FieldError>{errors.dateOfBirth}</FieldError>
            ) : null}
          </div>
          <div>
            <FieldLabel htmlFor="care-gender">Gender</FieldLabel>
            <SelectField
              id="care-gender"
              value={draft.gender}
              onChange={(value) => {
                clearError("gender");
                patchDraft({ gender: value });
              }}
              placeholder="Select gender"
              invalid={Boolean(errors.gender)}
              options={[...GENDER_OPTIONS]}
            />
            {errors.gender ? <FieldError>{errors.gender}</FieldError> : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>State</FieldLabel>
            <SearchableSelect
              variant="light"
              options={stateOptions}
              value={draft.state}
              onChange={(value) => {
                clearError("state");
                clearError("lga");
                patchDraft({ state: value, lga: "" });
              }}
              placeholder={
                locations.isLoading ? "Loading states..." : "Select state"
              }
              disabled={locations.isLoading || stateOptions.length === 0}
              emptyMessage="No states found"
              invalid={Boolean(errors.state)}
            />
            {errors.state ? <FieldError>{errors.state}</FieldError> : null}
          </div>
          <div>
            <FieldLabel>Area / LGA</FieldLabel>
            <SearchableSelect
              variant="light"
              options={lgas}
              value={draft.lga}
              onChange={(value) => {
                clearError("lga");
                patchDraft({ lga: value });
              }}
              placeholder={
                draft.state ? "e.g. Yaba" : "Select a state first"
              }
              disabled={!draft.state || lgas.length === 0}
              emptyMessage="No LGAs found"
              icon={<MapPin className="size-4 text-navy/40" aria-hidden />}
              invalid={Boolean(errors.lga)}
            />
            {errors.lga ? <FieldError>{errors.lga}</FieldError> : null}
          </div>
        </div>

        <UploadBox
          title={
            pronouns.label === "you"
              ? "Upload your photo"
              : `Upload your ${pronouns.label}'s image`
          }
          fileName={draft.photoName}
          onFile={(name) =>
            patchDraft({ photoName: name, photoConfirmed: Boolean(name) })
          }
        />

        <UploadBox
          title={
            pronouns.label === "you"
              ? "Upload your NIN"
              : `Upload your ${pronouns.label}'s NIN`
          }
          fileName={draft.ninName}
          onFile={(name) =>
            patchDraft({ ninName: name, ninConfirmed: Boolean(name) })
          }
        />

        <div>
          <p className="mb-3 text-sm font-medium text-navy">
            Languages{" "}
            {pronouns.subject === "you"
              ? "you speak"
              : `${pronouns.subject} speaks`}
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((language) => (
              <Chip
                key={language}
                label={language}
                selected={draft.languages.includes(language)}
                onToggle={() => toggleLanguage(language)}
              />
            ))}
          </div>
          {errors.languages ? <FieldError>{errors.languages}</FieldError> : null}
          {draft.languages.includes("Other") ? (
            <div className="mt-3">
              <FieldLabel htmlFor="language-other">Please specify</FieldLabel>
              <TextInput
                id="language-other"
                value={draft.languageOther}
                onChange={(value) => {
                  clearError("languageOther");
                  patchDraft({ languageOther: value });
                }}
                placeholder="e.g. French"
                invalid={Boolean(errors.languageOther)}
              />
              {errors.languageOther ? (
                <FieldError>{errors.languageOther}</FieldError>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        continueLabel={continueLabel}
        continueIcon={continueIcon}
      />
    </div>
  );
}

function CareNeedsStep({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueIcon = "arrow",
}: StepNavProps) {
  const draft = useCareProfileStore((state) => state.draft);
  const patchDraft = useCareProfileStore((state) => state.patchDraft);
  const [errors, setErrors] = useState<{
    careTypes?: string;
    frequency?: string;
    startTiming?: string;
    startDate?: string;
  }>({});

  function toggleCareType(type: CareType) {
    setErrors((current) => ({ ...current, careTypes: undefined }));
    const selected = draft.careTypes.includes(type);
    patchDraft({
      careTypes: selected
        ? draft.careTypes.filter((item) => item !== type)
        : [...draft.careTypes, type],
    });
  }

  function handleContinue() {
    const next: typeof errors = {};
    if (draft.careTypes.length === 0) {
      next.careTypes = "Select at least one type of care.";
    }
    if (!draft.frequency) {
      next.frequency = "Choose how often care is needed.";
    }
    if (!draft.startTiming) {
      next.startTiming = "Select when care should start.";
    }
    if (draft.startTiming === "specific_date" && !draft.startDate.trim()) {
      next.startDate = "Enter the specific start date.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onContinue();
  }

  const frequencies: { value: CareFrequency; label: string }[] = [
    { value: "live_in", label: "Live-in" },
    { value: "full_day", label: "Full day" },
    { value: "part_time", label: "Part-time (a few hours)" },
    { value: "overnight", label: "Overnight" },
    { value: "weekends_only", label: "Weekends only" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        What kind of care is needed?
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Choose all that apply. You can update this anytime.
      </p>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-navy">Type of care</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CARE_TYPE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              title={option.title}
              description={option.description}
              selected={draft.careTypes.includes(option.value)}
              onSelect={() => toggleCareType(option.value)}
              imageSrc={assets.careProfileRecipient}
            />
          ))}
        </div>
        {errors.careTypes ? <FieldError>{errors.careTypes}</FieldError> : null}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-navy">
          How often is care needed?
        </p>
        <div className="flex flex-wrap gap-2">
          {frequencies.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              selected={draft.frequency === item.value}
              onToggle={() => {
                setErrors((current) => ({ ...current, frequency: undefined }));
                patchDraft({ frequency: item.value });
              }}
            />
          ))}
        </div>
        {errors.frequency ? <FieldError>{errors.frequency}</FieldError> : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="start-timing">When should care start?</FieldLabel>
          <SelectField
            id="start-timing"
            value={draft.startTiming ?? ""}
            onChange={(value) => {
              setErrors((current) => ({
                ...current,
                startTiming: undefined,
                startDate: undefined,
              }));
              const timing = value as CareStartTiming;
              patchDraft({
                startTiming: timing,
                startDate:
                  timing === "specific_date" ? draft.startDate : "",
              });
            }}
            placeholder="Select timing"
            invalid={Boolean(errors.startTiming)}
            options={[...CARE_START_OPTIONS]}
          />
          {errors.startTiming ? (
            <FieldError>{errors.startTiming}</FieldError>
          ) : null}
        </div>
        <div>
          <FieldLabel htmlFor="caregiver-gender">
            Caregiver gender preference
          </FieldLabel>
          <SelectField
            id="caregiver-gender"
            value={draft.caregiverGender}
            onChange={(value) =>
              patchDraft({
                caregiverGender: value as typeof draft.caregiverGender,
              })
            }
            placeholder="Select preference"
            options={[...CAREGIVER_GENDER_OPTIONS]}
          />
        </div>
      </div>

      {draft.startTiming === "specific_date" ? (
        <div className="mt-4">
          <FieldLabel htmlFor="start-date">Specific Date</FieldLabel>
          <DateField
            id="start-date"
            value={draft.startDate}
            onChange={(value) => {
              setErrors((current) => ({ ...current, startDate: undefined }));
              patchDraft({ startDate: value });
            }}
            invalid={Boolean(errors.startDate)}
          />
          {errors.startDate ? <FieldError>{errors.startDate}</FieldError> : null}
        </div>
      ) : null}

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        continueLabel={continueLabel}
        continueIcon={continueIcon}
      />
    </div>
  );
}

function HealthStep({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueIcon = "arrow",
}: StepNavProps) {
  const draft = useCareProfileStore((state) => state.draft);
  const patchDraft = useCareProfileStore((state) => state.patchDraft);
  const pronouns = getCarePronouns(draft);
  const [errors, setErrors] = useState<{
    conditions?: string;
    mobility?: string;
    conditionOther?: string;
  }>({});

  function toggleCondition(condition: string) {
    setErrors((current) => ({ ...current, conditions: undefined }));
    const selected = draft.conditions.includes(condition);

    if (condition === NONE_OF_THESE_CONDITION) {
      patchDraft({
        conditions: selected ? [] : [NONE_OF_THESE_CONDITION],
        conditionOther: "",
      });
      return;
    }

    const withoutNone = draft.conditions.filter(
      (item) => item !== NONE_OF_THESE_CONDITION,
    );
    patchDraft({
      conditions: selected
        ? withoutNone.filter((item) => item !== condition)
        : [...withoutNone, condition],
      conditionOther:
        condition === "Other" && selected ? "" : draft.conditionOther,
    });
  }

  function handleContinue() {
    const next: typeof errors = {};
    if (draft.conditions.length === 0) {
      next.conditions =
        pronouns.subject === "you"
          ? "Select any conditions you have, or choose 'None of these'."
          : `Select any conditions ${pronouns.subject} has, or choose 'None of these'.`;
    }
    if (!draft.mobility) {
      next.mobility =
        pronouns.subject === "you"
          ? "Tell us how you get around."
          : pronouns.subject === "they"
            ? "Tell us how they get around."
            : `Tell us how ${pronouns.subject} gets around.`;
    }
    if (draft.conditions.includes("Other") && !draft.conditionOther.trim()) {
      next.conditionOther = "Please specify the other condition.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onContinue();
  }

  const mobilityOptions: { value: Mobility; label: string }[] = [
    { value: "walks_alone", label: `Walks on ${pronouns.possessive} own` },
    { value: "walks_with_help", label: "Walks with some help" },
    { value: "wheelchair", label: "Uses a wheelchair" },
    { value: "mostly_in_bed", label: "Mostly in bed" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        {capitalize(pronouns.possessive)} health and daily needs
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        This helps us match caregivers with the right experience. It&apos;s only
        shared with caregivers you book.
      </p>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-navy">
          Does {pronouns.subject} have any of these conditions?
        </p>
        <div className="flex flex-wrap gap-2">
          {CONDITION_OPTIONS.map((condition) => (
            <Chip
              key={condition}
              label={condition}
              selected={draft.conditions.includes(condition)}
              onToggle={() => toggleCondition(condition)}
            />
          ))}
        </div>
        {errors.conditions ? (
          <FieldError>{errors.conditions}</FieldError>
        ) : null}
        {draft.conditions.includes("Other") ? (
          <div className="mt-3">
            <TextInput
              id="condition-other"
              value={draft.conditionOther}
              onChange={(value) => {
                setErrors((current) => ({
                  ...current,
                  conditionOther: undefined,
                }));
                patchDraft({ conditionOther: value });
              }}
              placeholder="Please specify"
              invalid={Boolean(errors.conditionOther)}
            />
            {errors.conditionOther ? (
              <FieldError>{errors.conditionOther}</FieldError>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-navy">
          How does {pronouns.subject} get around?
        </p>
        <div className="flex flex-wrap gap-2">
          {mobilityOptions.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              selected={draft.mobility === item.value}
              onToggle={() => {
                setErrors((current) => ({ ...current, mobility: undefined }));
                patchDraft({ mobility: item.value });
              }}
            />
          ))}
        </div>
        {errors.mobility ? <FieldError>{errors.mobility}</FieldError> : null}
      </div>

      <div className="mt-6">
        <FieldLabel htmlFor="medications">
          Medications or allergies (optional)
        </FieldLabel>
        <TextArea
          id="medications"
          value={draft.medications}
          onChange={(value) => patchDraft({ medications: value })}
          placeholder="e.g. Amlodipine 5mg every morning; allergic to penicillin"
        />
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="additional-info">
          Anything else a caregiver should know? (optional)
        </FieldLabel>
        <TextArea
          id="additional-info"
          value={draft.additionalInfo}
          onChange={(value) => patchDraft({ additionalInfo: value })}
          placeholder={`Daily routines, favourite foods, behaviour, or things that comfort or upset ${pronouns.object}...`}
        />
      </div>

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        continueLabel={continueLabel}
        continueIcon={continueIcon}
      />
    </div>
  );
}

function EmergencyConsentStep({
  onBack,
  onContinue,
  continueLabel = "Review details",
  continueIcon = "arrow",
}: StepNavProps) {
  const draft = useCareProfileStore((state) => state.draft);
  const patchDraft = useCareProfileStore((state) => state.patchDraft);
  const [errors, setErrors] = useState<{
    emergencyName?: string;
    relationshipToYou?: string;
    emergencyPhone?: string;
    reachChannels?: string;
    consentMatch?: string;
    consentAccurate?: string;
    consentTerms?: string;
  }>({});
  const [banner, setBanner] = useState("");

  function clearError(key: keyof typeof errors) {
    setErrors((current) => ({ ...current, [key]: undefined }));
    setBanner("");
  }

  function toggleReach(channel: ReachChannel) {
    clearError("reachChannels");
    const selected = draft.reachChannels.includes(channel);
    patchDraft({
      reachChannels: selected
        ? draft.reachChannels.filter((item) => item !== channel)
        : [...draft.reachChannels, channel],
    });
  }

  function handleContinue() {
    const next: typeof errors = {};
    if (!draft.emergencyName.trim()) {
      next.emergencyName = "Enter the contact's full name.";
    }
    if (!draft.relationshipToYou) {
      next.relationshipToYou = "Select their relationship to you.";
    }
    const phoneError = validatePhoneNumber(draft.emergencyPhone);
    if (phoneError === "required") {
      next.emergencyPhone = "Enter a phone number.";
    } else if (phoneError) {
      next.emergencyPhone = phoneError;
    }
    if (draft.reachChannels.length === 0) {
      next.reachChannels = "Select how we should reach you.";
    }
    if (!draft.consentMatch) {
      next.consentMatch = "You need to agree to these to finish setting up.";
    }
    if (!draft.consentAccurate) {
      next.consentAccurate = "You need to agree to these to finish setting up.";
    }
    if (!draft.consentTerms) {
      next.consentTerms = "You need to agree to these to finish setting up.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (continueLabel === "Finish setup") {
        setBanner(
          "A few details still need your attention. Add the missing required details and accept the Terms & Conditions, Safety Rules and Code of Conduct before finishing setup.",
        );
      }
      return;
    }
    setBanner("");
    onContinue();
  }

  const reachOptions: { value: ReachChannel; label: string }[] = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "phone", label: "Phone call" },
    { value: "sms", label: "SMS" },
  ];

  const consentCheckboxClass = (invalid?: boolean) =>
    `mt-0.5 size-4 rounded border accent-brand-blue ${
      invalid ? "border-red-500 outline outline-1 outline-red-400" : "border-[#D7DEE8]"
    }`;

  return (
    <div>
      {banner ? <ErrorBanner>{banner}</ErrorBanner> : null}

      <h1 className="text-2xl font-bold tracking-tight text-navy">
        Emergency Contact and Consent
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Who should we call if something comes up and we can&apos;t reach you?
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <FieldLabel htmlFor="emergency-name">Contact&apos;s full name</FieldLabel>
          <TextInput
            id="emergency-name"
            value={draft.emergencyName}
            onChange={(value) => {
              clearError("emergencyName");
              patchDraft({ emergencyName: value });
            }}
            placeholder="e.g. Tunde Adebayo"
            icon={<User className="size-4 text-navy/40" />}
            invalid={Boolean(errors.emergencyName)}
          />
          {errors.emergencyName ? (
            <FieldError>{errors.emergencyName}</FieldError>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="rel-you">Relationship to you</FieldLabel>
          <SelectField
            id="rel-you"
            value={draft.relationshipToYou}
            onChange={(value) => {
              clearError("relationshipToYou");
              patchDraft({ relationshipToYou: value });
            }}
            placeholder="Select relationship"
            invalid={Boolean(errors.relationshipToYou)}
            options={[...EMERGENCY_RELATIONSHIP_OPTIONS]}
          />
          {errors.relationshipToYou ? (
            <FieldError>{errors.relationshipToYou}</FieldError>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="emergency-phone">Phone number</FieldLabel>
          <TextInput
            id="emergency-phone"
            value={draft.emergencyPhone}
            onChange={(value) => {
              clearError("emergencyPhone");
              patchDraft({ emergencyPhone: value });
            }}
            placeholder="e.g. +234 803 123 4567"
            icon={<Phone className="size-4 text-navy/40" />}
            invalid={Boolean(errors.emergencyPhone)}
          />
          {errors.emergencyPhone ? (
            <FieldError>{errors.emergencyPhone}</FieldError>
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-navy">
            How should we reach you?
          </p>
          <div className="flex flex-wrap gap-2">
            {reachOptions.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                selected={draft.reachChannels.includes(item.value)}
                onToggle={() => toggleReach(item.value)}
              />
            ))}
          </div>
          {errors.reachChannels ? (
            <FieldError>{errors.reachChannels}</FieldError>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-surface-soft/40 p-4">
          <p className="mb-3 text-sm font-semibold text-navy">Before you finish</p>
          <div className="space-y-3 text-sm text-navy/75">
            <div>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.consentMatch}
                  onChange={(event) => {
                    clearError("consentMatch");
                    patchDraft({ consentMatch: event.target.checked })
                  }}
                  className={consentCheckboxClass(Boolean(errors.consentMatch))}
                />
                <span>
                  I consent to CareVYA using the care and health information
                  I&apos;ve shared to match and coordinate care.
                </span>
              </label>
              {errors.consentMatch ? (
                <FieldError>{errors.consentMatch}</FieldError>
              ) : null}
            </div>
            <div>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.consentAccurate}
                  onChange={(event) => {
                    clearError("consentAccurate");
                    patchDraft({ consentAccurate: event.target.checked });
                  }}
                  className={consentCheckboxClass(
                    Boolean(errors.consentAccurate),
                  )}
                />
                <span>
                  I confirm that the information I&apos;ve provided is accurate.
                </span>
              </label>
              {errors.consentAccurate ? (
                <FieldError>{errors.consentAccurate}</FieldError>
              ) : null}
            </div>
            <div>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.consentTerms}
                  onChange={(event) => {
                    clearError("consentTerms");
                    patchDraft({ consentTerms: event.target.checked });
                  }}
                  className={consentCheckboxClass(Boolean(errors.consentTerms))}
                />
                <span>
                  I agree to CareVYA{" "}
                  <a href="/terms" className="font-medium text-brand-blue">
                    Terms &amp; Conditions
                  </a>
                  ,{" "}
                  <a
                    href="/safety-rules"
                    className="font-medium text-brand-blue"
                  >
                    Safety Rules
                  </a>{" "}
                  and{" "}
                  <a
                    href="/code-of-conduct"
                    className="font-medium text-brand-blue"
                  >
                    Code of Conduct
                  </a>
                  .
                </span>
              </label>
              {errors.consentTerms ? (
                <FieldError>
                  {continueLabel === "Finish setup"
                    ? "Not accepted. Required before you can finish setup."
                    : errors.consentTerms}
                </FieldError>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {continueLabel === "Finish setup" &&
      (errors.consentTerms ||
        errors.relationshipToYou ||
        errors.emergencyPhone) ? (
        <p className="mt-4 text-center text-xs text-navy/55">
          Finish setup will be available once the required details and agreement
          are complete.
        </p>
      ) : null}

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        continueLabel={continueLabel}
        continueIcon={continueIcon}
        disableContinue={false}
      />
    </div>
  );
}

function getReviewTitle(draft: CareProfileDraft): string {
  if (draft.recipient === "myself") return "Review your care profile";
  const pronouns = getCarePronouns(draft);
  if (pronouns.label === "them" || pronouns.label === "you") {
    return "Review your care profile";
  }
  return `Review your ${pronouns.label}'s care profile`;
}

function displayOrMissing(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function labelRecipient(draft: CareProfileDraft): string {
  if (draft.recipient === "myself") return "Myself";
  if (draft.recipient === "family_member") return "A family member";
  if (draft.recipient === "someone_in_my_care") return "Someone in my care";
  return "Not provided";
}

function labelCareTypes(draft: CareProfileDraft): string {
  if (draft.careTypes.length === 0) return "Not provided";
  const labels = Object.fromEntries(
    CARE_TYPE_OPTIONS.map((option) => [option.value, option.title]),
  ) as Record<CareType, string>;
  return draft.careTypes.map((type) => labels[type]).join(", ");
}

function labelStartTiming(draft: CareProfileDraft): string {
  if (draft.startTiming === "specific_date") {
    return displayOrMissing(draft.startDate);
  }
  const match = CARE_START_OPTIONS.find(
    (option) => option.value === draft.startTiming,
  );
  return match?.label ?? "Not provided";
}

function labelCaregiverGender(draft: CareProfileDraft): string {
  const match = CAREGIVER_GENDER_OPTIONS.find(
    (option) => option.value === draft.caregiverGender,
  );
  return match?.label ?? "Not provided";
}

function labelEmergencyRelationship(value: string): string {
  const match = EMERGENCY_RELATIONSHIP_OPTIONS.find(
    (option) => option.value === value,
  );
  return match?.label ?? "Not provided";
}

function labelFrequency(draft: CareProfileDraft): string {
  const labels: Record<NonNullable<CareProfileDraft["frequency"]>, string> = {
    live_in: "Live-in",
    full_day: "Full day",
    part_time: "Part-time (a few hours)",
    overnight: "Overnight",
    weekends_only: "Weekends only",
  };
  return draft.frequency ? labels[draft.frequency] : "Not provided";
}

function labelMobility(draft: CareProfileDraft): string {
  const pronouns = getCarePronouns(draft);
  const labels: Record<Mobility, string> = {
    walks_alone: `Walks on ${pronouns.possessive} own`,
    walks_with_help: "Walks with some help",
    wheelchair: "Uses a wheelchair",
    mostly_in_bed: "Mostly in bed",
  };
  return draft.mobility ? labels[draft.mobility] : "Not provided";
}

function labelGender(value: string): string {
  const match = GENDER_OPTIONS.find((option) => option.value === value);
  return match?.label ?? "Not provided";
}

function ReviewRow({
  label,
  value,
  missing,
}: {
  label: string;
  value: string;
  missing?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="shrink-0 text-navy/55">{label}</span>
      <span
        className={
          missing || value === "Not provided"
            ? "text-right font-medium text-navy/45"
            : "text-right font-semibold text-navy"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
  error,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
  error?: string;
}) {
  return (
    <section className="border-b border-[#E2E8F0] py-5 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-navy">{title}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-[#EEF2F7]">{children}</div>
      {error ? <FieldError>{error}</FieldError> : null}
    </section>
  );
}

function ReviewSummaryStep({
  onBack,
  onEditStep,
  onFinish,
}: {
  onBack: () => void;
  onEditStep: (index: number) => void;
  onFinish: () => void;
}) {
  const draft = useCareProfileStore((state) => state.draft);
  const patchDraft = useCareProfileStore((state) => state.patchDraft);
  const issues = getFinishSetupIssues(draft);
  const [attemptedFinish, setAttemptedFinish] = useState(false);

  const showErrors = attemptedFinish || !issues.canFinish;
  const showBanner = showErrors && !issues.canFinish;

  function handleFinish() {
    if (!issues.canFinish) {
      setAttemptedFinish(true);
      return;
    }
    onFinish();
  }

  const consentCheckboxClass = (invalid?: boolean) =>
    `mt-0.5 size-4 rounded border accent-brand-blue ${
      invalid ? "border-red-500 outline outline-1 outline-red-400" : "border-[#D7DEE8]"
    }`;

  const languages =
    draft.languages.length === 0
      ? "Not provided"
      : draft.languages
          .map((language) =>
            language === "Other" && draft.languageOther.trim()
              ? draft.languageOther.trim()
              : language,
          )
          .join(", ");

  const conditions =
    draft.conditions.length === 0
      ? "Not provided"
      : draft.conditions
          .map((condition) =>
            condition === "Other" && draft.conditionOther.trim()
              ? draft.conditionOther.trim()
              : condition,
          )
          .join(", ");

  const reachLabels: Record<ReachChannel, string> = {
    whatsapp: "WhatsApp",
    phone: "Phone call",
    sms: "SMS",
    email: "Email",
  };

  return (
    <div>
      {showBanner ? (
        <ErrorBanner>
          A few details still need your attention. Add the missing required
          details and accept the Terms &amp; Conditions, Safety Rules and Code
          of Conduct before finishing setup.
        </ErrorBanner>
      ) : null}

      <ReviewSection title="Who needs care" onEdit={() => onEditStep(0)}>
        <ReviewRow label="Arranging care for" value={labelRecipient(draft)} />
        {draft.recipient !== "myself" ? (
          <ReviewRow
            label="Relationship"
            value={
              draft.relationship === "Other"
                ? draft.relationshipOther.trim() || "Other"
                : displayOrMissing(draft.relationship)
            }
          />
        ) : null}
      </ReviewSection>

      <ReviewSection
        title="About them"
        onEdit={() => onEditStep(1)}
        error={showErrors ? issues.about : undefined}
      >
        <ReviewRow label="Full name" value={displayOrMissing(draft.fullName)} />
        <ReviewRow
          label="Date of birth"
          value={displayOrMissing(draft.dateOfBirth)}
          missing={Boolean(validateDateOfBirth(draft.dateOfBirth))}
        />
        <ReviewRow
          label="Gender"
          value={labelGender(draft.gender)}
          missing={!draft.gender}
        />
        <ReviewRow
          label="Location"
          value={
            draft.state || draft.lga
              ? [draft.lga, draft.state].filter(Boolean).join(", ")
              : "Not provided"
          }
        />
        <ReviewRow label="Languages" value={languages} />
      </ReviewSection>

      <ReviewSection title="Your identity" onEdit={() => onEditStep(1)}>
        <ReviewRow
          label="National Identification Number"
          value={
            draft.ninName
              ? draft.ninName.length > 4
                ? `••••${draft.ninName.slice(-4)}`
                : draft.ninName
              : "Not provided"
          }
        />
        <ReviewRow
          label="Verification status"
          value={draft.ninConfirmed ? "Uploaded" : "Not verified"}
        />
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2.5 text-xs leading-relaxed text-navy/70">
          <Info
            className="mt-0.5 size-3.5 shrink-0 text-brand-blue"
            aria-hidden
          />
          <p>
            On this review, an entered NIN shows only its last four digits. You
            can complete verification later if needed.
          </p>
        </div>
      </ReviewSection>

      <ReviewSection title="Care needs" onEdit={() => onEditStep(2)}>
        <ReviewRow label="Type of care" value={labelCareTypes(draft)} />
        <ReviewRow label="How often" value={labelFrequency(draft)} />
        <ReviewRow
          label="When care should start"
          value={labelStartTiming(draft)}
        />
        <ReviewRow
          label="Caregiver gender preference"
          value={labelCaregiverGender(draft)}
        />
      </ReviewSection>

      <ReviewSection title="Health" onEdit={() => onEditStep(3)}>
        <ReviewRow label="Conditions" value={conditions} />
        <ReviewRow label="Mobility" value={labelMobility(draft)} />
        <ReviewRow
          label="Medications or allergies (optional)"
          value={displayOrMissing(draft.medications)}
        />
        <ReviewRow
          label="Anything else (optional)"
          value={displayOrMissing(draft.additionalInfo)}
        />
      </ReviewSection>

      <ReviewSection
        title="Emergency & consent"
        onEdit={() => onEditStep(4)}
        error={showErrors ? issues.emergency : undefined}
      >
        <ReviewRow
          label="Contact’s full name"
          value={displayOrMissing(draft.emergencyName)}
        />
        <ReviewRow
          label="Relationship to you"
          value={labelEmergencyRelationship(draft.relationshipToYou)}
          missing={!draft.relationshipToYou}
        />
        <ReviewRow
          label="Phone number"
          value={displayOrMissing(draft.emergencyPhone)}
          missing={Boolean(validatePhoneNumber(draft.emergencyPhone))}
        />
        <ReviewRow
          label="How we should reach you"
          value={
            draft.reachChannels.length === 0
              ? "Not provided"
              : draft.reachChannels
                  .filter((channel) => channel !== "email")
                  .map((channel) => reachLabels[channel])
                  .join(", ")
          }
        />

        <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-surface-soft/40 p-4">
          <p className="mb-3 text-sm font-semibold text-navy">Before you finish</p>
          <div className="space-y-3 text-sm text-navy/75">
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={draft.consentMatch}
                onChange={(event) =>
                  patchDraft({ consentMatch: event.target.checked })
                }
                className={consentCheckboxClass()}
              />
              <span>
                I consent to CareVYA using the care and health information
                I&apos;ve shared to match and coordinate care.
              </span>
            </label>
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={draft.consentAccurate}
                onChange={(event) =>
                  patchDraft({ consentAccurate: event.target.checked })
                }
                className={consentCheckboxClass()}
              />
              <span>
                I confirm that the information I&apos;ve provided is accurate.
              </span>
            </label>
            <div>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.consentTerms}
                  onChange={(event) =>
                    patchDraft({ consentTerms: event.target.checked })
                  }
                  className={consentCheckboxClass(
                    showErrors && issues.missingConsentTerms,
                  )}
                />
                <span>
                  I agree to CareVYA{" "}
                  <a href="/terms" className="font-medium text-brand-blue">
                    Terms &amp; Conditions
                  </a>
                  ,{" "}
                  <a
                    href="/safety-rules"
                    className="font-medium text-brand-blue"
                  >
                    Safety Rules
                  </a>{" "}
                  and{" "}
                  <a
                    href="/code-of-conduct"
                    className="font-medium text-brand-blue"
                  >
                    Code of Conduct
                  </a>
                  .
                </span>
              </label>
              {showErrors && issues.missingConsentTerms ? (
                <FieldError>
                  Not accepted. Required before you can finish setup.
                </FieldError>
              ) : null}
            </div>
          </div>
        </div>
      </ReviewSection>

      {!issues.canFinish ? (
        <p className="mt-5 text-center text-xs text-navy/55">
          Finish setup will be available once the required details and agreement
          are complete.
        </p>
      ) : null}

      <StepActions
        onBack={onBack}
        onContinue={handleFinish}
        continueLabel="Finish setup"
        continueIcon="arrow"
        disableContinue={!issues.canFinish}
      />
    </div>
  );
}

export function CareProfileWizard() {
  const stepIndex = useCareProfileStore((state) => state.stepIndex);
  const isReviewing = useCareProfileStore((state) => state.isReviewing);
  const isComplete = useCareProfileStore((state) => state.isComplete);
  const draft = useCareProfileStore((state) => state.draft);
  const nextStep = useCareProfileStore((state) => state.nextStep);
  const prevStep = useCareProfileStore((state) => state.prevStep);
  const setStepIndex = useCareProfileStore((state) => state.setStepIndex);
  const enterReview = useCareProfileStore((state) => state.enterReview);
  const exitReview = useCareProfileStore((state) => state.exitReview);
  const completeSetup = useCareProfileStore((state) => state.completeSetup);
  const [editingFromReview, setEditingFromReview] = useState(false);

  const showReviewSummary = isReviewing && !editingFromReview;

  function startEditingStep(index: number) {
    setEditingFromReview(true);
    setStepIndex(index);
  }

  function returnToReviewSummary() {
    setEditingFromReview(false);
    setStepIndex(CARE_PROFILE_STEPS.length - 1);
  }

  function handleContinue() {
    if (isReviewing && editingFromReview) {
      returnToReviewSummary();
      return;
    }
    if (!isReviewing) {
      nextStep();
    }
  }

  function handleBack() {
    if (isReviewing && editingFromReview) {
      returnToReviewSummary();
      return;
    }
    if (isReviewing) {
      exitReview();
      return;
    }
    prevStep();
  }

  if (isComplete) {
    return <CareProfileComplete />;
  }

  const sharedNav: StepNavProps = {
    onBack: stepIndex === 0 && !isReviewing ? undefined : handleBack,
    onContinue: handleContinue,
    continueLabel: isReviewing && editingFromReview ? "Save Changes" : "Continue",
    continueIcon: isReviewing && editingFromReview ? "check" : "arrow",
  };

  return (
    <CareProfileShell
      stepIndex={showReviewSummary ? CARE_PROFILE_STEPS.length - 1 : stepIndex}
      isReviewing={isReviewing}
      reviewTitle={getReviewTitle(draft)}
      onSelectStep={isReviewing ? startEditingStep : undefined}
    >
      {showReviewSummary ? (
        <ReviewSummaryStep
          onBack={handleBack}
          onEditStep={startEditingStep}
          onFinish={completeSetup}
        />
      ) : null}
      {!showReviewSummary && stepIndex === 0 ? (
        <WhoNeedsCareStep {...sharedNav} />
      ) : null}
      {!showReviewSummary && stepIndex === 1 ? (
        <AboutThemStep {...sharedNav} />
      ) : null}
      {!showReviewSummary && stepIndex === 2 ? (
        <CareNeedsStep {...sharedNav} />
      ) : null}
      {!showReviewSummary && stepIndex === 3 ? (
        <HealthStep {...sharedNav} />
      ) : null}
      {!showReviewSummary && stepIndex === 4 ? (
        <EmergencyConsentStep
          onBack={handleBack}
          onContinue={isReviewing ? handleContinue : enterReview}
          continueLabel={
            isReviewing && editingFromReview ? "Save Changes" : "Review details"
          }
          continueIcon={isReviewing && editingFromReview ? "check" : "arrow"}
        />
      ) : null}
    </CareProfileShell>
  );
}
