import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";

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

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.status(201).json({
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.json({
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
  response.clearCookie("token");
  response.json({ message: "Logged out" });
};
