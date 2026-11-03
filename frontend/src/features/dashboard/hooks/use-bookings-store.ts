"use client";

import { create } from "zustand";
import { mockBookings } from "@/features/dashboard/data/mock-bookings";
import {
  confirmedTimeline,
  type Booking,
} from "@/features/dashboard/types/bookings";

type BookingsState = {
  bookings: Booking[];
  getById: (id: string) => Booking | undefined;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  removeBooking: (id: string) => void;
  confirmBooking: (id: string) => Booking | undefined;
};

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: mockBookings,
  getById: (id) => get().bookings.find((item) => item.id === id),
  updateBooking: (id, patch) =>
    set((state) => ({
      bookings: state.bookings.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((item) => item.id !== id),
    })),
  confirmBooking: (id) => {
    const booking = get().getById(id);
    if (!booking) return undefined;
    const next: Booking = {
      ...booking,
      status: "confirmed",
      timeProposal: undefined,
      paymentNote: `Pay ${booking.caregiverFirstName} directly, as agreed. Agreed in chat · Mon 12 Oct.`,
      timeline: confirmedTimeline(booking),
    };
    set((state) => ({
      bookings: state.bookings.map((item) => (item.id === id ? next : item)),
    }));
    return next;
  },
}));
