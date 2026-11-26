"use client";

import { create } from "zustand";
import {
  caregiverNotifications,
  type CaregiverNotification,
} from "@/features/caregiver-dashboard/data/mock";

type CaregiverNotificationsState = {
  items: CaregiverNotification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
};

export const useCaregiverNotificationsStore =
  create<CaregiverNotificationsState>((set) => ({
    items: caregiverNotifications.map((item) => ({ ...item })),
    markRead: (id) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, unread: false } : item,
        ),
      })),
    markAllRead: () =>
      set((state) => ({
        items: state.items.map((item) => ({ ...item, unread: false })),
      })),
  }));
