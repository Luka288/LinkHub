import type { Request } from "express";
import { AuthUser } from "./auth";

export type AuthenticatedRequest = Request & { user?: AuthUser };
