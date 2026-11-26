export type CaregiverBookingStatus =
  | "successful"
  | "rejected"
  | "pending";

export type CaregiverRecentBooking = {
  id: string;
  name: string;
  avatarUrl: string;
  careType: string;
  date: string;
  time: string;
  price: string;
  status: CaregiverBookingStatus;
};

export type CaregiverAppointment = {
  id: string;
  dateLabel: string;
  timeRange: string;
  clientName: string;
  careType: string;
};

export type CaregiverRecentMessage = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  timeLabel: string;
  unread: boolean;
};

export type CaregiverNotificationType =
  | "new_request"
  | "payment"
  | "reminder"
  | "withdrawal";

export type CaregiverNotification = {
  id: string;
  type: CaregiverNotificationType;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
  href: string;
};

export const caregiverDashboardStats = {
  upcomingCare: "Friday, 25th October",
  newRequests: 5,
  earnings: "₦90,000",
  completedBookings: 31,
};

export const caregiverRecentBookings: CaregiverRecentBooking[] = [
  {
    id: "cb1",
    name: "Olumide",
    avatarUrl: "/default-avatar.svg",
    careType: "Clinical Care",
    date: "15 October",
    time: "08:00AM",
    price: "₦150,000",
    status: "successful",
  },
  {
    id: "cb2",
    name: "Olumide",
    avatarUrl: "/default-avatar.svg",
    careType: "Clinical Care",
    date: "15 October",
    time: "08:00AM",
    price: "₦150,000",
    status: "rejected",
  },
  {
    id: "cb3",
    name: "Olumide",
    avatarUrl: "/default-avatar.svg",
    careType: "Clinical Care",
    date: "15 October",
    time: "08:00AM",
    price: "₦150,000",
    status: "pending",
  },
  {
    id: "cb4",
    name: "Olumide",
    avatarUrl: "/default-avatar.svg",
    careType: "Clinical Care",
    date: "15 October",
    time: "08:00AM",
    price: "₦150,000",
    status: "successful",
  },
  {
    id: "cb5",
    name: "Olumide",
    avatarUrl: "/default-avatar.svg",
    careType: "Clinical Care",
    date: "15 October",
    time: "08:00AM",
    price: "₦150,000",
    status: "rejected",
  },
  {
    id: "cb6",
    name: "Olumide",
    avatarUrl: "/default-avatar.svg",
    careType: "Clinical Care",
    date: "15 October",
    time: "08:00AM",
    price: "₦150,000",
    status: "pending",
  },
];

export const caregiverAppointments: CaregiverAppointment[] = [
  {
    id: "ca1",
    dateLabel: "12th October",
    timeRange: "09:30am - 05:00pm",
    clientName: "Folake Adebayo",
    careType: "Non-clinical care",
  },
  {
    id: "ca2",
    dateLabel: "12th October",
    timeRange: "10:30am - 05:00pm",
    clientName: "Olumide King",
    careType: "Clinical care",
  },
];

export const caregiverRecentMessages: CaregiverRecentMessage[] = [
  {
    id: "cm1",
    name: "Grace Okafor",
    initials: "GO",
    preview:
      "Hi Emeka, I would like to confirm if you will be available for the care request?",
    timeLabel: "10:28 AM",
    unread: true,
  },
  {
    id: "cm2",
    name: "Miracle Brendan",
    initials: "MB",
    preview:
      "Hi Emeka, I would like to confirm if you will be available for the care request?",
    timeLabel: "09:15 AM",
    unread: true,
  },
];

export const caregiverNotifications: CaregiverNotification[] = [
  {
    id: "cn1",
    type: "new_request",
    title: "New request from Tobi Adeleke",
    body: "Overnight care for his father — respond within 21 hrs.",
    timeLabel: "10 min ago",
    unread: true,
    href: "/caregiver/requests",
  },
  {
    id: "cn2",
    type: "payment",
    title: "Grace paid for booking #CV-2041",
    body: "₦185,000 held — you'll get ₦166,500 after she confirms care.",
    timeLabel: "1 hr ago",
    unread: true,
    href: "/caregiver/earnings",
  },
  {
    id: "cn3",
    type: "reminder",
    title: "Care starts Thursday",
    body: "Live-in with Folake Adebayo — arrive by 8:00 AM.",
    timeLabel: "Today, 8:00 AM",
    unread: false,
    href: "/caregiver/schedule",
  },
  {
    id: "cn4",
    type: "withdrawal",
    title: "₦75,600 is ready to withdraw",
    body: "Kemi Ojo confirmed care for #CV-1877.",
    timeLabel: "Yesterday",
    unread: false,
    href: "/caregiver/earnings",
  },
];
