import type { Request, Response } from "express";
import pool from "../config/db";

export const getPublicProfile = async (
  request: Request,
  response: Response,
) => {
  try {
    const { username } = request.params;

    const userResult = await pool.query(
      "SELECT id, username, bio, avatar_url, is_public, display_name FROM users WHERE username = $1",
      [username],
    );

    if (userResult.rows.length === 0) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    const user = userResult.rows[0];

    const linksResult = await pool.query(
      "SELECT * FROM links WHERE user_id = $1 AND is_active = true",
      [user.id],
    );

    const preferences = await pool.query(
      `
        SELECT preset_id, background, text_primary, text_secondary, button_bg, button_text, border, radius
        FROM user_appearance
        WHERE user_id = $1
        `,
      [user.id],
    );

    response.json({
      user,
      links: linksResult.rows,
      preferences: preferences.rows[0] ?? null,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error" });
  }
};

// method to track which user does user clicked
export const trackClick = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      "UPDATE links SET click_count = click_count + 1 WHERE id = $1 RETURNING click_count",
      [id],
    );

    response.json({
      message: "Url clicked",
      click_count: result.rows[0].click_count,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error" });
  }
};
