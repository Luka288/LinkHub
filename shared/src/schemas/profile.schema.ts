import { z } from "zod";

export const updateUsernameSchema = z.object({
  username: z.string().trim().min(3).max(20),
});

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

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
});

export const updateProfileVisibilitySchema = z.object({
  is_public: z.boolean(),
});

export type UpdatePasswordPayload = z.infer<typeof updatePasswordSchema>;
export type UpdateUsernamePayload = z.infer<typeof updateUsernameSchema>;
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
export type UpdateProfileVisibilityPayload = z.infer<
  typeof updateProfileVisibilitySchema
>;
