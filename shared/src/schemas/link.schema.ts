import { z } from "zod";

export const userLinkSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1),
  url: z.url(),
  is_active: z.boolean(),
  click_count: z.number().default(0),
  order_index: z.number(),
  created_at: z.string(),
  favicon_url: z.string(),
  domain: z.string().nullable(),
});

export const createLinkPayloadSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
});

export const updateLinkPayloadSchema = z.object({
  title: z.string().optional(),
  url: z.url().optional(),
  is_active: z.boolean().optional(),
  id: z.number().optional(),
  userId: z.number().optional(),
});

export const deleteLinkPayloadSchema = z.object({
  id: z.number(),
});

export type UserLink = z.infer<typeof userLinkSchema>;
export type CreateLinkPayload = z.infer<typeof createLinkPayloadSchema>;
export type UpdateLinkPayload = z.infer<typeof updateLinkPayloadSchema>;
export type DeleteLinkPayload = z.infer<typeof deleteLinkPayloadSchema>;
