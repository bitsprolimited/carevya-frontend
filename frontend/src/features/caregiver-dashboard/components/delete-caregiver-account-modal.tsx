"use client";

import { AlertTriangle, Lock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatNaira } from "@/features/caregiver-dashboard/data/mock-earnings";

export type CaregiverDeletionBlockers = {
  activeBookingReference: string | null;
  availableToWithdraw: number;
};

export function DeleteCaregiverAccountModal({
  open,
  onClose,
  onDeleted,
  blockers,
}: {
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void | Promise<void>;
  blockers: CaregiverDeletionBlockers;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hasActiveBooking = Boolean(blockers.activeBookingReference);
  const hasBalance = blockers.availableToWithdraw > 0;
  const blocked = hasActiveBooking || hasBalance;
  const typedOk = confirmText.trim().toUpperCase() === "DELETE";
  const canDelete = typedOk && !blocked;

  useEffect(() => {
    if (!open) {
      setConfirmText("");
      setSubmitting(false);
    }
  }, [open]);

  async function handleDelete() {
    if (!canDelete || submitting) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await onDeleted?.();
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FEECEC] text-danger">
          <Trash2 className="size-5" aria-hidden />
        </span>

        <h2 className="mt-4 text-xl font-bold tracking-tight text-navy">
          Delete your caregiver account?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/60">
          This permanently removes your profile, verification documents,
          reviews and messages. This can&apos;t be undone.
        </p>

        {blocked ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#FFF6E5] px-3.5 py-3 text-sm leading-relaxed text-amber-800">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden
            />
            <span>
              {hasActiveBooking && hasBalance ? (
                <>
                  You have 1 active booking ({blockers.activeBookingReference})
                  and {formatNaira(blockers.availableToWithdraw)} to withdraw.
                  Finish the booking and withdraw your earnings first.
                </>
              ) : hasActiveBooking ? (
                <>
                  You have 1 active booking (
                  {blockers.activeBookingReference}). Finish or cancel it
                  before deleting your account.
                </>
              ) : (
                <>
                  You have {formatNaira(blockers.availableToWithdraw)} to
                  withdraw. Withdraw your earnings first.
                </>
              )}
            </span>
          </p>
        ) : null}

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-navy">
            Type DELETE to confirm
          </span>
          <span className="flex h-11 items-center gap-2 rounded-xl border border-[#D7E0EA] bg-white px-3.5">
            <Lock className="size-4 shrink-0 text-navy/40" aria-hidden />
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="DELETE"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-navy outline-none placeholder:text-navy/35"
            />
          </span>
        </label>

        <Button
          type="button"
          onClick={() => void handleDelete()}
          disabled={!canDelete || submitting}
          className="mt-5 h-11 w-full rounded-full bg-[#FEECEC] text-danger shadow-none hover:bg-[#FDD8D8] disabled:bg-[#FEECEC]/60 disabled:text-danger/40"
        >
          {submitting ? "Deleting..." : "Delete account"}
        </Button>
      </div>
    </Modal>
  );
}
