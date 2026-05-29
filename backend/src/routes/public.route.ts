import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getPublicProfile, trackClick } from "../controllers/public.controller";

const router = Router();

router.get("/:username", getPublicProfile);
router.post("/:username/links/:id/click", trackClick);

export default router;
