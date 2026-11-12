import type { CaregiverProfile } from "@/features/dashboard/types/caregiver-profile";

/**
 * Caregiver detail profiles will come from Nest when a caregivers API ships.
 * Until then return null so the UI never falls back to seed catalogs.
 */
export function getCaregiverProfile(_id: string): CaregiverProfile | null {
  return null;
}

export function getCaregiverProfileIds(): string[] {
  return [];
}
