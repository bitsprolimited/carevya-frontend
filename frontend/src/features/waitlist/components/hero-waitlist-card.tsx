"use client";

import { Button } from "@/components/ui/button";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";

export function HeroWaitlistCard() {
  const openModal = useWaitlistStore((state) => state.openModal);

  return (
    <Button
      type="button"
      size="lg"
      onClick={openModal}
      className="h-12 rounded-full px-8 text-base sm:h-14 sm:px-10 sm:text-lg"
    >
      Get Started Now
    </Button>
  );
}
