"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { signOut } from "@/lib/auth-client";

export function LogoutConfirmModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut();
      onClose();
      router.push("/home");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-sm">
      <div className="rounded-2xl border border-[#E8EEF5] bg-white px-5 py-6 text-center shadow-xl sm:px-6">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-[#FEECEC] text-danger">
          <LogOut className="size-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-navy">
          Log out of CareVYA?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/60">
          You&apos;ll need to sign in again to see your bookings and messages.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
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
            onClick={() => void handleLogout()}
            disabled={loading}
            className="h-11 flex-1 rounded-full bg-[#FEECEC] text-danger shadow-none hover:bg-[#FDD8D8]"
          >
            {loading ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
