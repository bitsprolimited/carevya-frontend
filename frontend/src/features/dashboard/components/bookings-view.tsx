"use client";

import { CalendarDays, ChevronDown, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BookingDetailsDrawer } from "@/features/dashboard/components/booking-details-drawer";
import { BookingStatusBadge } from "@/features/dashboard/components/booking-status-badge";
import { CareReviewModal } from "@/features/dashboard/components/care-review-modal";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { MessageCaregiverModal } from "@/features/dashboard/components/message-caregiver-modal";
import { getCaregiverProfile } from "@/features/dashboard/data/caregiver-profiles";
import { mockRecipients } from "@/features/dashboard/data/mock";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";
import { cn } from "@/lib/utils";

type TabFilter = "all" | "pending" | "accepted" | "declined";

const TIMEFRAMES = ["This month", "Last month", "All time"] as const;

export function BookingsView() {
  const router = useRouter();
  const bookings = useBookingsStore((state) => state.bookings);
  const updateBooking = useBookingsStore((state) => state.updateBooking);
  const removeBooking = useBookingsStore((state) => state.removeBooking);

  const [tab, setTab] = useState<TabFilter>("all");
  const [timeframe, setTimeframe] =
    useState<(typeof TIMEFRAMES)[number]>("This month");
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(mockRecipients[0]?.id ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedRecipient =
    mockRecipients.find((item) => item.id === recipientId) ?? mockRecipients[0];

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((item) => item.status === "pending").length,
      accepted: bookings.filter(
        (item) => item.status === "accepted" || item.status === "confirmed",
      ).length,
      declined: bookings.filter((item) => item.status === "declined").length,
    }),
    [bookings],
  );

  const visible = useMemo(() => {
    return bookings.filter((item) => {
      if (tab === "all") return true;
      if (tab === "accepted") {
        return item.status === "accepted" || item.status === "confirmed";
      }
      return item.status === tab;
    });
  }, [bookings, tab]);

  const selected = bookings.find((item) => item.id === selectedId) ?? null;
  const selectedProfile = selected
    ? getCaregiverProfile(selected.caregiverId)
    : null;

  const showDeclinedNote =
    tab === "declined" ||
    (tab === "all" && visible.some((item) => item.status === "declined"));

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  const tabs: { id: TabFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "accepted", label: "Accepted", count: counts.accepted },
    { id: "declined", label: "Declined", count: counts.declined },
  ];

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Bookings"
          subtitle={`Track your bookings for ${selectedRecipient?.firstName ?? "your family"}.`}
          recipientId={recipientId}
          onRecipientChange={setRecipientId}
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div
            role="tablist"
            aria-label="Booking status"
            className="flex gap-4 overflow-x-auto border-b border-[#E8EEF5]"
          >
            {tabs.map((item) => {
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
                  {item.label} ({item.count})
                </button>
              );
            })}
          </div>

          <div className="relative self-end">
            <button
              type="button"
              onClick={() => setTimeframeOpen((open) => !open)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D7E0EA] bg-white px-3.5 text-sm font-semibold text-navy hover:bg-surface-soft"
            >
              <CalendarDays className="size-4 text-navy/50" aria-hidden />
              {timeframe}
              <ChevronDown className="size-3.5 text-navy/45" aria-hidden />
            </button>
            {timeframeOpen ? (
              <div className="absolute right-0 z-20 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg">
                {TIMEFRAMES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setTimeframe(option);
                      setTimeframeOpen(false);
                    }}
                    className={cn(
                      "block w-full px-3.5 py-2 text-left text-sm hover:bg-surface-soft",
                      option === timeframe
                        ? "font-semibold text-brand-blue"
                        : "text-navy",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC] text-[0.6875rem] font-semibold tracking-wide text-navy/45 uppercase">
                  <th className="px-4 py-3 font-semibold">Caregiver</th>
                  <th className="px-4 py-3 font-semibold">Care type</th>
                  <th className="px-4 py-3 font-semibold">Date &amp; time</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-navy/50"
                    >
                      No bookings in this view.
                    </td>
                  </tr>
                ) : (
                  visible.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-[#E8EEF5] last:border-b-0 hover:bg-[#F8FAFC]/80"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                            <Image
                              src={booking.avatarUrl}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover object-top"
                            />
                          </span>
                          <span className="font-semibold text-navy">
                            {booking.caregiverName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-navy/70">
                        {booking.careType}
                      </td>
                      <td className="px-4 py-3.5 text-navy/70">
                        {booking.dateTimeLabel}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "font-semibold text-navy",
                            booking.status === "declined" &&
                              "text-navy/40 line-through",
                          )}
                        >
                          {booking.priceLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <BookingStatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        {booking.status === "declined" ? (
                          <Link
                            href="/careseeker/caregivers"
                            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
                          >
                            Find similar
                          </Link>
                        ) : booking.status === "accepted" ? (
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/careseeker/bookings/${booking.id}/confirm`}
                              className="inline-flex h-8 items-center justify-center rounded-lg bg-brand-blue px-3 text-xs font-semibold text-white hover:bg-brand-blue-hover"
                            >
                              Confirm
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSelectedId(booking.id)}
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-[#D7E0EA] bg-white px-3 text-xs font-semibold text-navy hover:bg-surface-soft"
                            >
                              View
                            </button>
                          </div>
                        ) : booking.status === "confirmed" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedId(booking.id);
                                setReviewOpen(true);
                              }}
                              className="inline-flex h-8 items-center justify-center rounded-lg bg-brand-blue px-3 text-xs font-semibold text-white hover:bg-brand-blue-hover"
                            >
                              Review
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedId(booking.id)}
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-[#D7E0EA] bg-white px-3 text-xs font-semibold text-navy hover:bg-surface-soft"
                            >
                              View
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedId(booking.id)}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-[#D7E0EA] bg-white px-3 text-xs font-semibold text-navy hover:bg-surface-soft"
                          >
                            {booking.timeProposal ? "Review time" : "View"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDeclinedNote ? (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-[#F3F6FB] px-4 py-3 text-sm text-navy/65">
            <Info className="mt-0.5 size-4 shrink-0 text-navy/45" aria-hidden />
            Declined requests cost nothing. Tap &quot;Find similar&quot; to see
            other caregivers with the same skills nearby.
          </p>
        ) : null}
      </div>

      <BookingDetailsDrawer
        booking={selected}
        open={Boolean(selected) && !reviewOpen}
        onClose={() => setSelectedId(null)}
        onMessage={() => setMessageOpen(true)}
        onViewAgreement={() => {
          setSelectedId(null);
          router.push("/careseeker/messages");
        }}
        onReview={() => {
          setReviewOpen(true);
        }}
        onConfirm={() => {
          if (!selected) return;
          setSelectedId(null);
          router.push(`/careseeker/bookings/${selected.id}/confirm`);
        }}
        onAcceptProposal={() => {
          if (!selected?.timeProposal) return;
          const suggested = selected.timeProposal.suggestedRange;
          updateBooking(selected.id, {
            status: "accepted",
            dateTimeLabel: suggested.includes("–")
              ? `${suggested.split("–")[0]?.trim()} · 10:00 AM`
              : suggested,
            timeProposal: undefined,
            timeline: [
              {
                id: "t1",
                title: "Request sent",
                detail: selected.timeline[0]?.detail ?? selected.requestedOn,
                state: "done",
              },
              {
                id: "t2",
                title: `${selected.caregiverFirstName} accepted`,
                detail: "Just now",
                state: "done",
              },
              {
                id: "t3",
                title: "Agree price & confirm",
                detail: "Price agreed in chat · Confirm soon",
                state: "current",
              },
              {
                id: "t4",
                title: "Care starts",
                detail: suggested,
                state: "upcoming",
              },
            ],
          });
          showToast("New time accepted");
        }}
        onCancel={() => {
          if (!selected) return;
          removeBooking(selected.id);
          setSelectedId(null);
          showToast(
            selected.status === "confirmed"
              ? "Booking cancelled"
              : "Request cancelled",
          );
        }}
        onReport={() => showToast("Issue reported")}
      />

      <CareReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        booking={selected}
        onSubmitted={() => showToast("Thanks for your review")}
      />

      {selectedProfile ? (
        <MessageCaregiverModal
          open={messageOpen}
          onClose={() => setMessageOpen(false)}
          caregiver={selectedProfile}
          recipientId={recipientId ?? undefined}
        />
      ) : null}

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
