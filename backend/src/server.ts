import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoute from "./routes/auth.route";
import linksRoute from "./routes/links.route";
import profileRoute from "./routes/profile.route";
import qrRoute from "./routes/qr.route";
import publicRoute from "./routes/public.route";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import "./config/db";
import { errorMiddleWare } from "./middlewares/error.middleware";

const allowedOrigins = (process.env.ALLOWED_ORIGIN || "http://localhost:4200")
  .split(",")
  .map((o) => o.trim());

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(globalLimiter);

app.use("/auth", authRoute);
app.use("/links", linksRoute);
app.use("/profile", profileRoute);
app.use("/username", publicRoute);
app.use("/qr", qrRoute);

app.use(errorMiddleWare);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
