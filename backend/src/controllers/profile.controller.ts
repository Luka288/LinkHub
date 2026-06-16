import type { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import pool from "../config/db";
import { icoScrapper } from "../services/icon-scraper.service";

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

    const [userResult, linksResult] = await Promise.all([
      pool.query(
        `
        SELECT id, username, email, bio, avatar_url
        FROM users
        WHERE id = $1
        `,
        [userId],
      ),
      pool.query(
        `
        SELECT *
        FROM links
        WHERE user_id = $1
        ORDER BY id
        `,
        [userId],
      ),
    ]);

    // scrapping website icons
    const links = await Promise.all(
      linksResult.rows.map(async (link) => ({
        ...link,
        favicon: await icoScrapper(link.url),
      })),
    );

    response.json({
      ...userResult.rows[0],
      links: links,
    });
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
