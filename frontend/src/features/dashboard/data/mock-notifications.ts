export type AppNotification = {
  id: string;
  type: "booking_accepted" | "message" | "reminder" | "booking_declined";
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
  href: string;
};

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "booking_accepted",
    title: "Emeka accepted your request",
    body: "Confirm the booking to secure Emeka’s live-in care.",
    timeLabel: "10 min ago",
    unread: true,
    href: "/careseeker/bookings/cv-2041/confirm",
  },
  {
    id: "n2",
    type: "message",
    title: "New message from Amina Bello",
    body: "“Would 10am work better for your mum?”",
    timeLabel: "1 hr ago",
    unread: true,
    href: "/careseeker/messages",
  },
  {
    id: "n3",
    type: "reminder",
    title: "Visit reminder",
    body: "Emeka Okonkwo · Live-in starts Thu 15 Oct.",
    timeLabel: "Today, 8:00 AM",
    unread: false,
    href: "/careseeker/bookings",
  },
  {
    id: "n4",
    type: "booking_declined",
    title: "Ngozi declined your request",
    body: "See similar caregivers near Yaba.",
    timeLabel: "Yesterday",
    unread: false,
    href: "/careseeker/caregivers",
  },
];
