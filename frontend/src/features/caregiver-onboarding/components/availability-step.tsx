"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ErrorBanner,
  FieldError,
  FieldLabel,
  SelectField,
  TextInput,
} from "@/features/care-profile/components/care-profile-ui";
import { useCaregiverOnboardingStore } from "@/features/caregiver-onboarding/hooks/use-caregiver-onboarding-store";
import {
  validateCaregiverAvailability,
  type CaregiverAvailabilityErrors,
} from "@/features/caregiver-onboarding/lib/validation";
import {
  CAREGIVER_AVAILABILITY_OPTIONS,
  CAREGIVER_FLEX_DAYS,
  CAREGIVER_HOUR_SLOT_OPTIONS,
  CAREGIVER_OPEN_TO_OPTIONS,
  CAREGIVER_START_OPTIONS,
  CAREGIVER_TIME_OF_DAY_OPTIONS,
  CAREGIVER_TRAVEL_OPTIONS,
  CAREGIVER_WEEKDAY_OPTIONS,
  createTimeSlot,
  type CaregiverAvailabilityMode,
  type CaregiverFlexDayId,
  type CaregiverOpenTo,
  type CaregiverStartTiming,
  type CaregiverTravelDistance,
  type CaregiverWeekday,
} from "@/features/caregiver-onboarding/types";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function toggleValue<T extends string>(list: T[], value: T): T[] {
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

function InfoCallout({ children }: { children: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#F3F5F8] px-3.5 py-3 text-xs leading-relaxed text-navy/65">
      <Info className="mt-0.5 size-3.5 shrink-0 text-navy/45" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

export function AvailabilityStep({
  onBack,
  onContinue,
  saving = false,
}: {
  onBack: () => void;
  onContinue: () => void;
  saving?: boolean;
}) {
  const draft = useCaregiverOnboardingStore((state) => state.draft);
  const patchDraft = useCaregiverOnboardingStore((state) => state.patchDraft);
  const [errors, setErrors] = useState<CaregiverAvailabilityErrors>({});
  const [areaDraft, setAreaDraft] = useState("");
  const [addingArea, setAddingArea] = useState(false);

  const mode = draft.availabilityMode;

  function setMode(next: CaregiverAvailabilityMode) {
    patchDraft({ availabilityMode: next });
  }

  function updateFlexibleDay(
    dayId: CaregiverFlexDayId,
    updater: (
      day: (typeof draft.flexibleSchedule)[number],
    ) => (typeof draft.flexibleSchedule)[number],
  ) {
    patchDraft({
      flexibleSchedule: draft.flexibleSchedule.map((day) =>
        day.dayId === dayId ? updater(day) : day,
      ),
    });
  }

  function enableFlexibleDay(dayId: CaregiverFlexDayId) {
    updateFlexibleDay(dayId, (day) => ({
      ...day,
      enabled: true,
      slots: day.slots.length > 0 ? day.slots : [createTimeSlot()],
    }));
  }

  function disableFlexibleDay(dayId: CaregiverFlexDayId) {
    updateFlexibleDay(dayId, (day) => ({
      ...day,
      enabled: false,
      slots: [],
    }));
  }

  function addArea() {
    const next = areaDraft.trim();
    if (!next) return;
    if (draft.workAreas.some((area) => area.toLowerCase() === next.toLowerCase())) {
      appToast.message("That area is already added.");
      return;
    }
    if (draft.workAreas.length >= 10) {
      appToast.message("You can add up to 10 areas.");
      return;
    }
    patchDraft({ workAreas: [...draft.workAreas, next] });
    setAreaDraft("");
    setAddingArea(false);
  }

  function handleContinue() {
    const nextErrors = validateCaregiverAvailability(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      appToast.error("Please complete your availability details.");
      return;
    }
    onContinue();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-navy">
        When can you work?
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Let careseekers know when you can help. Choose your days and preferred
        time slots.
      </p>

      {Object.keys(errors).length > 0 ? (
        <div className="mt-5">
          <ErrorBanner>
            Check the highlighted fields below, then continue.
          </ErrorBanner>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">Availability</h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {CAREGIVER_AVAILABILITY_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={mode === option.value}
              onToggle={() => setMode(option.value)}
            />
          ))}
        </div>
        {errors.availabilityMode ? (
          <FieldError>{errors.availabilityMode}</FieldError>
        ) : null}

        {mode === "full_time" ? (
          <p className="mt-3 text-xs leading-relaxed text-navy/55">
            Full time hours: About 40 hours of active care per week • Overtime
            rate after 40 hours
          </p>
        ) : null}
      </section>

      {mode === "part_time" ? (
        <section className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-navy">Part time schedule</h3>
          <p className="mt-1 text-xs text-navy/55">
            A few days or hours per week. Perfect for careseekers who need
            support on specific days.
          </p>

          <div className="mt-5">
            <p className="mb-2.5 text-sm font-medium text-navy">
              Preferred days of the week
            </p>
            <div className="flex flex-wrap gap-2.5">
              {CAREGIVER_WEEKDAY_OPTIONS.map((day) => (
                <Chip
                  key={day}
                  label={day}
                  selected={draft.preferredDays.includes(day)}
                  onToggle={() =>
                    patchDraft({
                      preferredDays: toggleValue(
                        draft.preferredDays,
                        day as CaregiverWeekday,
                      ),
                    })
                  }
                />
              ))}
            </div>
            {errors.preferredDays ? (
              <FieldError>{errors.preferredDays}</FieldError>
            ) : null}
          </div>

          <div className="mt-5">
            <p className="mb-2.5 text-sm font-medium text-navy">
              Preferred time of the day
            </p>
            <div className="flex flex-wrap gap-2.5">
              {CAREGIVER_TIME_OF_DAY_OPTIONS.map((slot) => (
                <Chip
                  key={slot.value}
                  label={slot.label}
                  selected={draft.preferredTimesOfDay.includes(slot.value)}
                  onToggle={() =>
                    patchDraft({
                      preferredTimesOfDay: toggleValue(
                        draft.preferredTimesOfDay,
                        slot.value,
                      ),
                    })
                  }
                />
              ))}
            </div>
            {errors.preferredTimesOfDay ? (
              <FieldError>{errors.preferredTimesOfDay}</FieldError>
            ) : null}
          </div>

          <div className="mt-5">
            <p className="mb-2.5 text-sm font-medium text-navy">
              Preferred hours of the day
            </p>
            <div className="flex flex-wrap gap-2.5">
              {CAREGIVER_HOUR_SLOT_OPTIONS.map((slot) => (
                <Chip
                  key={slot.value}
                  label={slot.label}
                  selected={draft.preferredHourSlots.includes(slot.value)}
                  onToggle={() =>
                    patchDraft({
                      preferredHourSlots: toggleValue(
                        draft.preferredHourSlots,
                        slot.value,
                      ),
                    })
                  }
                />
              ))}
            </div>
            {errors.preferredHourSlots ? (
              <FieldError>{errors.preferredHourSlots}</FieldError>
            ) : null}
          </div>
        </section>
      ) : null}

      {mode === "flexible" ? (
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-navy">Working hours</h3>
          <p className="mt-1 text-xs text-navy/55">
            Select when you are typically available to work.
          </p>
          <div className="mt-4 space-y-3">
            {CAREGIVER_FLEX_DAYS.map((dayMeta) => {
              const day =
                draft.flexibleSchedule.find(
                  (item) => item.dayId === dayMeta.id,
                ) ?? {
                  dayId: dayMeta.id,
                  enabled: false,
                  slots: [],
                };
              const slot = day.slots[0];
              const dayName =
                dayMeta.weekday.charAt(0).toUpperCase() +
                dayMeta.weekday.slice(1);

              return (
                <div
                  key={dayMeta.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#E8EEF5] bg-white px-3 py-3 sm:flex-row sm:items-center"
                >
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                      day.enabled ? "bg-emerald-500" : "bg-[#C5CDD8]",
                    )}
                    title={dayName}
                  >
                    {dayMeta.label}
                  </span>

                  {day.enabled && slot ? (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(event) =>
                          updateFlexibleDay(day.dayId, (current) => ({
                            ...current,
                            slots: current.slots.map((item) =>
                              item.id === slot.id
                                ? { ...item, start: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="h-10 w-[7.5rem] rounded-xl border border-[#D7DEE8] px-3 text-sm text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                        aria-label={`${dayName} start time`}
                      />
                      <ArrowRight
                        className="size-4 text-navy/35"
                        aria-hidden
                      />
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(event) =>
                          updateFlexibleDay(day.dayId, (current) => ({
                            ...current,
                            slots: current.slots.map((item) =>
                              item.id === slot.id
                                ? { ...item, end: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="h-10 w-[7.5rem] rounded-xl border border-[#D7DEE8] px-3 text-sm text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                        aria-label={`${dayName} end time`}
                      />
                    </div>
                  ) : (
                    <p className="flex-1 text-sm text-navy/45">Unavailable</p>
                  )}

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {day.enabled ? (
                      <button
                        type="button"
                        aria-label={`Mark ${dayName} unavailable`}
                        onClick={() => disableFlexibleDay(day.dayId)}
                        className="inline-flex size-8 items-center justify-center rounded-full text-navy/40 hover:bg-[#F3F5F8] hover:text-navy"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Enable ${dayName}`}
                        onClick={() => enableFlexibleDay(day.dayId)}
                        className="inline-flex size-8 items-center justify-center rounded-full text-brand-blue hover:bg-[#EAF2FF]"
                      >
                        <Plus className="size-4" aria-hidden />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {errors.flexibleSchedule ? (
            <FieldError>{errors.flexibleSchedule}</FieldError>
          ) : null}
        </section>
      ) : null}

      {(mode === "full_time" || mode === "flexible") && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-navy">I&apos;m open to</h2>
          <ul className="mt-3 space-y-2.5">
            {CAREGIVER_OPEN_TO_OPTIONS.map((option) => {
              const selected = draft.openTo.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() =>
                      patchDraft({
                        openTo: toggleValue(
                          draft.openTo,
                          option.value as CaregiverOpenTo,
                        ),
                      })
                    }
                    className="flex w-full items-start gap-3 rounded-xl px-1 py-1 text-left"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border",
                        selected
                          ? "border-brand-blue bg-brand-blue text-white"
                          : "border-[#D7DEE8] bg-white",
                      )}
                    >
                      {selected ? (
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      ) : null}
                    </span>
                    <span className="text-sm text-navy">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">
          Areas you can work in
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          {draft.workAreas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() =>
                patchDraft({
                  workAreas: draft.workAreas.filter((item) => item !== area),
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue bg-[#E8F1FF] px-3.5 py-2 text-sm font-medium text-brand-blue"
            >
              {area}
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
            </button>
          ))}
          {addingArea ? (
            <div className="flex items-center gap-2">
              <TextInput
                id="cg-add-area"
                value={areaDraft}
                onChange={setAreaDraft}
                placeholder="e.g Ikeja"
              />
              <Button
                type="button"
                size="sm"
                className="h-10 rounded-full px-4"
                onClick={addArea}
              >
                Add
              </Button>
              <button
                type="button"
                onClick={() => {
                  setAddingArea(false);
                  setAreaDraft("");
                }}
                className="text-sm font-medium text-navy/50 hover:text-navy"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingArea(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              <Plus className="size-4" aria-hidden />
              Add area
            </button>
          )}
        </div>
        {errors.workAreas ? <FieldError>{errors.workAreas}</FieldError> : null}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-navy">
          How far can you travel?
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {CAREGIVER_TRAVEL_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={draft.travelDistance === option.value}
              onToggle={() =>
                patchDraft({
                  travelDistance: option.value as CaregiverTravelDistance,
                })
              }
            />
          ))}
        </div>
        {errors.travelDistance ? (
          <FieldError>{errors.travelDistance}</FieldError>
        ) : null}
        <InfoCallout>
          Careseekers outside these areas won&apos;t see you in search. You can
          change this anytime from Schedule.
        </InfoCallout>
      </section>

      <section className="mt-8">
        <FieldLabel htmlFor="cg-available-start">Available to start</FieldLabel>
        <SelectField
          id="cg-available-start"
          value={draft.availableToStart}
          onChange={(value) =>
            patchDraft({
              availableToStart: value as CaregiverStartTiming,
            })
          }
          placeholder="Select when you can start"
          options={CAREGIVER_START_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          invalid={Boolean(errors.availableToStart)}
        />
        {errors.availableToStart ? (
          <FieldError>{errors.availableToStart}</FieldError>
        ) : null}
        <InfoCallout>You can edit this anytime from your profile.</InfoCallout>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={saving}
          className="h-12 rounded-full px-6"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="h-12 rounded-full px-8 sm:min-w-[12rem]"
        >
          {saving ? "Saving…" : "Next"}
          {saving ? null : <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );
}
