import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorMiddleWare = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof ZodError) {
    response.status(400).json({
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  response.status(500).json({
    message: "Internal server error",
  });
};
