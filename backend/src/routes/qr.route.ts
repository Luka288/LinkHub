import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { generateQr } from "../controllers/qr.controller";

const router = Router();

router.get("/", authMiddleware, generateQr);

export default router;
