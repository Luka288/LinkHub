import type { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import pool from "../config/db";
import { icoScrapper } from "../services/icon-scraper.service";
import {
  CreateLinkPayload,
  createLinkPayloadSchema,
  updateLinkPayloadSchema,
} from "@linkhub/shared";
import { z } from "zod";

// to fetch all the users links (protected)
export const getLinks = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
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
    next(e);
  }
};

// POST request to create new urls
export const createLink = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const parsed = createLinkPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    const { title, url } = parsed.data;

    let hostname: string;
    try {
      hostname = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return response.status(400).json({ error: "Invalid url" });
    }

    const existing = await pool.query(
      `SELECT favicon_url FROM links WHERE domain = $1 AND favicon_url IS NOT NULL LIMIT 1`,
      [hostname],
    );

    let faviconUrl: string | null = existing.rows[0]?.favicon_url ?? null;

    if (!faviconUrl) {
      faviconUrl = (await icoScrapper(url)) ?? null;
    }

    const result = await pool.query(
      `INSERT INTO links (user_id, title, url, domain, favicon_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, url, hostname, faviconUrl],
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// PUT request to modify current link (title, link)
export const modifyLink = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = updateLinkPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: z.treeifyError(parsed.error) });
      return;
    }

    const { title, url, id } = parsed.data;

    if (!title || !url) {
      response.status(400).json({ error: "Title and url are required" });
      return;
    }

    let hostname: string;

    try {
      hostname = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      response.status(400).json({ error: "Invalid url" });
      return;
    }

    const existing = await pool.query(
      `SELECT favicon_url FROM links WHERE domain = $1 AND favicon_url IS NOT NULL LIMIT 1`,
      [hostname],
    );

    const faviconUrl =
      existing.rows[0]?.favicon_url ?? (await icoScrapper(url)) ?? null;

    const result = await pool.query(
      `UPDATE links
       SET title = $1, url = $2, domain = $3, favicon_url = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, url, hostname, faviconUrl, id, userId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: "Link not found" });
      return;
    }

    response.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const toggleLink = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { id, is_active } = request.body;

    if (!userId) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      `UPDATE links
       SET is_active = $3
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, is_active],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: "Link not found" });
      return;
    }

    response.json(result.rows[0]);
  } catch (e) {
    next(e);
  }
};

export const deleteLink = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
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
    next(error);
  }
};
