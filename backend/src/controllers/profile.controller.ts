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

    const [userResult, linksResult, preferencesResult] = await Promise.all([
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

      pool.query(
        `
        SELECT preset_id, background, text_primary, text_secondary, button_bg, button_text, radius
        FROM user_appearance
        WHERE user_id = $1
        `,
        [userId],
      ),
    ]);

    // scrapping website icons
    const links = await Promise.all(
      linksResult.rows.map(async (link) => ({
        ...link,
      })),
    );

    response.json({
      ...userResult.rows[0],
      links: links,
      preferences: preferencesResult.rows[0] ?? null,
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

export const updateAppearance = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const {
      preset_id,
      background,
      text_primary,
      text_secondary,
      button_bg,
      button_text,
      radius,
      font,
    } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validRadii = ["sm", "md", "lg", "full"];
    if (radius && !validRadii.includes(radius)) {
      response.status(400).json({ error: "Invalid radius value." });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO user_appearance (user_id, preset_id, background, text_primary, text_secondary, button_bg, button_text, radius, font)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) DO UPDATE SET
        preset_id = EXCLUDED.preset_id,
        background = EXCLUDED.background,
        text_primary = EXCLUDED.text_primary,
        text_secondary = EXCLUDED.text_secondary,
        button_bg = EXCLUDED.button_bg,
        button_text = EXCLUDED.button_text,
        radius = EXCLUDED.radius,
        font = EXCLUDED.font,
        updated_at = now()
      RETURNING *
      `,
      [
        userId,
        preset_id ?? null,
        background,
        text_primary,
        text_secondary,
        button_bg,
        button_text,
        radius,
        font,
      ],
    );

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error." });
  }
};
