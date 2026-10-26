"use client";

import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { CaregiverCard } from "@/features/dashboard/components/caregiver-card";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardRightPanel } from "@/features/dashboard/components/dashboard-right-panel";
import { FiltersDrawer } from "@/features/dashboard/components/filters-drawer";
import {
  mockAppointments,
  mockCaregivers,
  mockRecipients,
  mockStats,
  mockUser,
} from "@/features/dashboard/data/mock";
import { filterCaregivers } from "@/features/dashboard/lib/filter-caregivers";
import {
  CARE_CATEGORY_OPTIONS,
  defaultDashboardFilters,
  type CareCategory,
  type Caregiver,
  type DashboardFilters,
} from "@/features/dashboard/types";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function firstNameFrom(name: string | undefined | null): string {
  return name?.trim().split(/\s+/)[0] || mockUser.firstName;
}

const QUICK_CHIPS: { value: CareCategory | "live_in"; label: string }[] = [
  ...CARE_CATEGORY_OPTIONS.map((option) => ({
    value: option.value as CareCategory | "live_in",
    label: option.label,
  })),
  { value: "live_in", label: "Live-in" },
];

export function DashboardView() {
  const { data: session } = useSession();
  const displayFirstName = firstNameFrom(session?.user?.name);
  const displayFullName = session?.user?.name?.trim() || mockUser.fullName;

  const [selectedRecipientId, setSelectedRecipientId] = useState(
    mockRecipients[0]?.id ?? null,
  );
  const [filters, setFilters] = useState<DashboardFilters>(() =>
    defaultDashboardFilters(mockRecipients[0]?.id ?? null),
  );
  const [liveInChip, setLiveInChip] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState(15);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const [recipientMenuOpen, setRecipientMenuOpen] = useState(false);

  const selectedRecipient =
    mockRecipients.find((item) => item.id === selectedRecipientId) ??
    mockRecipients[0];

  const filtered = useMemo(() => {
    let list = filterCaregivers(caregivers, filters, { liveInChip });
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.area.toLowerCase().includes(query) ||
          item.categoryLabel.toLowerCase().includes(query),
      );
    }
    return list;
  }, [caregivers, filters, liveInChip, searchQuery]);

  const recommendationsByRecipient = useMemo(() => {
    return mockRecipients
      .map((recipient) => ({
        recipient,
        caregivers: filtered.filter((item) =>
          item.recipientIds.includes(recipient.id),
        ),
      }))
      .filter((group) => group.caregivers.length > 0);
  }, [filtered]);

  const isEmpty = filtered.length === 0;

  function toggleCategoryChip(value: CareCategory) {
    setFilters((current) => {
      const has = current.categories.includes(value);
      return {
        ...current,
        categories: has
          ? current.categories.filter((item) => item !== value)
          : [...current.categories, value],
      };
    });
  }

  function clearFilters() {
    setFilters(defaultDashboardFilters(selectedRecipientId));
    setLiveInChip(false);
    setSearchQuery("");
  }

  function toggleSave(id: string) {
    setCaregivers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item,
      ),
    );
  }

  function selectRecipient(id: string) {
    setSelectedRecipientId(id);
    setFilters((current) => ({ ...current, recipientId: id }));
    setRecipientMenuOpen(false);
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]">
                Hello {displayFirstName}
              </h1>
              <p className="mt-1 text-sm text-navy/55">
                Your care journey starts here.
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:max-w-2xl lg:justify-end">
              <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-full border border-[#D7E0EA] bg-white pl-1.5 pr-3 shadow-sm">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRecipientMenuOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F3F6FB] py-1.5 pr-2.5 pl-1.5 text-sm font-semibold text-navy"
                  >
                    <span className="relative size-7 overflow-hidden rounded-full bg-surface-soft">
                      {selectedRecipient ? (
                        <Image
                          src={selectedRecipient.avatarUrl}
                          alt=""
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    {selectedRecipient?.firstName ?? "Select"}
                    <ChevronDown className="size-3.5 text-navy/50" aria-hidden />
                  </button>
                  {recipientMenuOpen ? (
                    <div className="absolute top-full left-0 z-20 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg">
                      {mockRecipients.map((recipient) => (
                        <button
                          key={recipient.id}
                          type="button"
                          onClick={() => selectRecipient(recipient.id)}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-soft",
                            recipient.id === selectedRecipientId
                              ? "font-semibold text-brand-blue"
                              : "text-navy",
                          )}
                        >
                          <span className="relative size-6 overflow-hidden rounded-full bg-surface-soft">
                            <Image
                              src={recipient.avatarUrl}
                              alt=""
                              fill
                              sizes="24px"
                              className="object-cover"
                            />
                          </span>
                          {recipient.firstName}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={`Find care for ${selectedRecipient?.firstName ?? "someone"}`}
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-navy outline-none placeholder:text-navy/40"
                />
                <Search className="size-4 shrink-0 text-navy/40" aria-hidden />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-navy hover:bg-surface-soft"
                >
                  <Bell className="size-4" aria-hidden />
                  {mockUser.notificationCount > 0 ? (
                    <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.625rem] font-bold text-white">
                      +{mockUser.notificationCount}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white py-1.5 pr-2.5 pl-1.5 hover:bg-surface-soft"
                >
                  <span className="relative size-8 overflow-hidden rounded-full bg-surface-soft">
                    <Image
                      src={mockUser.avatarUrl}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs font-semibold text-navy">
                      {displayFullName}
                    </span>
                    <span className="block text-[0.6875rem] text-navy/45">
                      {mockUser.roleLabel}
                    </span>
                  </span>
                  <ChevronDown
                    className="size-3.5 text-navy/45"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </header>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {QUICK_CHIPS.map((chip) => {
              const selected =
                chip.value === "live_in"
                  ? liveInChip
                  : filters.categories.includes(chip.value);
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => {
                    if (chip.value === "live_in") {
                      setLiveInChip((value) => !value);
                      return;
                    }
                    toggleCategoryChip(chip.value);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm",
                    selected
                      ? "border-brand-blue bg-[#E8F0FE] text-brand-blue"
                      : "border-[#D7E0EA] bg-white text-navy/65 hover:border-navy/30",
                  )}
                >
                  {selected ? <Check className="size-3.5" aria-hidden /> : null}
                  {chip.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              All filters
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard
              tone="blue"
              icon={<CalendarDays className="size-5" aria-hidden />}
              count={mockStats.appointments.count}
              label="Care Appointments"
              detail={mockStats.appointments.detail}
            />
            <StatCard
              tone="amber"
              icon={<Clock3 className="size-5" aria-hidden />}
              count={mockStats.pendingRequests.count}
              label="Pending requests"
              detail={mockStats.pendingRequests.detail}
            />
            <StatCard
              tone="green"
              icon={<MessageCircle className="size-5" aria-hidden />}
              count={mockStats.unreadMessages.count}
              label="Unread messages"
              detail={mockStats.unreadMessages.detail}
            />
          </div>

          {isEmpty ? (
            <DashboardEmptyState
              areaLabel={selectedRecipient?.area ?? "your area"}
              onEditFilters={() => setFiltersOpen(true)}
              onClearFilters={clearFilters}
            />
          ) : (
            <div className="mt-8 space-y-8">
              {recommendationsByRecipient.map(({ recipient, caregivers: list }) => (
                <section key={recipient.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-navy sm:text-lg">
                      Recommended for {recipient.firstName}
                    </h2>
                    <Link
                      href="/careseeker/caregivers"
                      className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
                    >
                      See all &gt;
                    </Link>
                  </div>
                  <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                    {list.map((caregiver) => (
                      <CaregiverCard
                        key={caregiver.id}
                        caregiver={caregiver}
                        onToggleSave={toggleSave}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#E8EEF5] bg-[#F8FAFC] px-4 py-5 sm:px-6 xl:w-[22rem] xl:shrink-0 xl:border-t-0 xl:border-l xl:px-5">
          <DashboardRightPanel
            recipients={mockRecipients}
            appointments={mockAppointments}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>
      </div>

      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        recipients={mockRecipients}
        resultCount={filtered.length}
        onClear={clearFilters}
      />
    </CareseekerShell>
  );
}

function StatCard({
  tone,
  icon,
  count,
  label,
  detail,
}: {
  tone: "blue" | "amber" | "green";
  icon: ReactNode;
  count: number;
  label: string;
  detail: string;
}) {
  const tones = {
    blue: {
      card: "bg-[#EAF2FF] border-[#D6E6FF]",
      icon: "bg-white text-brand-blue",
    },
    amber: {
      card: "bg-[#FFF6E5] border-[#F5E2B8]",
      icon: "bg-white text-amber-600",
    },
    green: {
      card: "bg-[#E9F9F1] border-[#C8EBD9]",
      icon: "bg-white text-emerald",
    },
  }[tone];

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3.5",
        tones.card,
      )}
    >
      <div>
        <p className="text-2xl font-bold tracking-tight text-navy">{count}</p>
        <p className="mt-0.5 text-sm font-semibold text-navy">{label}</p>
        <p className="mt-0.5 text-xs text-navy/55">{detail}</p>
      </div>
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
          tones.icon,
        )}
      >
        {icon}
      </span>
    </div>
  );
}
