"use client";

import { ArrowRight, Check, ChevronDown, Paperclip, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CAREGIVER_REQUEST_DECLINE_REASONS } from "@/features/caregiver-dashboard/data/mock-requests";
import { cn } from "@/lib/utils";

export function DeclineRequestModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    reason: string;
    details: string;
    safetyConcern: boolean;
    fileName: string | null;
  }) => void;
}) {
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reason, setReason] = useState<string>(
    CAREGIVER_REQUEST_DECLINE_REASONS[0],
  );
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [safetyConcern, setSafetyConcern] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReason(CAREGIVER_REQUEST_DECLINE_REASONS[0]);
    setDetails("");
    setFileName(null);
    setSafetyConcern(false);
    setMenuOpen(false);
  }, [open]);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-lg"
    >
      <div
        ref={rootRef}
        className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-xl font-bold tracking-tight text-navy"
            >
              Decline Request?
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              Tell us why you would like to decline a request
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-navy/45 hover:bg-surface-soft"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-navy">
            What&apos;s the problem?
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((openMenu) => !openMenu)}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#D7DEE8] bg-white px-4 text-left text-sm text-navy"
            >
              <span>{reason}</span>
              <ChevronDown className="size-4 text-navy/40" aria-hidden />
            </button>
            {menuOpen ? (
              <div className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-xl">
                {CAREGIVER_REQUEST_DECLINE_REASONS.map((option) => {
                  const selected = option === reason;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setReason(option);
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-surface-soft",
                        selected ? "font-semibold text-brand-blue" : "text-navy",
                      )}
                    >
                      {option}
                      {selected ? (
                        <Check className="size-4" strokeWidth={3} aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="decline-details"
            className="mb-2 block text-sm font-medium text-navy"
          >
            Tell us more (Optional)
          </label>
          <textarea
            id="decline-details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={4}
            placeholder="Include what happened, when, and how we can help"
            className="w-full resize-none rounded-2xl border border-[#D7DEE8] bg-white px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D7DEE8] bg-[#F8FAFC] px-4 py-5 text-sm text-navy/60 hover:border-brand-blue/40"
        >
          <Paperclip className="size-4" aria-hidden />
          {fileName
            ? fileName
            : "Add photos or documents (Optional)"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file?.name ?? null);
            event.target.value = "";
          }}
        />

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={safetyConcern}
            onClick={() => setSafetyConcern((value) => !value)}
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
              safetyConcern
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-[#C9D3E0] bg-white text-transparent",
            )}
          >
            <Check className="size-3" strokeWidth={3} aria-hidden />
          </button>
          <span className="text-sm text-navy/70">
            This is a safety concern, someone may be at risk
          </span>
        </label>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 rounded-full px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() =>
              onSubmit({
                reason,
                details: details.trim(),
                safetyConcern,
                fileName,
              })
            }
            className="h-11 rounded-full px-6"
          >
            Submit report
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
