import type { Caregiver, DashboardFilters } from "@/features/dashboard/types";

export function filterCaregivers(
  caregivers: Caregiver[],
  filters: DashboardFilters,
  options?: { liveInChip?: boolean },
): Caregiver[] {
  let list = caregivers.filter((caregiver) => {
    if (
      filters.recipientId &&
      !caregiver.recipientIds.includes(filters.recipientId)
    ) {
      return false;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(caregiver.category)
    ) {
      return false;
    }

    const arrangements = [...filters.arrangements];
    if (options?.liveInChip && !arrangements.includes("live_in")) {
      arrangements.push("live_in");
    }
    if (
      arrangements.length > 0 &&
      (!caregiver.arrangement ||
        !arrangements.includes(caregiver.arrangement))
    ) {
      return false;
    }

    if (filters.gender !== "any" && caregiver.gender !== filters.gender) {
      return false;
    }

    if (
      filters.languages.length > 0 &&
      !filters.languages.some((lang) => caregiver.languages.includes(lang))
    ) {
      return false;
    }

    return true;
  });

  list = [...list].sort((a, b) => {
    switch (filters.sort) {
      case "highest_rated":
        return b.rating - a.rating;
      case "price_asc":
        return a.priceAmount - b.priceAmount;
      case "price_desc":
        return b.priceAmount - a.priceAmount;
      case "nearest":
        return a.area.localeCompare(b.area);
      case "most_experienced":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return list;
}
