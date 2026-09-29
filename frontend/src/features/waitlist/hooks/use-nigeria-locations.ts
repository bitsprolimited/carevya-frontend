"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNigeriaLocations } from "@/features/waitlist/services/nigeria-locations-service";

export const nigeriaLocationsKey = ["nigeria", "locations"] as const;

export function useNigeriaLocations() {
  return useQuery({
    queryKey: nigeriaLocationsKey,
    queryFn: fetchNigeriaLocations,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    retry: 2,
  });
}
