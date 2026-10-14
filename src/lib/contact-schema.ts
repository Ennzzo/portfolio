import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: campo invisível que só bots preenchem.
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
