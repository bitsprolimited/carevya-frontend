import { z } from "zod";

export const verificationLayerSchema = z.enum([
  "identity",
  "background",
  "experience",
  "family_feedback",
  "periodic_review",
]);

export type VerificationLayer = z.infer<typeof verificationLayerSchema>;

export type VerificationItem = {
  id: VerificationLayer;
  title: string;
  description: string;
};
