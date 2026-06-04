import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";

/*
  TODO: Implement silent refresh (dual token strategy)
  - login returns access_token (1h, memory) + refresh_token (7d, httpOnly cookie)
  - on app init POST /auth/refresh instead of GET /profile
    ├── cookie valid → restore session silently ✅
    └── no cookie   → guest, no 401 alert ✅
  - on 401 → interceptor auto-refreshes → retries request
*/

const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (request: Request, response: Response) => {
  const { username, email, password } = request.body;

  try {
    const existingUser = await pool.query(
      "SELECT id, username, email FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );

    // username, email check
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];

      if (user.email === email) {
        response.status(400).json({ error: "Email already taken" });
        return;
      }

      if (user.username === username) {
        response.status(400).json({ error: "Username already taken" });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword],
    );

    const newUser = result.rows[0];

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    response.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);

    response.status(201).json({
      access_token: accessToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar_url: null,
        bio: null,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    response.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    response.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);

    response.json({
      access_token: accessToken,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
    });
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = async (request: Request, response: Response) => {
  response.clearCookie("refresh_token");
  response.json({ message: "Logged out" });
};

export const refresh = async (request: Request, response: Response) => {
  const refresh_token = request.cookies.refresh_token;

  if (!refresh_token) {
    response.status(200).json({ user: null, message: "Guest session" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_SECRET as string,
    ) as { userId: string | number };

    const result = await pool.query(
      "SELECT id, username, email, avatar_url, bio FROM users WHERE id = $1",
      [decoded.userId],
    );
    const user = result.rows[0];

    if (!user) {
      response.clearCookie("refresh_token");
      response
        .status(200)
        .json({ user: null, message: "User no longer exists" });
      return;
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    response.cookie("refresh_token", newRefreshToken, COOKIE_OPTIONS);

    response.json({
      access_token: newAccessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    response.clearCookie("refresh_token");
    response.status(200).json({ user: null, message: "Session expired" });
  }
};
