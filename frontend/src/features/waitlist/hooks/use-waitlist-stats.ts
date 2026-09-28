"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWaitlistStats } from "@/features/waitlist/services/waitlist-service";
import { useWaitlistStore } from "@/features/waitlist/hooks/use-waitlist-store";

export const waitlistStatsKey = ["waitlist", "stats"] as const;

export function useWaitlistStats() {
  const setCount = useWaitlistStore((state) => state.setCount);

  const query = useQuery({
    queryKey: waitlistStatsKey,
    queryFn: getWaitlistStats,
    staleTime: 60_000, // counts don't need to be real-time
    select: (res) => res.data,
  });

  // Keep the existing store in sync so components that read `count`
  // from useWaitlistStore show the real total.
  useEffect(() => {
    if (query.data) setCount(query.data.total);
  }, [query.data, setCount]);

  return query;
}