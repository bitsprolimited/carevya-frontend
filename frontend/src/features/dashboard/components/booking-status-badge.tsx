import type { BookingStatus } from "@/features/dashboard/types/bookings";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  BookingStatus,
  { label: string; className: string; dot: string }
> = {
  accepted: {
    label: "Accepted",
    className: "bg-[#E9F9F1] text-emerald-dark",
    dot: "bg-emerald",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[#E9F9F1] text-emerald-dark",
    dot: "bg-emerald",
  },
  pending: {
    label: "Pending",
    className: "bg-[#FFF6E5] text-amber-700",
    dot: "bg-amber-500",
  },
  declined: {
    label: "Declined",
    className: "bg-[#FEECEC] text-danger",
    dot: "bg-danger",
  },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        style.className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      {style.label}
    </span>
  );
}
