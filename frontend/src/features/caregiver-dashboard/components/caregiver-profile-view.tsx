"use client";

import {
  BadgeCheck,
  Check,
  MapPin,
  Pencil,
  Star,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import { EditCaregiverProfileModal } from "@/features/caregiver-dashboard/components/edit-caregiver-profile-modal";
import {
  caregiverProfileSeed,
  formatProfileNaira,
} from "@/features/caregiver-dashboard/data/mock-profile";
import type {
  CaregiverPublicProfile,
  ProfileCredentialStatus,
} from "@/features/caregiver-dashboard/types/profile";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const CREDENTIAL_STATUS_LABEL: Record<ProfileCredentialStatus, string> = {
  licence_checked: "Licence checked",
  reference_checked: "Reference checked",
  certificate_checked: "Certificate checked",
};

function TagGroup({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  if (values.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy/40">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex rounded-full bg-[#EEF2F7] px-3 py-1.5 text-xs font-semibold text-navy/70"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#F59E0B]" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < Math.round(rating) ? "fill-current" : "text-navy/20",
          )}
        />
      ))}
    </span>
  );
}

export function CaregiverProfileView() {
  const [profile, setProfile] =
    useState<CaregiverPublicProfile>(caregiverProfileSeed);
  const [editOpen, setEditOpen] = useState(false);

  const allVerified = profile.verification.every((item) => item.done);

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title="Profile"
          subtitle="This is what careseekers see when they find you. Keep it up to date."
          showSearch={false}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-surface-soft sm:size-20">
                    <Image
                      src={profile.photoUrl}
                      alt=""
                      fill
                      sizes="80px"
                      unoptimized={profile.photoUrl.startsWith("blob:")}
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold tracking-tight text-navy">
                        {profile.fullName}
                      </h2>
                      {profile.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[0.6875rem] font-semibold text-emerald-dark">
                          <BadgeCheck
                            className="size-3.5 fill-emerald text-white"
                            aria-hidden
                          />
                          ID verified
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy/60">
                      <span>{profile.yearsLabel}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-navy">
                        <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
                        {profile.rating.toFixed(1)}{" "}
                        <span className="font-medium text-navy/50">
                          ({profile.reviewCount} reviews)
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden />
                        {profile.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <UserRound className="size-3.5" aria-hidden />
                        {profile.gender}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-full border border-[#D7E0EA] bg-white px-3.5 text-sm font-semibold text-brand-blue hover:bg-surface-soft"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit profile
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-navy/70">
                {profile.bio}
              </p>

              <div className="mt-5 space-y-4 border-t border-[#E8EEF5] pt-5">
                <TagGroup label="Care type" values={[profile.careType]} />
                <TagGroup
                  label="Specializations"
                  values={profile.specializations}
                />
                <TagGroup label="Arrangements" values={profile.arrangements} />
                <TagGroup label="Languages" values={profile.languages} />
                <TagGroup
                  label={`Areas (${profile.travelLabel.toLowerCase()})`}
                  values={profile.areas}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-bold text-navy">
                Experience & qualifications
              </h3>
              <ul className="mt-4 space-y-3">
                {profile.credentials.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl bg-[#F8FAFC] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-navy/50">{item.detail}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[0.6875rem] font-semibold text-emerald-dark">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                      {CREDENTIAL_STATUS_LABEL[item.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-navy">Verification</h3>
                {allVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[0.6875rem] font-semibold text-emerald-dark">
                    <BadgeCheck
                      className="size-3.5 fill-emerald text-white"
                      aria-hidden
                    />
                    Verified
                  </span>
                ) : null}
              </div>
              <ul className="mt-3 space-y-2.5">
                {profile.verification.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2.5 text-sm text-navy/70"
                  >
                    <span
                      className={cn(
                        "inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                        item.done
                          ? "bg-emerald text-white"
                          : "bg-[#E8EEF5] text-navy/35",
                      )}
                    >
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-bold text-navy">Your rates</h3>
              <dl className="mt-3 space-y-2.5 text-sm">
                {[
                  { label: "Day shift", value: profile.rates.dayShift },
                  { label: "Night shift", value: profile.rates.nightShift },
                  { label: "Weekly", value: profile.rates.weekly },
                  {
                    label: "Monthly - live-in",
                    value: profile.rates.monthlyLiveIn,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt className="text-navy/55">{row.label}</dt>
                    <dd className="font-semibold text-navy">
                      {formatProfileNaira(row.value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-navy/50">
                Starting prices. You can agree a different price in chat.
                CareVYA keeps 10%.
              </p>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-navy">Availability</h3>
                <Link
                  href="/caregiver/schedule"
                  className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                >
                  Manage
                </Link>
              </div>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Schedule
                  </dt>
                  <dd className="mt-1 text-navy/70">
                    {profile.availability.modeLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Open to
                  </dt>
                  <dd className="mt-1 text-navy/70">
                    {profile.availability.openToLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    Available to start
                  </dt>
                  <dd className="mt-1 text-navy/70">
                    {profile.availability.startLabel}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-navy">Reviews</h3>
                <p className="text-sm font-bold text-navy">
                  {profile.rating.toFixed(1)}
                  <span className="font-medium text-navy/40">/5.0</span>
                </p>
              </div>
              <ul className="mt-3 space-y-3">
                {profile.reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-xl bg-[#F8FAFC] px-3.5 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-navy">
                          {review.authorName}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Stars rating={review.rating} />
                          <span className="text-xs font-semibold text-navy">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-navy/40">{review.dateLabel}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-navy/65">
                      {review.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <EditCaregiverProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={(next) => {
          setProfile(next);
          setEditOpen(false);
          appToast.success("Profile updated");
        }}
      />
    </CaregiverShell>
  );
}
