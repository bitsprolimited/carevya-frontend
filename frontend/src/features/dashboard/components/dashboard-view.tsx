"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { CaregiverCard } from "@/features/dashboard/components/caregiver-card";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardRightPanel } from "@/features/dashboard/components/dashboard-right-panel";
import { FiltersDrawer } from "@/features/dashboard/components/filters-drawer";
import {
  mockAppointments,
  mockCaregivers,
  mockRecipients,
  mockStats,
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
  return name?.trim().split(/\s+/)[0] || "Grace";
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
        caregivers: filtered
          .filter((item) => item.recipientIds.includes(recipient.id))
          .slice(0, 3),
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
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="min-w-0 flex-1 px-4 py-5 sm:px-5 lg:px-6">
          <CareseekerTopbar
            title={`Hello ${displayFirstName}`}
            subtitle="Your care journey starts here."
            recipientId={selectedRecipientId}
            onRecipientChange={selectRecipient}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="mt-5 flex flex-wrap items-center gap-2">
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
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5 sm:py-2 sm:text-sm",
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
            <div className="mt-7 space-y-8">
              {recommendationsByRecipient.map(
                ({ recipient, caregivers: list }) => (
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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {list.map((caregiver) => (
                        <CaregiverCard
                          key={caregiver.id}
                          caregiver={caregiver}
                          onToggleSave={toggleSave}
                          className="w-full"
                        />
                      ))}
                    </div>
                  </section>
                ),
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#E8EEF5] bg-[#F8FAFC] px-4 py-5 sm:px-5 xl:w-[17.5rem] xl:shrink-0 xl:border-t-0 xl:border-l xl:px-4 2xl:w-[19.5rem] 2xl:px-5">
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
        "flex items-start justify-between gap-2 rounded-2xl border px-3.5 py-3 sm:px-4 sm:py-3.5",
        tones.card,
      )}
    >
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-navy">{count}</p>
        <p className="mt-0.5 text-sm font-semibold text-navy">{label}</p>
        <p className="mt-0.5 text-xs text-navy/55">{detail}</p>
      </div>
      <span
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm sm:size-10",
          tones.icon,
        )}
      >
        {icon}
      </span>
    </div>
  );
}
