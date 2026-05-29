import type { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import pool from "../config/db";

// to fetch all the users links (protected)
export const getLinks = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query("SELECT * FROM links WHERE user_id = $1", [
      userId,
    ]);

    response.json(result.rows);
  } catch (e) {
    console.error(e);
    response.status(500).json({ error: "Server error" });
  }
};

// POST request to create new urls
export const createLink = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const { title, url } = request.body;

    const result = await pool.query(
      `INSERT INTO links (user_id, title, url)
     VALUES ($1, $2, $3)
     RETURNING *`,
      [userId, title, url],
    );

    response.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error" });
  }
};

// PUT request to modify current link (title, link)
export const modifyLink = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;

    const { id } = request.params;
    const { title, url } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!title || !url) {
      response.status(400).json({ error: "Title and url are required" });
      return;
    }

    const result = await pool.query(
      `UPDATE links
       SET title = $1, url = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, url, id, userId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: "Link not found" });
      return;
    }

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
};

export const toggleLink = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const { id } = request.params;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      `UPDATE links
       SET is_active = NOT is_active
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: "Link not found" });
      return;
    }

    response.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    response.status(500).json({ error: "Server error" });
  }
};

export const deleteLink = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  try {
    const userId = request.user?.userId;
    const { id } = request.params;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      `DELETE FROM links
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: "Link not found" });
      return;
    }

    response.json({ message: "Link deleted" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
};
