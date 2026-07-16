import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  reorderLinks,
  updateAppearance,
  updatePassword,
  updateProfile,
  updateProfileVisibility,
  updateUsername,
} from "../controllers/profile.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.patch("/", updateProfile);
router.put("/preferences", updateAppearance);
router.patch("/username", updateUsername);
router.patch("/password", updatePassword);
router.patch("/visibility", updateProfileVisibility);
router.patch("/reorder", reorderLinks);

export default router;
