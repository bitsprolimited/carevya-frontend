"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddPayoutAccountModal } from "@/features/caregiver-dashboard/components/add-payout-account-modal";
import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";
import { VerifyPayoutOtpModal } from "@/features/caregiver-dashboard/components/verify-payout-otp-modal";
import { WithdrawEarningsModal } from "@/features/caregiver-dashboard/components/withdraw-earnings-modal";
import {
  defaultPayoutAccount,
  earningsBookingRowsSeed,
  earningsSummarySeed,
  formatNaira,
  maskAccountNumber,
  payoutHistorySeed,
} from "@/features/caregiver-dashboard/data/mock-earnings";
import type {
  EarningsBookingRow,
  EarningsBookingStatus,
  EarningsPeriod,
  PayoutAccount,
  PayoutHistoryEntry,
} from "@/features/caregiver-dashboard/types/earnings";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: Array<{ id: EarningsPeriod; label: string }> = [
  { id: "this_week", label: "This week" },
  { id: "this_month", label: "This month" },
  { id: "last_3_months", label: "Last 3 months" },
  { id: "this_year", label: "This year" },
  { id: "all_time", label: "All time" },
];

const STATUS_STYLES: Record<
  EarningsBookingStatus,
  { label: string; className: string }
> = {
  held: {
    label: "Held",
    className: "bg-[#EAF2FF] text-brand-blue",
  },
  available: {
    label: "Available",
    className: "bg-[#ECFDF3] text-emerald-dark",
  },
  paid_out: {
    label: "Paid out",
    className: "bg-[#F0FDF4] text-[#15803D]",
  },
};

function PeriodFilter({
  value,
  onChange,
}: {
  value: EarningsPeriod;
  onChange: (next: EarningsPeriod) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const label =
    PERIOD_OPTIONS.find((option) => option.id === value)?.label ?? "This month";

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D7E0EA] bg-white px-3.5 text-sm font-semibold text-navy shadow-sm hover:bg-surface-soft"
      >
        <CalendarDays className="size-4 text-navy/45" aria-hidden />
        {label}
        <ChevronDown className="size-4 text-navy/45" aria-hidden />
      </button>
      {open ? (
        <div
          id={menuId}
          role="listbox"
          className="absolute left-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg"
        >
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={option.id === value}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-[#F8FAFC]",
                option.id === value && "bg-[#EAF2FF] font-semibold text-navy",
              )}
            >
              {option.label}
              {option.id === value ? (
                <Check className="size-4 text-brand-blue" aria-hidden />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CaregiverEarningsView({
  initialEmptyAccount = false,
}: {
  initialEmptyAccount?: boolean;
}) {
  const [period, setPeriod] = useState<EarningsPeriod>("this_month");
  const [available, setAvailable] = useState(earningsSummarySeed.available);
  const [onHold] = useState(earningsSummarySeed.onHold);
  const [totalEarned] = useState(earningsSummarySeed.totalEarned);
  const [rows, setRows] = useState<EarningsBookingRow[]>(earningsBookingRowsSeed);
  const [history, setHistory] =
    useState<PayoutHistoryEntry[]>(payoutHistorySeed);
  const [account, setAccount] = useState<PayoutAccount | null>(
    initialEmptyAccount ? null : defaultPayoutAccount,
  );

  const [addOpen, setAddOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [draftAccount, setDraftAccount] = useState<Omit<
    PayoutAccount,
    "verified"
  > | null>(null);

  const periodLabel =
    PERIOD_OPTIONS.find((option) => option.id === period)?.label ?? "This month";

  const summaryCards = useMemo(
    () => [
      {
        id: "earned",
        label: "Total Earned",
        value: totalEarned,
        className: "bg-[#ECFDF3]",
        iconClassName: "bg-emerald text-white",
        icon: Check,
      },
      {
        id: "hold",
        label: "Payment on hold",
        value: onHold,
        className: "bg-[#EEF2FF]",
        iconClassName: "bg-brand-blue text-white",
        icon: Lock,
      },
      {
        id: "available",
        label: "Available to withdraw",
        value: available,
        className: "bg-[#FFF7ED]",
        iconClassName: "bg-[#F97316] text-white",
        icon: Clock3,
      },
    ],
    [available, onHold, totalEarned],
  );

  function openAddAccount() {
    setAddOpen(true);
  }

  function handleWithdrawClick() {
    if (!account) {
      openAddAccount();
      appToast.message("Add a payout account before withdrawing");
      return;
    }
    if (available <= 0) return;
    setWithdrawOpen(true);
  }

  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar
          title="Earnings"
          subtitle="Careseekers pay the agreed price."
          showSearch={false}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PeriodFilter value={period} onChange={setPeriod} />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-10 rounded-full px-4"
              onClick={() =>
                appToast.message(`Statement for ${periodLabel} downloaded`)
              }
            >
              <Download className="size-4" aria-hidden />
              Download statement
            </Button>
            <Button
              type="button"
              className="h-10 rounded-full px-4"
              disabled={available <= 0}
              onClick={handleWithdrawClick}
            >
              {available > 0
                ? `Withdraw ${formatNaira(available)}`
                : "Nothing to withdraw"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={cn(
                  "rounded-2xl border border-transparent p-4 shadow-sm sm:p-5",
                  card.className,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-navy/60">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-navy">
                      {formatNaira(card.value)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-full",
                      card.iconClassName,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
          <section className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
            <div className="border-b border-[#E8EEF5] px-4 py-4 sm:px-5">
              <h2 className="text-base font-bold text-navy">
                Earnings by booking
              </h2>
              <p className="mt-0.5 text-xs text-navy/45">{periodLabel}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[0.6875rem] font-semibold tracking-wide text-navy/45 uppercase">
                  <tr>
                    <th className="px-4 py-3 sm:px-5">Date</th>
                    <th className="px-4 py-3 sm:px-5">Booking</th>
                    <th className="px-4 py-3 sm:px-5">Booking Price</th>
                    <th className="px-4 py-3 sm:px-5">Commission</th>
                    <th className="px-4 py-3 sm:px-5">You Get (90%)</th>
                    <th className="px-4 py-3 sm:px-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const status = STATUS_STYLES[row.status];
                    return (
                      <tr
                        key={row.id}
                        className="border-t border-[#E8EEF5] align-top"
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap text-navy/70 sm:px-5">
                          {row.dateLabel}
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <p className="font-semibold text-navy">
                            {row.careseekerName}{" "}
                            <span className="font-medium text-navy/45">
                              · {row.reference}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs text-navy/50">
                            {row.arrangement}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-navy sm:px-5">
                          {formatNaira(row.bookingPrice)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-navy/60 sm:px-5">
                          -{formatNaira(row.commission)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-navy sm:px-5">
                          {formatNaira(row.youGet)}
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              status.className,
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-bold text-navy">Payout account</h3>
              {account ? (
                <div className="mt-3 rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy">
                        {account.bankShortName}{" "}
                        {maskAccountNumber(account.accountNumber)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-navy/50">
                        {account.accountName}
                      </p>
                    </div>
                    {account.verified ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF3] px-2 py-1 text-[0.6875rem] font-semibold text-emerald-dark">
                        <ShieldCheck className="size-3.5" aria-hidden />
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3 h-9 w-full rounded-full text-sm"
                    onClick={openAddAccount}
                  >
                    Change account
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  className="mt-3 h-10 w-full rounded-full"
                  onClick={openAddAccount}
                >
                  Add a payout account
                </Button>
              )}
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-bold text-navy">How payouts work</h3>
              <ol className="mt-3 space-y-3">
                {[
                  "Careseeker pays; CareVYA holds funds.",
                  "Caregiver marks complete; seeker confirms within 3 days.",
                  "CareVYA keeps 10% commission, credits 90% to your balance. Withdrawal is free.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-navy/65">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand-blue">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-bold text-navy">Payout history</h3>
              <ul className="mt-3 space-y-2.5">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl bg-[#F8FAFC] px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy">
                          {formatNaira(entry.amount)}
                        </p>
                        <p className="mt-0.5 text-xs text-navy/50">
                          To {entry.bankShortName} •••• {entry.last4}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            entry.status === "processing"
                              ? "text-[#C2410C]"
                              : "text-emerald-dark",
                          )}
                        >
                          {entry.status === "processing" ? "Processing" : "Paid"}
                        </p>
                        <p className="mt-0.5 text-xs text-navy/40">
                          {entry.dateLabel}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <AddPayoutAccountModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onContinue={(draft) => {
          setDraftAccount(draft);
          setAddOpen(false);
          setOtpOpen(true);
        }}
      />

      <VerifyPayoutOtpModal
        open={otpOpen}
        draft={draftAccount}
        onClose={() => {
          setOtpOpen(false);
          setDraftAccount(null);
        }}
        onBack={() => {
          setOtpOpen(false);
          setAddOpen(true);
        }}
        onVerified={(next) => {
          setAccount(next);
          setOtpOpen(false);
          setDraftAccount(null);
          appToast.success(
            `${next.bankShortName} ${maskAccountNumber(next.accountNumber)} added — you can now withdraw to this account`,
          );
        }}
      />

      {account ? (
        <WithdrawEarningsModal
          open={withdrawOpen}
          available={available}
          account={account}
          onClose={() => setWithdrawOpen(false)}
          onWithdraw={(amount) => {
            setAvailable((current) => Math.max(0, current - amount));
            setRows((current) =>
              current.map((row) =>
                row.status === "available"
                  ? { ...row, status: "paid_out" }
                  : row,
              ),
            );
            setHistory((current) => [
              {
                id: `po-${Date.now()}`,
                amount,
                bankShortName: account.bankShortName,
                last4: account.last4,
                status: "processing",
                dateLabel: "Today",
              },
              ...current,
            ]);
            setWithdrawOpen(false);
            appToast.success(
              `Withdrawal of ${formatNaira(amount)} requested · it should reach ${account.bankShortName} ${maskAccountNumber(account.accountNumber)} by tomorrow.`,
            );
          }}
        />
      ) : null}
    </CaregiverShell>
  );
}
