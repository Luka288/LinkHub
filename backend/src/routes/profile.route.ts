import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateAppearance,
  updateProfile,
} from "../controllers/profile.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.patch("/", updateProfile);
router.put("/preferences", updateAppearance);

export default router;
