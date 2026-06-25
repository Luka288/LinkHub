import type { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import bcrypt from "bcrypt";
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

    const [userResult, linksResult, preferencesResult] = await Promise.all([
      pool.query(
        `
        SELECT id, username, email, bio, avatar_url, is_public, display_name
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
        ORDER BY order_index
        `,
        [userId],
      ),

      pool.query(
        `
          SELECT preset_id, background, text_primary, text_secondary, button_bg, button_text, border, radius
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
    const { bio, avatar_url, display_name } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const fields: Record<string, unknown> = { bio, avatar_url, display_name };
    const updates = Object.entries(fields).filter(([, v]) => v !== undefined);

    if (updates.length === 0) {
      response.status(400).json({ error: "No fields to update." });
      return;
    }

    const setClause = updates
      .map(([key], i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = updates.map(([, v]) => v);

    const result = await pool.query(
      `UPDATE users 
        SET ${setClause}
        WHERE id = $${values.length + 1}
        RETURNING id, username, email, bio, avatar_url, display_name`,
      [...values, userId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: "User not found." });
      return;
    }

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
      border,
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
      INSERT INTO user_appearance (user_id, preset_id, background, text_primary, text_secondary, button_bg, button_text, border, radius, font)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id) DO UPDATE SET
        preset_id = EXCLUDED.preset_id,
        background = EXCLUDED.background,
        text_primary = EXCLUDED.text_primary,
        text_secondary = EXCLUDED.text_secondary,
        button_bg = EXCLUDED.button_bg,
        button_text = EXCLUDED.button_text,
        border = EXCLUDED.border,
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
        border,
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

export const updateUsername = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;

    const { username } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!username) {
      response.status(500).json({ error: "USERNAME WAS NOT PROVIDED" });
      return;
    }

    if (!username || username.trim().length < 3) {
      response
        .status(400)
        .json({ error: "Username must be at least 3 characters." });
      return;
    }

    const result = await pool.query(
      `UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username`,
      [username.trim(), userId],
    );

    response.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      response.status(409).json({ error: "Username is already taken." });
      return;
    }
    console.error(error);
    response.status(500).json({ error: "Server error." });
  }
};

export const updatePassword = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const { currentPassword, newPassword } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      response
        .status(400)
        .json({ error: "Password must be at least 8 characters." });
      return;
    }

    const userResult = await pool.query(
      `SELECT password FROM users WHERE id = $1`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      response.status(404).json({ error: "User not found." });
      return;
    }

    const isValid = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password,
    );

    if (!isValid) {
      response.status(401).json({ error: "Current password is incorrect." });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      hashed,
      userId,
    ]);

    response.json({ success: true });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error." });
  }
};

export const updateProfileVisibility = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const { is_public } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (typeof is_public !== "boolean") {
      response.status(500).json({ error: "Invalid status" });
      return;
    }

    const result = await pool.query(
      `UPDATE users SET is_public = $1 WHERE id = $2 RETURNING id, is_public`,
      [is_public, userId],
    );

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error." });
  }
};

export const reorderLinks = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  const client = await pool.connect();

  try {
    const userId = request.user?.userId;
    const { links } = request.body as {
      links: { id: number; order_index: number }[];
    };

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!Array.isArray(links) || links.length === 0) {
      response.status(400).json({ error: "links must be a non-empty array." });
      return;
    }

    for (const link of links) {
      if (typeof link.id !== "number" || typeof link.order_index !== "number") {
        response
          .status(400)
          .json({ error: "Each link requires numeric id and order_index." });
        return;
      }
    }

    const ids = links.map((l) => l.id);

    await client.query("BEGIN");

    const caseClause = links
      .map((_, i) => `WHEN id = $${i * 2 + 1} THEN $${i * 2 + 2}::int`)
      .join(" ");
    const values = links.flatMap((l) => [l.id, l.order_index]);

    const result = await client.query(
      `
      UPDATE links
      SET order_index = CASE ${caseClause} END
      WHERE user_id = $${values.length + 1}
        AND id = ANY($${values.length + 2})
      RETURNING id, order_index
      `,
      [...values, userId, ids],
    );

    if (result.rows.length !== links.length) {
      await client.query("ROLLBACK");
      response
        .status(403)
        .json({ error: "One or more links could not be reordered." });
      return;
    }

    await client.query("COMMIT");
    response.json(result.rows);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    response.status(500).json({ error: "Server error." });
  } finally {
    client.release();
  }
};
