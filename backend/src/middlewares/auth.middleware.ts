import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const token = request.cookies?.token;

    if (!token) {
      response.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    (request as any).user = decoded;
    next();
  } catch {
    response.status(401).json({ error: "Unauthorized" });
  }
};
