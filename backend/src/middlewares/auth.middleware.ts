import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      response.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    request.user = decoded;
    next();
  } catch {
    response.status(401).json({ error: "Unauthorized" });
  }
};
