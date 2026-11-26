"use client";

import { Check, ChevronDown, CreditCard, Wallet } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  defaultPayoutBank,
  nigerianBanks,
  resolveAccountName,
  verifiedIdAccountName,
} from "@/features/caregiver-dashboard/data/mock-earnings";
import type {
  NigerianBankOption,
  PayoutAccount,
} from "@/features/caregiver-dashboard/types/earnings";
import { cn } from "@/lib/utils";

export function AddPayoutAccountModal({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: (draft: Omit<PayoutAccount, "verified">) => void;
}) {
  const titleId = useId();
  const [bank, setBank] = useState<NigerianBankOption>(defaultPayoutBank);
  const [accountNumber, setAccountNumber] = useState("0123454821");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setBank(defaultPayoutBank);
    setAccountNumber("0123454821");
    setMenuOpen(false);
  }, [open]);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const resolvedName = useMemo(
    () => resolveAccountName(accountNumber),
    [accountNumber],
  );
  const matchesId = resolvedName === verifiedIdAccountName;
  const canContinue =
    accountNumber.replace(/\D/g, "").length === 10 && matchesId;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-brand-blue">
          <Wallet className="size-6" aria-hidden />
        </div>

        <h2
          id={titleId}
          className="mt-4 text-center text-xl font-bold tracking-tight text-navy"
        >
          Add a payout account
        </h2>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-navy/55">
          We&apos;ll send your earnings here. The account name must match the
          name on your verified ID.
        </p>

        <div className="mt-5 space-y-4">
          <div ref={menuRef} className="relative">
            <label className="text-sm font-semibold text-navy">Bank</label>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="mt-1.5 flex h-11 w-full items-center justify-between rounded-xl border border-[#D7E0EA] bg-white px-3.5 text-left text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="truncate">{bank.name}</span>
              <ChevronDown className="size-4 shrink-0 text-navy/45" aria-hidden />
            </button>
            {menuOpen ? (
              <div
                role="listbox"
                className="absolute z-20 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg"
              >
                {nigerianBanks.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    role="option"
                    aria-selected={option.code === bank.code}
                    onClick={() => {
                      setBank(option);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-[#F8FAFC]",
                      option.code === bank.code && "bg-[#EAF2FF]",
                    )}
                  >
                    <span>{option.name}</span>
                    {option.code === bank.code ? (
                      <Check className="size-4 text-brand-blue" aria-hidden />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="payout-account-number"
              className="text-sm font-semibold text-navy"
            >
              Account number
            </label>
            <div className="relative mt-1.5">
              <CreditCard
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-navy/40"
                aria-hidden
              />
              <input
                id="payout-account-number"
                inputMode="numeric"
                maxLength={10}
                value={accountNumber}
                onChange={(event) =>
                  setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="h-11 w-full rounded-xl border border-[#D7E0EA] bg-white py-2 pr-3.5 pl-10 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="10-digit account number"
              />
            </div>
          </div>

          {matchesId ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald/20 bg-[#ECFDF3] px-3.5 py-3 text-sm leading-relaxed text-emerald-dark">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald text-white">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              <p>
                Account name: {resolvedName} matches your verified ID
              </p>
            </div>
          ) : resolvedName ? (
            <div className="rounded-xl border border-danger/20 bg-[#FEF2F2] px-3.5 py-3 text-sm leading-relaxed text-[#B42318]">
              Account name: {resolvedName} does not match your verified ID (
              {verifiedIdAccountName}).
            </div>
          ) : accountNumber.replace(/\D/g, "").length === 10 ? (
            <div className="rounded-xl bg-[#F5F7FB] px-3.5 py-3 text-sm text-navy/55">
              Could not resolve this account. Check the number and try again.
            </div>
          ) : (
            <div className="rounded-xl bg-[#F5F7FB] px-3.5 py-3 text-sm text-navy/55">
              Enter a 10-digit account number ending in 4821 for the demo match.
            </div>
          )}
        </div>

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
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue || !resolvedName) return;
              const digits = accountNumber.replace(/\D/g, "");
              onContinue({
                bankCode: bank.code,
                bankName: bank.name,
                bankShortName: bank.shortName,
                accountNumber: digits,
                accountName: resolvedName,
                last4: digits.slice(-4),
              });
            }}
            className="h-11 flex-1 rounded-full"
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
