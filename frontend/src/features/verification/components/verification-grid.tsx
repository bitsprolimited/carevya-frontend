import {
  BadgeCheck,
  ClipboardCheck,
  IdCard,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { VERIFICATION_ITEMS } from "@/features/verification/services/verification-data";
import type { VerificationLayer } from "@/features/verification/types";

const icons: Record<VerificationLayer, LucideIcon> = {
  identity: IdCard,
  background: ShieldCheck,
  experience: ClipboardCheck,
  family_feedback: MessagesSquare,
  periodic_review: BadgeCheck,
};

export function VerificationGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {VERIFICATION_ITEMS.map((item) => {
        const Icon = icons[item.id];
        return (
          <li
            key={item.id}
            className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm"
          >
            <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald/10 text-emerald-dark">
              <Icon aria-hidden className="size-5" />
            </span>
            <p className="text-sm font-semibold text-navy">{item.title}</p>
            <p className="mt-1 text-xs text-muted">{item.description}</p>
          </li>
        );
      })}
    </ul>
  );
}
