import { Router } from "express";
import { getPublicProfile, trackClick } from "../controllers/public.controller";
import { updateAppearance } from "../controllers/profile.controller";

const router = Router();

router.get("/:username", getPublicProfile);
router.post("/:username/links/:id/click", trackClick);

export default router;
