export type ChatMessage = {
  id: string;
  from: "seeker" | "caregiver";
  body: string;
  timeLabel: string;
};

export type MessageThread = {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverFirstName: string;
  avatarUrl: string;
  verified: boolean;
  online: boolean;
  preview: string;
  timeLabel: string;
  unreadCount: number;
  pinned?: boolean;
  messages: ChatMessage[];
};
