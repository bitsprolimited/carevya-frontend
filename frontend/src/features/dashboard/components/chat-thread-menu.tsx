"use client";

import {
  Ban,
  Flag,
  MoreVertical,
  Pin,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ChatThreadMenu({
  caregiverId,
  pinned,
  onPin,
  onBlock,
  onReport,
  onDelete,
}: {
  caregiverId: string;
  pinned?: boolean;
  onPin: () => void;
  onBlock: () => void;
  onReport: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Chat actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-9 items-center justify-center rounded-full text-navy/60 hover:bg-surface-soft hover:text-navy"
      >
        <MoreVertical className="size-4" aria-hidden />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-[#E8EEF5] bg-white py-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-navy hover:bg-surface-soft"
            onClick={() => {
              onPin();
              setOpen(false);
            }}
          >
            <Pin className="size-4 text-navy/60" aria-hidden />
            {pinned ? "Unpin chat" : "Pin chat"}
          </button>
          <Link
            href={`/careseeker/caregivers/${caregiverId}`}
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-navy hover:bg-surface-soft"
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-4 text-navy/60" aria-hidden />
            View profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-danger hover:bg-danger/5"
            onClick={() => {
              onBlock();
              setOpen(false);
            }}
          >
            <Ban className="size-4" aria-hidden />
            Block user
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-danger hover:bg-danger/5"
            onClick={() => {
              onReport();
              setOpen(false);
            }}
          >
            <Flag className="size-4" aria-hidden />
            Report user
          </button>
          <button
            type="button"
            role="menuitem"
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-danger hover:bg-danger/5",
            )}
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete chat
          </button>
        </div>
      ) : null}
    </div>
  );
}
