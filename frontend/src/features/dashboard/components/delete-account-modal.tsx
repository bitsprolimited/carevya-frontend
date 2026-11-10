"use client";

import { AlertTriangle, Lock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  deleteAccount,
  getDeletionEligibility,
} from "@/features/account/services/account-service";
import { ApiError } from "@/lib/api";

export function DeleteAccountModal({
  open,
  onClose,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void | Promise<void>;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [activeBookings, setActiveBookings] = useState(0);
  const [canDeleteApi, setCanDeleteApi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete =
    confirmText.trim().toUpperCase() === "DELETE" &&
    canDeleteApi &&
    activeBookings === 0;

  useEffect(() => {
    if (!open) {
      setConfirmText("");
      setError(null);
      setSubmitting(false);
      return;
    }

    let cancelled = false;
    setLoadingEligibility(true);
    setError(null);
    void (async () => {
      try {
        const eligibility = await getDeletionEligibility();
        if (cancelled) return;
        setCanDeleteApi(Boolean(eligibility.canDelete));
        setActiveBookings(eligibility.activeBookings ?? 0);
      } catch (err) {
        if (cancelled) return;
        setCanDeleteApi(false);
        setActiveBookings(0);
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not check whether your account can be deleted.",
        );
      } finally {
        if (!cancelled) setLoadingEligibility(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleDelete() {
    if (!canDelete) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteAccount();
      await onDeleted?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn't delete your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
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

        {loadingEligibility ? (
          <p className="mt-4 text-sm text-navy/55">Checking eligibility…</p>
        ) : null}

        {!loadingEligibility && activeBookings > 0 ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#FFF6E5] px-3.5 py-3 text-sm leading-relaxed text-amber-800">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden
            />
            You have {activeBookings} active booking
            {activeBookings === 1 ? "" : "s"}. Complete or cancel them before
            deleting your account.
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

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

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
            disabled={!canDelete || submitting || loadingEligibility}
            className="h-11 flex-1 rounded-full bg-[#FEECEC] text-danger shadow-none hover:bg-[#FDD8D8] disabled:bg-[#FEECEC]/60 disabled:text-danger/40"
          >
            {submitting ? "Deleting..." : "Delete account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
