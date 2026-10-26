"use client";

import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Caregiver } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

export function CaregiverCard({
  caregiver,
  onToggleSave,
}: {
  caregiver: Caregiver;
  onToggleSave?: (id: string) => void;
}) {
  return (
    <article className="flex w-[15.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm sm:w-[16.5rem]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-soft">
        <Link
          href={`/careseeker/caregivers/${caregiver.id}`}
          className="absolute inset-0"
          aria-label={`View ${caregiver.name}`}
        >
          <Image
            src={caregiver.imageUrl}
            alt=""
            fill
            sizes="264px"
            className="object-cover object-top"
          />
        </Link>
        <button
          type="button"
          aria-label={caregiver.saved ? "Remove from saved" : "Save caregiver"}
          onClick={() => onToggleSave?.(caregiver.id)}
          className="absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/95 text-navy shadow-sm transition-colors hover:bg-white"
        >
          <Heart
            className={cn(
              "size-4",
              caregiver.saved ? "fill-danger text-danger" : "text-navy/70",
            )}
            aria-hidden
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-bold text-navy">
            <Link
              href={`/careseeker/caregivers/${caregiver.id}`}
              className="hover:text-brand-blue"
            >
              {caregiver.name}
            </Link>
          </h3>
          {caregiver.verified ? (
            <BadgeCheck
              className="size-4 shrink-0 fill-emerald text-white"
              aria-label="Verified"
            />
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-navy/55">{caregiver.categoryLabel}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-navy/70">
          <span className="inline-flex items-center gap-1">
            <Star
              className="size-3.5 fill-amber-400 text-amber-400"
              aria-hidden
            />
            {caregiver.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 text-navy/45" aria-hidden />
            {caregiver.area}, {caregiver.city}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="text-xs font-semibold text-navy">
            {caregiver.priceLabel}
          </p>
          <Link
            href={`/careseeker/caregivers/${caregiver.id}`}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-[#D7E0EA] bg-white px-3 text-xs font-semibold text-navy transition-colors hover:bg-surface-soft"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
