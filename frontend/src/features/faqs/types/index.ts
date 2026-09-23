import { z } from "zod";

export const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
