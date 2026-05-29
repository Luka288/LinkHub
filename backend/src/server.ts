import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import linksRoute from "./routes/links.route";
import profileRoute from "./routes/profile.route";
import publicRoute from "./routes/public.route";
import "./config/db";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:4200",
  }),
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});

app.use("/auth", authRoute);
app.use("/links", linksRoute);
app.use("/profile", profileRoute);
app.use("/username", publicRoute);
