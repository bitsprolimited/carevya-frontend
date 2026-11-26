"use client";

import { ArrowRight, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function RequestAcceptedModal({
  open,
  onClose,
  onMessage,
  onViewBooking,
}: {
  open: boolean;
  onClose: () => void;
  onMessage: () => void;
  onViewBooking: () => void;
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="relative rounded-2xl border border-[#E8EEF5] bg-white px-6 py-8 text-center shadow-xl sm:px-8">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full text-navy/40 hover:bg-surface-soft hover:text-navy"
        >
          <X className="size-5" />
        </button>

        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#EAF2FF]">
          <span className="text-4xl" aria-hidden>
            🙌
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-navy">
          Bookings Accepted!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/60">
          You&apos;ve successfully accepted the care request. The careseeker
          will be notified and can confirm the details with you shortly.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onMessage}
            className="h-11 flex-1 rounded-full"
          >
            <MessageSquare className="size-4" aria-hidden />
            Message
          </Button>
          <Button
            type="button"
            onClick={onViewBooking}
            className="h-11 flex-1 rounded-full"
          >
            View Booking
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
