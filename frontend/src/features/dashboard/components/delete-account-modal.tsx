"use client";

import { AlertTriangle, Lock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeleteAccountModal({
  open,
  onClose,
  activeBookings = 2,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  activeBookings?: number;
  onDeleted?: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canDelete =
    confirmText.trim().toUpperCase() === "DELETE" && activeBookings === 0;

  useEffect(() => {
    if (!open) setConfirmText("");
  }, [open]);

  async function handleDelete() {
    if (!canDelete) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    onDeleted?.();
    onClose();
  }

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md">
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FEECEC] text-danger">
          <Trash2 className="size-5" aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-navy">
          Delete your account?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/60">
          This permanently removes your account, care profiles, saved carers and
          messages. This can&apos;t be undone.
        </p>

        {activeBookings > 0 ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#FFF6E5] px-3.5 py-3 text-sm leading-relaxed text-amber-800">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden
            />
            You have {activeBookings} active bookings. Complete or cancel them
            before deleting your account.
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

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 flex-1 rounded-full"
          >
            Keep my account
          </Button>
          <Button
            type="button"
            onClick={() => void handleDelete()}
            disabled={!canDelete || submitting}
            className="h-11 flex-1 rounded-full bg-[#FEECEC] text-danger shadow-none hover:bg-[#FDD8D8] disabled:bg-[#FEECEC]/60 disabled:text-danger/40"
          >
            {submitting ? "Deleting..." : "Delete account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
