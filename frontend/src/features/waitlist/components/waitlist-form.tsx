"use client";

import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";

/** Legacy form entry — opens the glass waitlist modal. */
export function WaitlistForm() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <Button
      type="button"
      onClick={openModal}
      className="w-full rounded-full sm:w-auto"
    >
      Join Waitlist
    </Button>
  );
}
