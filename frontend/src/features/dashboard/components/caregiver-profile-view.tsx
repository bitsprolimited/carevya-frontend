"use client";

import {
  BadgeCheck,
  Briefcase,
  Check,
  Heart,
  Info,
  MapPin,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BookCaregiverModal } from "@/features/dashboard/components/book-caregiver-modal";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { MessageCaregiverModal } from "@/features/dashboard/components/message-caregiver-modal";
import { getCaregiverProfile } from "@/features/dashboard/data/caregiver-profiles";
import type {
  AvailabilitySlot,
  CaregiverProfile,
  Weekday,
} from "@/features/dashboard/types/caregiver-profile";
import { cn } from "@/lib/utils";

const WEEKDAY_ROWS: { key: Weekday; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const SLOTS: { key: AvailabilitySlot; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[#D7E0EA] bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-navy">
      {children}
    </span>
  );
}

function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      {title ? (
        <h2 className="mb-3 text-base font-bold text-navy">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

export function CaregiverProfileView({ caregiverId }: { caregiverId: string }) {
  const loaded = getCaregiverProfile(caregiverId) as CaregiverProfile;
  const [saved, setSaved] = useState(Boolean(loaded.saved));
  const [messageOpen, setMessageOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const profile = loaded;

  return (
    <CareseekerShell>
      <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Find Care"
          subtitle="Meet your next trusted caregiver."
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 space-y-4">
            <Card>
              <div className="flex gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-surface-soft sm:size-24">
                  <Image
                    src={profile.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
                          {profile.name}
                        </h2>
                        {profile.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F9F1] px-2 py-0.5 text-xs font-semibold text-emerald-dark">
                            <BadgeCheck
                              className="size-3.5 fill-emerald text-white"
                              aria-hidden
                            />
                            ID verified
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-navy/60">
                        {profile.headline}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy/70">
                        <span className="inline-flex items-center gap-1 font-medium text-navy">
                          <Star
                            className="size-3.5 fill-amber-400 text-amber-400"
                            aria-hidden
                          />
                          {profile.rating.toFixed(1)}
                          <span className="font-normal text-navy/50">
                            ({profile.reviewCount} reviews)
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-navy/40" aria-hidden />
                          {profile.area}, {profile.city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase
                            className="size-3.5 text-navy/40"
                            aria-hidden
                          />
                          {profile.yearsExperience} years experience
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={saved ? "Remove from saved" : "Save caregiver"}
                      onClick={() => setSaved((value) => !value)}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-navy hover:bg-surface-soft"
                    >
                      <Heart
                        className={cn(
                          "size-4",
                          saved ? "fill-danger text-danger" : "text-navy/60",
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="About">
              <p className="text-sm leading-relaxed text-navy/70">
                {profile.about}
              </p>
            </Card>

            <Card title="Services">
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-navy/45 uppercase">
                    Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-navy/45 uppercase">
                    Also offers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.alsoOffers.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-navy/45 uppercase">
                    Arrangements
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.arrangements.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-navy/45 uppercase">
                    Areas covered · {profile.areasNote}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.areasCovered.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
                {profile.clinicalNote ? (
                  <p className="text-xs text-navy/50">{profile.clinicalNote}</p>
                ) : null}
              </div>
            </Card>

            <Card title="Experience & qualifications">
              <ul className="divide-y divide-[#E8EEF5]">
                {profile.experience.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-navy/55">{item.detail}</p>
                    </div>
                    <span className="inline-flex shrink-0 rounded-full bg-[#E9F9F1] px-2.5 py-1 text-[0.6875rem] font-semibold text-emerald-dark">
                      {item.badge}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Availability">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-xs text-navy/45">
                      <th className="pb-2 font-semibold">Day</th>
                      {SLOTS.map((slot) => (
                        <th key={slot.key} className="pb-2 font-semibold">
                          {slot.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKDAY_ROWS.map((day) => (
                      <tr key={day.key} className="border-t border-[#E8EEF5]">
                        <td className="py-2.5 font-medium text-navy">
                          {day.label}
                        </td>
                        {SLOTS.map((slot) => {
                          const available = Boolean(
                            profile.availability[day.key]?.[slot.key],
                          );
                          return (
                            <td key={slot.key} className="py-2.5">
                              {available ? (
                                <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand-blue text-white">
                                  <Check className="size-3.5" aria-hidden />
                                </span>
                              ) : (
                                <span className="text-navy/30" aria-hidden>
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 rounded-xl bg-[#EAF2FF] px-3.5 py-3 text-sm text-navy/80">
                {profile.availabilityNote}
              </p>
            </Card>

            <Card title={`Reviews · ${profile.rating.toFixed(1)} (${profile.reviewCount})`}>
              <ul className="space-y-3">
                {profile.reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-xl bg-[#F8FAFC] px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy">
                        {review.author}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-navy/50">
                        <span className="inline-flex items-center gap-1 font-semibold text-navy">
                          <Star
                            className="size-3 fill-amber-400 text-amber-400"
                            aria-hidden
                          />
                          {review.rating.toFixed(1)}
                        </span>
                        <span>{review.dateLabel}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-navy/70">
                      {review.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <Card>
              <p className="text-xl font-bold tracking-tight text-navy">
                {profile.priceLabel}
              </p>
              <ul className="mt-4 space-y-2.5">
                {profile.priceBreakdown.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-navy/60">{item.label}</span>
                    <span className="font-semibold text-navy">
                      {item.amountLabel}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                onClick={() => setBookOpen(true)}
                className="mt-5 h-11 w-full rounded-full"
              >
                Book caregiver →
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMessageOpen(true)}
                className="mt-2.5 h-11 w-full rounded-full"
              >
                Message {profile.firstName}
              </Button>
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-navy/55">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                No payment on CareVYA. You&apos;ll agree the price with{" "}
                {profile.firstName} in chat.
              </p>
            </Card>

            <Card title="Verification">
              <ul className="space-y-3">
                {profile.verification.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="inline-flex items-center gap-2 text-navy">
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#E9F9F1] text-emerald">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {item.label}
                    </span>
                    <span className="text-xs font-semibold text-emerald-dark">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/faqs"
                className="mt-4 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
              >
                What verification means &gt;
              </Link>
            </Card>
          </aside>
        </div>
      </div>

      <MessageCaregiverModal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        caregiver={profile}
      />
      <BookCaregiverModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        caregiver={profile}
        onMessage={() => setMessageOpen(true)}
      />
    </CareseekerShell>
  );
}
