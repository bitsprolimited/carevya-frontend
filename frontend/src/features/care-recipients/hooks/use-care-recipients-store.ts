"use client";

import { create } from "zustand";
import {
  listCareRecipients,
  type CareRecipientListItem,
} from "@/features/care-recipients/services/care-recipients-service";
import type { CareRecipient } from "@/features/dashboard/types";
import { assets } from "@/lib/assets";

function ageFromDob(dob?: string | null): number {
  if (!dob) return 0;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const m = now.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age -= 1;
  return Math.max(0, age);
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

export function mapListItemToRecipient(
  item: CareRecipientListItem,
): CareRecipient {
  const completeness = item.profileCompleteness;
  return {
    id: item.id,
    firstName: firstName(item.fullName),
    fullName: item.fullName,
    relationship: item.relationship
      ? item.relationship.charAt(0).toUpperCase() + item.relationship.slice(1)
      : "Loved one",
    age: ageFromDob(item.dateOfBirth),
    area: item.addressLga ?? "",
    city: item.addressState ?? "",
    avatarUrl: item.photoUrl || assets.defaultAvatar,
    ...(completeness &&
    typeof completeness.completed === "number" &&
    typeof completeness.total === "number" &&
    completeness.completed < completeness.total
      ? {
          profileProgress: {
            completed: completeness.completed,
            total: completeness.total,
          },
        }
      : {}),
  };
}

type CareRecipientsState = {
  items: CareRecipient[];
  raw: CareRecipientListItem[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  selectedId: string | null;
  load: () => Promise<void>;
  setSelectedId: (id: string | null) => void;
  refresh: () => Promise<void>;
};

export const useCareRecipientsStore = create<CareRecipientsState>((set, get) => ({
  items: [],
  raw: [],
  loading: false,
  error: null,
  loaded: false,
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const result = await listCareRecipients();
      const raw = result.recipients ?? [];
      const items = raw.map(mapListItemToRecipient);
      const selectedId =
        get().selectedId && items.some((item) => item.id === get().selectedId)
          ? get().selectedId
          : (items[0]?.id ?? null);
      set({
        raw,
        items,
        selectedId,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (err) {
      set({
        loading: false,
        loaded: true,
        error: err instanceof Error ? err.message : "Failed to load recipients",
        items: [],
        raw: [],
        selectedId: null,
      });
    }
  },
  refresh: async () => {
    set({ loaded: false });
    await get().load();
  },
}));
