"use client";

import { MessageSquare, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { CaregiverRequest } from "@/features/caregiver-dashboard/data/mock-requests";
import { cn } from "@/lib/utils";

function statusClass(status: CaregiverRequest["status"]) {
  if (status === "accepted") return "bg-[#E9F9F1] text-emerald-700";
  if (status === "declined") return "bg-[#FEECEC] text-danger";
  return "bg-[#FFF6E5] text-amber-700";
}

function statusLabel(status: CaregiverRequest["status"]) {
  if (status === "accepted") return "Accepted";
  if (status === "declined") return "Declined";
  return "Pending";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-2 py-1.5 text-sm">
      <dt className="text-navy/45">{label}</dt>
      <dd className="font-medium text-navy">{value}</dd>
    </div>
  );
}

export function RequestDetailsDrawer({
  request,
  open,
  onClose,
  onAccept,
  onDecline,
  onMessage,
}: {
  request: CaregiverRequest | null;
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onMessage: () => void;
}) {
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

  if (!open || !request) return null;

  const canRespond = request.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close request details"
        className="absolute inset-0 bg-scrim/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#E8EEF5] px-5 py-4">
          <div>
            <h2
              id="request-details-title"
              className="text-lg font-bold tracking-tight text-navy"
            >
              Request Details
            </h2>
            <p className="mt-0.5 text-xs text-navy/50">{request.requestedOn}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/55 hover:bg-surface-soft hover:text-navy"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-soft">
              <Image
                src={request.careseekerAvatarUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-bold text-navy">
                  {request.careseekerName}
                </p>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
                    statusClass(request.status),
                  )}
                >
                  {statusLabel(request.status)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-navy/50">Careseeker</p>
            </div>
            <button
              type="button"
              aria-label="Message careseeker"
              onClick={onMessage}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] text-brand-blue hover:bg-[#EAF2FF]"
            >
              <MessageSquare className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] px-4 py-3">
            <dl>
              <DetailRow
                label="Requested date & time"
                value={request.requestedDateTime}
              />
              <DetailRow label="Location" value={request.location} />
              <DetailRow label="Languages" value={request.languages} />
              <DetailRow
                label="Preferred caregiver"
                value={request.preferredCaregiver}
              />
            </dl>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                <Image
                  src={request.patient.avatarUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-navy">
                    {request.patient.name}
                  </p>
                  <span className="inline-flex rounded-full bg-[#E9F9F1] px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-700">
                    Patient
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-navy/65">
              {request.patient.bio}
            </p>
            <dl className="mt-3">
              <DetailRow label="Care type" value={request.patient.careType} />
              <DetailRow label="Languages" value={request.patient.languages} />
              <DetailRow
                label="Relationship to you"
                value={request.patient.relationship}
              />
              <DetailRow label="Gender" value={request.patient.gender} />
              <DetailRow label="Mobility" value={request.patient.mobility} />
              <DetailRow label="Age" value={request.patient.age} />
              <DetailRow
                label="Daily routines"
                value={request.patient.dailyRoutines}
              />
              <DetailRow
                label="Arrangement"
                value={request.patient.arrangement}
              />
              <DetailRow
                label="Emergency contact"
                value={request.patient.emergencyContact}
              />
            </dl>
            <Link
              href="/caregiver/requests"
              className="mt-3 inline-flex text-sm font-medium text-brand-blue hover:underline"
              onClick={onClose}
            >
              View more details →
            </Link>
          </div>

          <div className="mt-5 border-t border-[#E8EEF5] pt-4">
            <p className="text-sm text-navy/45">Pricing (as shown on profile)</p>
            <p className="mt-1 text-xl font-bold text-navy">
              {request.pricingLabel}
            </p>
          </div>
        </div>

        {canRespond ? (
          <div className="space-y-2.5 border-t border-[#E8EEF5] px-5 py-4">
            <Button
              type="button"
              onClick={onAccept}
              className="h-11 w-full rounded-full"
            >
              Accept Request
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onDecline}
              className="h-11 w-full rounded-full text-danger hover:bg-danger/5"
            >
              Decline Request
            </Button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
