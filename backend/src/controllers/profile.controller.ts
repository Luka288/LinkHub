import type { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import pool from "../config/db";

// private profile endpoint
export const getProfile = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      "SELECT id, username, email, bio, avatar_url FROM users WHERE id = $1",
      [userId],
    );

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error." });
  }
};

export const updateProfile = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const { bio, avatar_url } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      `UPDATE users 
   SET bio = $1, avatar_url = $2 
   WHERE id = $3
   RETURNING id, username, email, bio, avatar_url`,
      [bio, avatar_url, userId],
    );

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error." });
  }
};
