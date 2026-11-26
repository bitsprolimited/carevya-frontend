"use client";

import { Check, Wallet } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  formatNaira,
  maskAccountNumber,
} from "@/features/caregiver-dashboard/data/mock-earnings";
import type { PayoutAccount } from "@/features/caregiver-dashboard/types/earnings";
import { cn } from "@/lib/utils";

const PRESETS = [
  { id: "25", label: "25%", ratio: 0.25 },
  { id: "50", label: "50%", ratio: 0.5 },
  { id: "75", label: "75%", ratio: 0.75 },
  { id: "max", label: "Max", ratio: 1 },
] as const;

export function WithdrawEarningsModal({
  open,
  available,
  account,
  onClose,
  onWithdraw,
}: {
  open: boolean;
  available: number;
  account: PayoutAccount;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
}) {
  const titleId = useId();
  const [preset, setPreset] = useState<string>("max");
  const [amountInput, setAmountInput] = useState(String(available));

  useEffect(() => {
    if (!open) return;
    setPreset("max");
    setAmountInput(String(available));
  }, [open, available]);

  const amount = useMemo(() => {
    const parsed = Number(amountInput.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amountInput]);

  const valid = amount > 0 && amount <= available;

  function applyPreset(id: string) {
    const item = PRESETS.find((entry) => entry.id === id);
    if (!item) return;
    setPreset(id);
    setAmountInput(String(Math.round(available * item.ratio)));
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <h2
          id={titleId}
          className="text-xl font-bold tracking-tight text-navy"
        >
          Withdraw to your bank
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-navy/55">
          {formatNaira(available)} is ready to withdraw. Our 10% commission was
          taken when care was confirmed, so there&apos;s no fee to withdraw.
        </p>

        <div className="mt-5 rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] px-3.5 py-3 text-sm text-navy">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy/40">
            To
          </p>
          <p className="mt-1 font-semibold">
            {account.bankShortName} {maskAccountNumber(account.accountNumber)} ·{" "}
            {account.accountName}
          </p>
        </div>

        <div className="mt-4">
          <label
            htmlFor="withdraw-amount"
            className="text-sm font-semibold text-navy"
          >
            Amount
          </label>
          <div className="relative mt-1.5">
            <Wallet
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-navy/40"
              aria-hidden
            />
            <input
              id="withdraw-amount"
              inputMode="numeric"
              value={amountInput ? formatNaira(amount) : ""}
              onChange={(event) => {
                const digits = event.target.value.replace(/[^\d]/g, "");
                setAmountInput(digits);
                const matched = PRESETS.find(
                  (entry) =>
                    Math.round(available * entry.ratio) === Number(digits),
                );
                setPreset(matched?.id ?? "");
              }}
              className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white py-2 pr-3.5 pl-10 text-sm font-semibold text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((entry) => {
            const selected = preset === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => applyPreset(entry.id)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors",
                  selected
                    ? "border-brand-blue bg-[#EAF2FF] text-brand-blue"
                    : "border-[#D7E0EA] bg-white text-navy/70 hover:border-brand-blue/40",
                )}
              >
                {entry.label}
                {selected ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-navy/50">
          {amount >= available
            ? `Your full balance · ${formatNaira(available)} goes to ${account.bankShortName} ${maskAccountNumber(account.accountNumber)}. No withdrawal fee.`
            : `${formatNaira(amount)} goes to ${account.bankShortName} ${maskAccountNumber(account.accountNumber)}. No withdrawal fee.`}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!valid}
            onClick={() => onWithdraw(amount)}
            className="h-11 flex-1 rounded-full"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Modal>
  );
}
