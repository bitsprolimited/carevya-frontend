"use client";

import { Check, ChevronLeft, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CaregiverReportIssueModal } from "@/features/caregiver-dashboard/components/caregiver-report-issue-modal";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import { CheckInModal } from "@/features/caregiver-dashboard/components/check-in-modal";
import { getCaregiverReportBookingOptions } from "@/features/caregiver-dashboard/data/mock-bookings";
import { useCaregiverBookingsStore } from "@/features/caregiver-dashboard/hooks/use-caregiver-bookings-store";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function DetailRow({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 border-b border-[#F1F5F9] py-2.5 text-sm last:border-0">
      <dt className="text-navy/45">{label}</dt>
      <dd className={cn("font-medium text-navy", danger && "text-danger")}>
        {value}
      </dd>
    </div>
  );
}

export function CaregiverBookingDetailsView({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();
  const booking = useCaregiverBookingsStore((state) => state.getById(bookingId));
  const checkedIn = useCaregiverBookingsStore(
    (state) => state.checkedIn[bookingId],
  );
  const markCheckedIn = useCaregiverBookingsStore(
    (state) => state.markCheckedIn,
  );

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (!booking) {
    return (
      <CaregiverShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-sm text-navy/60">Booking not found.</p>
          <Link
            href="/caregiver/bookings"
            className="text-sm font-semibold text-brand-blue"
          >
            Back to bookings
          </Link>
        </div>
      </CaregiverShell>
    );
  }

  const firstName = booking.bookedByName.split(" ")[0];
  const canCheckIn = booking.checkInUnlocked && !checkedIn;

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title={`Bookings ${booking.reference}`}
          subtitle={`${booking.careLabel} for ${booking.patientName} booked by ${booking.bookedByName}`}
          showSearch={false}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/caregiver/bookings"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy/60 hover:text-navy"
          >
            <ChevronLeft className="size-4" aria-hidden />
            All bookings
          </Link>
          <span className="inline-flex rounded-full bg-[#E9F9F1] px-3 py-1 text-xs font-semibold text-emerald-700">
            {booking.statusBanner}
          </span>
        </div>

        <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm sm:p-6">
          <ol className="flex gap-2 overflow-x-auto pb-1">
            {booking.timeline.map((step, index) => {
              const isLast = index === booking.timeline.length - 1;
              return (
                <li
                  key={step.id}
                  className="relative flex min-w-[7.5rem] flex-1 flex-col items-start"
                >
                  <div className="flex w-full items-center">
                    <span
                      className={cn(
                        "inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                        step.state === "done" &&
                          "border-emerald-500 bg-emerald-500 text-white",
                        step.state === "current" &&
                          "border-brand-blue bg-white text-brand-blue",
                        step.state === "upcoming" &&
                          "border-[#D7DEE8] bg-white text-transparent",
                      )}
                    >
                      {step.state === "done" ? (
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      ) : step.state === "current" ? (
                        <span className="size-2 rounded-full bg-brand-blue" />
                      ) : null}
                    </span>
                    {!isLast ? (
                      <span
                        className={cn(
                          "mx-1 h-px flex-1",
                          step.state === "done"
                            ? "bg-emerald-500"
                            : "bg-[#E2E8F0]",
                        )}
                      />
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-xs font-semibold",
                      step.state === "upcoming" ? "text-navy/45" : "text-navy",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] text-navy/45">
                    {step.detail}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <div className="flex items-center gap-3">
                <span className="relative size-14 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={booking.patientAvatarUrl}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <div>
                  <p className="text-base font-bold text-navy">
                    {booking.patientName}
                  </p>
                  <p className="text-sm text-navy/50">{booking.patientGender}</p>
                </div>
              </div>

              <dl className="mt-5">
                <DetailRow label="Care needed" value={booking.careNeeded} />
                <DetailRow label="Age" value={booking.patientAge} />
                <DetailRow label="Languages" value={booking.languages} />
                <DetailRow
                  label="Arrangement"
                  value={`${booking.arrangement} · ${booking.datesLabel}`}
                />
                <DetailRow label="Home address" value={booking.homeAddress} />
                <DetailRow label="Mobility" value={booking.mobility} />
                <DetailRow
                  label="Health conditions"
                  value={booking.healthConditions}
                />
                <DetailRow label="Medications" value={booking.medications} />
                <DetailRow
                  label="Allergies"
                  value={booking.allergies}
                  danger={booking.allergies.toLowerCase() !== "none"}
                />
                <DetailRow label="Daily routine" value={booking.dailyRoutine} />
                <div className="grid grid-cols-[9rem_1fr] gap-3 border-b border-[#F1F5F9] py-2.5 text-sm">
                  <dt className="text-navy/45">Emergency contact</dt>
                  <dd className="space-y-1 font-medium text-navy">
                    {booking.emergencyContacts.map((contact) => (
                      <p key={`${contact.name}-${contact.phone}`}>
                        {contact.name} ({contact.relation}) · {contact.phone}
                      </p>
                    ))}
                  </dd>
                </div>
                <DetailRow
                  label="Careseeker contact"
                  value={`${booking.careseekerContact.name} (${booking.careseekerContact.relation}) · ${booking.careseekerContact.phone}`}
                />
              </dl>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] p-4">
                <p className="text-sm font-semibold text-navy">
                  Price &amp; payment
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-navy/55">Agreed price</p>
                  <p className="text-base font-bold text-navy">
                    {booking.agreedPriceLabel}
                  </p>
                </div>
                {booking.paidIntoWallet ? (
                  <span className="mt-2 inline-flex rounded-full bg-[#E9F9F1] px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Paid into wallet
                  </span>
                ) : null}
                <p className="mt-3 flex gap-2 text-xs leading-relaxed text-navy/50">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  CareVYA keeps a 10% service fee. The rest is available after
                  care is confirmed.
                </p>
              </div>

              <Button
                type="button"
                disabled={!canCheckIn}
                onClick={() => setCheckInOpen(true)}
                className="h-11 w-full rounded-full"
              >
                {checkedIn ? "Checked in" : "Check in on arrival"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/caregiver/messages")}
                className="h-11 w-full rounded-full"
              >
                Message {firstName}
              </Button>
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="w-full text-center text-sm font-medium text-danger hover:underline"
              >
                Report an issue
              </button>
              {booking.checkInUnlockHint ? (
                <p className="text-center text-xs text-navy/45">
                  {booking.checkInUnlockHint}
                </p>
              ) : null}
            </aside>
          </div>
        </section>
      </div>

      <CheckInModal
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        helperText={`Live-in care · ${booking.datesLabel}`}
        onConfirm={(payload) => {
          markCheckedIn(booking.id, payload);
          setCheckInOpen(false);
          appToast.success("Checked in successfully");
        }}
      />

      <CaregiverReportIssueModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        bookingOptions={(
          () => {
            const options = getCaregiverReportBookingOptions();
            const current = options.find((item) => item.id === booking.id);
            if (!current) {
              return [
                {
                  id: booking.id,
                  triggerLabel: `${booking.bookedByName} · ${booking.reference}`,
                  name: booking.bookedByName,
                  careLabel: booking.careLabel.replace(/ care$/i, ""),
                  dateLabel:
                    booking.startsLabel.split(" · ")[0] ?? booking.datesLabel,
                  reference: booking.reference,
                  avatarUrl: booking.patientAvatarUrl,
                },
                ...options,
              ];
            }
            return [
              current,
              ...options.filter((item) => item.id !== booking.id),
            ];
          }
        )()}
      />
    </CaregiverShell>
  );
}
