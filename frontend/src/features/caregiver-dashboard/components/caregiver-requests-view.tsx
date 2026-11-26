"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import { DeclineRequestModal } from "@/features/caregiver-dashboard/components/decline-request-modal";
import { RequestAcceptedModal } from "@/features/caregiver-dashboard/components/request-accepted-modal";
import { RequestDetailsDrawer } from "@/features/caregiver-dashboard/components/request-details-drawer";
import type {
  CaregiverCareTypeFilter,
  CaregiverRequestStatus,
} from "@/features/caregiver-dashboard/data/mock-requests";
import { useCaregiverRequestsStore } from "@/features/caregiver-dashboard/hooks/use-caregiver-requests-store";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type StatusTab = "all" | CaregiverRequestStatus;

const PAGE_SIZE = 6;

const CARE_TYPE_OPTIONS: Array<"all" | CaregiverCareTypeFilter> = [
  "all",
  "Clinical care",
  "Non-clinical care",
  "Personal & specialized care",
];

const STATUS_FILTER_OPTIONS: Array<"all" | CaregiverRequestStatus> = [
  "all",
  "pending",
  "accepted",
  "declined",
];

function statusTextClass(status: CaregiverRequestStatus) {
  if (status === "accepted") return "text-emerald-600";
  if (status === "declined") return "text-danger";
  return "text-amber-600";
}

function statusLabel(status: CaregiverRequestStatus) {
  if (status === "accepted") return "Accepted";
  if (status === "declined") return "Declined";
  return "Pending";
}

export function CaregiverRequestsView() {
  const router = useRouter();
  const items = useCaregiverRequestsStore((state) => state.items);
  const setStatus = useCaregiverRequestsStore((state) => state.setStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<StatusTab>("all");
  const [careType, setCareType] = useState<"all" | CaregiverCareTypeFilter>(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | CaregiverRequestStatus
  >("all");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acceptedOpen, setAcceptedOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const counts = useMemo(() => {
    return {
      all: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      accepted: items.filter((item) => item.status === "accepted").length,
      declined: items.filter((item) => item.status === "declined").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (tab !== "all" && item.status !== tab) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (careType !== "all" && item.careType !== careType) return false;
      if (!query) return true;
      return (
        item.careseekerName.toLowerCase().includes(query) ||
        item.careType.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      );
    });
  }, [items, tab, statusFilter, careType, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selected = items.find((item) => item.id === selectedId) ?? null;

  function openRequest(id: string) {
    setSelectedId(id);
    setDrawerOpen(true);
  }

  function handleAccept() {
    if (!selectedId) return;
    setStatus(selectedId, "accepted");
    setDrawerOpen(false);
    setAcceptedOpen(true);
  }

  function handleDeclineSubmit(payload: {
    reason: string;
    details: string;
    safetyConcern: boolean;
    fileName: string | null;
  }) {
    if (!selectedId) return;
    setStatus(selectedId, "declined");
    setDeclineOpen(false);
    setDrawerOpen(false);
    appToast.success(
      payload.safetyConcern
        ? "Request declined and flagged as a safety concern"
        : `Request declined · ${payload.reason}`,
    );
  }

  const tabs: { id: StatusTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "accepted", label: "Accepted", count: counts.accepted },
    { id: "declined", label: "Declined", count: counts.declined },
  ];

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title="Requests"
          subtitle="View and manage care requests."
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4 border-b border-[#E8EEF5]">
            {tabs.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    setPage(1);
                  }}
                  className={cn(
                    "border-b-2 pb-3 text-sm font-medium transition-colors",
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

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <select
                value={careType}
                onChange={(event) => {
                  setCareType(
                    event.target.value as "all" | CaregiverCareTypeFilter,
                  );
                  setPage(1);
                }}
                className="h-10 appearance-none rounded-full border border-[#D7DEE8] bg-white py-2 pr-9 pl-3.5 text-sm text-navy outline-none"
              >
                {CARE_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All care types" : option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-navy/40" />
            </label>

            <label className="relative">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value as "all" | CaregiverRequestStatus,
                  );
                  setPage(1);
                }}
                className="h-10 appearance-none rounded-full border border-[#D7DEE8] bg-white py-2 pr-9 pl-3.5 text-sm text-navy outline-none"
              >
                {STATUS_FILTER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "all"
                      ? "All statuses"
                      : statusLabel(option)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-navy/40" />
            </label>

            <label className="relative">
              <select
                defaultValue="this_month"
                className="h-10 appearance-none rounded-full border border-[#D7DEE8] bg-white py-2 pr-9 pl-3.5 text-sm text-navy outline-none"
              >
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="all_time">All time</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-navy/40" />
            </label>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EEF2F7] text-xs text-navy/45">
                  <th className="px-5 py-3 font-medium">Careseeker</th>
                  <th className="px-3 py-3 font-medium">Caretype</th>
                  <th className="px-3 py-3 font-medium">Proposed Date</th>
                  <th className="px-3 py-3 font-medium">Proposed Time</th>
                  <th className="px-3 py-3 font-medium">Location</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-navy/50"
                    >
                      No requests match these filters.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((request) => {
                    const isPending = request.status === "pending";
                    return (
                      <tr
                        key={request.id}
                        className="border-b border-[#F1F5F9] last:border-0"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="relative size-8 overflow-hidden rounded-full bg-surface-soft">
                              <Image
                                src={request.careseekerAvatarUrl}
                                alt=""
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </span>
                            <span className="font-medium text-navy">
                              {request.careseekerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-navy/70">
                          {request.careType}
                        </td>
                        <td className="px-3 py-3.5 text-navy/70">
                          {request.proposedDate}
                        </td>
                        <td className="px-3 py-3.5 text-navy/70">
                          {request.proposedTime}
                        </td>
                        <td className="px-3 py-3.5 text-navy/70">
                          {request.location}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-3.5 font-medium",
                            statusTextClass(request.status),
                          )}
                        >
                          {statusLabel(request.status)}
                        </td>
                        <td className="px-5 py-3.5">
                          {isPending ? (
                            <Button
                              type="button"
                              onClick={() => openRequest(request.id)}
                              className="h-9 rounded-full px-4 text-xs"
                            >
                              Review request →
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => openRequest(request.id)}
                              className="h-9 rounded-full px-4 text-xs"
                            >
                              View →
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="inline-flex size-8 items-center justify-center rounded-lg text-navy/50 hover:bg-white disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg text-sm font-semibold",
                  pageNumber === currentPage
                    ? "bg-emerald-500 text-white"
                    : "text-navy/55 hover:bg-white",
                )}
              >
                {pageNumber}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
            className="inline-flex size-8 items-center justify-center rounded-lg text-navy/50 hover:bg-white disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <RequestDetailsDrawer
        request={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAccept={handleAccept}
        onDecline={() => setDeclineOpen(true)}
        onMessage={() => {
          setDrawerOpen(false);
          router.push("/caregiver/messages");
        }}
      />

      <RequestAcceptedModal
        open={acceptedOpen}
        onClose={() => setAcceptedOpen(false)}
        onMessage={() => {
          setAcceptedOpen(false);
          router.push("/caregiver/messages");
        }}
        onViewBooking={() => {
          setAcceptedOpen(false);
          router.push("/caregiver/bookings");
        }}
      />

      <DeclineRequestModal
        open={declineOpen}
        onClose={() => setDeclineOpen(false)}
        onSubmit={handleDeclineSubmit}
      />
    </CaregiverShell>
  );
}
