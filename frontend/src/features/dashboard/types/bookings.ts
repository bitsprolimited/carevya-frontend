export type BookingStatus = "pending" | "accepted" | "declined";

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
  dateTimeLabel: string;
  priceLabel: string;
  priceAmount: number;
  status: BookingStatus;
  recipientName: string;
  recipientRelationship: string;
  scheduleLabel: string;
  datesLabel: string;
  durationLabel: string;
  locationLabel: string;
  agreedPriceLabel: string;
  privacyNote: string;
  timeline: BookingTimelineStep[];
  timeProposal?: BookingTimeProposal;
  confirmByLabel?: string;
};
