"use client";

import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";

export function HeroWaitlistCard() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <Button
      type="button"
      onClick={openModal}
      className="h-10 shrink-0 rounded-full px-5 text-sm sm:h-11 sm:px-6 sm:text-base md:px-8"
    >
      Join Waitlist
    </Button>
  );
}
