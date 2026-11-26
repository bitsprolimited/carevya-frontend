"use client";

import { create } from "zustand";
import {
  caregiverBookingsSeed,
  type CaregiverBooking,
} from "@/features/caregiver-dashboard/data/mock-bookings";

type CheckInPayload = {
  dateLabel: string;
  timeLabel: string;
  note: string;
};

type CaregiverBookingsState = {
  items: CaregiverBooking[];
  checkedIn: Record<string, CheckInPayload>;
  getById: (id: string) => CaregiverBooking | undefined;
  markCheckedIn: (id: string, payload: CheckInPayload) => void;
};

export const useCaregiverBookingsStore = create<CaregiverBookingsState>(
  (set, get) => ({
    items: caregiverBookingsSeed.map((item) => ({
      ...item,
      emergencyContacts: item.emergencyContacts.map((contact) => ({
        ...contact,
      })),
      careseekerContact: { ...item.careseekerContact },
      timeline: item.timeline.map((step) => ({ ...step })),
    })),
    checkedIn: {},
    getById: (id) => get().items.find((item) => item.id === id),
    markCheckedIn: (id, payload) =>
      set((state) => ({
        checkedIn: { ...state.checkedIn, [id]: payload },
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                statusBanner: "Checked in · care in progress",
                checkInUnlocked: false,
                checkInUnlockHint: "You’ve already checked in for this booking.",
                timeline: item.timeline.map((step) =>
                  step.id === "starts"
                    ? { ...step, state: "done" as const, detail: payload.dateLabel }
                    : step,
                ),
              }
            : item,
        ),
      })),
  }),
);
