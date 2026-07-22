import { z } from "zod";

export const loginPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerPayloadSchema = z.object({
  username: z.string().min(3).max(16),
  email: z.email(),
  password: z.string().min(8).max(16),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
