"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="fixed inset-0 bg-[#C5CED8]/55 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-10 w-full max-w-[26rem] animate-in fade-in zoom-in-95 duration-200",
            className,
          )}
        >
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-navy/40 shadow-sm transition-colors hover:bg-surface-soft hover:text-navy"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
