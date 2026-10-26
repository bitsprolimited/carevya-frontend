"use client";

import {
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { AppNotification } from "@/features/dashboard/data/mock-notifications";
import { useNotificationsStore } from "@/features/dashboard/hooks/use-notifications-store";
import { cn } from "@/lib/utils";

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  const styles = {
    booking_accepted: {
      wrap: "bg-[#E9F9F1] text-emerald",
      Icon: CheckCircle2,
    },
    message: {
      wrap: "bg-[#EAF2FF] text-brand-blue",
      Icon: MessageSquare,
    },
    reminder: {
      wrap: "bg-[#FFF6E5] text-amber-600",
      Icon: CalendarDays,
    },
    booking_declined: {
      wrap: "bg-[#FEECEC] text-danger",
      Icon: XCircle,
    },
  }[type];

  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
        styles.wrap,
      )}
    >
      <styles.Icon className="size-4" aria-hidden />
    </span>
  );
}

export function NotificationsDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const items = useNotificationsStore((state) => state.items);
  const markAllRead = useNotificationsStore((state) => state.markAllRead);
  const markRead = useNotificationsStore((state) => state.markRead);
  const unreadCount = items.filter((item) => item.unread).length;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      id={menuId}
      role="dialog"
      aria-label="Notifications"
      className="absolute top-full right-0 z-40 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-xl"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#E8EEF5] px-4 py-3">
        <p className="text-sm font-bold text-navy">Notifications</p>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover disabled:text-navy/30"
        >
          Mark all as read
        </button>
      </div>

      <ul className="max-h-[22rem] overflow-y-auto py-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={() => {
                markRead(item.id);
                onClose();
              }}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#F8FAFC]"
            >
              <NotificationIcon type={item.type} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-navy">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-navy/60">
                  {item.body}
                </span>
                <span className="mt-1 block text-[0.6875rem] text-navy/40">
                  {item.timeLabel}
                </span>
              </span>
              {item.unread ? (
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-blue"
                  aria-label="Unread"
                />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-[#E8EEF5] px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => {
            markAllRead();
            onClose();
          }}
          className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
