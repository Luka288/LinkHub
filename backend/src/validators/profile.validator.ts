import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().max(300).optional(),

  display_name: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[\p{L}0-9 _-]+$/u)
    .optional(),

  avatar_url: z.string().url().optional(),
});
