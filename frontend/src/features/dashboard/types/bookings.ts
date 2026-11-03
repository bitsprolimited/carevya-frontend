export type BookingStatus =
  | "pending"
  | "accepted"
  | "confirmed"
  | "declined";

export type BookingTimelineStep = {
  id: string;
  title: string;
  detail: string;
  state: "done" | "current" | "upcoming";
};

export type BookingTimeProposal = {
  askedLabel: string;
  askedRange: string;
  suggestedBy: string;
  suggestedLabel: string;
  suggestedRange: string;
  message: string;
  messageAuthor: string;
  messageAvatarUrl: string;
};

export type Booking = {
  id: string;
  reference: string;
  requestedOn: string;
  caregiverId: string;
  caregiverName: string;
  caregiverFirstName: string;
  avatarUrl: string;
  verified: boolean;
  careType: string;
  careCategoryLabel: string;
  dateTimeLabel: string;
  careStartsLabel: string;
  priceLabel: string;
  priceAmount: number;
  listedPriceLabel?: string;
  status: BookingStatus;
  recipientName: string;
  recipientRelationship: string;
  scheduleLabel: string;
  datesLabel: string;
  datesShortLabel: string;
  durationLabel: string;
  locationLabel: string;
  agreedPriceLabel: string;
  agreedOnLabel: string;
  privacyNote: string;
  timeline: BookingTimelineStep[];
  timeProposal?: BookingTimeProposal;
  confirmByLabel?: string;
  paymentNote?: string;
};

export function confirmedTimeline(booking: Booking): BookingTimelineStep[] {
  return [
    {
      id: "c1",
      title: "Request accepted",
      detail: "Sat 10 Oct",
      state: "done",
    },
    {
      id: "c2",
      title: "Price agreed in chat",
      detail: `${booking.agreedPriceLabel} for ${booking.durationLabel}`,
      state: "done",
    },
    {
      id: "c3",
      title: "Booking confirmed",
      detail: "Mon 12 Oct · 2:15 PM",
      state: "done",
    },
    {
      id: "c4",
      title: "Care starts",
      detail: booking.careStartsLabel,
      state: "current",
    },
    {
      id: "c5",
      title: "Care ends · leave a review",
      detail: "Sat 14 Nov",
      state: "upcoming",
    },
  ];
}
