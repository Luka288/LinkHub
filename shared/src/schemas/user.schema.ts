import { z } from "zod";
import { userLinkSchema } from "./link.schema";

export const themeResponseSchema = z.object({
  preset_id: z.string(),
  label: z.string(),
  background: z.string(),
  text_primary: z.string(),
  text_secondary: z.string(),
  button_bg: z.string(),
  button_text: z.string(),
  border: z.string(),
  radius: z.enum(["sm", "md", "lg", "full"]),
});

export const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  is_public: z.boolean(),
  links: z.array(userLinkSchema),
  display_name: z.string(),
  preferences: themeResponseSchema.nullable(),
});

export const authResponseSchema = z.object({
  access_token: z.string(),
  user: userResponseSchema,
});

export type ThemePreset = z.infer<typeof themeResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
