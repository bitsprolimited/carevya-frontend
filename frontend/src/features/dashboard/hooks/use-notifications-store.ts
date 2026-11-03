"use client";

import { create } from "zustand";
import {
  mockNotifications,
  type AppNotification,
} from "@/features/dashboard/data/mock-notifications";

type NotificationsState = {
  items: AppNotification[];
  unreadCount: () => number;
  markAllRead: () => void;
  markRead: (id: string) => void;
};

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: mockNotifications,
  unreadCount: () => get().items.filter((item) => item.unread).length,
  markAllRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, unread: false })),
    })),
  markRead: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    })),
}));
