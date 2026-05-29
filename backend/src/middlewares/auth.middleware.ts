import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      response
        .status(401)
        .json({ error: "invalid authorization headers, no token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      response.status(401).json({ error: "invalid token format." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    (request as any).user = decoded;

    next();
  } catch (e) {
    return response.status(401).json({ error: "Unauthorized" });
  }
};
