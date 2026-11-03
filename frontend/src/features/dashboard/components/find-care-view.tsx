"use client";

import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { BookedCaregiverCard } from "@/features/dashboard/components/booked-caregiver-card";
import { CaregiverCard } from "@/features/dashboard/components/caregiver-card";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { FiltersDrawer } from "@/features/dashboard/components/filters-drawer";
import { MessageCaregiverModal } from "@/features/dashboard/components/message-caregiver-modal";
import {
  buildFindCareCatalog,
  FIND_CARE_PAGE_SIZE,
} from "@/features/dashboard/data/find-care-catalog";
import { getCaregiverProfile } from "@/features/dashboard/data/caregiver-profiles";
import { mockRecipients } from "@/features/dashboard/data/mock";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";
import { filterCaregivers } from "@/features/dashboard/lib/filter-caregivers";
import {
  defaultDashboardFilters,
  type Caregiver,
  type DashboardFilters,
} from "@/features/dashboard/types";
import type { Booking } from "@/features/dashboard/types/bookings";
import { cn } from "@/lib/utils";

type FindCareTab = "all" | "saved" | "booked" | "contacted";

const INITIAL_CATALOG = buildFindCareCatalog();

export function FindCareView() {
  const bookings = useBookingsStore((state) => state.bookings);
  const [catalog, setCatalog] = useState<Caregiver[]>(INITIAL_CATALOG);
  const [tab, setTab] = useState<FindCareTab>("all");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipientId, setRecipientId] = useState(
    mockRecipients[0]?.id ?? null,
  );
  const [filters, setFilters] = useState<DashboardFilters>(() => ({
    ...defaultDashboardFilters(null),
    categories: [],
    recipientId: null,
  }));
  const [messageBooking, setMessageBooking] = useState<Booking | null>(null);

  const selectedRecipient =
    mockRecipients.find((item) => item.id === recipientId) ?? mockRecipients[0];

  const bookedBookings = useMemo(() => {
    let list = bookings.filter(
      (item) => item.status === "accepted" || item.status === "confirmed",
    );
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.caregiverName.toLowerCase().includes(query) ||
          item.careType.toLowerCase().includes(query) ||
          item.locationLabel.toLowerCase().includes(query),
      );
    }
    return list;
  }, [bookings, searchQuery]);

  const filtered = useMemo(() => {
    let list = filterCaregivers(catalog, filters);
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.area.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.categoryLabel.toLowerCase().includes(query),
      );
    }
    if (tab === "saved") list = list.filter((item) => item.saved);
    if (tab === "contacted") list = list.filter((item) => item.contacted);
    return list;
  }, [catalog, filters, searchQuery, tab]);

  const counts = useMemo(
    () => ({
      all: catalog.length,
      saved: catalog.filter((item) => item.saved).length,
      booked: bookings.filter(
        (item) => item.status === "accepted" || item.status === "confirmed",
      ).length,
      contacted: catalog.filter((item) => item.contacted).length,
    }),
    [catalog, bookings],
  );

  const showBookedList = tab === "booked";
  const listForPagination = showBookedList ? bookedBookings : filtered;
  const totalPages = Math.max(
    1,
    Math.ceil(listForPagination.length / FIND_CARE_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * FIND_CARE_PAGE_SIZE,
    safePage * FIND_CARE_PAGE_SIZE,
  );
  const bookedPageItems = bookedBookings.slice(
    (safePage - 1) * FIND_CARE_PAGE_SIZE,
    safePage * FIND_CARE_PAGE_SIZE,
  );

  const tabs: { id: FindCareTab; label: string; count: number }[] = [
    { id: "all", label: "All caregivers", count: counts.all },
    { id: "saved", label: "Saved", count: counts.saved },
    { id: "booked", label: "Booked", count: counts.booked },
    { id: "contacted", label: "Contacted", count: counts.contacted },
  ];

  const messageProfile = messageBooking
    ? getCaregiverProfile(messageBooking.caregiverId)
    : null;

  function toggleSave(id: string) {
    setCatalog((current) =>
      current.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item,
      ),
    );
  }

  function clearFilters() {
    setFilters({
      ...defaultDashboardFilters(null),
      categories: [],
      recipientId: null,
    });
    setSearchQuery("");
    setPage(1);
  }

  const isEmpty = showBookedList
    ? bookedBookings.length === 0
    : pageItems.length === 0;

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Find Care"
          subtitle="Browse trusted caregivers that fit."
          recipientId={recipientId}
          onRecipientChange={setRecipientId}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div
            role="tablist"
            aria-label="Caregiver lists"
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
                  onClick={() => {
                    setTab(item.id);
                    setPage(1);
                  }}
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

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 self-end rounded-full px-2 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover sm:self-auto"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            All filters
          </button>
        </div>

        {isEmpty ? (
          <div className="mt-10 rounded-2xl border border-[#E8EEF5] bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-base font-bold text-navy">
              {showBookedList ? "No booked caregivers" : "No caregivers found"}
            </p>
            <p className="mt-2 text-sm text-navy/55">
              {showBookedList
                ? "When a caregiver accepts your request, they’ll show up here."
                : `Try another tab, clear filters, or search for ${selectedRecipient?.firstName ?? "someone"} again.`}
            </p>
            {!showBookedList ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white hover:bg-brand-blue-hover"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : showBookedList ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-navy/55">
              {bookedBookings.length} booked caregiver
              {bookedBookings.length === 1 ? "" : "s"}
            </p>
            <ul className="space-y-3">
              {bookedPageItems.map((booking) => (
                <li key={booking.id}>
                  <BookedCaregiverCard
                    booking={booking}
                    onMessage={() => setMessageBooking(booking)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((caregiver) => (
              <CaregiverCard
                key={caregiver.id}
                caregiver={caregiver}
                onToggleSave={toggleSave}
                className="w-full"
              />
            ))}
          </div>
        )}

        {!isEmpty && listForPagination.length > FIND_CARE_PAGE_SIZE ? (
          <nav
            aria-label="Pagination"
            className="mt-8 mb-2 flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-navy disabled:opacity-40 hover:bg-surface-soft"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={pageNumber === safePage ? "page" : undefined}
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    pageNumber === safePage
                      ? "bg-brand-blue text-white"
                      : "border border-[#E8EEF5] bg-white text-navy hover:bg-surface-soft",
                  )}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-navy disabled:opacity-40 hover:bg-surface-soft"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </nav>
        ) : null}
      </div>

      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={(next) => {
          setFilters({ ...next, recipientId: null });
          setPage(1);
        }}
        recipients={mockRecipients}
        resultCount={showBookedList ? bookedBookings.length : filtered.length}
        onClear={clearFilters}
      />

      {messageProfile ? (
        <MessageCaregiverModal
          open={Boolean(messageBooking)}
          onClose={() => setMessageBooking(null)}
          caregiver={messageProfile}
        />
      ) : null}
    </CareseekerShell>
  );
}
