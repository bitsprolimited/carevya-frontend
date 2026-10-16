import { z } from "zod";
import {
  isValidNigerianMobile,
  NIGERIAN_PHONE_ERROR,
} from "@/lib/phone";

export const waitlistRoleSchema = z.enum(["care_seeker", "caregiver"]);

/** Hero waitlist: email + role (Care Seeker / Caregivers). */
export const heroWaitlistSchema = z.object({
  email: z.email("Enter a valid email address"),
  role: waitlistRoleSchema,
});

/** Full waitlist modal form. */
export const waitlistJoinSchema = z.object({
  role: waitlistRoleSchema,
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Enter a valid phone number")
    .refine(isValidNigerianMobile, { message: NIGERIAN_PHONE_ERROR }),
  state: z.string().min(1, "Select a state").max(60),
  lga: z
    .string()
    .trim()
    .min(2, "Select an LGA")
    .max(120, "LGA name is too long"),
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
    fullName?: string;
    phone?: string;
    state?: string;
    lga?: string;
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