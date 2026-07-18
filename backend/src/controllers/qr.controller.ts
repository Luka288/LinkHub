import type { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import qrcode from "qrcode";
import pool from "../config/db";

const getBaseUrl = (): string => {
  return process.env.VERCEL_ENV === "production"
    ? process.env.APP_BASE_URL_PROD!
    : process.env.APP_BASE_URL_DEV!;
};

export const generateQr = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    response.status(403).json({ error: "Forbidden unauthorized" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userId],
    );

    const user = result.rows[0];

    const baseUrl = getBaseUrl();
    const profileUrl = `${baseUrl}/p/${user.username}`;

    if (!user) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    const qr = await qrcode.toDataURL(profileUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300,
    });

    response.status(200).json({ qr });
  } catch (error) {
    response.status(500).json({ error: "Failed to generate QR code" });
  }
};
