"use client";

import { Check, Flag, Info, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Booking } from "@/features/dashboard/types/bookings";
import { cn } from "@/lib/utils";

const REVIEW_TAGS = [
  "Kind & patient",
  "On time",
  "Followed the care plan",
  "Good communication",
] as const;

export function CareReviewModal({
  open,
  onClose,
  booking,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSubmitted?: () => void;
}) {
  const titleId = useId();
  const [wentWell, setWentWell] = useState(true);
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>(["Kind & patient", "On time"]);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setWentWell(true);
    setRating(5);
    setTags(["Kind & patient", "On time"]);
    setReview("");
  }, [open, booking?.id]);

  if (!booking) return null;

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setSubmitting(false);
    onSubmitted?.();
    onClose();
  }

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-lg">
      <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-3 pr-8">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-soft">
            <Image
              src={booking.avatarUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          </span>
          <div>
            <h2
              id={titleId}
              className="text-xl font-bold tracking-tight text-navy"
            >
              How is {booking.caregiverFirstName}&apos;s care going?
            </h2>
            <p className="mt-1 text-sm text-navy/55">
              {booking.careType.split("·")[0]?.trim() || booking.careType} ·{" "}
              {booking.careStartsLabel.split("·")[0]?.trim()}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-navy">
            Is care happening as agreed?
          </p>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setWentWell(true)}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold transition-colors",
                wentWell
                  ? "border-emerald bg-[#E9F9F1] text-emerald-dark"
                  : "border-[#D7E0EA] bg-white text-navy hover:bg-surface-soft",
              )}
            >
              <ThumbsUp className="size-4 shrink-0" aria-hidden />
              Yes, it went well
              {wentWell ? (
                <Check className="ml-auto size-4" strokeWidth={3} aria-hidden />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setWentWell(false)}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold transition-colors",
                !wentWell
                  ? "border-danger bg-[#FEECEC] text-danger"
                  : "border-[#D7E0EA] bg-white text-navy hover:bg-surface-soft",
              )}
            >
              <Flag className="size-4 shrink-0" aria-hidden />
              No, report a problem
            </button>
          </div>
        </div>

        {wentWell ? (
          <>
            <div className="mt-5">
              <p className="text-sm font-semibold text-navy">
                Rate {booking.caregiverFirstName}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${value} stars`}
                      onClick={() => setRating(value)}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "size-7",
                          value <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-[#D7E0EA]",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => {
                  const selected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                        selected
                          ? "border-brand-blue bg-[#E8F0FE] text-brand-blue"
                          : "border-[#D7E0EA] bg-white text-navy/65",
                      )}
                    >
                      {selected ? (
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      ) : null}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="care-review"
                className="text-sm font-semibold text-navy"
              >
                Write a review
              </label>
              <textarea
                id="care-review"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                rows={4}
                placeholder="Share what went well to help other families."
                className="mt-2 w-full resize-y rounded-2xl border border-[#D7E0EA] bg-white px-3.5 py-3 text-sm leading-relaxed text-navy outline-none placeholder:text-navy/40 focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="mt-2 flex items-start gap-2 text-xs text-navy/50">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Reviews are optional and help other families choose care.
              </p>
            </div>
          </>
        ) : (
          <p className="mt-5 rounded-2xl bg-[#FEECEC] px-4 py-3 text-sm leading-relaxed text-danger">
            Tell us what went wrong in Messages or after you submit. CareVYA
            support can help if you need to stop care early.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 flex-1 rounded-full"
          >
            Skip review
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="h-11 flex-1 rounded-full"
          >
            {submitting ? "Submitting..." : "Submit →"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
