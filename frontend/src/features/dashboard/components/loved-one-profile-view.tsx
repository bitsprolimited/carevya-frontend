"use client";

import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  FileText,
  Home,
  Languages,
  MessageSquare,
  Pencil,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { EditLovedOneDrawer } from "@/features/dashboard/components/edit-loved-one-drawer";
import type {
  LovedOneProfile,
  LovedOneTab,
} from "@/features/dashboard/types/loved-one";
import { cn } from "@/lib/utils";

const TABS: { id: LovedOneTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "health", label: "Health" },
  { id: "care-plan", label: "Care plan" },
  { id: "history", label: "Care history" },
  { id: "contacts", label: "Contacts & documents" },
];

function Card({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm",
        className,
      )}
    >
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-navy">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#E8EEF5] py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-sm text-navy/50">{label}</dt>
      <dd className="text-sm font-medium text-navy sm:text-right">{value}</dd>
    </div>
  );
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
    >
      <Pencil className="size-3.5" aria-hidden />
      Edit
    </button>
  );
}

function toneClass(tone: "amber" | "emerald" | "blue") {
  return {
    amber: "bg-[#FFF6E5] text-amber-700",
    emerald: "bg-[#E9F9F1] text-emerald-dark",
    blue: "bg-[#EAF2FF] text-brand-blue",
  }[tone];
}

function OverviewTab({
  profile,
  onEdit,
  onHealth,
}: {
  profile: LovedOneProfile;
  onEdit: () => void;
  onHealth: () => void;
}) {
  const stats = [
    {
      icon: CalendarDays,
      label: "Age",
      value: `${profile.age} years`,
      detail: `Born ${profile.dateOfBirth}`,
    },
    {
      icon: Home,
      label: "Lives in",
      value: `${profile.area}, ${profile.city}`,
      detail: `${profile.lga} LGA`,
    },
    {
      icon: Languages,
      label: "Speaks",
      value: profile.languages.join(", "),
      detail: `Prefers ${profile.preferredLanguage} at home`,
    },
    {
      icon: UserRound,
      label: "Care type",
      value: profile.careTypeSummary,
      detail: profile.careTypeDetail,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#DCE8FF] bg-[#F3F7FF] p-4"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm">
              <stat.icon className="size-4" aria-hidden />
            </span>
            <p className="mt-3 text-xs font-medium text-navy/50">{stat.label}</p>
            <p className="mt-0.5 text-sm font-bold text-navy">{stat.value}</p>
            <p className="mt-0.5 text-xs text-navy/50">{stat.detail}</p>
          </div>
        ))}
      </div>

      <Card title={`About ${profile.firstName}`} action={<EditLink onClick={onEdit} />}>
        <dl>
          <DetailRow label="Full name" value={profile.about.fullName} />
          <DetailRow
            label="Relationship to you"
            value={profile.about.relationship}
          />
          <DetailRow label="Date of birth" value={profile.about.dateOfBirth} />
          <DetailRow label="Gender" value={profile.about.gender} />
          <DetailRow label="Home address" value={profile.about.homeAddress} />
          <DetailRow
            label={`Languages ${profile.gender === "Female" ? "she" : "he"} speaks`}
            value={profile.about.languages}
          />
        </dl>
      </Card>

      <Card
        title="Health at a glance"
        action={
          <button
            type="button"
            onClick={onHealth}
            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            View health details
          </button>
        }
      >
        <dl className="space-y-3">
          <div>
            <dt className="text-xs font-medium text-navy/50">Conditions</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {profile.healthGlance.conditions.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#4F5BD5]"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
          <DetailRow label="Mobility" value={profile.healthGlance.mobility} />
          <DetailRow label="Allergies" value={profile.healthGlance.allergies} />
          <DetailRow label="Medicines" value={profile.healthGlance.medicines} />
        </dl>
      </Card>

      <Card title="Care needs" action={<EditLink onClick={onEdit} />}>
        <dl>
          <DetailRow label="Type of care" value={profile.careNeeds.typeOfCare} />
          <DetailRow
            label="Arrangement"
            value={profile.careNeeds.arrangement}
          />
          <DetailRow
            label="Care started"
            value={profile.careNeeds.careStarted}
          />
          <DetailRow
            label="Caregiver preference"
            value={profile.careNeeds.caregiverPreference}
          />
        </dl>
      </Card>
    </div>
  );
}

function HealthTab({
  profile,
  onEdit,
}: {
  profile: LovedOneProfile;
  onEdit: () => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
      <div className="space-y-5">
        <Card title="Conditions" action={<EditLink onClick={onEdit} />}>
          <ul className="space-y-4">
            {profile.conditions.map((item) => (
              <li key={item.name} className="rounded-xl bg-[#F8FAFC] px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy">{item.name}</p>
                  <span className="text-xs text-navy/45">{item.diagnosed}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-navy/60">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Medications"
          action={
            <button
              type="button"
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              + Add medication
            </button>
          }
        >
          <ul className="space-y-3">
            {profile.medications.map((med) => (
              <li
                key={med.id}
                className="rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] px-4 py-3"
              >
                <p className="font-semibold text-navy">{med.name}</p>
                <p className="mt-0.5 text-xs text-navy/50">
                  {med.form} · {med.purpose}
                </p>
                <p className="mt-2 text-sm font-medium text-navy">
                  {med.schedule}
                </p>
                <p className="text-xs text-navy/50">{med.instruction}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Allergies & diet" action={<EditLink onClick={onEdit} />}>
          <dl>
            <div className="border-b border-[#E8EEF5] py-3">
              <dt className="text-xs font-medium text-navy/50">
                Medicine allergies
              </dt>
              <dd className="mt-1 text-sm font-medium text-danger">
                {profile.allergiesDiet.medicineAllergies}
              </dd>
            </div>
            <DetailRow
              label="Food allergies"
              value={profile.allergiesDiet.foodAllergies}
            />
            <DetailRow label="Diet" value={profile.allergiesDiet.diet} />
            <DetailRow label="Fluids" value={profile.allergiesDiet.fluids} />
          </dl>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Mobility & daily living">
          <p className="mb-3 text-sm text-navy/55">
            How much help {profile.firstName} needs
          </p>
          <ul className="space-y-2.5">
            {profile.mobility.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-navy">{item.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    toneClass(item.tone),
                  )}
                >
                  {item.level}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Doctor & clinic" action={<EditLink onClick={onEdit} />}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-navy">{profile.doctor.name}</p>
              <p className="mt-0.5 text-sm text-navy/55">
                {profile.doctor.role} · {profile.doctor.clinic}
              </p>
              <p className="mt-2 text-xs text-navy/50">Next check-up</p>
              <p className="text-sm font-medium text-navy">
                {profile.doctor.nextCheckup}
              </p>
            </div>
            <div className="flex gap-1.5">
              <a
                href={`tel:${profile.doctor.phone.replace(/\s/g, "")}`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] text-navy hover:bg-surface-soft"
                aria-label="Call doctor"
              >
                <Phone className="size-4" aria-hidden />
              </a>
              <Link
                href="/careseeker/messages"
                className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] text-navy hover:bg-surface-soft"
                aria-label="Message"
              >
                <MessageSquare className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Card>

        <Card
          title="Notes for caregivers"
          action={<EditLink onClick={onEdit} />}
        >
          <p className="text-sm leading-relaxed text-navy/70">
            {profile.caregiverNotes.body}
          </p>
          <p className="mt-3 text-xs text-navy/45">
            {profile.caregiverNotes.meta}
          </p>
        </Card>

        <p className="rounded-xl bg-[#FFF6E5] px-4 py-3 text-sm text-amber-800">
          In an emergency, call 112 first, then{" "}
          {profile.emergencyContacts[0]?.name.split(" ")[0] ?? "family"}.
        </p>
      </div>
    </div>
  );
}

function CarePlanTab({
  profile,
  onEdit,
}: {
  profile: LovedOneProfile;
  onEdit: () => void;
}) {
  const plan = profile.carePlan;
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
      <div className="space-y-5">
        <Card title="Care needs" action={<EditLink onClick={onEdit} />}>
          <dl>
            <DetailRow label="Type of care" value={plan.typeOfCare} />
            <DetailRow label="Arrangement" value={plan.arrangement} />
            <DetailRow label="Schedule" value={plan.schedule} />
            <DetailRow label="Start date" value={plan.startDate} />
            <DetailRow label="Duration" value={plan.duration} />
          </dl>
        </Card>

        <Card title="Daily routine" action={<EditLink onClick={onEdit} />}>
          <p className="mb-4 text-sm text-navy/55">
            A typical day for {profile.firstName}. Caregivers follow this as a
            guide.
          </p>
          <ol className="space-y-0">
            {plan.routine.map((item, index) => (
              <li key={item.time} className="flex gap-3">
                <span className="flex w-16 shrink-0 flex-col items-center">
                  <span className="text-xs font-semibold text-brand-blue">
                    {item.time}
                  </span>
                  {index < plan.routine.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-[#E8EEF5]" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 pb-4">
                  <span className="block text-sm font-semibold text-navy">
                    {item.title}
                  </span>
                  {item.note ? (
                    <span className="mt-0.5 block text-xs text-navy/50">
                      {item.note}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="space-y-5">
        <Card
          title="Caregiver preferences"
          action={<EditLink onClick={onEdit} />}
        >
          <dl>
            <DetailRow label="Gender" value={plan.preferences.gender} />
            <DetailRow label="Languages" value={plan.preferences.languages} />
            <DetailRow
              label="Experience"
              value={plan.preferences.experience}
            />
            <DetailRow label="Other" value={plan.preferences.other} />
          </dl>
        </Card>

        <Card
          title={`What ${profile.firstName} enjoys`}
          action={<EditLink onClick={onEdit} />}
        >
          <div className="flex flex-wrap gap-2">
            {plan.enjoys.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#EAF2FF] px-3 py-1.5 text-xs font-semibold text-brand-blue"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Home" action={<EditLink onClick={onEdit} />}>
          <dl>
            <DetailRow label="Lives with" value={plan.home.livesWith} />
            <DetailRow label="Home" value={plan.home.home} />
            <DetailRow
              label="Caregiver's room"
              value={plan.home.caregiverRoom}
            />
            <DetailRow label="Power" value={plan.home.power} />
          </dl>
        </Card>

        <p className="rounded-xl bg-[#EAF2FF] px-4 py-3 text-sm text-navy/70">
          Caregivers see the care plan once you confirm a booking.
        </p>
      </div>
    </div>
  );
}

function HistoryTab({ profile }: { profile: LovedOneProfile }) {
  if (profile.history.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-navy/50">
          No care history yet for {profile.firstName}.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Care history">
      <ul className="divide-y divide-[#E8EEF5]">
        {profile.history.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-navy">{item.title}</p>
              <p className="mt-0.5 text-sm text-navy/55">
                {item.caregiver} · {item.dateLabel}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
                item.status === "Completed"
                  ? "bg-[#E9F9F1] text-emerald-dark"
                  : "bg-[#FEECEC] text-danger",
              )}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ContactsTab({
  profile,
  sharing,
  onSharingChange,
  onEdit,
}: {
  profile: LovedOneProfile;
  sharing: LovedOneProfile["sharing"];
  onSharingChange: (key: keyof LovedOneProfile["sharing"], value: boolean) => void;
  onEdit: () => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
      <div className="space-y-5">
        <Card
          title="Emergency contacts"
          action={
            <button
              type="button"
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              + Add contact
            </button>
          }
        >
          <p className="mb-4 text-sm text-navy/55">
            If something happens, caregivers call these people in this order.
          </p>
          <ul className="space-y-3">
            {profile.emergencyContacts.map((contact) => (
              <li
                key={contact.id}
                className="flex items-center gap-3 rounded-xl border border-[#E8EEF5] px-3.5 py-3"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-bold text-brand-blue">
                  {contact.name
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">
                    {contact.name}
                    {contact.isYou ? " (you)" : ""}
                  </p>
                  <p className="text-xs text-navy/50">
                    {contact.relationship} · {contact.orderLabel}
                  </p>
                  <p className="mt-0.5 text-sm text-navy/70">{contact.phone}</p>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] text-navy hover:bg-surface-soft"
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone className="size-4" aria-hidden />
                  </a>
                  <Link
                    href="/careseeker/messages"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] text-navy hover:bg-surface-soft"
                    aria-label="Message"
                  >
                    <MessageSquare className="size-4" aria-hidden />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Home & access" action={<EditLink onClick={onEdit} />}>
          <dl>
            <DetailRow label="Address" value={profile.homeAccess.address} />
            <DetailRow label="Landmark" value={profile.homeAccess.landmark} />
            <DetailRow
              label="Getting in"
              value={profile.homeAccess.gettingIn}
            />
            <DetailRow
              label="Nearest hospital"
              value={profile.homeAccess.nearestHospital}
            />
            <DetailRow label="Parking" value={profile.homeAccess.parking} />
          </dl>
        </Card>
      </div>

      <div className="space-y-5">
        <Card
          title="Documents"
          action={
            <button
              type="button"
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              + Upload
            </button>
          }
        >
          {profile.documents.length === 0 ? (
            <p className="text-sm text-navy/50">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {profile.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E8EEF5] px-3 py-2.5"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#EAF2FF] text-brand-blue">
                    <FileText className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy">
                      {doc.name}
                    </span>
                    <span className="text-xs text-navy/45">{doc.type}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            variant="secondary"
            className="mt-4 h-10 w-full rounded-full"
          >
            Upload a document
          </Button>
        </Card>

        <Card title="Sharing & privacy">
          <p className="mb-4 text-sm text-navy/55">
            Choose what caregivers can see about {profile.firstName}.
          </p>
          <div className="space-y-4">
            <Toggle
              checked={sharing.healthDetails}
              onChange={(next) => onSharingChange("healthDetails", next)}
              label="Booked caregivers see her health details"
            />
            <Toggle
              checked={sharing.documents}
              onChange={(next) => onSharingChange("documents", next)}
              label="Share documents with booked caregivers"
            />
            <Toggle
              checked={sharing.addressBeforeBook}
              onChange={(next) => onSharingChange("addressBeforeBook", next)}
              label="Show her address before you book"
            />
          </div>
        </Card>

        <p className="flex items-start gap-2 rounded-xl bg-[#E9F9F1] px-4 py-3 text-sm text-emerald-dark">
          <Shield className="mt-0.5 size-4 shrink-0" aria-hidden />
          Only caregivers you choose to book can see these details.
        </p>
      </div>
    </div>
  );
}

function RightPanel({ profile }: { profile: LovedOneProfile }) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-[19rem]">
      {profile.nextCare ? (
        <Card>
          <div className="mb-3 flex gap-3 text-xs font-semibold">
            <span className="text-brand-blue">Today</span>
            <span className="text-navy/35">Next care</span>
          </div>
          <p className="text-sm font-bold text-navy">{profile.nextCare.title}</p>
          <p className="mt-1 text-sm text-navy/60">
            {profile.nextCare.whenLabel}
          </p>
          <p className="mt-1 text-xs text-navy/50">
            with {profile.nextCare.caregiverName} · {profile.nextCare.untilLabel}
          </p>
          <Link
            href={`/careseeker/bookings/${profile.nextCare.bookingId}/confirm`}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white hover:bg-brand-blue-hover"
          >
            View booking
          </Link>
        </Card>
      ) : null}

      <Card
        title="Care team"
        action={
          profile.careTeam.length > 0 ? (
            <span className="text-xs text-navy/45">
              {profile.careTeam.length}
            </span>
          ) : null
        }
      >
        {profile.careTeam.length === 0 ? (
          <p className="text-sm text-navy/50">No caregivers assigned yet.</p>
        ) : (
          <ul className="space-y-3">
            {profile.careTeam.map((member) => (
              <li key={member.id} className="flex items-center gap-2.5">
                <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={member.avatarUrl}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover object-top"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate text-sm font-semibold text-navy">
                    {member.name}
                    {member.verified ? (
                      <BadgeCheck
                        className="size-3.5 shrink-0 text-emerald"
                        aria-hidden
                      />
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-navy/50">{member.role}</p>
                </div>
                <div className="flex gap-1">
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-[#E8EEF5] text-navy/60 hover:bg-surface-soft"
                    aria-label={`Call ${member.name}`}
                  >
                    <Phone className="size-3.5" aria-hidden />
                  </a>
                  <Link
                    href="/careseeker/messages"
                    className="inline-flex size-8 items-center justify-center rounded-full border border-[#E8EEF5] text-navy/60 hover:bg-surface-soft"
                    aria-label="Message"
                  >
                    <MessageSquare className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card
        title="Emergency contact"
        action={
          <button
            type="button"
            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            + Add
          </button>
        }
      >
        {profile.emergencyContacts[0] ? (
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand-blue">
              {profile.emergencyContacts[0].name
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy">
                {profile.emergencyContacts[0].name}
              </p>
              <p className="text-xs text-navy/50">
                {profile.emergencyContacts[0].relationship} ·{" "}
                {profile.emergencyContacts[0].phone}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <Card
        title="Recent activity"
        action={
          <button
            type="button"
            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
          >
            See all
          </button>
        }
      >
        <ul className="space-y-3">
          {profile.recentActivity.map((item) => (
            <li key={item.id} className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-blue" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy">{item.title}</p>
                <p className="text-xs text-navy/50">{item.detail}</p>
                <p className="mt-0.5 text-[0.6875rem] text-navy/40">
                  {item.timeLabel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <p className="flex items-start gap-2 rounded-xl bg-[#EAF2FF] px-3.5 py-3 text-xs leading-relaxed text-navy/70">
        <Shield className="mt-0.5 size-3.5 shrink-0 text-brand-blue" aria-hidden />
        Only caregivers you book can see{" "}
        {profile.gender === "Female" ? "her" : "his"} health details.
      </p>
    </aside>
  );
}

export function LovedOneProfileView({
  profile: initial,
}: {
  profile: LovedOneProfile;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [tab, setTab] = useState<LovedOneTab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setProfile(initial);
    setTab("overview");
  }, [initial]);

  const findCareHref = useMemo(
    () => `/careseeker?recipient=${profile.id}`,
    [profile.id],
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Hello Grace"
          subtitle="Your care journey starts here."
          recipientId={profile.id}
          onRecipientChange={(id) => {
            if (id !== profile.id) {
              router.push(`/careseeker/recipients/${id}`);
            }
          }}
        />

        <nav
          aria-label="Breadcrumb"
          className="mt-5 flex items-center gap-1.5 text-sm text-navy/50"
        >
          <Link href="/careseeker" className="hover:text-navy">
            Dashboard
          </Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <span className="font-medium text-navy">{profile.fullName}</span>
        </nav>

        <div className="mt-4 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-surface-soft shadow-sm sm:size-24">
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
                    {profile.fullName}
                  </h2>
                  {profile.profileComplete ? (
                    <span className="rounded-full bg-[#E9F9F1] px-2.5 py-0.5 text-[0.6875rem] font-semibold text-emerald-dark">
                      Profile complete
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 text-[0.6875rem] font-semibold text-amber-700">
                      Profile incomplete
                    </span>
                  )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy/55">
                  <span>{profile.updatedLabel}</span>
                  <span className="inline-flex items-center gap-1">
                    <Shield className="size-3.5" aria-hidden />
                    Shared only with caregivers you book
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditOpen(true)}
                className="h-11 rounded-full px-5"
              >
                <Pencil className="size-4" aria-hidden />
                Edit profile
              </Button>
              <Link
                href={findCareHref}
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-hover"
              >
                Find caregivers for {profile.firstName}
              </Link>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Loved one sections"
            className="mt-5 flex gap-4 overflow-x-auto border-b border-[#E8EEF5]"
          >
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "shrink-0 border-b-2 pb-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "border-brand-blue text-brand-blue"
                      : "border-transparent text-navy/50 hover:text-navy",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5 xl:flex-row">
          <div className="min-w-0 flex-1">
            {tab === "overview" ? (
              <OverviewTab
                profile={profile}
                onEdit={() => setEditOpen(true)}
                onHealth={() => setTab("health")}
              />
            ) : null}
            {tab === "health" ? (
              <HealthTab
                profile={profile}
                onEdit={() => setEditOpen(true)}
              />
            ) : null}
            {tab === "care-plan" ? (
              <CarePlanTab
                profile={profile}
                onEdit={() => setEditOpen(true)}
              />
            ) : null}
            {tab === "history" ? <HistoryTab profile={profile} /> : null}
            {tab === "contacts" ? (
              <ContactsTab
                profile={profile}
                sharing={profile.sharing}
                onSharingChange={(key, value) =>
                  setProfile((current) => ({
                    ...current,
                    sharing: { ...current.sharing, [key]: value },
                  }))
                }
                onEdit={() => setEditOpen(true)}
              />
            ) : null}
          </div>

          {tab === "overview" ? <RightPanel profile={profile} /> : null}
        </div>
      </div>

      <EditLovedOneDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSave={(patch) => {
          setProfile((current) => ({ ...current, ...patch }));
          showToast(`${profile.firstName}'s details updated`);
        }}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </CareseekerShell>
  );
}
