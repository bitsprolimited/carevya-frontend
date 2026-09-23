import {
  Award,
  BadgeCheck,
  Heart,
  IdCard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { VERIFICATION_ITEMS } from "@/features/verification/services/verification-data";
import type { VerificationLayer } from "@/features/verification/types";

const icons: Record<VerificationLayer, LucideIcon> = {
  identity: IdCard,
  background: ShieldCheck,
  experience: Award,
  family_feedback: Heart,
  carevya_verified: BadgeCheck,
};

export function VerificationGrid() {
  return (
    <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-0">
      {VERIFICATION_ITEMS.map((item) => {
        const Icon = icons[item.id];
        return (
          <li key={item.id} className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald/15 text-emerald-dark sm:size-16">
              <Icon aria-hidden className="size-6 sm:size-7" strokeWidth={1.75} />
            </span>
            <p className="mt-4 text-sm font-bold text-navy sm:text-base">
              {item.title}
            </p>
            <p className="mt-1.5 max-w-[11rem] text-xs leading-relaxed text-muted sm:text-sm">
              {item.description}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
