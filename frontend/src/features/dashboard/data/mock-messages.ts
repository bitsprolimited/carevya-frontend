import { assets } from "@/lib/assets";
import type { MessageThread } from "@/features/dashboard/types/messages";

export const mockMessageThreads: MessageThread[] = [
  {
    id: "amara",
    caregiverId: "amina",
    caregiverName: "Amara Okafor",
    caregiverFirstName: "Amara",
    avatarUrl: assets.aboutMemberDesD,
    verified: true,
    online: true,
    preview: "Hi Grace! I'm looking forward to our visit on Thursday...",
    timeLabel: "Tuesday 1:55pm",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        from: "seeker",
        body: "Hi Amara! I'm looking forward to our visit on Thursday, it would be a pleasure to see you.",
        timeLabel: "9:25am",
      },
      {
        id: "m2",
        from: "seeker",
        body: "Hello Amara, I will be very much available by 3pm, we can meet by that time.",
        timeLabel: "9:25am",
      },
      {
        id: "m3",
        from: "seeker",
        body: "I would like to know what time would be convenient for you?",
        timeLabel: "9:25am",
      },
      {
        id: "m4",
        from: "caregiver",
        body: "Hello Grace! I look forward to meeting you too, what time would best for us to meet?",
        timeLabel: "9:25am",
      },
    ],
  },
  {
    id: "amanda",
    caregiverId: "blessing",
    caregiverName: "Amanda Judge",
    caregiverFirstName: "Amanda",
    avatarUrl: assets.homeCommitmentPortraitA,
    verified: true,
    online: false,
    preview: "Would 10am work better for you?",
    timeLabel: "Monday 4:12pm",
    unreadCount: 0,
    messages: [
      {
        id: "a1",
        from: "caregiver",
        body: "Thanks for reaching out, Grace. Would 10am work better for you?",
        timeLabel: "4:12pm",
      },
      {
        id: "a2",
        from: "seeker",
        body: "Yes, 10am works well. Looking forward to it.",
        timeLabel: "4:20pm",
      },
    ],
  },
  {
    id: "grace-aminat",
    caregiverId: "ngozi",
    caregiverName: "Grace Aminat",
    caregiverFirstName: "Grace",
    avatarUrl: assets.aboutMemberDevO,
    verified: true,
    online: false,
    preview: "What time would be convenient for the intro call?",
    timeLabel: "Sunday 6:40pm",
    unreadCount: 1,
    messages: [
      {
        id: "g1",
        from: "caregiver",
        body: "What time would be convenient for the intro call?",
        timeLabel: "6:40pm",
      },
    ],
  },
];
