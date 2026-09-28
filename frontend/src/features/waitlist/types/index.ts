import { z } from "zod";

export const waitlistRoleSchema = z.enum(["family", "caregiver", "agency"]);

/** Hero waitlist: email + role (Care Seeker / Caregivers). */
export const heroWaitlistSchema = z.object({
  email: z.email("Enter a valid email address"),
  role: waitlistRoleSchema,
});

export const waitlistJoinSchema = heroWaitlistSchema.extend({
  location: z.string().min(2, "Enter your location").max(120).optional(),
});

export type WaitlistRole = z.infer<typeof waitlistRoleSchema>;
export type HeroWaitlistInput = z.infer<typeof heroWaitlistSchema>;
export type WaitlistJoinInput = z.infer<typeof waitlistJoinSchema>;

export type WaitlistJoinResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
    position: number;
    referralCode: string;
    createdAt: string;
  };
  meta: {
    alreadyJoined: boolean;
    roleChanged: boolean;
  };
};

export type WaitlistStatsResponse = {
  success: boolean;
  data: {
    careSeekers: number;
    caregivers: number;
    total: number;
  };
  meta: {
    asOf: string;
  };
};

export type HealthResponse = {
  status: string;
  uptime: number;
  timestamp: string;
};