"use client";

import { BadgeCheck, Lock } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Toggle } from "@/components/ui/toggle";
import { mockRecipients, mockUser } from "@/features/dashboard/data/mock";
import { buildCaregiverMessageDraft } from "@/features/dashboard/lib/message-draft";
import type { CaregiverProfile } from "@/features/dashboard/types/caregiver-profile";
import { useSession } from "@/lib/auth-client";

export function MessageCaregiverModal({
  open,
  onClose,
  caregiver,
  recipientId = mockRecipients[0]?.id,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  caregiver: CaregiverProfile;
  recipientId?: string;
  onSent?: () => void;
}) {
  const titleId = useId();
  const { data: session } = useSession();
  const seekerName = session?.user?.name?.trim() || mockUser.fullName;
  const recipient =
    mockRecipients.find((item) => item.id === recipientId) ?? mockRecipients[0];

  const [message, setMessage] = useState("");
  const [requestCall, setRequestCall] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open || !recipient) return;
    setMessage(
      buildCaregiverMessageDraft({
        caregiver,
        recipient,
        seekerName,
      }),
    );
    setRequestCall(false);
  }, [open, caregiver, recipient, seekerName]);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSending(false);
    onSent?.();
    onClose();
  }

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-lg">
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <h2 id={titleId} className="pr-8 text-xl font-bold tracking-tight text-navy">
          Message {caregiver.firstName}
        </h2>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-soft">
            <Image
              src={caregiver.imageUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-navy">
              {caregiver.name}
            </p>
            <p className="truncate text-xs text-navy/55">
              {caregiver.categoryLabel.replace(/ · .*$/, "")} ·{" "}
              {caregiver.yearsExperience} years
            </p>
          </div>
          {caregiver.verified ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E9F9F1] px-2 py-1 text-[0.6875rem] font-semibold text-emerald-dark">
              <BadgeCheck
                className="size-3.5 fill-emerald text-white"
                aria-hidden
              />
              ID verified
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <label
              htmlFor="caregiver-message"
              className="text-sm font-semibold text-navy"
            >
              Your message
            </label>
            <span className="text-xs text-navy/45">
              Filled in from {recipient?.firstName ?? "care"}&apos;s care profile
            </span>
          </div>
          <textarea
            id="caregiver-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={9}
            className="w-full resize-y rounded-2xl border border-[#D7E0EA] bg-white px-3.5 py-3 text-sm leading-relaxed text-navy outline-none placeholder:text-navy/40 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-[#F3F6FB] px-3.5 py-3">
          <Toggle
            id="request-call"
            checked={requestCall}
            onChange={setRequestCall}
            label="Request a voice or video call"
            description={`${caregiver.firstName} can suggest a time to talk before you book.`}
          />
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-navy/55">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Messages are private. Your full address is never shared in chat.
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
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
            onClick={() => void handleSend()}
            disabled={sending || !message.trim()}
            className="h-11 flex-1 rounded-full"
          >
            {sending ? "Sending..." : "Send message →"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
