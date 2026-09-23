import { z } from "zod";

export const waitlistRoleSchema = z.enum(["family", "caregiver", "agency"]);

export const waitlistJoinSchema = z.object({
  email: z.email("Enter a valid email address"),
  location: z.string().min(2, "Enter your location").max(120),
  role: waitlistRoleSchema,
});

export type WaitlistRole = z.infer<typeof waitlistRoleSchema>;
export type WaitlistJoinInput = z.infer<typeof waitlistJoinSchema>;

export type WaitlistJoinResponse = {
  success: boolean;
  position?: number;
  message: string;
};
